// Account NFTs Endpoint
import { NextRequest, NextResponse } from 'next/server';
import { requirePayment, trackApiRequest } from '@/lib/payment/middleware';
import { getNFTs } from '@/lib/solana/data';
import { ApiResponse } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  const startTime = Date.now();
  const { address } = await params;
  const endpoint = `/api/v1/account/nfts/${address}`;

  try {
    const paymentCheck = await requirePayment(request, endpoint);
    if (!paymentCheck.authorized) {
      return paymentCheck.response!;
    }

    const nfts = await getNFTs(address);

    const response: ApiResponse = {
      success: true,
      data: {
        address,
        nfts,
        count: nfts.length,
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
