import { generateServiceToken } from "@shared/utils/serviceAuth";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { UserResponseDTO } from "../types/response_dto";


export interface UserHTTPClientConfig {
    gatewayURL: string;
    userServiceURL: string;
    timeout: number;
    serviceName: string;
    serviceSecret: string;
}

export interface UserServiceClient {
    verifyUser(phonenumber: string, password: string): Promise<UserResponseDTO>;
}

export class UserHTTPClient implements UserServiceClient {
    private httpClient: AxiosInstance;
    private gatewayURL: string;
    private userServiceURL: string;
    private serviceName: string;
    private serviceSecret: string;


    constructor(config: UserHTTPClientConfig) {
        this.gatewayURL = config.gatewayURL;
        this.serviceName = config.serviceName;
        this.serviceSecret = config.serviceSecret;
        this.userServiceURL = config.userServiceURL;

        this.httpClient = axios.create({
            timeout: config.timeout,
            baseURL: config.gatewayURL,
        });

        //add service headers
        this.httpClient.interceptors.request.use(
            (config) => {
                this.addServiceHeaders(config);
                return config;
            },
            (error) => Promise.reject(error)
        );
    }

    private addServiceHeaders(config: AxiosRequestConfig): void {
        const serviceToken = generateServiceToken(this.serviceName, this.serviceSecret);
        config.headers = {
            ...config.headers,
            'x-service-auth': serviceToken,
            'x-service-name': this.serviceName,
        };
    }


    //internal
    async verifyUser(phonenumber: string, password: string): Promise<UserResponseDTO> {
        try {   
            const url = `${this.userServiceURL}/internal/verify`;
            const response: AxiosResponse<UserResponseDTO> = await this.httpClient.post(url, {
                phoneNumber: phonenumber,
                password
            });

            return response.data;
        } catch(error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    //server responded with error status
                    throw new Error(
                        `User service returned ${error.response.status}: ${JSON.stringify(error.response.data)}`
                    );
                } else if (error.request) {
                    //no response received
                    throw new Error('No response from user service');
                }
            }
            throw new Error(`Failed to verify user: ${error instanceof Error ? error.message : String(error)}`);
        }
        

    }

    async createUser(phonenumber: string, firstName: string, lastName: string, password: string): Promise<UserResponseDTO> {
        try {
            const url = `${this.userServiceURL}/internal/create`;
            const response: AxiosResponse<UserResponseDTO> = await this.httpClient.post(url, {
                phoneNumber: phonenumber,
                firstName,
                lastName,
                password
            });

            return response.data;
        } catch (error) {
            if(axios.isAxiosError(error)) {
                if(error.response) {
                    throw new Error(
                        `User service returned ${error.response.status}: ${JSON.stringify(error.response.data)} `
                    )
                } else if(error.request) {
                    throw new Error("No response from user service");
                }

            }
            throw new Error(`Failed to create user: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    //external
}