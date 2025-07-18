import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './modules/product/product.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from './modules/storage/cloudinary/cloudinary.module';
import { ImageModule } from './modules/image/image.module';
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ['dist/database/entities/*.entity{.ts,.js}'],
    logging: true,
    migrations: ['dist/database/migrations/*{.ts,.js}'],
    autoLoadEntities: true,
    synchronize: false
  }),
    AuthModule, ProductModule, UserModule, CloudinaryModule, ImageModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
