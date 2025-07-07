import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {
    constructor() {}
    async login(credential): Promise<void>
    {
        console.log(credential)
    }
    async register(newData): Promise<void>
    {
        console.log(newData)
    }
}