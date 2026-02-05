import { UserResponseDTO } from "@src/types/response_dto.js";
import { UserRepository } from "@src/repositories/user_repository.js";
import bcrypt from 'bcrypt';

export class UserService {
    private user_repository : UserRepository

    constructor() {
        this.user_repository = new UserRepository();
    }

    async findUserByPhoneNumber(phoneNumber: string): Promise<UserResponseDTO | null> {
        try {
            const user = await this.user_repository.findByPhoneNumber(phoneNumber);

            if(!user) {
                return null;
            }

            const userResponse : UserResponseDTO = {
                userId: user.id,
                phoneNumber: user.phoneNumber,
                firstName: user.firstName ?? '',
                lastName: user.lastName,
                role: user.role
            }

            return userResponse;
        } catch {
            return null;
        }
    }

    async findUserByID(userID: string) : Promise<UserResponseDTO | null> {
        try {
            const user = await this.user_repository.findByUserID(userID);

            if(!user) {
                return null;
            }

            const userResponse : UserResponseDTO = {
                userId: user.id,
                phoneNumber: user.phoneNumber,
                firstName: user.firstName ?? '',
                lastName: user.lastName,
                role: user.role
            }

            return userResponse;
        } catch {
            return null;
        }
    }

    async verifyUser(phoneNumber: string, password: string) {
            
        try {
            const user = await this.user_repository.findByPhoneNumber(phoneNumber);

            if(!user) {
                return null;
            }

            const isPasswordValid = await bcrypt.compare(password, user.passwordHash ?? '');
            if(!isPasswordValid) {
                return null;
            }

            const userResponse : UserResponseDTO = {
                userId: user.id,
                phoneNumber: user.phoneNumber,
                firstName: user.firstName ?? '',
                lastName: user.lastName,
                role: user.role
            }

            return userResponse;
        } catch {
            throw new Error("Unable to verify user");
        }
        
    }

    async createUser(phoneNumber: string, firstName: string, lastName: string, password: string) {
       
        try {
            const userExist = await this.user_repository.findByPhoneNumber(phoneNumber);

            if(userExist) {
                throw new Error("User exists already");
            }

            const user = await this.user_repository.createUser(phoneNumber, firstName, lastName, password)

            if(!user) {
                throw new Error("Error when creating user");
            }

            const userResponse : UserResponseDTO = {
                userId: user.id,
                phoneNumber: user.phoneNumber,
                firstName: user.firstName ?? '',
                lastName: user.lastName,
                role: user.role
            }

            return userResponse;
        } catch (error){
            throw error;
        }


    }
}