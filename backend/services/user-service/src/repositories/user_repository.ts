import { prisma } from '@src/lib/prisma.js';
import bcrypt from 'bcrypt';
import { error } from 'console';
import { UserRole } from '@src/models/models.js';


export class UserRepository {
   

    async findByAnyIdentifier(identifiers: {phoneNumber?: string | undefined; googleId?: string | undefined; userId?: string | undefined; email?: string | undefined}) {
        const {phoneNumber, googleId, userId, email} = identifiers;

        const orConditions = [];
        if(userId) orConditions.push({ userId });
        if (phoneNumber) orConditions.push({ phoneNumber });
        if (email) orConditions.push({ email });
        if (googleId) orConditions.push({ googleId });

        if (orConditions.length === 0) return null;

        return prisma.user.findFirst({
            where: {
                OR: orConditions
            },
            select: {
                id: true,
                phoneNumber: true,
                firstName: true,
                lastName: true,
                passwordHash: true,
                role: true,
                email: true,
                googleId: true
            }
        });
    }

    async createUser(firstName: string, lastName: string, password?: string, phoneNumber?: string, email?: string, googleId?: string) {
        
        let hashedPassword = '';
        if(password) {
            const saltRounds = 12;
            hashedPassword = await bcrypt.hash(password, saltRounds);
        }
        

        const user = await prisma.user.create({
            data: {
                phoneNumber: phoneNumber,
                email: email,
                googleId: googleId,
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


