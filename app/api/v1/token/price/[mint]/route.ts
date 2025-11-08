// Token Price Endpoint
import { NextRequest, NextResponse } from 'next/server';
import { requirePayment, trackApiRequest } from '@/lib/payment/middleware';
import { getTokenPrice } from '@/lib/solana/data';
import { ApiResponse } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ mint: string }> }
) {
  const startTime = Date.now();
  const { mint } = await params;
  const endpoint = `/api/v1/token/price/${mint}`;

  try {
    const paymentCheck = await requirePayment(request, endpoint);
    if (!paymentCheck.authorized) {
      return paymentCheck.response!;
    }

    const price = await getTokenPrice(mint);

    const response: ApiResponse = {
      success: true,
      data: {
        mint,
        price,
        note: price === null ? 'Price data not available - integrate with Jupiter/Birdeye' : undefined,
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
    const response: ApiResponse = { success: false, error: 'Internal server error' };
    return NextResponse.json(response, { status: 500 });
  }
}
