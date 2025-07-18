import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from 'src/database/entities/product.entity';
import { ProductVariant } from 'src/database/entities/product-variant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Brand } from 'src/database/entities/brand.entity';
import { Category } from 'src/database/entities/category.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductVariant, Brand, Category])
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    PermissionGuard
  ]
})
export class ProductModule { }
