import { Body, ClassSerializerInterceptor, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put, SerializeOptions, UseInterceptors } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleResponseDto } from './dto/role-response.dto';
import { plainToInstance } from 'class-transformer';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('Role')
@ApiBearerAuth()
@Controller('roles')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
    excludeExtraneousValues: true
})
export class RoleController {
    constructor(
        private roleService: RoleService
    ) { }

    @Get('')
    @ApiOperation({ summary: 'Get all roles' })
    @ApiResponse({ status: 200, description: 'Get all roles successfully!' })
    async getAllRoles(): Promise<RoleResponseDto[]> {
        const roles = await this.roleService.getAllRoles()
        return plainToInstance(RoleResponseDto, roles)
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get role by ID' })
    @ApiResponse({ status: 200, description: 'Get role by ID successfully!' })
    async getRoleById(@Param('id', ParseUUIDPipe) id: string): Promise<RoleResponseDto> {
        const role = await this.roleService.getRoleById(id)
        return plainToInstance(RoleResponseDto, role)
    }

    @Post('')
    @ApiOperation({ summary: 'Create role' })
    @ApiResponse({ status: 201, description: 'Create role successfully!' })
    @HttpCode(HttpStatus.CREATED)
    async createRole(@Body() roleData: CreateRoleDto): Promise<RoleResponseDto> {
        const newRole = await this.roleService.createRole(roleData)
        return plainToInstance(RoleResponseDto, newRole)
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update role by ID' })
    @ApiResponse({ status: 200, description: 'Update role by ID successfully!' })
    async updateRole(@Body() updateData: UpdateRoleDto, @Param('id', ParseUUIDPipe) id: string): Promise<RoleResponseDto> {
        const updatedRole = await this.roleService.updateRole(updateData, id)
        return plainToInstance(RoleResponseDto, updatedRole)
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete role by ID' })
    @ApiResponse({ status: 200, description: 'Delete role by ID successfully!' })
    async deleteRole(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
        const { message } = await this.roleService.deleteRole(id)
        return {
            message
        }
    }
}
