import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/database/entities/order.entity';
import { OrderItem } from 'src/database/entities/order-item.entity';
import { Cart } from 'src/database/entities/cart.entity';
import { Payment } from 'src/database/entities/payment.entity';
import { CartModule } from '../cart/cart.module';
import { ProductVariant } from 'src/database/entities/product-variant.entity';
import { OrderCancelRequest } from 'src/database/entities/order-cancel-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Cart, Payment, ProductVariant, OrderCancelRequest]),
    CartModule
  ],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule { }
