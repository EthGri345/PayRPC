// Account Tokens Endpoint
import { NextRequest, NextResponse } from 'next/server';
import { requirePayment, trackApiRequest } from '@/lib/payment/middleware';
import { getTokenAccounts } from '@/lib/solana/data';
import { ApiResponse } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  const startTime = Date.now();
  const { address } = await params;
  const endpoint = `/api/v1/account/tokens/${address}`;

  try {
    const paymentCheck = await requirePayment(request, endpoint);
    if (!paymentCheck.authorized) {
      return paymentCheck.response!;
    }

    const tokens = await getTokenAccounts(address);

    const response: ApiResponse = {
      success: true,
      data: {
        address,
        tokens,
        count: tokens.length,
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
    console.error('Token fetch error:', error);

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
