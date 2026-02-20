
import OTPRepository from "@src/repositories/otp.repository";
import { generateOTP } from "@src/utils/otpGenerator";
import { checkWhatsAppStatus, sendOTPViaWhatsApp } from "@src/clients/whatsappClient";
import { UserHTTPClient } from "@src/clients/userServiceClient";
import { UserResponseDTO } from "@src/types/response_dto";

export default class AuthService {
    private otp_repository: OTPRepository;
    private userServiceClient: UserHTTPClient;

    constructor() {
        this.otp_repository = new OTPRepository();
        this.userServiceClient = new UserHTTPClient({
            gatewayURL:  process.env.GATEWAY_URL ?? 'http://localhost:8080',
            userServiceURL: process.env.USER_SERVICE_URL ?? 'http://localhost:8018', 
            timeout: 5000,
            serviceName: "AUTH_SERVICE",
            serviceSecret: process.env.SERVICE_SECRET ?? 'secret',
        });
        
    }

    async verifyUser(phonenumber: string, password: string): Promise<UserResponseDTO> {
        try {
            const user : UserResponseDTO | null = await this.userServiceClient.verifyUser(phonenumber, password);
            return user;
        } catch(error) {
            throw error;
        }
    }

    async createUser(phoneNumber: string, firstName: string, lastName: string, password: string): Promise<UserResponseDTO> {
        try {
            const user : UserResponseDTO = await this.userServiceClient.createUser(phoneNumber, firstName, lastName, password);
            return user;
        } catch (error) {
            throw error;
        }
    }

    
    async sendOTP(phoneNumber: string) {
        try {
            const {otp} = generateOTP();
            await this.otp_repository.insertOTP(phoneNumber, otp);

            const isConnected = await checkWhatsAppStatus();
            if(!isConnected) {
                throw new Error("Server cannot connect to WhatsApp");
            }

            const response = await sendOTPViaWhatsApp(phoneNumber, otp);
            if(!response.success) {
                throw new Error("Unable to send OTP to WhatsApp")
            }

            return {success: true, message: response.message};
        } catch(error) {
            throw error;
        }
    }

    async verifyOTP(phoneNumber: string, otp: string) {
        try {
            const OTP = await this.otp_repository.getOTP(phoneNumber);

            if(OTP == null) {
                throw new Error("The OTP for this phonenumber is not available");
            }

            const createdAt = new Date(OTP.createdAt);
            const expiry = new Date(createdAt.getTime() + (5 * 60 * 1000));

            if(new Date() > expiry) {
                throw new Error("The OTP has expired");
            }

            if(otp != OTP.otp) {
                throw new Error("Wrong OTP");
            }

            return { success : true, message: "Correct OTP"};

        } catch(error: any)  {
            return { success : false, message: error.mesage};
        }
    }

}