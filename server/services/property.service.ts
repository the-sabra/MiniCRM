import { AppError } from '../middleware/error.handler';

import logger from '../config/logger';
import { IPagination } from "../share/pagination.interface";
import Property, { PropertyDocument } from '../models/ property.model';
import { FilterQuery } from 'mongoose';
import { PaginatedResponse, paginatedResponse } from '../share/pagination-reesponse';


export interface IPropertyFilter extends IPagination{
    search: string;
}

class PropertyService {
    public async createProperty(data: PropertyDocument): Promise<PropertyDocument> {
        try {
            const property = new Property(data);
            const savedProperty = await property.save();
            logger.info('Property created successfully:');
            return savedProperty;
        } catch (error) {
            logger.error('Error creating property:', error);
            throw new AppError('Failed to create property',422);
        }
    }

    public async getAllProperties(filters: IPropertyFilter): Promise<PaginatedResponse<PropertyDocument>> {
        try {
            const query: FilterQuery<PropertyDocument> = {};
            if (filters.search) {
                query.$or = [
                    { title: { $regex: filters.search, $options: 'i' } },
                    { location: { $regex: filters.search, $options: 'i' } },
                ];
            }

            const skip = (filters.page - 1) * filters.take;
            
            const [properties, total] = await Promise.all([
                Property.find(query).skip(skip).limit(filters.take).exec(),
                Property.countDocuments(query).exec(),
            ]);

            logger.info('Fetched all properties successfully:');
            return paginatedResponse(properties, filters.page, filters.take, total);
        } catch (error) {
            logger.error('Error fetching properties:', error);
            throw new AppError('Failed to fetch properties',500);
        }
    }

    public async updateProperty(id: string, data: Partial<PropertyDocument>): Promise<PropertyDocument> {
        try {
            const updatedProperty = await Property.findByIdAndUpdate(id, data, { new: true });
            if (!updatedProperty) {
                logger.warn(`Property with id ${id} not found for update.`);
                throw new AppError('Property not found',404);
            }
            logger.info(`Property with id ${id} updated successfully:`);
            return updatedProperty;
        } catch (error) {
            logger.error('Error updating property:', error);
            throw new AppError('Failed to update property',422);
        }
    }

    public async deleteProperty(id: string): Promise<PropertyDocument> {
        const deletedProperty = await Property.findByIdAndDelete(id);
        if (!deletedProperty) {
            logger.warn(`Property with id ${id} not found for deletion.`);
            throw new AppError('Property not found',404);
        }
        logger.info(`Property with id ${id} deleted successfully:`);
        return deletedProperty;
    }
}


const propertyService = new PropertyService();

export { propertyService };
