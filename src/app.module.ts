import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './modules/product/product.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }), AuthModule, ProductModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
