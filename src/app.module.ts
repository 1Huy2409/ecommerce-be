import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductModule } from './modules/product/product.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from './modules/storage/cloudinary/cloudinary.module';
import { ImageModule } from './modules/image/image.module';
import { PermissionModule } from './modules/permission/permission.module';
import { RoleModule } from './modules/role/role.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),
  CacheModule.registerAsync({
    isGlobal: true,
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => {
      const store = await redisStore({
        socket: {
          host: configService.get('REDIS_HOST', 'redis'),
          port: parseInt(configService.get('REDIS_PORT', '6379'))
        }
      });
      return {
        store: () => store,
        ttl: 300 * 1000,
        max: 1000
      }
    },
    inject: [ConfigService]
  }),
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST || 'postgres',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ['dist/database/entities/*.entity{.ts,.js}'],
    logging: true,
    migrations: ['dist/database/migrations/*{.ts,.js}'],
    autoLoadEntities: true,
    synchronize: false
  }),
    AuthModule, ProductModule, UserModule, CloudinaryModule, ImageModule, PermissionModule, RoleModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
