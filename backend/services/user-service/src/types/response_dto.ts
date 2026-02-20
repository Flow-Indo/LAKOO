

export interface UserResponseDTO {
    id: string;
    phoneNumber: string | null;
    firstName: string;
    lastName: string | null;
    role: string;
    passwordHash?: string;
    email: string | null;
    googleId: string | null;
}

