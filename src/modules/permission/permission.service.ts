import { permission } from 'process';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/database/entities/permission.entity';
import { Not, Repository } from 'typeorm';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(Permission)
        private permissionsRepository: Repository<Permission>
    ) { }

    async getAllPermission(): Promise<Permission[]> {
        const permissions = await this.permissionsRepository.find()
        return permissions
    }

    async getPermissionById(id: string): Promise<Permission> {
        const permission = await this.permissionsRepository.findOne({
            where: { id }
        })
        if (!permission) {
            throw new NotFoundException(`Permission with ID ${id} is not found!`)
        }
        return permission
    }

    async createPermission(permissionData: CreatePermissionDto): Promise<Permission> {
        const { name, description } = permissionData
        console.log(permissionData)
        const nameExisting = await this.permissionsRepository.find({
            where: {
                name: name
            }
        })
        if (nameExisting.length > 0) {
            throw new ConflictException("This permission name already exist")
        }
        const permission = this.permissionsRepository.create(permissionData)
        const newPermission = await this.permissionsRepository.save(permission)
        return newPermission
    }

    async updatePermission(updateData: UpdatePermissionDto, id: string): Promise<Permission> {
        const updatePermission = await this.permissionsRepository.findOne({
            where: { id }
        })
        if (!updatePermission) {
            throw new NotFoundException(`Permission with ID ${id} is not found!`)
        }
        if (updateData.name !== undefined) {
            const nameExisting = await this.permissionsRepository.findOne({
                where: {
                    name: updateData.name,
                    id: Not(id)
                }
            })
            if (nameExisting) {
                throw new ConflictException("This permission name already exist")
            }
        }
        const savePermission = await this.permissionsRepository.save({
            ...updatePermission,
            ...updateData
        })
        return savePermission
    }

    async deletePermission(id: string): Promise<{ message: string }> {
        const deletePermission = await this.permissionsRepository.findOne({ where: { id } })
        if (!deletePermission) {
            throw new NotFoundException(`Permission with ID ${id} is not found!`)
        }
        await this.permissionsRepository.remove(deletePermission)
        return {
            message: 'Delete permission successfully!'
        }
    }
}
