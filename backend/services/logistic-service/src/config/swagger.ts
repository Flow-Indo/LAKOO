import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Logistics Service API',
      version: '1.0.0',
      description: 'Microservice for shipment management, tracking, courier integrations, and shipping rates',
      contact: {
        name: 'API Support'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3009}`,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
        gatewayAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-gateway-key'
        },
        internalServiceAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-service-auth'
        },
        internalServiceName: {
          type: 'apiKey',
          in: 'header',
          name: 'x-service-name'
        }
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string', example: 'Validation failed' },
            code: { type: 'string', nullable: true, example: 'VALIDATION_ERROR' },
            details: { type: 'array', items: { type: 'object' }, nullable: true }
          }
        },
        Address: {
          type: 'object',
          required: ['name', 'phone', 'address', 'city', 'province', 'postalCode'],
          properties: {
            name: { type: 'string' },
            phone: { type: 'string' },
            address: { type: 'string' },
            district: { type: 'string', nullable: true },
            city: { type: 'string' },
            province: { type: 'string' },
            postalCode: { type: 'string' },
            latitude: { type: 'number', nullable: true },
            longitude: { type: 'number', nullable: true }
          }
        },
        Shipment: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            shipmentNumber: { type: 'string' },
            orderId: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            courier: { type: 'string' },
            courierName: { type: 'string', nullable: true },
            serviceType: { type: 'string', nullable: true },
            serviceName: { type: 'string', nullable: true },
            trackingNumber: { type: 'string', nullable: true },
            status: {
              type: 'string',
              enum: [
                'pending',
                'booked',
                'awaiting_pickup',
                'picked_up',
                'in_transit',
                'at_destination_hub',
                'out_for_delivery',
                'delivered',
                'failed',
                'returned',
                'cancelled'
              ]
            },
            shippingCost: { type: 'number' },
            estimatedDelivery: { type: 'string', format: 'date-time', nullable: true },
            createdAt: { type: 'string', format: 'date-time', nullable: true },
            updatedAt: { type: 'string', format: 'date-time', nullable: true }
          }
        },
        CreateShipment: {
          type: 'object',
          required: ['orderId', 'courier', 'shippingCost', 'weightGrams', 'destination'],
          properties: {
            orderId: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid', nullable: true, description: 'Set by gateway auth' },
            returnId: { type: 'string', format: 'uuid', nullable: true },
            courier: { type: 'string' },
            courierName: { type: 'string', nullable: true },
            serviceType: { type: 'string', nullable: true },
            serviceName: { type: 'string', nullable: true },
            shippingCost: { type: 'number' },
            insuranceCost: { type: 'number', nullable: true },
            codAmount: { type: 'number', nullable: true },
            weightGrams: { type: 'integer' },
            lengthCm: { type: 'number', nullable: true },
            widthCm: { type: 'number', nullable: true },
            heightCm: { type: 'number', nullable: true },
            itemCount: { type: 'integer', nullable: true },
            itemDescription: { type: 'string', nullable: true },
            origin: { $ref: '#/components/schemas/Address' },
            destination: { $ref: '#/components/schemas/Address' },
            instructions: { type: 'string', nullable: true },
            metadata: { type: 'object', additionalProperties: true, nullable: true }
          }
        },
        CreateShipmentInternal: {
          allOf: [
            { $ref: '#/components/schemas/CreateShipment' },
            {
              type: 'object',
              required: ['userId'],
              properties: {
                userId: { type: 'string', format: 'uuid' }
              }
            }
          ]
        },
        GetRatesRequest: {
          type: 'object',
          required: ['originPostalCode', 'destPostalCode', 'weightGrams'],
          properties: {
            originPostalCode: { type: 'string' },
            destPostalCode: { type: 'string' },
            weightGrams: { type: 'integer' },
            lengthCm: { type: 'number', nullable: true },
            widthCm: { type: 'number', nullable: true },
            heightCm: { type: 'number', nullable: true },
            itemValue: { type: 'number', nullable: true },
            couriers: { type: 'array', items: { type: 'string' }, nullable: true }
          }
        },
        ShippingRate: {
          type: 'object',
          properties: {
            courier: { type: 'string' },
            courierName: { type: 'string' },
            serviceCode: { type: 'string' },
            serviceName: { type: 'string' },
            serviceType: { type: 'string', nullable: true },
            rate: { type: 'number' },
            estimatedDays: { type: 'string', nullable: true },
            supportsCod: { type: 'boolean' },
            supportsInsurance: { type: 'boolean' }
          }
        },
        UpdateShipmentStatus: {
          type: 'object',
          required: ['status'],
          properties: {
            status: {
              type: 'string',
              enum: [
                'pending',
                'booked',
                'awaiting_pickup',
                'picked_up',
                'in_transit',
                'at_destination_hub',
                'out_for_delivery',
                'delivered',
                'failed',
                'returned',
                'cancelled'
              ]
            },
            failureReason: { type: 'string', nullable: true },
            receiverName: { type: 'string', nullable: true },
            proofOfDeliveryUrl: { type: 'string', format: 'uri', nullable: true },
            signature: { type: 'string', nullable: true }
          }
        },
        UpdateShipment: {
          type: 'object',
          properties: {
            trackingNumber: { type: 'string', nullable: true },
            waybillId: { type: 'string', nullable: true },
            biteshipOrderId: { type: 'string', nullable: true },
            status: { $ref: '#/components/schemas/UpdateShipmentStatus/properties/status' },
            estimatedDelivery: { type: 'string', format: 'date-time', nullable: true },
            failureReason: { type: 'string', nullable: true },
            receiverName: { type: 'string', nullable: true },
            proofOfDeliveryUrl: { type: 'string', format: 'uri', nullable: true },
            signature: { type: 'string', nullable: true },
            internalNotes: { type: 'string', nullable: true },
            metadata: { type: 'object', additionalProperties: true, nullable: true }
          }
        },
        BookShipment: {
          type: 'object',
          properties: {
            trackingNumber: { type: 'string', nullable: true },
            waybillId: { type: 'string', nullable: true },
            biteshipOrderId: { type: 'string', nullable: true },
            estimatedDelivery: { type: 'string', format: 'date-time', nullable: true }
          }
        },
        CreateTrackingEvent: {
          type: 'object',
          required: ['status', 'eventTime'],
          properties: {
            status: { type: 'string' },
            statusCode: { type: 'string', nullable: true },
            description: { type: 'string', nullable: true },
            location: { type: 'string', nullable: true },
            city: { type: 'string', nullable: true },
            courierStatus: { type: 'string', nullable: true },
            eventTime: { type: 'string', format: 'date-time' }
          }
        },
        MarkDelivered: {
          type: 'object',
          properties: {
            receiverName: { type: 'string', nullable: true },
            proofOfDeliveryUrl: { type: 'string', format: 'uri', nullable: true },
            signature: { type: 'string', nullable: true }
          }
        },
        MarkFailed: {
          type: 'object',
          required: ['failureReason'],
          properties: {
            failureReason: { type: 'string' }
          }
        },
        ToggleCourier: {
          type: 'object',
          required: ['isActive'],
          properties: {
            isActive: { type: 'boolean' }
          }
        },
        CreateCourierService: {
          type: 'object',
          required: ['serviceCode', 'serviceName'],
          properties: {
            serviceCode: { type: 'string' },
            serviceName: { type: 'string' },
            serviceType: { type: 'string', nullable: true },
            estimatedDays: { type: 'string', nullable: true },
            isActive: { type: 'boolean', nullable: true },
            displayOrder: { type: 'integer', nullable: true }
          }
        },
        CreateCourier: {
          type: 'object',
          required: ['courierCode', 'courierName'],
          properties: {
            courierCode: { type: 'string' },
            courierName: { type: 'string' },
            isActive: { type: 'boolean', nullable: true },
            apiEndpoint: { type: 'string', format: 'uri', nullable: true },
            apiKey: { type: 'string', nullable: true },
            supportsCod: { type: 'boolean', nullable: true },
            supportsInsurance: { type: 'boolean', nullable: true },
            supportsPickup: { type: 'boolean', nullable: true },
            supportsDropoff: { type: 'boolean', nullable: true },
            supportsRealTimeTracking: { type: 'boolean', nullable: true },
            hasFixedRates: { type: 'boolean', nullable: true },
            rateMultiplier: { type: 'number', nullable: true },
            logoUrl: { type: 'string', format: 'uri', nullable: true },
            displayOrder: { type: 'integer', nullable: true },
            pickupCutoffTime: { type: 'string', nullable: true },
            settings: { type: 'object', additionalProperties: true, nullable: true }
          }
        },
        UpdateCourier: {
          type: 'object',
          properties: {
            courierName: { type: 'string', nullable: true },
            isActive: { type: 'boolean', nullable: true },
            apiEndpoint: { type: 'string', format: 'uri', nullable: true },
            apiKey: { type: 'string', nullable: true },
            supportsCod: { type: 'boolean', nullable: true },
            supportsInsurance: { type: 'boolean', nullable: true },
            supportsPickup: { type: 'boolean', nullable: true },
            supportsDropoff: { type: 'boolean', nullable: true },
            supportsRealTimeTracking: { type: 'boolean', nullable: true },
            hasFixedRates: { type: 'boolean', nullable: true },
            rateMultiplier: { type: 'number', nullable: true },
            logoUrl: { type: 'string', format: 'uri', nullable: true },
            displayOrder: { type: 'integer', nullable: true },
            pickupCutoffTime: { type: 'string', nullable: true },
            settings: { type: 'object', additionalProperties: true, nullable: true }
          }
        },
        CreateWarehouse: {
          type: 'object',
          required: ['code', 'name', 'contactName', 'contactPhone', 'address', 'city', 'province', 'postalCode'],
          properties: {
            code: { type: 'string' },
            name: { type: 'string' },
            contactName: { type: 'string' },
            contactPhone: { type: 'string' },
            address: { type: 'string' },
            district: { type: 'string', nullable: true },
            city: { type: 'string' },
            province: { type: 'string' },
            postalCode: { type: 'string' },
            latitude: { type: 'number', nullable: true },
            longitude: { type: 'number', nullable: true },
            isDefault: { type: 'boolean', nullable: true },
            isActive: { type: 'boolean', nullable: true },
            operatingHours: { type: 'string', nullable: true }
          }
        },
        UpdateWarehouse: {
          type: 'object',
          properties: {
            name: { type: 'string', nullable: true },
            contactName: { type: 'string', nullable: true },
            contactPhone: { type: 'string', nullable: true },
            address: { type: 'string', nullable: true },
            district: { type: 'string', nullable: true },
            city: { type: 'string', nullable: true },
            province: { type: 'string', nullable: true },
            postalCode: { type: 'string', nullable: true },
            latitude: { type: 'number', nullable: true },
            longitude: { type: 'number', nullable: true },
            isDefault: { type: 'boolean', nullable: true },
            isActive: { type: 'boolean', nullable: true },
            operatingHours: { type: 'string', nullable: true }
          }
        }
      }
    },
    tags: [
      { name: 'Shipments', description: 'Shipment management endpoints' },
      { name: 'Rates', description: 'Shipping rate endpoints' },
      { name: 'Webhooks', description: 'Courier webhook endpoints' },
      { name: 'Admin - Shipments', description: 'Admin shipment management' },
      { name: 'Admin - Couriers', description: 'Admin courier management' },
      { name: 'Admin - Warehouses', description: 'Admin warehouse management' },
      { name: 'Internal', description: 'Internal service-to-service endpoints' }
    ]
  },
  // Support both local dev (tsx/ts-node, TS sources) and Docker/prod (node dist, JS output)
  apis: [
    './src/controllers/*.ts',
    './src/routes/*.ts',
    './dist/controllers/*.js',
    './dist/routes/*.js'
  ]
};

export const swaggerSpec = swaggerJsdoc(options);
