import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common"
import { Request, Response } from "express"
import { AuthService } from "./auth.service"
import { LoginDTO } from "./dto/login.dto"
import { RegisterDTO } from "./dto/register.dto"
import { User } from "src/database/entities/user.entity"
import { Public } from "src/core/decorators/public.decorator"
import { GoogleOAuthGuard } from "src/modules/auth/guards/google-oauth.guard"
import { RequestWithUser } from "./types/auth.type"
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
@ApiTags('Auth')
@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) { }
    @Public()
    @Post('login')
    @ApiOperation({ summary: 'Login to your account' })
    @ApiResponse({ status: 200, description: 'Login successfully!' })
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
    @ApiOperation({ summary: 'Register new account' })
    @ApiResponse({ status: 201, description: 'Register successfully!' })
    register(@Body() registerDTO: RegisterDTO): Promise<User> {
        return this.authService.register(registerDTO)
    }
    @Public()
    @Post('processNewToken')
    @ApiOperation({ summary: 'Refresh token' })
    @ApiResponse({ status: 201, description: 'Refresh token successfully!' })
    refreshToken(@Req() req: Request): Promise<{ accessToken: string }> {
        return this.authService.refreshToken(req)
    }
    @Post('logout')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Logout of account' })
    @ApiResponse({ status: 200, description: 'Logout of your account successfully!' })
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<{ message: string }> {
        const { message } = await this.authService.logout(req)
        res.clearCookie("refreshToken")
        return {
            message: message
        }
    }
}