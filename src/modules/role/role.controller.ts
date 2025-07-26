import { Body, ClassSerializerInterceptor, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put, SerializeOptions, UseInterceptors } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleResponseDto } from './dto/role-response.dto';
import { plainToInstance } from 'class-transformer';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

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
    async getAllRoles(): Promise<RoleResponseDto[]> {
        const roles = await this.roleService.getAllRoles()
        return plainToInstance(RoleResponseDto, roles)
    }

    @Get(':id')
    async getRoleById(@Param('id', ParseUUIDPipe) id: string): Promise<RoleResponseDto> {
        const role = await this.roleService.getRoleById(id)
        return plainToInstance(RoleResponseDto, role)
    }

    @Post('')
    @HttpCode(HttpStatus.CREATED)
    async createRole(@Body() roleData: CreateRoleDto): Promise<RoleResponseDto> {
        const newRole = await this.roleService.createRole(roleData)
        return plainToInstance(RoleResponseDto, newRole)
    }

    @Put(':id')
    async updateRole(@Body() updateData: UpdateRoleDto, @Param('id', ParseUUIDPipe) id: string): Promise<RoleResponseDto> {
        const updatedRole = await this.roleService.updateRole(updateData, id)
        return plainToInstance(RoleResponseDto, updatedRole)
    }

    @Delete(':id')
    async deleteRole(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
        const { message } = await this.roleService.deleteRole(id)
        return {
            message
        }
    }
}
