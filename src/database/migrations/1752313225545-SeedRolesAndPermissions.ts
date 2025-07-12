import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { Role } from "../entities/role.entity";
import { Permission } from "../entities/permission.entity";
export class SeedRolesAndPermissions1752313225545 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const roleRepository = queryRunner.manager.getRepository(Role)
        const permissionRepository = queryRunner.manager.getRepository(Permission)

        const permissionData = [
            { name: 'user:create', description: 'Create new user' },
            { name: 'user:update', description: 'Update user data' },
            { name: 'user:read', description: 'Read user data' },
            { name: 'user:delete', description: 'Delete user data' },
            { name: 'product:create', description: 'Create new product' },
            { name: 'product:update', description: 'Update product data' },
            { name: 'product:read', description: 'Read product data' },
            { name: 'product:delete', description: 'Delete product data' },
            { name: 'order: read_all', description: 'Read all orders' },
            { name: 'order: manage', description: 'Manage all orders' }
        ]
        const seededPermissions = await permissionRepository.save(permissionData)

        const rolesData = [
            { name: 'admin', description: 'Administrator with full access' },
            { name: 'staff', description: 'Staff with limited access' },
            { name: 'customer', description: 'Regular customer' }
        ]
        const seededRole = await roleRepository.save(rolesData)

        const adminRole = seededRole.find(role => role.name === 'admin')
        const staffRole = seededRole.find(role => role.name === 'staff')

        if (adminRole) {
            adminRole.permissions = seededPermissions
            await roleRepository.save(adminRole)
        }

        if (staffRole) {
            staffRole.permissions = seededPermissions.filter(p =>
                p.name.includes('product:read') ||
                p.name.includes('order:read_all') ||
                p.name.includes('order:manage') ||
                p.name.includes('user.read')
            )
            await roleRepository.save(staffRole)
        }
        console.log('Roles and Permissions seeded successfully!');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
