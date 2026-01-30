"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const prisma_1 = require("@src/generated/prisma");
const prismaClientSingleton = () => {
    return new prisma_1.PrismaClient({
        log: process.env.NODE_ENV === 'development'
            ? ['query', 'error', 'warn']
            : ['error'],
    });
};
exports.prisma = globalThis.prisma ?? prismaClientSingleton();
if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = exports.prisma;
}
// Graceful shutdown
process.on('beforeExit', async () => {
    await exports.prisma.$disconnect();
});
//# sourceMappingURL=prisma.js.map