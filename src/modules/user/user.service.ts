import { BadRequestException, ConflictException, Injectable, NotFoundException, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Role } from 'src/database/entities/role.entity';
import { Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt'
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Role)
        private rolesRepository: Repository<Role>
    ) { }
    async findAll(): Promise<User[]> {
        const users = await this.usersRepository.find()
        return users;
    }
    async findById(id: string) {
        const user = await this.usersRepository.findOne({ where: { id } })
        if (!user) {
            throw new NotFoundException("User not found!")
        }
        return user;
    }
    async create(userData: CreateUserDto): Promise<User> {
        const existingUser = await this.usersRepository.findOne({ where: [{ email: userData.email }, { username: userData.username }] })
        if (existingUser) {
            if (existingUser.email === userData.email) {
                throw new ConflictException("This email already exist!")
            }
            if (existingUser.username === userData.username) {
                throw new ConflictException("This username already exist!")
            }
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10)
        const roleOption = await this.rolesRepository.findOne({ where: { id: userData.role_id } })
        if (!roleOption) {
            throw new BadRequestException("RoleID not found!")
        }
        const newUser = this.usersRepository.create({
            fullname: userData.fullname,
            username: userData.username,
            email: userData.email,
            password: hashedPassword,
            role: roleOption
        })
        const saveUser = await this.usersRepository.save(newUser);
        return saveUser;
    }
    async update(updateData: UpdateUserDto, id: string): Promise<User> {
        console.log("data:", updateData)
        const user = await this.usersRepository.findOne({ where: { id } })
        if (!user) {
            throw new NotFoundException("User not found!")
        }
        const checkDuplicate = await this.usersRepository.findOne({
            where:
                [
                    {
                        email: updateData.email,
                        id: Not(user.id)
                    },
                    {
                        username: updateData.username,
                        id: Not(user.id)
                    },
                    {
                        phone_number: updateData.phone_number,
                        id: Not(user.id)
                    }
                ]
        })
        if (checkDuplicate) {
            if (checkDuplicate.email === updateData.email) {
                throw new ConflictException("This email already exist")
            }
            if (checkDuplicate.username === updateData.username) {
                throw new ConflictException("This username already exist")
            }
        }
        else {
            console.log("Khong duplicate")
        }
        const hashedPassword = await bcrypt.hash(updateData.password, 10)
        const updatedUser = await this.usersRepository.save({
            ...user,
            ...updateData,
            password: hashedPassword
        });
        // user.fullname = updateData.fullname
        // user.username = updateData.username
        // user.email = updateData.email
        // user.password = hashedPassword
        // user.phone_number = updateData.phone_number
        // return await this.usersRepository.save(user);
        return updatedUser;
    }
    async delete(id: string): Promise<{ message: string }> {
        const user = await this.usersRepository.findOne({ where: { id } })
        if (!user) {
            throw new NotFoundException("User not found!")
        }
        await this.usersRepository.delete(user)
        return {
            message: "Delete successfully!"
        }
    }
}
