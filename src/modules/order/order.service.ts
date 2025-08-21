import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'src/database/entities/cart.entity';
import { OrderItem } from 'src/database/entities/order-item.entity';
import { Order, OrderStatus } from 'src/database/entities/order.entity';
import { Payment } from 'src/database/entities/payment.entity';
import { User } from 'src/database/entities/user.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/order-dto/create-order.dto';
import { CartService } from '../cart/cart.service';
import { ProductVariant } from 'src/database/entities/product-variant.entity';
import { UpdateOrderDto } from './dto/order-dto/update-order.dto';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private orderItemRepository: Repository<OrderItem>,
        @InjectRepository(Cart)
        private cartRepository: Repository<Cart>,
        private cartService: CartService,
        private dataSource: DataSource
    ) { }

    async createOrderFromCart(user: User, orderData: CreateOrderDto): Promise<Order | null> {
        return await this.dataSource.transaction(async (manager: EntityManager) => {
            const { paymentMethod, shippingAddress, customerNote } = orderData
            const cart = await manager.findOne(Cart, {
                where: {
                    user: { id: user.id }
                },
                relations: ['items', 'items.productVariant', 'items.productVariant.product']
            })
            if (!cart || !cart.items.length) {
                throw new BadRequestException('Cart is empty!')
            }
            let totalAmount = 0
            cart.items.forEach((item) => {
                if (item.isChecked) {
                    totalAmount += Number(item.priceAtAddition)
                }
            })
            const shippingFee = this.calculateShippingFee(shippingAddress)
            const finalAmount = totalAmount + shippingFee
            const orderNumber = this.generateTrackingCode()
            const newOrder = manager.create(Order, {
                totalAmount: totalAmount,
                shippingFee: shippingFee,
                finalAmount: finalAmount,
                shippingAddress: shippingAddress,
                customerNote: customerNote ? customerNote : undefined,
                user: user,
                orderNumber: orderNumber,
                paymentMethod: paymentMethod
            })
            const savedOrder = await manager.save(Order, newOrder)
            // cartitems ==> orderitems (only which item isChecked true)
            const listCartItems = cart.items
            let listOrderItems: OrderItem[] = []
            for (let i = 0; i < listCartItems.length; i++) {
                if (listCartItems[i].isChecked) {
                    const currentItem = listCartItems[i]
                    // check quantity & stock again
                    if (currentItem.quantity > currentItem.productVariant.stockQuantity) {
                        throw new BadRequestException('This order item quantity is over stock!')
                    }
                    const newOrderItem = manager.create(OrderItem, {
                        quantity: currentItem.quantity,
                        priceAtPurchase: currentItem.priceAtAddition,
                        totalItemPrice: Number(currentItem.priceAtAddition) * Number(currentItem.quantity),
                        order: savedOrder,
                        productVariant: currentItem.productVariant
                    })
                    listOrderItems.push(await manager.save(OrderItem, newOrderItem))
                    currentItem.productVariant.stockQuantity -= currentItem.quantity
                    await manager.save(ProductVariant, currentItem.productVariant)
                    await this.cartService.deleteCartItem(currentItem.id)
                }
            }
            savedOrder.items = listOrderItems
            // payment
            if (paymentMethod) {
                const newPayment = manager.create(Payment, {
                    transactionId: this.generateTransactionId(),
                    amount: finalAmount,
                    order: savedOrder
                })
                await manager.save(Payment, newPayment)
            }
            await manager.save(Order, savedOrder)
            return await manager.findOne(Order, {
                where: {
                    id: savedOrder.id
                },
                relations: ['items', 'items.productVariant', 'items.productVariant.product']
            })
        })
    }

    async getAllOrders(user: User): Promise<Order[]> {
        let whereCondition = {}
        if (user.role.name === 'customer') {
            whereCondition = {
                user: { id: user.id }
            }
        }
        const orders = await this.orderRepository.find({
            where: whereCondition
        })
        return orders
    }

    async getOrderById(user: User, id: string): Promise<Order> {
        let whereCondition = {}
        if (user.role.name === 'customer') {
            whereCondition = {
                user: { id: user.id }
            }
        }
        const order = await this.orderRepository.findOne({
            where: {
                id: id,
                ...whereCondition
            }
        })
        if (!order) {
            throw new NotFoundException(`Order with ID ${id} is not found!`)
        }
        return order
    }

    async updateOrder(id: string, updateData: UpdateOrderDto): Promise<Order> {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['items', 'items.productVariant', 'items.productVariant.product']
        })
        if (!order) {
            throw new NotFoundException(`Order with ID ${id} is not found!`)
        }
        return await this.orderRepository.save({
            ...order,
            status: updateData.status
        })
    }

    async cancelOrder(id: string): Promise<Order> {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['items', 'items.productVariant', 'items.productVariant.product']
        })
        if (!order) {
            throw new NotFoundException(`Order with ID ${id} is not found!`)
        }
        order.status = OrderStatus.CANCELLED
        await this.orderRepository.save(order)
        return order
    }

    async getOrderByUser(user: User): Promise<Order[]> {
        const orders = await this.orderRepository.find({
            where: {
                user: { id: user.id }
            },
            relations: ['items', 'items.productVariant', 'items.productVariant.product']
        })
        if (!orders.length) {
            throw new NotFoundException('You have no orders yet!')
        }
        return orders
    }

    private generateTransactionId(): string {
        return `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }

    private generateTrackingCode(prefix: string = 'ORD'): string {
        const timestamp = Date.now().toString(36).toUpperCase();

        const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();

        return `${prefix}-${timestamp}-${randomPart}`;
    }

    private calculateShippingFee(shippingAddress: any): number {
        const baseFee = 30000
        // logic for calculate shipping fee here
        return baseFee
    }

}
