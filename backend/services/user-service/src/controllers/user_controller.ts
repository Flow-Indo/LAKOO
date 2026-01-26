import { type Request, type Response} from 'express';
import { UserService } from '@src/services/user_service';
import { UserResponseDTO } from '@src/types/response_dto';


export class UserController {
    private userService: UserService;
    constructor() {
        this.userService = new UserService();
    }

   findUser = async(req: Request, res: Response) => {
        try {
            //parse and validate params using zod
            const { phoneNumber } = req.params;
            const user : UserResponseDTO | null = await this.userService.findUser(phoneNumber as string);

            if(!user) {
                res.status(404).json({
                    error: "user not found"
                })
            }
            return res.json({
                success: user,
                user: user
            })

        } catch (error) {
            return res.status(404).json({
                error: error
            })
        }

   }

   verifyUser = async(req: Request, res: Response) => {
        try {
            const { phoneNumber, password } = req.body;
            const user: UserResponseDTO | null = await this.userService.verifyUser(phoneNumber, password);
            if(!user) {
                return res.status(401).json({
                    error: "Invalid credentials"
                })
            }

            return res.json({
                success: true,
                user: user
            })
        } catch(error: any) {
            res.status(400).json({
                error: error.message ?? "Unable to verify user"
            })
        }
   }


   createUser = async(req: Request, res: Response) => {
        try {
            const { phoneNumber, firstName , lastName, password } = req.body;

            const user : UserResponseDTO = await this.userService.createUser(phoneNumber, firstName, lastName, password);
            
        } catch (error) {

        }
   }

    


}