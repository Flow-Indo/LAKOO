import { UserResponseDTO } from "@src/types/response_dto";
export declare class UserService {
    private user_repository;
    constructor();
    findUser(phoneNumber: string): Promise<UserResponseDTO | null>;
    verifyUser(phoneNumber: string, password: string): Promise<UserResponseDTO | null>;
    createUser(phoneNumber: string, firstName: string, lastName: string, password: string): Promise<UserResponseDTO>;
}
//# sourceMappingURL=user_service.d.ts.map