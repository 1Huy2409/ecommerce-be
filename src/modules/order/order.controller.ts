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
import { CreateCancelRequest } from './dto/order-request/create-cancel-request.dto';
import { Order } from 'src/database/entities/order.entity';
import { ProcessCancelRequestDto } from './dto/order-request/process-cancel-request.dto';
import { CancelRequestResponseDto } from './dto/order-request/cancel-request-response.dto';
import { OrderCancelRequest } from 'src/database/entities/order-cancel-request.entity';

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

    @Post(':orderId/cancel-request')
    @ApiOperation({ summary: 'Cancel order from customer' })
    @ApiResponse({ status: 201, description: 'Cancel / Send cancel request successfully!' })
    async createCancelRequest(@Req() req: Request, @Body() requestData: CreateCancelRequest, @Param('orderId', ParseUUIDPipe) orderId: string): Promise<OrderResponseDto | CancelRequestResponseDto | null> {
        const user: User = req.user as User
        const result = await this.orderService.createCancelRequest(user, requestData, orderId)
        if (result instanceof Order) {
            return plainToInstance(OrderResponseDto, result)
        }
        else if (result instanceof OrderCancelRequest) {
            return plainToInstance(CancelRequestResponseDto, result)
        }
        return null
    }

    @RequirePermission('order:cancel')
    @Patch(':requestId/cancel-request')
    @ApiOperation({ summary: 'Process cancel request from customer' })
    @ApiResponse({ status: 200, description: 'Handle request successfully!' })
    async handleCancelRequest(@Req() req: Request, @Param('requestId', ParseUUIDPipe) requestId: string, @Body() processData: ProcessCancelRequestDto): Promise<CancelRequestResponseDto> {
        const user: User = req.user as User
        const request = await this.orderService.handleCancelRequest(user, requestId, processData)
        return plainToInstance(CancelRequestResponseDto, request)
    }

    @Get('/cancel-request')
    @ApiOperation({ summary: 'View cancel requests' })
    @ApiResponse({ status: 200, description: 'View cancel request successfully!' })
    async getCancelRequests(@Req() req: Request): Promise<CancelRequestResponseDto[]> {
        const user: User = req.user as User
        const requests = await this.orderService.getCancelRequest(user)
        return plainToInstance(CancelRequestResponseDto, requests)
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

    @RequirePermission('order:update')
    @Patch(':orderId')
    @ApiOperation({ summary: 'Update order status' })
    @ApiResponse({ status: 200, description: 'Update order status successfully!' })
    async updateOrder(@Param('orderId', ParseUUIDPipe) orderId: string, @Body() updateData: UpdateOrderDto): Promise<OrderResponseDto> {
        const updatedOrder = await this.orderService.updateOrder(orderId, updateData)
        return plainToInstance(OrderResponseDto, updatedOrder)
    }
}
