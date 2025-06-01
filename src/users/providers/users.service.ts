import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { GetUserParamDto } from "../dtos/get-user-param.dto";
import { AuthService } from "src/auth/providers/auth.service";

@Injectable()
export class UsersService {
    constructor(
        @Inject(forwardRef(() => AuthService))
        private readonly authServices: AuthService
    ) { }
    public findAll(
        getUserParamDto: GetUserParamDto,
        limit: number,
        page: number
    ) {
        console.log(this.authServices.isAuth())
        return [
            {
                firstName: "Abraam",
                email: 'abraam@gmail.com'
            },
            {
                firstName: "Sara",
                email: 'sara@gmail.com'
            }
        ]
    }

    public findOneById(
        id: string
    ) {
        return {
            id: 123,
            firstName: "Abraam",
            email: 'abraam@gmail.com'
        }
    }
}