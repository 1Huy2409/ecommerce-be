import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Role } from 'src/database/entities/role.entity';
import { PermissionGuard } from '../auth/guards/permission.guard';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role])
  ],
  controllers: [UserController],
  providers: [
    UserService,
    PermissionGuard
  ]
})
export class UserModule { }
