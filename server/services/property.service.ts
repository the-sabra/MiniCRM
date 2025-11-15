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
                Property.find(query).skip(skip).limit(filters.take).sort({ createdAt: -1 }).exec(),
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

    public async getStatisticsProperty(): Promise<
    { totalProperties: number , 
      averagePrice:number , 
      statusCount: {
        available: number;
        sold: number;
      }
      locationStats: {
        location: string;
        averageBedrooms: number;
        averageBathrooms: number;
      }[]
    }> {
        try {

            const overallStats = await Property.aggregate([
                {
                    $facet: {
                        totalAndAverage: [
                            {
                                $group: {
                                    _id: null,
                                    totalProperties: { $sum: 1 },
                                    averagePrice: { $avg: '$price' }
                                }
                            }
                        ],
                        statusCount: [
                            {
                                $group: {
                                    _id: '$status',
                                    count: { $sum: 1 }
                                }
                            }
                        ],
                        locationStats: [
                            {
                                $group: {
                                    _id: '$location',
                                    averageBedrooms: { $avg: '$bedrooms' },
                                    averageBathrooms: { $avg: '$bathrooms' }
                                }
                            },
                            {
                                $project: {
                                    _id: 0,
                                    location: '$_id',
                                    averageBedrooms: { $round: ['$averageBedrooms', 2] },
                                    averageBathrooms: { $round: ['$averageBathrooms', 2] }
                                }
                            }
                        ]
                    }
                }
            ]);

            const result = overallStats[0];

            const totalProperties = result.totalAndAverage[0]?.totalProperties || 0;
            const averagePrice = result.totalAndAverage[0]?.averagePrice || 0;

            const statusCount = {
                available: 0,
                sold: 0
            };


            result.statusCount.forEach((status: { _id: string; count: number }) => {
                if (status._id === 'available') {
                    statusCount.available = status.count;
                } else if (status._id === 'sold') {
                    statusCount.sold = status.count;
                }
            });

            const locationStats = result.locationStats || [];

            logger.info('Property statistics fetched successfully');

            return {
                totalProperties,
                averagePrice: Math.round(averagePrice * 100) / 100,
                statusCount,
                locationStats
            };
        } catch (error) {
            logger.error('Error fetching property statistics:', error);
            throw new AppError('Failed to fetch property statistics', 500);
        }
    }
}


const propertyService = new PropertyService();

export { propertyService };
