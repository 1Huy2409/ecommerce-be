import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common"
import { Request, Response } from "express"
import { AuthService } from "./auth.service"
import { LoginDTO } from "./dto/login.dto"
import { RegisterDTO } from "./dto/register.dto"
import { User } from "src/database/entities/user.entity"
import { Public } from "src/core/decorators/public.decorator"
import { GoogleOAuthGuard } from "src/core/guards/google-oauth.guard"
import { RequestWithUser } from "./types/auth.type"
@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) { }
    @Public()
    @Post('login')
    async login(@Body() loginDTO: LoginDTO, @Res({ passthrough: true }) res: Response): Promise<{ accessToken: string }> {
        const { accessToken, refreshToken } = await this.authService.login(loginDTO)
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            expires: new Date(Date.now() + 24 * 3600)
        })
        return {
            accessToken: accessToken
        }
    }

    @Public()
    @Get('google')
    @UseGuards(GoogleOAuthGuard)
    async googleAuth(@Req() req: Request) { }

    @Public()
    @Get('google/callback')
    @UseGuards(GoogleOAuthGuard)
    async googleRedirect(@Req() req: RequestWithUser, @Res({ passthrough: true }) res: Response): Promise<{ accessToken: string }> {
        const { accessToken, refreshToken } = await this.authService.googleRedirect(req)
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            expires: new Date(Date.now() + 24 * 3600)
        })
        return {
            accessToken: accessToken
        }
    }

    @Public()
    @Post('register')
    register(@Body() registerDTO: RegisterDTO): Promise<User> {
        return this.authService.register(registerDTO)
    }
    @Public()
    @Post('processNewToken')
    refreshToken(@Req() req: Request): Promise<{ accessToken: string }> {
        return this.authService.refreshToken(req)
    }
    @Post('logout')
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<{ message: string }> {
        const { message } = await this.authService.logout(req)
        res.clearCookie("refreshToken")
        return {
            message: message
        }
    }
}