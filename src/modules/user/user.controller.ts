import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put, Req, SerializeOptions, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { plainToInstance } from 'class-transformer';
import { RequirePermission } from 'src/core/decorators/permission.decorator';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Request } from 'express';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('User')
@ApiBearerAuth()
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
    excludeExtraneousValues: true
})
@UseGuards(PermissionGuard)
export class UserController {
    constructor(private userService: UserService) { }

    @RequirePermission("user:read")
    @Get('')
    @ApiOperation({ summary: 'Get all users (Admin)' })
    @ApiResponse({ status: 200, description: 'Get all users successfully!' })
    async findAll(): Promise<UserResponseDto[]> {
        const users = await this.userService.findAll()
        return plainToInstance(UserResponseDto, users)
    }

    @Get('me')
    @ApiOperation({ summary: 'Get users information by them self' })
    @ApiResponse({ status: 200, description: 'Get information successfully!' })
    async getProfile(@Req() req: Request): Promise<UserResponseDto> {
        const profile = await this.userService.getProfile(req)
        return plainToInstance(UserResponseDto, profile)
    }

    @RequirePermission("user:read")
    @Get(':id')
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiResponse({ status: 200, description: 'Get user by ID successfully!' })
    async findById(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
        const user = await this.userService.findById(id)
        return plainToInstance(UserResponseDto, user)
    }

    @RequirePermission("user:create")
    @Post('')
    @ApiOperation({ summary: 'Create new user (Admin)' })
    @ApiResponse({ status: 201, description: 'Create user successully!' })
    async create(@Body() dataUser: CreateUserDto): Promise<UserResponseDto> {
        const user = await this.userService.create(dataUser)
        return plainToInstance(UserResponseDto, user)
    }

    @Put('me')
    @ApiOperation({ summary: 'Update users information by themself' })
    @ApiResponse({ status: 200, description: 'Update information successfully!' })
    async updateProfile(@Body() profileData: UpdateProfileDto, @Req() req: Request): Promise<UserResponseDto> {
        const updatedProfile = await this.userService.updateProfile(profileData, req)
        return plainToInstance(UserResponseDto, updatedProfile)
    }

    @RequirePermission("user:update")
    @Put(':id')
    @ApiOperation({ summary: 'Update users information' })
    @ApiResponse({ status: 200, description: 'Update user successfully!' })
    async update(@Body() updateData: UpdateUserDto, @Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
        const updatedUser = await this.userService.update(updateData, id)
        return plainToInstance(UserResponseDto, updatedUser)
    }

    @RequirePermission("user:update")
    @Patch(':id/lock')
    @ApiOperation({ summary: 'Lock user' })
    @ApiResponse({ status: 200, description: 'Lock user successfully!' })
    async lock(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
        const updatedUser = await this.userService.lock(id)
        return plainToInstance(UserResponseDto, updatedUser)
    }

    @RequirePermission("user:update")
    @Patch(':id/unlock')
    @ApiOperation({ summary: 'Unlock user' })
    @ApiResponse({ status: 200, description: 'Unlock user successfully!' })
    async unlock(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
        const updatedUser = await this.userService.unlock(id)
        return plainToInstance(UserResponseDto, updatedUser)
    }


    @RequirePermission("user:delete")
    @Delete(':id')
    @ApiOperation({ summary: 'Delete user' })
    @ApiResponse({ status: 204, description: 'Delete user successfully!' })
    async delete(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
        const { message } = await this.userService.delete(id)
        return {
            message: message
        }
    }
}
