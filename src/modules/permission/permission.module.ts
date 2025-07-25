import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from 'src/database/entities/permission.entity';
import { Role } from 'src/database/entities/role.entity';
@Module({
    imports: [TypeOrmModule.forFeature([Permission, Role])],
    controllers: [PermissionController],
    providers: [PermissionService]
})
export class PermissionModule { }
