export declare class UserRepository {
    findByPhoneNumber(phoneNumber: string): Promise<{
        id: string;
        phoneNumber: string;
        passwordHash: string | null;
        firstName: string | null;
        lastName: string | null;
        role: import("@src/generated/prisma").$Enums.UserRole;
    } | null>;
    createUser(phoneNumber: string, firstName: string, lastName: string, password: string): Promise<{
        id: string;
        email: string | null;
        phoneNumber: string;
        passwordHash: string | null;
        firstName: string | null;
        lastName: string | null;
        profileImageUrl: string | null;
        role: import("@src/generated/prisma").$Enums.UserRole;
        status: import("@src/generated/prisma").$Enums.UserStatus;
        emailVerified: boolean;
        phoneVerified: boolean;
        lastLoginAt: Date | null;
        lastLoginIp: string | null;
        failedAttempts: number;
        lockedUntil: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    } | null>;
}
//# sourceMappingURL=user_repository.d.ts.map