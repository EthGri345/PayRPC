// Trending Tokens Analytics Endpoint
import { NextRequest, NextResponse } from 'next/server';
import { requirePayment, trackApiRequest } from '@/lib/payment/middleware';
import { getCache, setCache, CACHE_TTL } from '@/lib/cache/redis';
import { ApiResponse, TrendingToken } from '@/lib/types';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const endpoint = '/api/v1/analytics/trending';

  try {
    const paymentCheck = await requirePayment(request, endpoint);
    if (!paymentCheck.authorized) {
      return paymentCheck.response!;
    }

    // Check cache
    const cached = await getCache<TrendingToken[]>('analytics:trending');
    if (cached) {
      const response: ApiResponse = {
        success: true,
        data: { tokens: cached, cached: true },
        responseTime: Date.now() - startTime,
      };
      return NextResponse.json(response);
    }

    // Mock trending data - TODO: Implement real analytics
    const trendingTokens: TrendingToken[] = [
      {
        mint: 'So11111111111111111111111111111111111111112',
        name: 'Wrapped SOL',
        symbol: 'SOL',
        volumeChange: 45.2,
        priceChange: 12.5,
        buyPressure: 67.8,
        score: 85.3,
      },
    ];

    await setCache('analytics:trending', trendingTokens, CACHE_TTL.TRENDING);

    const response: ApiResponse = {
      success: true,
      data: { tokens: trendingTokens },
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
