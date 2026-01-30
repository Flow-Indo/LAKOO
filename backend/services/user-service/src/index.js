"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const external_1 = require("@src/routes/external");
const internal_1 = require("@src/routes/internal");
const serviceAuthMiddleware_1 = require("@shared/middleware/serviceAuthMiddleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Security middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'user-service',
        timestamp: new Date().toISOString()
    });
});
// Routes
app.use('/api/user', external_1.externalRouter);
app.use('/internal', serviceAuthMiddleware_1.serviceAuthMiddleware, internal_1.internalRouter);
// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal server error'
    });
});
const PORT = process.env.USER_SERVICE_PORT || 3004;
app.listen(PORT, () => {
    console.log(`User service running on http://localhost:${PORT}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map