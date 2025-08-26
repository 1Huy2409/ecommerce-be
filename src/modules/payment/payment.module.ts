import { StripeService } from './providers/stripe.service';
import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/database/entities/order.entity';
import { Payment } from 'src/database/entities/payment.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Payment]), ConfigModule],
  controllers: [PaymentController],
  providers: [PaymentService, StripeService]
})
export class PaymentModule { }
