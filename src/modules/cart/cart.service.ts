import { CreateCartItemDto } from './dto/cart-item/create-cart-item.dto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from 'src/database/entities/cart-item.entity';
import { Cart } from 'src/database/entities/cart.entity';
import { ProductVariant } from 'src/database/entities/product-variant.entity';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateCartItemDto } from './dto/cart-item/update-cart-item.dto';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private cartRepository: Repository<Cart>,
        @InjectRepository(CartItem)
        private cartItemRepository: Repository<CartItem>,
        @InjectRepository(ProductVariant)
        private variantRepository: Repository<ProductVariant>
    ) { }
    async createCart(user: User): Promise<Cart> {
        const newCart = this.cartRepository.create(
            {
                user: user
            }
        )
        return await this.cartRepository.save(newCart)
    }
    async viewCart(user: User): Promise<Cart> {
        const cart = await this.cartRepository.findOne(
            {
                where: {
                    user: { id: user.id }
                },
                relations: ['items', 'items.productVariant', 'items.productVariant.product']
            }
        )
        if (!cart) {
            throw new NotFoundException('You dont have any cart yet!')
        }
        return cart
    }
    async addToCart(user: User, cartItemData: CreateCartItemDto): Promise<Cart> {
        const cart = await this.cartRepository.findOne(
            {
                where: {
                    user: { id: user.id }
                },
                relations: ['items', 'items.productVariant', 'items.productVariant.product']
            }
        )
        if (!cart) {
            throw new NotFoundException('You dont have any cart!')
        }
        const { variantId, quantity } = cartItemData
        const variant = await this.variantRepository.findOne(
            {
                where: {
                    id: variantId
                },
                relations: ['product', 'cartItems']
            }
        )
        if (!variant) {
            throw new NotFoundException('This product variant does not exist!')
        }

        const listCartItems = cart.items;
        const existingCartItem = listCartItems.find(item => item.productVariant.id == variantId)
        if (existingCartItem) {
            const newQuantity = existingCartItem.quantity + quantity
            if (newQuantity > variant.stockQuantity) {
                throw new BadRequestException('This variant quantity is over stock!')
            }
            existingCartItem.quantity = newQuantity
            await this.cartItemRepository.save(existingCartItem)
        }
        else {
            if (quantity > variant.stockQuantity) {
                throw new BadRequestException('This variant quantity is over stock!')
            }
            const newCartItem = this.cartItemRepository.create(
                {
                    quantity: quantity,
                    priceAtAddition: Number(variant.product.basePrice) + Number(variant.additionalPrice),
                    cart: cart,
                    productVariant: variant
                }
            )
            await this.cartItemRepository.save(newCartItem)
        }
        const finalCart = await this.cartRepository.findOne(
            {
                where: { id: cart.id },
                relations: ['items', 'items.productVariant', 'items.productVariant.product']
            }
        )
        if (!finalCart) {
            throw new NotFoundException('Cart not found!')
        }
        return finalCart
    }
    async updateCartItem(cartItemId: string, updateData: UpdateCartItemDto): Promise<CartItem> {
        const cartItem = await this.cartItemRepository.findOne(
            {
                where: { id: cartItemId },
                relations: ['productVariant', 'productVariant.product']
            }
        )
        if (!cartItem) {
            throw new NotFoundException('Cart item is not found!')
        }
        const { quantity } = updateData
        if (quantity) {
            if (quantity > cartItem.productVariant.stockQuantity) {
                throw new BadRequestException('Variant quantity is over stock!')
            }
            cartItem.quantity = quantity
            return await this.cartItemRepository.save(cartItem)
        }
        return cartItem
    }
    async deleteCartItem(cartItemId: string): Promise<{ message: string }> {
        await this.cartItemRepository.delete({ id: cartItemId })
        return {
            message: "Delete successfully!"
        }
    }
    async clearCart(user: User): Promise<{ message: string }> {
        const cart = await this.cartRepository.findOne(
            {
                where: {
                    user: { id: user.id }
                }
            }
        )
        if (!cart) {
            throw new NotFoundException('Cart is not found!')
        }
        await this.cartItemRepository.delete(
            {
                cart: { id: cart.id }
            }
        )
        return {
            message: 'Clear cart successfully!'
        }
    }
}
