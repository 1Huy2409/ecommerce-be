import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Role } from 'src/database/entities/role.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role])
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule { }
