"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const prisma_1 = require("@src/lib/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const models_1 = require("@src/models/models");
class UserRepository {
    //for login
    async findByPhoneNumber(phoneNumber) {
        try {
            return prisma_1.prisma.user.findUnique({
                where: { phoneNumber: phoneNumber },
                select: {
                    id: true,
                    phoneNumber: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    passwordHash: true
                }
            });
        }
        catch (err) {
            console.error('UserRepository.findByPhoneNumber error:', err);
            throw err;
        }
    }
    async createUser(phoneNumber, firstName, lastName, password) {
        try {
            const saltRounds = 12;
            const hashedPassword = await bcrypt_1.default.hash(password, saltRounds);
            const user = await prisma_1.prisma.user.create({
                data: {
                    phoneNumber: phoneNumber,
                    firstName: firstName || '',
                    lastName: lastName || '',
                    passwordHash: hashedPassword,
                    role: models_1.UserRole.Buyer,
                    status: 'active',
                },
            });
            if (!user) {
                return null;
            }
            return user;
        }
        catch (err) {
            console.error('UserRepository.createUser error:', err);
            throw err;
        }
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user_repository.js.map