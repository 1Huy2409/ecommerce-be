import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'src/database/entities/cart.entity';
import { CartItem } from 'src/database/entities/cart-item.entity';
import { ProductVariant } from 'src/database/entities/product-variant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem, ProductVariant])],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService]
})
export class CartModule { }
