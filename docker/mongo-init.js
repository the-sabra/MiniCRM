// MongoDB initialization script for minicrm database
db = db.getSiblingDB('minicrm');

// Create collections if they don't exist
db.createCollection('properties');

// Create indexes for better performance
db.properties.createIndex({ title: 1 });
db.properties.createIndex({ status: 1 });
db.properties.createIndex({ location: 1 });
db.properties.createIndex({ createdAt: -1 });

print('MongoDB initialization completed successfully');
