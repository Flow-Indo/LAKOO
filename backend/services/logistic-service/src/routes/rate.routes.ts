import { Router } from 'express';
import { rateController } from '../controllers/rate.controller';
import { validate, getRatesSchema } from '../middleware/validation';

const router: import('express').Router = Router();

// Get shipping rates
/**
 * @swagger
 * /api/rates:
 *   post:
 *     summary: Get shipping rates for a route
 *     tags: [Rates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GetRatesRequest'
 *     responses:
 *       200:
 *         description: List of shipping rates
 *       400:
 *         description: Validation error
 */
router.post('/', validate(getRatesSchema), rateController.getShippingRates);

// Get available couriers
/**
 * @swagger
 * /api/rates/couriers:
 *   get:
 *     summary: Get available couriers
 *     tags: [Rates]
 *     responses:
 *       200:
 *         description: List of couriers
 */
router.get('/couriers', rateController.getAvailableCouriers);

// Get quick estimate
/**
 * @swagger
 * /api/rates/estimate:
 *   post:
 *     summary: Get quick rate estimate (cheapest + fastest)
 *     tags: [Rates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GetRatesRequest'
 *     responses:
 *       200:
 *         description: Rate estimate
 *       400:
 *         description: Validation error
 */
router.post('/estimate', validate(getRatesSchema), rateController.getQuickEstimate);

export default router;
