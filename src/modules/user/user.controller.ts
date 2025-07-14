import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { instanceToPlain } from 'class-transformer';
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
    constructor(private userService: UserService) { }

    @Get('')
    async findAll(): Promise<UserResponseDto[]> {
        const users = await this.userService.findAll()
        return instanceToPlain(users) as UserResponseDto[];
    }

    @Get(':id')
    async findById(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
        const user = await this.userService.findById(id)
        return instanceToPlain(user) as UserResponseDto
    }

    @Post('')
    async create(@Body() dataUser: CreateUserDto): Promise<UserResponseDto> {
        const user = await this.userService.create(dataUser)
        return instanceToPlain(user) as UserResponseDto
    }

    @Put(':id')
    async update(@Body() updateData: UpdateUserDto, @Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
        const updatedUser = await this.userService.update(updateData, id)
        return instanceToPlain(updatedUser) as UserResponseDto
    }

    @Delete(':id')
    async delete(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
        const { message } = await this.userService.delete(id)
        return {
            message: message
        }
    }
}
