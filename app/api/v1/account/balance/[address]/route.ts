// Account Balance Endpoint
import { NextRequest, NextResponse } from 'next/server';
import { requirePayment, trackApiRequest } from '@/lib/payment/middleware';
import { getAccountBalance } from '@/lib/solana/data';
import { ApiResponse } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  const startTime = Date.now();
  const { address } = await params;
  const endpoint = `/api/v1/account/balance/${address}`;

  try {
    const paymentCheck = await requirePayment(request, endpoint);
    if (!paymentCheck.authorized) {
      return paymentCheck.response!;
    }

    const balance = await getAccountBalance(address);

    if (balance === null) {
      const response: ApiResponse = {
        success: false,
        error: 'Account not found',
      };

      await trackApiRequest({
        endpoint,
        method: 'GET',
        paymentId: paymentCheck.paymentId,
        responseTimeMs: Date.now() - startTime,
        statusCode: 404,
        success: false,
        errorMessage: 'Account not found',
        payerWallet: paymentCheck.wallet,
      });

      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      data: {
        address,
        balance,
        balanceLamports: Math.floor(balance * 1_000_000_000),
      },
      responseTime: Date.now() - startTime,
    };

    await trackApiRequest({
      endpoint,
      method: 'GET',
      paymentId: paymentCheck.paymentId,
      responseTimeMs: Date.now() - startTime,
      statusCode: 200,
      success: true,
      payerWallet: paymentCheck.wallet,
    });

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Balance fetch error:', error);

    const response: ApiResponse = {
      success: false,
      error: 'Internal server error',
    };

    await trackApiRequest({
      endpoint,
      method: 'GET',
      responseTimeMs: Date.now() - startTime,
      statusCode: 500,
      success: false,
      errorMessage: error.message,
    });

    return NextResponse.json(response, { status: 500 });
  }
}
