"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyServiceToken = exports.generateServiceToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateServiceToken = (serviceName, secret) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const message = `${serviceName}:${timestamp}`;
    const signature = crypto_1.default
        .createHmac('sha256', secret)
        .update(message)
        .digest('hex');
    return `${serviceName}:${timestamp}:${signature}`;
};
exports.generateServiceToken = generateServiceToken;
const verifyServiceToken = (token, serviceSecret) => {
    const parts = token.split(':');
    if (parts.length !== 3) {
        throw new Error("invalid token format");
    }
    const [tokenServiceName, timestampStr, signature] = parts;
    const timestamp = parseInt(timestampStr);
    //check timestamp (5 minutes)
    const now = Math.floor(Date.now() / 1000);
    if (now - timestamp > 300) {
        throw new Error("Token Expired");
    }
    //verify token
    const message = `${tokenServiceName}:${timestamp}`;
    const expectedSignature = crypto_1.default
        .createHmac('sha256', serviceSecret)
        .update(message)
        .digest('hex');
    if (signature !== expectedSignature) {
        throw new Error("Invalid signature");
    }
    return;
};
exports.verifyServiceToken = verifyServiceToken;
//# sourceMappingURL=serviceAuth.js.map