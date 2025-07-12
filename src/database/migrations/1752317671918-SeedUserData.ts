import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { User } from "../entities/user.entity"
import { Role } from "../entities/role.entity";
import * as bcrypt from 'bcrypt'
export class SeedUserData1752317671918 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const userRepository = queryRunner.manager.getRepository(User)
        const roleRepository = queryRunner.manager.getRepository(Role)
        const roleAdmin: Role | null = await roleRepository.findOne({ where: { name: 'admin' } })
        if (roleAdmin) {
            console.log(roleAdmin.id)
            const adminPassword = await bcrypt.hash('nhathuy@24092005', 10)
            const AdminData = {
                fullname: "Nguyễn Hữu Nhất Huy",
                username: "1Huy2409",
                email: "nhathuy2005@gmail.com",
                password: adminPassword,
                phone_number: "0935492574",
                role: roleAdmin
            }
            const seededUserData = await userRepository.save(AdminData)
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
