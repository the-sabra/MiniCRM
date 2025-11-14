import { Router, Request, Response } from 'express';
import { ApiResponse } from '../utils/ApiResponse.js';
import mongoose from 'mongoose';

const router = Router();

/**
 * @route GET /health
 * @desc Health check endpoint (includes DB ping)
 * @access Public
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const readyState = mongoose.connection.readyState;
    const stateMap: Record<number, string> = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };
    const dbState = stateMap[readyState] ?? 'unknown';

    let pingResult: any = null;
    let dbHealthy = false;

    if (readyState === 1 && mongoose.connection.db) {
      try {
        const admin = mongoose.connection.db.admin();
        pingResult = await admin.ping();
        // pingResult.ok is typically 1 when healthy
        dbHealthy = !!(pingResult && (pingResult.ok === 1 || pingResult.ok === 1.0));
      } catch (err: any) {
        pingResult = { error: err?.message ?? String(err) };
        dbHealthy = false;
      }
    }

    if (dbHealthy) {
      return res.status(200).json(
        ApiResponse.success(200, {
          status: 'UP',
          timestamp: new Date().toISOString(),
          service: 'MiniCRM API',
          database: {
            state: dbState,
            ping: pingResult,
          },
        }, 'Service is healthy')
      );
    }

    // DB not healthy/connected
    return res.status(500).json(
      ApiResponse.error(500, 'Service degraded - database unavailable', {
        status: 'DEGRADED',
        timestamp: new Date().toISOString(),
        service: 'MiniCRM API',
        database: {
          state: dbState,
          ping: pingResult,
        },
      })
    );
  } catch (error: any) {
    return res.status(500).json(
      ApiResponse.error(500, error?.message || 'Health check failed')
    );
  }
});

export default router;
