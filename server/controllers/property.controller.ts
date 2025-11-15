import { type NextFunction, type Request, type Response } from "express";
import { propertyService } from "../services/property.service";
import { ApiResponse } from "../utils/ApiResponse";


class PropertyController {
    static async createProperty(req: Request, res: Response,next: NextFunction): Promise<Response | void> {
        try {
            const property = await propertyService.createProperty(req.body);
            return res.status(201).json(new ApiResponse(201, 'Property created successfully', property));
        } catch (error) {
            next(error);
        }
    }

    static  async getAllProperties(req: Request, res: Response,next: NextFunction): Promise<Response | void> {
        try {
            const filters = {
                page: parseInt(req.query.page as string) || 1,
                take: parseInt(req.query.take as string) || 10,
                search: req.query.search as string || '',
            };
            const properties = await propertyService.getAllProperties(filters);
            return res.status(200).json(new ApiResponse(200, 'Properties fetched successfully', properties));
        } catch (error) {
            next(error);
        }

    }

    static async updateProperty(req: Request, res: Response,next: NextFunction): Promise<Response | void> {
        try {
            const propertyId = req.params.id;
            const updatedProperty = await propertyService.updateProperty(propertyId, req.body);
            return  res.status(200).json(new ApiResponse(200, 'Property updated successfully', updatedProperty));
        } catch (error) {
            next(error);
        }
    }

    static async deleteProperty(req: Request, res: Response,next: NextFunction): Promise<Response | void> {
        try {
            const propertyId = req.params.id;
            const deletedProperty = await propertyService.deleteProperty(propertyId);
            return res.status(200).json(new ApiResponse(200, 'Property deleted successfully', deletedProperty));
        } catch (error) {
            next(error);
        }
    }

    static async statisticsProperty(_req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const statistics = await propertyService.getStatisticsProperty();
            return res.status(200).json(
                new ApiResponse(200,
                    'Property Statistics',
                    statistics
                )
            )
        } catch (error) {
            next(error);
        }
    }
}


export { PropertyController };