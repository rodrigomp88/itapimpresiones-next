import { NextRequest, NextResponse } from 'next/server';
import { logPerformance } from '@/utils/logger';

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Health check básico
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version,
      environment: process.env.NODE_ENV,
    };

    const duration = Date.now() - startTime;
    logPerformance('health-check', duration);

    return NextResponse.json(healthData, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    logPerformance('health-check-error', duration);

    return NextResponse.json(
      {
        status: 'unhealthy',
        error: 'Internal server error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
