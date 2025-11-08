// Whale Activity Analytics Endpoint
import { NextRequest, NextResponse } from 'next/server';
import { requirePayment, trackApiRequest } from '@/lib/payment/middleware';
import { getCache, setCache, CACHE_TTL } from '@/lib/cache/redis';
import { ApiResponse, WhaleActivity } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ mint: string }> }
) {
  const startTime = Date.now();
  const { mint } = await params;
  const endpoint = `/api/v1/analytics/whales/${mint}`;

  try {
    const paymentCheck = await requirePayment(request, endpoint);
    if (!paymentCheck.authorized) {
      return paymentCheck.response!;
    }

    // Check cache
    const cached = await getCache<WhaleActivity[]>(`analytics:whales:${mint}`);
    if (cached) {
      const response: ApiResponse = {
        success: true,
        data: { mint, whales: cached, cached: true },
        responseTime: Date.now() - startTime,
      };
      return NextResponse.json(response);
    }

    // Mock whale data - TODO: Implement real whale tracking
    const whaleActivity: WhaleActivity[] = [];

    await setCache(`analytics:whales:${mint}`, whaleActivity, CACHE_TTL.WHALE_ACTIVITY);

    const response: ApiResponse = {
      success: true,
      data: { mint, whales: whaleActivity },
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
