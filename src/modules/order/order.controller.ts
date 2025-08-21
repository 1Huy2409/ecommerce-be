import { Body, ClassSerializerInterceptor, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Req, SerializeOptions, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { Request } from 'express';
import { User } from 'src/database/entities/user.entity';
import { CreateOrderDto } from './dto/order-dto/create-order.dto';
import { OrderResponseDto } from './dto/order-dto/order-response.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateOrderDto } from './dto/order-dto/update-order.dto';
import { RequirePermission } from 'src/core/decorators/permission.decorator';
import { PermissionGuard } from '../auth/guards/permission.guard';

@ApiTags('Order')
@ApiBearerAuth()
@Controller('orders')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
    excludeExtraneousValues: true
})
@UseGuards(PermissionGuard)
export class OrderController {
    constructor(
        private orderService: OrderService
    ) { }

    @RequirePermission('order:create')
    @Post('')
    @ApiOperation({ summary: 'Create order from cart' })
    @ApiResponse({ status: 201, description: 'Create order successfully!' })
    async createOrderFromCart(@Req() req: Request, @Body() orderData: CreateOrderDto): Promise<OrderResponseDto> {
        const user: User = req.user as User
        const newOrder = await this.orderService.createOrderFromCart(user, orderData)
        return plainToInstance(OrderResponseDto, newOrder)
    }

    @RequirePermission('order:read')
    @Get('')
    @ApiOperation({ summary: 'Get all orders' })
    @ApiResponse({ status: 200, description: 'Get all orders successfully!' })
    async getAllOrders(@Req() req: Request): Promise<OrderResponseDto[]> {
        const user: User = req.user as User
        const orders = await this.orderService.getAllOrders(user)
        return plainToInstance(OrderResponseDto, orders)
    }

    @RequirePermission('order:read')
    @Get(':orderId')
    @ApiOperation({ summary: 'Get order by order ID' })
    @ApiResponse({ status: 200, description: 'Get order by order ID successfully!' })
    async getOrderById(@Req() req: Request, @Param('orderId', ParseUUIDPipe) orderId: string): Promise<OrderResponseDto> {
        const user: User = req.user as User
        const order = await this.orderService.getOrderById(user, orderId)
        return plainToInstance(OrderResponseDto, order)
    }

    @RequirePermission('order:cancel')
    @Patch(':orderId/cancel')
    @ApiOperation({ summary: 'Cancel order' })
    @ApiResponse({ status: 200, description: 'Cancel order successfully!' })
    async cancelOrder(@Param('orderId', ParseUUIDPipe) orderId: string): Promise<OrderResponseDto> {
        const cancelledOrder = await this.orderService.cancelOrder(orderId)
        return plainToInstance(OrderResponseDto, cancelledOrder)
    }

    @RequirePermission('order:update')
    @Patch(':orderId')
    @ApiOperation({ summary: 'Update order status' })
    @ApiResponse({ status: 200, description: 'Update order status successfully!' })
    async updateOrder(@Param('orderId', ParseUUIDPipe) orderId: string, @Body() updateData: UpdateOrderDto): Promise<OrderResponseDto> {
        const updatedOrder = await this.orderService.updateOrder(orderId, updateData)
        return plainToInstance(OrderResponseDto, updatedOrder)
    }
}
