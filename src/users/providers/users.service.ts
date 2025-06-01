import { Injectable } from "@nestjs/common";
import { GetUserParamDto } from "../dtos/get-user-param.dto";

@Injectable()
export class UsersService {
    public findAll(
        getUserParamDto: GetUserParamDto,
        limit: number,
        page: number
    ) {
        console.log(getUserParamDto, limit, page);
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