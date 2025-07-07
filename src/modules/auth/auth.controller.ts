import { Body, Controller, Get, Post } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { LoginDTO } from "./dto/login.dto"
import { RegisterDTO } from "./dto/register.dto"
import { User } from "src/database/entities/user.entity"
@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}
    @Post('login')
    login(@Body() loginDTO: LoginDTO): Promise<{accessToken: string, refreshToken: string}>
    {
        return this.authService.login(loginDTO)
    }
    @Post('register')
    register(@Body() registerDTO: RegisterDTO): Promise<User>
    {
        return this.authService.register(registerDTO)
    }
}