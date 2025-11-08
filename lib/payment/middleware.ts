// HTTP 402 Payment Middleware
import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { verifyPaymentSignature, quickValidateSignature } from '../solana/verification';
import { getPaymentWallet, PAYMENT_AMOUNT_SOL, PAYMENT_TIMEOUT_MS } from '../solana/client';
import { PaymentDetails, ApiResponse } from '../types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Payment middleware for API routes
 * Returns 402 if no payment, validates payment if provided
 */
export async function requirePayment(
  request: NextRequest,
  endpoint: string
): Promise<{ authorized: boolean; response?: NextResponse; paymentId?: string; wallet?: string }> {
  const signature = request.headers.get('x-payment-signature');
  const requestId = request.headers.get('x-request-id');

  // No payment provided - return 402
  if (!signature || !requestId) {
    const paymentDetails = await createPaymentRequest(endpoint);
    const response: ApiResponse = {
      success: false,
      payment: paymentDetails,
      error: 'Payment required',
    };

    return {
      authorized: false,
      response: NextResponse.json(response, {
        status: 402,
        headers: {
          'Content-Type': 'application/json',
          'X-Payment-Required': 'true',
        },
      }),
    };
  }

  // Quick validation first
  if (!quickValidateSignature(signature)) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: 'Invalid signature format' },
        { status: 400 }
      ),
    };
  }

  // Check if payment already verified (cache hit)
  const existingPayment = await prisma.payment.findUnique({
    where: { signature },
  });

  if (existingPayment) {
    if (existingPayment.verified && existingPayment.requestId === requestId) {
      // Payment already verified
      return {
        authorized: true,
        paymentId: existingPayment.id,
        wallet: existingPayment.payerWallet,
      };
    }

    if (existingPayment.verified && existingPayment.requestId !== requestId) {
      return {
        authorized: false,
        response: NextResponse.json(
          { success: false, error: 'Signature already used for different request' },
          { status: 403 }
        ),
      };
    }
  }

  // Verify payment on-chain
  const verification = await verifyPaymentSignature(signature, PAYMENT_AMOUNT_SOL, PAYMENT_TIMEOUT_MS);

  if (!verification.valid) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: verification.error || 'Payment verification failed' },
        { status: 402 }
      ),
    };
  }

  // Store verified payment
  const payment = await prisma.payment.upsert({
    where: { signature },
    create: {
      requestId,
      signature,
      amount: verification.amount || PAYMENT_AMOUNT_SOL,
      payerWallet: verification.sender || 'unknown',
      endpoint,
      verified: true,
      verifiedAt: new Date(),
      expiresAt: new Date(Date.now() + PAYMENT_TIMEOUT_MS),
    },
    update: {
      verified: true,
      verifiedAt: new Date(),
    },
  });

  // Update wallet analytics
  await updateWalletAnalytics(payment.payerWallet, payment.amount);

  return {
    authorized: true,
    paymentId: payment.id,
    wallet: payment.payerWallet,
  };
}

/**
 * Create a new payment request
 */
async function createPaymentRequest(endpoint: string): Promise<PaymentDetails> {
  const requestId = nanoid();
  const expiresAt = Date.now() + PAYMENT_TIMEOUT_MS;
  const paymentWallet = getPaymentWallet();

  // Store payment request
  await prisma.payment.create({
    data: {
      requestId,
      signature: null, // Will be filled when payment is made
      amount: PAYMENT_AMOUNT_SOL,
      payerWallet: '',
      endpoint,
      verified: false,
      expiresAt: new Date(expiresAt),
    },
  });

  return {
    paymentRequired: true,
    amount: PAYMENT_AMOUNT_SOL,
    recipient: paymentWallet.toBase58(),
    requestId,
    expiresAt,
    message: `Pay ${PAYMENT_AMOUNT_SOL} SOL to access this endpoint`,
  };
}

/**
 * Update wallet analytics and calculate discount tier
 */
async function updateWalletAnalytics(walletAddress: string, amount: number) {
  try {
    await prisma.walletAnalytics.upsert({
      where: { walletAddress },
      create: {
        walletAddress,
        totalRequests: 1,
        totalSpent: amount,
        tokenBalance: 0,
        discountTier: 'none',
        firstSeenAt: new Date(),
        lastSeenAt: new Date(),
      },
      update: {
        totalRequests: { increment: 1 },
        totalSpent: { increment: amount },
        lastSeenAt: new Date(),
      },
    });

    // TODO: Fetch actual token balance from chain
    // This will be implemented when token is deployed
  } catch (error) {
    console.error('Error updating wallet analytics:', error);
  }
}

/**
 * Track API request metrics
 */
export async function trackApiRequest(data: {
  endpoint: string;
  method: string;
  paymentId?: string;
  responseTimeMs: number;
  statusCode: number;
  success: boolean;
  errorMessage?: string;
  payerWallet?: string;
  userAgent?: string;
  ipAddress?: string;
}) {
  try {
    await prisma.apiRequest.create({ data });
  } catch (error) {
    console.error('Error tracking API request:', error);
  }
}
