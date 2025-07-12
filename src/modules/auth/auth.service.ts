import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Req } from "@nestjs/common"
import { Request } from "express"
import { User } from "src/database/entities/user.entity";
import { Role } from "src/database/entities/role.entity";
import { RegisterDTO } from "./dto/register.dto";
import { LoginDTO } from "./dto/login.dto";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt'
import { JwtService } from "@nestjs/jwt";
import { RequestWithUser } from "./types/auth.type";
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Role)
        private rolesRepository: Repository<Role>,
        private jwtService: JwtService
    ) { }
    async login(credential: LoginDTO): Promise<{ accessToken: string, refreshToken: string }> {
        const { username, password } = credential
        const user = await this.usersRepository.findOne({ where: { username } })
        if (!user) {
            throw new BadRequestException("Username Incorrect!")
        }
        const isMatch: boolean = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            throw new BadRequestException("Password Incorrect!")
        }
        const payload = { sub: user.id, username: user.username, email: user.email }
        const accessToken = await this.jwtService.signAsync(payload)
        const refreshToken = this.jwtService.sign(
            payload,
            {
                secret: process.env.JWT_SECRET,
                expiresIn: process.env.JWT_REFRESH_EXPIRE
            }
        )
        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    }
    async googleRedirect(@Req() req: RequestWithUser): Promise<{ accessToken: string, refreshToken: string }> {
        if (!req.user) {
            throw new BadRequestException("This user doesnt exist")
        }
        const payload =
        {
            sub: req.user.id,
            username: req.user.username,
            email: req.user.email
        }
        const accessToken = await this.jwtService.signAsync(payload)
        const refreshToken = this.jwtService.sign(
            payload,
            {
                secret: process.env.JWT_SECRET,
                expiresIn: process.env.JWT_REFRESH_EXPIRE
            }
        )
        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    }
    async register(newData: RegisterDTO): Promise<User> {
        const { fullname, username, email, password } = newData;
        const existingUser = await this.usersRepository.findOne({ where: [{ email }, { username }] })
        if (existingUser) {
            if (existingUser.email === email) {
                throw new ConflictException("This email already exist!")
            }
            if (existingUser.username === username) {
                throw new ConflictException("This username already exist!")
            }
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const customerRole: Role | null = await this.rolesRepository.findOne({ where: { name: 'customer' } })
        if (!customerRole) {
            throw new ConflictException("Customer role not support!")
        }
        const newUserData = {
            fullname,
            username,
            email,
            password: hashedPassword,
            role: customerRole
        }
        return this.usersRepository.save(newUserData)
    }
    async refreshToken(@Req() req: Request): Promise<{ accessToken: string }> {
        const refreshToken = req.cookies['refreshToken'];
        if (!refreshToken) {
            throw new UnauthorizedException("Refresh token not found!")
        }
        const decode = await this.jwtService.verifyAsync(refreshToken, {
            secret: process.env.JWT_SECRET
        })
        const { sub, username, email } = decode
        const newPayload = { sub, username, email }
        const newAccessToken = await this.jwtService.signAsync(newPayload)
        return {
            accessToken: newAccessToken
        }
    }
    async logout(@Req() req: Request): Promise<{ message: string }> {
        const refreshToken = req.cookies['refreshToken'];
        if (!refreshToken) {
            throw new UnauthorizedException("Refresh token not found!")
        }
        return {
            message: 'Logout successfully!'
        }
    }
}