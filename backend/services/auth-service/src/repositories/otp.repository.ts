// import { prisma } from '@repo/database';
import { OTP } from '@src/types/otp';

// TODO: Implement OTP storage using Redis or external service
// Auth service doesn't have its own database - it depends on user-service
// Using in-memory storage for now (not production-ready)
const otpStore = new Map<string, OTP>();

export default class OTPRepository {
    async insertOTP(phoneNumber: string, otp: string): Promise<OTP> {
        // TODO: Implement with Redis or in-memory cache
        // For now, using a simple in-memory map (not production-ready)
        console.warn('OTP storage not implemented - using temporary in-memory solution');
        const otpData: OTP = { 
            phoneNumber, 
            otp, 
            expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
            attempts: 0,
            createdAt: new Date()
        };
        otpStore.set(phoneNumber, otpData);
        return otpData;
    }

    async getOTP(phoneNumber: string): Promise<OTP | null> {
        // TODO: Implement with Redis or in-memory cache
        console.warn('OTP retrieval not implemented - using temporary in-memory solution');
        return otpStore.get(phoneNumber) || null;
    }
}