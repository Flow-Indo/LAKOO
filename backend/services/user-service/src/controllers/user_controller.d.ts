import { type Request, type Response } from 'express';
export declare class UserController {
    private userService;
    constructor();
    findUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    verifyUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    createUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=user_controller.d.ts.map