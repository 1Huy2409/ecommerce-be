import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/database/entities/user.entity";
import { RegisterDTO } from "./dto/register.dto";
import { LoginDTO } from "./dto/login.dto";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt'
import { JwtService } from "@nestjs/jwt";
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService
    ) {}
    async login(credential: LoginDTO): Promise<{accessToken: string, refreshToken: string}>
    {   
        const {username, password} = credential
        const user = await this.usersRepository.findOne({where: {username}})
        if (!user)
        {
            throw new BadRequestException("Username Incorrect!")
        }
        const isMatch: boolean = await bcrypt.compare(password, user.password)
        if (!isMatch)
        {
            throw new BadRequestException("Password Incorrect!")
        }
        const payload = {sub: user.id, username: user.username, email: user.email}
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
    async register(newData: RegisterDTO): Promise<User>
    {
        const { fullname, username, email, password } = newData;
        const existingUser = await this.usersRepository.findOne({ where: [{email}, {username}] })
        if (existingUser)
        {
            if (existingUser.email === email)
            {
                throw new ConflictException("This email already exist!")
            }
            if (existingUser.username === username)
            {
                throw new ConflictException("This username already exist!")
            }
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = this.usersRepository.create({
            fullname,
            username,
            email,
            password: hashedPassword
        });
        return this.usersRepository.save(newUser)
    }
}