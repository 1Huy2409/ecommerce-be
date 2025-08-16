import { permission } from 'process';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionResponseDto } from './dto/permission-response.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('Permission')
@ApiBearerAuth()
@Controller('permissions')
export class PermissionController {
    constructor(
        private permissionService: PermissionService
    ) { }

    @Get('')
    @ApiOperation({ summary: 'Get all permissions' })
    @ApiResponse({ status: 200, description: 'Get all persmissions successfully!' })
    async getAllPermission(): Promise<PermissionResponseDto[]> {
        const permissions = await this.permissionService.getAllPermission()
        return permissions
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get permission by ID' })
    @ApiResponse({ status: 200, description: 'Get persmission by ID successfully!' })
    async getPermissionById(@Param('id', ParseUUIDPipe) id: string): Promise<PermissionResponseDto> {
        const permission = await this.permissionService.getPermissionById(id)
        return permission
    }

    @Post('')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create new permisison' })
    @ApiResponse({ status: 201, description: 'Create permission persmission successfully!' })
    async createPermission(@Body() permissionData: CreatePermissionDto): Promise<PermissionResponseDto> {
        const newPermission = await this.permissionService.createPermission(permissionData)
        return newPermission
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update permission' })
    @ApiResponse({ status: 200, description: 'Update persmission successfully!' })
    async updatePermission(@Body() updateData: UpdatePermissionDto, @Param('id', ParseUUIDPipe) id: string): Promise<PermissionResponseDto> {
        const updatePermission = await this.permissionService.updatePermission(updateData, id)
        return updatePermission
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete permission' })
    @ApiResponse({ status: 200, description: 'Delete persmission successfully!' })
    async deletePermission(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
        const { message } = await this.permissionService.deletePermission(id)
        return {
            message
        }
    }
}
