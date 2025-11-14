import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export class AppError extends Error {
    statusCode: number;
    status: string;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    }
}

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction): void => {
    logger.error(err.stack || err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json(
        ApiResponse.error(
            statusCode,
            err.message || 'Internal server error'
        )
    );
};
