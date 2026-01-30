export interface OTP {
    phoneNumber: string;
    otp: string;
    expiresAt: Date;
    attempts: number;
    createdAt?: Date;
}
