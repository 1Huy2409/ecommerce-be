import { Body, Controller, Get, Post } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { LoginDTO } from "./dto/login.dto"
import { RegisterDTO } from "./dto/register.dto"
@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}
    @Post('login')
    login(@Body() loginDTO: LoginDTO): void
    {
        this.authService.login(loginDTO)
    }
    @Post('register')
    register(@Body() registerDTO: RegisterDTO): void
    {
        this.authService.register(registerDTO)
    }
}