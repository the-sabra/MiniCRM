import vine, { errors } from '@vinejs/vine'
import type { Request, NextFunction, Response } from 'express';

export enum validateType {
    BODY, QUERY, PARAMS
}

/**
 * Validation middleware factory for VineJS schemas
 * @param type - Type of data to validate (BODY, QUERY, or PARAMS)
 * @param schema - VineJS schema to validate against
 * @returns Express middleware function
 */
export default (type: validateType, schema: any) => {
    return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
        try {
            const dataToValidate = 
                type === validateType.BODY ? req.body :
                type === validateType.QUERY ? req.query :
                req.params;

            const output = await vine.validate({
                schema,
                data: dataToValidate,
            });

            // Assign validated data back to req object
            if (type === validateType.BODY) req.body = output;
            else if (type === validateType.QUERY) req.query = output;
            else req.params = output;

            next();
        } catch (error) {
            if (error instanceof errors.E_VALIDATION_ERROR) {
                (error as any).statusCode = 400;
            }
            next(error);
        }
    };
};
