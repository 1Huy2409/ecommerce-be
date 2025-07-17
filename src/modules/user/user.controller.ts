import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { instanceToPlain } from 'class-transformer';
import { RequirePermission } from 'src/core/decorators/permission.decorator';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Request } from 'express';
import { UpdateProfileDto } from './dto/update-profile.dto';
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(PermissionGuard)
export class UserController {
    constructor(private userService: UserService) { }

    @RequirePermission("user:read")
    @Get('')
    async findAll(): Promise<UserResponseDto[]> {
        const users = await this.userService.findAll()
        return instanceToPlain(users) as UserResponseDto[];
    }

    @Get('me')
    async getProfile(@Req() req: Request): Promise<UserResponseDto> {
        const profile = await this.userService.getProfile(req)
        return instanceToPlain(profile) as UserResponseDto
    }

    @RequirePermission("user:read")
    @Get(':id')
    async findById(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
        const user = await this.userService.findById(id)
        return instanceToPlain(user) as UserResponseDto
    }


    @RequirePermission("user:create")
    @Post('')
    async create(@Body() dataUser: CreateUserDto): Promise<UserResponseDto> {
        const user = await this.userService.create(dataUser)
        return instanceToPlain(user) as UserResponseDto
    }

    @Put('me')
    async updateProfile(@Body() profileData: UpdateProfileDto, @Req() req: Request): Promise<UserResponseDto> {
        const updatedProfile = await this.userService.updateProfile(profileData, req)
        return instanceToPlain(updatedProfile) as UserResponseDto
    }

    @RequirePermission("user:update")
    @Put(':id')
    async update(@Body() updateData: UpdateUserDto, @Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
        const updatedUser = await this.userService.update(updateData, id)
        return instanceToPlain(updatedUser) as UserResponseDto
    }

    @RequirePermission("user:update")
    @Patch(':id/lock')
    async lock(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
        const updatedUser = await this.userService.lock(id)
        return instanceToPlain(updatedUser) as UserResponseDto
    }

    @RequirePermission("user:update")
    @Patch(':id/unlock')
    async unlock(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
        const updatedUser = await this.userService.unlock(id)
        return instanceToPlain(updatedUser) as UserResponseDto
    }


    @RequirePermission("user:delete")
    @Delete(':id')
    async delete(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
        const { message } = await this.userService.delete(id)
        return {
            message: message
        }
    }
}
