import crypto from 'crypto';

export const generateGatewayToken = (secret: string): string => {
    const timestamp = Math.floor(Date.now() / 1000);
    const message = `apiGateway:${timestamp}`;
    const signature = crypto
        .createHmac('sha256', secret)
        .update(message)
        .digest('hex');
    
    return `apiGateway:${timestamp}:${signature}`;
};

export const verifyGatewayToken = (token: string | string[], gatewaySecret: string) => {
    const parts = (token as string).split(':');
    if (parts.length !== 3) {
        throw new Error("invalid token format")
    }

    const [gatewayName, timestampStr, signature] = parts;
    
    const timestamp = parseInt(timestampStr as string);

    //check timestamp (5 minutes)
    const now = Math.floor(Date.now() / 1000);
    if (now - timestamp > 300) {
        throw new Error("Token Expired")
    }
    
    //verify token
    const message = `${gatewayName}:${timestamp}`;
    const expectedSignature = crypto
        .createHmac('sha256', gatewaySecret)
        .update(message)
        .digest('hex');

    if (signature !== expectedSignature) {
        throw new Error("Invalid signature")
    }

    return


}
