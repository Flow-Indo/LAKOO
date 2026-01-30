"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("@src/services/user_service");
class UserController {
    userService;
    constructor() {
        this.userService = new user_service_1.UserService();
    }
    findUser = async (req, res) => {
        try {
            //parse and validate params using zod
            const { phoneNumber } = req.params;
            const user = await this.userService.findUser(phoneNumber);
            if (!user) {
                return res.status(404).json({
                    error: "user not found"
                });
            }
            return res.json({
                success: true,
                user
            });
        }
        catch (error) {
            return res.status(500).json({
                error: error instanceof Error ? error.message : String(error)
            });
        }
    };
    verifyUser = async (req, res) => {
        try {
            const { phoneNumber, password } = req.body;
            const user = await this.userService.verifyUser(phoneNumber, password);
            if (!user) {
                return res.status(401).json({
                    error: "Invalid credentials"
                });
            }
            return res.json({
                success: true,
                user: user
            });
        }
        catch (error) {
            res.status(400).json({
                error: error.message ?? "Unable to verify user"
            });
        }
    };
    createUser = async (req, res) => {
        try {
            const { phoneNumber, firstName, lastName, password } = req.body;
            const user = await this.userService.createUser(phoneNumber, firstName, lastName, password);
            if (!user) {
                return res.status(400).json({ success: false, error: 'Failed to create user' });
            }
            return res.status(201).json({
                success: true,
                data: {
                    // UserResponseDTO uses `userId`; include both for compatibility
                    id: user.userId,
                    userId: user.userId,
                    phoneNumber: user.phoneNumber,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role
                }
            });
        }
        catch (error) {
            console.error('Create user error:', error);
            return res.status(500).json({ success: false, error: 'Internal server error' });
        }
    };
}
exports.UserController = UserController;
//# sourceMappingURL=user_controller.js.map