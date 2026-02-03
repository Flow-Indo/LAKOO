// services/order-service/src/config/swagger.ts

import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Order Service API',
      version: '1.0.0',
      description: 'Order management service (seller-based order splitting + payment initiation)',
    },
    servers: [
      { 
        url: 'http://localhost:3006', 
        description: 'Development server' 
      }
    ],
    tags: [
      { name: 'Orders', description: 'Order management endpoints' },
      { name: 'Admin', description: 'Admin-only endpoints' }
    ],
  },
  apis: ['./dist/routes/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
