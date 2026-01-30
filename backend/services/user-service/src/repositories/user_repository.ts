import { prisma } from '@src/lib/prisma';
import bcrypt from 'bcrypt';
import { UserRole } from '@src/models/models';


export class UserRepository {
    //for login
    async findByPhoneNumber(phoneNumber: string) {
        try {
            return prisma.user.findUnique({
                where: { phoneNumber: phoneNumber },
                select: {
                    id: true,
                    phoneNumber: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    passwordHash: true
                }
            })
        } catch (err) {
            console.error('UserRepository.findByPhoneNumber error:', err);
            throw err;
        }
        
    }

    async createUser(phoneNumber: string, firstName: string, lastName: string, password: string) {
        try {
            const saltRounds = 12;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const user = await prisma.user.create({
                data: {
                    phoneNumber: phoneNumber,
                    firstName: firstName || '',
                    lastName: lastName || '',
                    passwordHash: hashedPassword,
                    role: UserRole.Buyer,
                    status: 'active',
                },
            })

            if(!user) {
                return null;
            }

            return user;
        } catch (err) {
            console.error('UserRepository.createUser error:', err);
            throw err;
        }
    }

    // async getPassword(phoneNumber: string) {
    //     return prisma.users.findUnique({
    //         where: { phone_number: phoneNumber },
    //         select: {
    //             password_hash: true
    //         }
    //     })
    // }

}


