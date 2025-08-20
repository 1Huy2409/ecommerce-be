import { Body, ClassSerializerInterceptor, Controller, Post, Req, SerializeOptions, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { Request } from 'express';
import { User } from 'src/database/entities/user.entity';
import { CreateOrderDto } from './dto/order-dto/create-order.dto';
import { OrderResponseDto } from './dto/order-dto/order-response.dto';
import { plainToInstance } from 'class-transformer';

@ApiTags('Order')
@ApiBearerAuth()
@Controller('orders')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
    excludeExtraneousValues: true
})
export class OrderController {
    constructor(
        private orderService: OrderService
    ) { }

    @Post('')
    async createOrderFromCart(@Req() req: Request, @Body() orderData: CreateOrderDto): Promise<OrderResponseDto> {
        const user: User = req.user as User
        const newOrder = await this.orderService.createOrderFromCart(user, orderData)
        return plainToInstance(OrderResponseDto, newOrder)
    }
}
