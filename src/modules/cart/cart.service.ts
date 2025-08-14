import { CreateCartItemDto } from './dto/cart-item/create-cart-item.dto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from 'src/database/entities/cart-item.entity';
import { Cart } from 'src/database/entities/cart.entity';
import { ProductVariant } from 'src/database/entities/product-variant.entity';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';

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
        // check variant exist
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
            // create new cart item (quantity, priceAtAddition)
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
}
