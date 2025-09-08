import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from 'src/database/entities/product.entity';
import { ProductVariant } from 'src/database/entities/product-variant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Brand } from 'src/database/entities/brand.entity';
import { Category } from 'src/database/entities/category.entity';
import { ProductVariantService } from './product-variant.service';
import { ImageModule } from '../image/image.module';
import { VariantController } from './product-variant.controller';
import { RoleModule } from '../role/role.module';
import { ProductQueueService } from './queue/product-queue.service';
import { BullModule } from '@nestjs/bullmq';
import { ProductProcessor } from './processor/product.processor';
import { VariantProcessor } from './processor/variant.processor';
@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductVariant, Brand, Category]),
    ImageModule,
    RoleModule,
    BullModule.registerQueue(
      {
        name: 'product-queue'
      },
      {
        name: 'variant-queue'
      }
    ),
  ],
  controllers: [ProductController, VariantController],
  providers: [
    ProductQueueService,
    ProductService,
    ProductVariantService,
    ProductProcessor,
    VariantProcessor,
    PermissionGuard
  ]
})
export class ProductModule { }
