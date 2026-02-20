import { UserResponseDTO } from "@src/types/response_dto.js";
import { UserRepository } from "@src/repositories/user_repository.js";
import bcrypt from 'bcrypt';

export class UserService {
    private user_repository : UserRepository

    constructor() {
        this.user_repository = new UserRepository();
    }

    // async findUserByPhoneNumber(phoneNumber: string): Promise<UserResponseDTO | null> {
    //     try {
    //         const user = await this.user_repository.findByPhoneNumber(phoneNumber);

    //         if(!user) {
    //             return null;
    //         }

    //         const userResponse : UserResponseDTO = {
    //             userId: user.id,
    //             firstName: user.firstName ?? '',
    //             lastName: user.lastName,
    //             role: user.role
    //         }

    //         return userResponse;
    //     } catch (error){
    //         throw error;
    //     }
    // }

    // async findUserByID(userID: string) : Promise<UserResponseDTO | null> {
    //     try {
    //         const user = await this.user_repository.findByUserID(userID);

    //         if(!user) {
    //             return null;
    //         }

    //         const userResponse : UserResponseDTO = {
    //             userId: user.id,
    //             firstName: user.firstName ?? '',
    //             lastName: user.lastName,
    //             role: user.role
    //         }

    //         return userResponse;
    //     } catch (error){
    //         throw error;
    //     }
    // }

    // async findUserByGoogleId(googleId: string) : Promise<UserResponseDTO | null> {
    //     try {
    //          const user = await this.user_repository.findByGoogleId(googleId);

    //          if (!user) {
    //             return null;
    //          }
    //          const userResponse : UserResponseDTO = {
    //             userId: user.id,
    //             firstName: user.firstName ?? '',
    //             lastName: user.lastName,
    //             role: user.role
    //         }

    //         return userResponse;

    //     } catch (error) {
    //         throw error;
    //     }
    // }

    
    // async findUserByEmail(email: string) : Promise<UserResponseDTO | null> {
    //     try {
    //         const user = await this.user_repository.findByEmail(email);

    //         if(!user) {
    //             return null;
    //         }

    //         const userResponse : UserResponseDTO = {
    //             userId: user.id,
    //             firstName: user.firstName ?? '',
    //             lastName: user.lastName,
    //             role: user.role
    //         }

    //         return userResponse;
    //     } catch (error){
    //         throw error;
    //     }
    // }

    async findUser(criteria: { phoneNumber?: string | undefined; googleId?: string | undefined; userId?: string | undefined; email?: string | undefined}) {
        const user : UserResponseDTO | null = await this.user_repository.findByAnyIdentifier(criteria);
        return user;
    }

    async verifyUser(criteria: {phoneNumber?: string, email?: string}, password: string) {
            
        try {
            const user = await this.findUser(criteria);

            if(!user) {
                return null;
            }

            const isPasswordValid = await bcrypt.compare(password, user.passwordHash ?? '');
            if(!isPasswordValid) {
                return null;
            }

            const userResponse : UserResponseDTO = {
                id: user.id,
                phoneNumber: user.phoneNumber,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                email: user.email,
                googleId: user.googleId
            }

            return userResponse;
        } catch {
            throw new Error("Unable to verify user");
        }
        
    }

    async createUser(firstName: string, lastName: string, password?: string, email?: string, googleId?: string, phoneNumber?: string) {
       
        try {
            const identifiers: { phoneNumber?: string; googleId?: string; email?: string } = {};
        
            if (phoneNumber !== undefined) identifiers.phoneNumber = phoneNumber;
            if (googleId !== undefined) identifiers.googleId = googleId;
            if (email !== undefined) identifiers.email = email;
            
            if (Object.keys(identifiers).length === 0) {
                throw new Error("At least one of phoneNumber, googleId, or email is required");
            }
            const userExist = await this.user_repository.findByAnyIdentifier(identifiers);

            if(userExist) {
                throw new Error("User exists already");
            }

            const user = await this.user_repository.createUser(firstName, lastName, password, phoneNumber, email, googleId);

            if(!user) {
                throw new Error("Error when creating user");
            }

            const userResponse : UserResponseDTO = {
                id: user.id,
                phoneNumber: user.phoneNumber,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                email: user.email,
                googleId: user.googleId
            }

            return userResponse;
        } catch (error){
            throw error;
        }


    }
}