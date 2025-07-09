import { Request } from "@nestjs/common";

export interface GoogleUser {
    id: number;
    fullname: string;
    username: string;
    email: string;
    providers: object;
    password: string;
}

export interface RequestWithUser extends Request {
    user?: GoogleUser;
}