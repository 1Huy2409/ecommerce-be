import { permission } from 'process';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionResponseDto } from './dto/permission-response.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
@Controller('permissions')
export class PermissionController {
    constructor(
        private permissionService: PermissionService
    ) { }

    @Get('')
    async getAllPermission(): Promise<PermissionResponseDto[]> {
        const permissions = await this.permissionService.getAllPermission()
        return permissions
    }

    @Get(':id')
    async getPermissionById(@Param('id', ParseUUIDPipe) id: string): Promise<PermissionResponseDto> {
        const permission = await this.permissionService.getPermissionById(id)
        return permission
    }

    @Post('')
    @HttpCode(HttpStatus.CREATED)
    async createPermission(@Body() permissionData: CreatePermissionDto): Promise<PermissionResponseDto> {
        const newPermission = await this.permissionService.createPermission(permissionData)
        return newPermission
    }

    @Put(':id')
    async updatePermission(@Body() updateData: UpdatePermissionDto, @Param('id', ParseUUIDPipe) id: string): Promise<PermissionResponseDto> {
        const updatePermission = await this.permissionService.updatePermission(updateData, id)
        return updatePermission
    }

    @Delete(':id')
    async deletePermission(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
        const { message } = await this.permissionService.deletePermission(id)
        return {
            message
        }
    }
}
