import axios from 'axios';

const BLACKLIST_SERVICE_URL = process.env.BLACKLIST_SERVICE_URL || 'http://localhost:8017';

export class BlacklistService {
    static async isUserBlacklisted(userId: string): Promise<boolean> {
        try {
            const response = await axios.get(
                `${BLACKLIST_SERVICE_URL}/blacklist/users/${userId}/check`,
                { timeout: 3000 }
            );
            const responseData = response.data;

            return responseData.isBlacklisted;
        } catch (error) {
            throw error;
        }
    }

    static async isTokenBlacklisted(token: string): Promise<boolean> {
        try {
            const response = await axios.post(
                `${BLACKLIST_SERVICE_URL}/blacklist/tokens/check`,
                { token },
                { timeout: 3000 }
            );

            const responseData = response.data;

            return responseData.isBlacklisted;
            
        } catch (error) {
            throw error;
        }
    }

    // static async blacklistUser(userId: string): Promise<void> {
    //     try {
    //         const response = await axios.post(`${BLACKLIST_SERVICE_URL}/blacklist/users`,
    //             { userId },
    //             { timeout: 3000 }
    //         );

    //     } catch(error) {
    //         console.error("Error blacklisting user: ", error);
    //         throw error;
    //     }

    // }

    // static async blacklistToken(token: string) : Promise<void> {
    //     try {
    //         const response = await axios.post(
    //             `${BLACKLIST_SERVICE_URL}/blacklist/tokens`,
    //             { token },
    //             { timeout: 3000 }
    //         );
            
    //     } catch (error) {
    //         console.error("Error blacklisting token: ", error);
    //         throw error;
    //     }
    // }

}