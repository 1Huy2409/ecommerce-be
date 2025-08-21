import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/database/entities/role.entity';
import { Not, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Permission } from 'src/database/entities/permission.entity';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private rolesRepository: Repository<Role>,
        @InjectRepository(Permission)
        private permissionsRepository: Repository<Permission>
    ) { }

    async getAllRoles(): Promise<Role[]> {
        const roles = await this.rolesRepository.find({ relations: ['permissions'] })
        return roles
    }

    async getRoleById(id: string): Promise<Role> {
        const role = await this.rolesRepository.findOne({
            where: { id },
            relations: ['permission']
        })
        if (!role) {
            throw new NotFoundException(`Role with ID ${id} is not found!`)
        }
        return role
    }

    async createRole(roleData: CreateRoleDto): Promise<Role> {
        const { permissionIds, ...restData } = roleData
        const nameExisting = await this.rolesRepository.findOne({
            where: { name: roleData.name }
        })
        if (nameExisting) {
            throw new ConflictException(`Role name already exist!`)
        }
        const newRole = this.rolesRepository.create(restData)
        let permissions: Permission[] = []
        if (permissionIds !== undefined) {
            permissionIds.forEach(async (id) => {
                const permission = await this.permissionsRepository.findOne({
                    where: { id }
                })
                if (!permission) {
                    throw new NotFoundException(`Permission with ID ${id} is not found!`)
                }
                permissions.push(permission)
            })
            newRole.permissions = permissions
        }
        await this.rolesRepository.save(newRole)
        return newRole
    }

    async updateRole(updateData: UpdateRoleDto, id: string): Promise<Role> {
        const { permissionIds, ...restData } = updateData
        console.log('PERMISSION IDS ARRAY: ', permissionIds)
        let roleUpdate = await this.rolesRepository.findOne({
            where: { id },
            relations: ['permissions']
        })
        if (!roleUpdate) {
            throw new NotFoundException(`Role with ID ${id} is not found!`)
        }
        if (updateData.name !== undefined) {
            const nameExisting = await this.rolesRepository.findOne({
                where: { name: updateData.name, id: Not(id) }
            })
            if (nameExisting) {
                throw new ConflictException("This role name already exist!")
            }
        }
        let permissions: Permission[] = []
        if (permissionIds !== undefined) {
            for (const pid of permissionIds) {
                const permission = await this.permissionsRepository.findOne({ where: { id: pid } })
                if (!permission) {
                    throw new NotFoundException(`Permission with ID ${pid} is not found!`)
                }
                permissions.push(permission)
            }
            roleUpdate.permissions = permissions
        }

        const savedRole = await this.rolesRepository.save({
            ...roleUpdate,
            ...restData
        })
        return savedRole
    }

    async deleteRole(id: string): Promise<{ message: string }> {
        const deleteRole = await this.rolesRepository.findOne({
            where: { id }
        })
        if (!deleteRole) {
            throw new NotFoundException(`Role with ID ${id} is not found!`)
        }
        await this.rolesRepository.remove(deleteRole)
        return {
            message: 'Delete role successfully!'
        }
    }
}
