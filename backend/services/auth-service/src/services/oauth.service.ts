import { UserHTTPClient } from "@src/clients/userServiceClient";
import { UserResponseDTO } from "@src/types/response_dto";




export class OAuthService{
    private userServiceClient: UserHTTPClient
    constructor() {
        this.userServiceClient = new UserHTTPClient({
            gatewayURL:  process.env.GATEWAY_URL ?? 'http://localhost:8080',
            userServiceURL: process.env.USER_SERVICE_URL ?? 'http://localhost:8018', 
            timeout: 5000,
            serviceName: "AUTH_SERVICE",
            serviceSecret: process.env.SERVICE_SECRET ?? 'secret',
        });
    }

    async findOrCreateGoogleUser(profile: any) {
        const {sub: googleId, email, given_name, family_name} = profile;

        const user = await this.userServiceClient.createUser(given_name, family_name, undefined, undefined, email,googleId); //create user already verifies if the user exists already

        return user;
        
    }

}