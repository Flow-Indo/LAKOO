"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_repository_1 = require("@src/repositories/user_repository");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserService {
    user_repository;
    constructor() {
        this.user_repository = new user_repository_1.UserRepository();
    }
    async findUser(phoneNumber) {
        try {
            const user = await this.user_repository.findByPhoneNumber(phoneNumber);
            if (!user) {
                return null;
            }
            const userResponse = {
                userId: user.id,
                phoneNumber: user.phoneNumber,
                firstName: user.firstName ?? '',
                lastName: user.lastName,
                role: user.role
            };
            return userResponse;
        }
        catch {
            return null;
        }
    }
    async verifyUser(phoneNumber, password) {
        try {
            const user = await this.user_repository.findByPhoneNumber(phoneNumber);
            if (!user) {
                return null;
            }
            const isPasswordValid = await bcrypt_1.default.compare(password, user.passwordHash ?? '');
            if (!isPasswordValid) {
                return null;
            }
            const userResponse = {
                userId: user.id,
                phoneNumber: user.phoneNumber,
                firstName: user.firstName ?? '',
                lastName: user.lastName,
                role: user.role
            };
            return userResponse;
        }
        catch {
            throw new Error("Unable to verify user");
        }
    }
    async createUser(phoneNumber, firstName, lastName, password) {
        try {
            const userExist = await this.user_repository.findByPhoneNumber(phoneNumber);
            if (userExist) {
                throw new Error("User exists already");
            }
            const user = await this.user_repository.createUser(phoneNumber, firstName, lastName, password);
            if (!user) {
                throw new Error("Error when creating user");
            }
            const userResponse = {
                userId: user.id,
                phoneNumber: user.phoneNumber,
                firstName: user.firstName ?? '',
                lastName: user.lastName,
                role: user.role
            };
            return userResponse;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user_service.js.map