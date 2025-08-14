import { Controller, Post, Param, Req, Body, UseInterceptors, ClassSerializerInterceptor, SerializeOptions, Get, Put, ParseUUIDPipe, Delete } from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from 'src/database/entities/cart.entity';
import { CreateCartItemDto } from './dto/cart-item/create-cart-item.dto';
import { User } from 'src/database/entities/user.entity';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { CartResponseDto } from './dto/cart/cart-response.dto';
import { UpdateCartItemDto } from './dto/cart-item/update-cart-item.dto';
import { CartItemResponseDto } from './dto/cart-item/cart-item-response.dto';

@Controller('carts')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
    excludeExtraneousValues: true // chỉ lấy các dữ liệu được @Expose()
})
export class CartController {
    constructor(
        private cartService: CartService
    ) { }
    // @Post('')
    // async createCart(): Promise<Cart> {
    //     const newCart = await this.cartService.createCart()
    //     return newCart
    // }

    @Get('')
    async viewCart(@Req() req: Request): Promise<CartResponseDto> {
        const user: User = req.user as User
        const cart: Cart = await this.cartService.viewCart(user)
        return plainToInstance(CartResponseDto, cart)
    }

    @Post('items')
    async addToCart(@Req() req: Request, @Body() cartItemData: CreateCartItemDto): Promise<CartResponseDto> {
        const user: User = req.user as User
        const cart: Cart = await this.cartService.addToCart(user, cartItemData)

        return plainToInstance(CartResponseDto, cart)
    }

    @Put('items/:cartItemId')
    async updateCartItem(@Param('cartItemId', ParseUUIDPipe) cartItemId: string, @Body() updateData: UpdateCartItemDto): Promise<CartItemResponseDto> {
        const updatedCartItem = await this.cartService.updateCartItem(cartItemId, updateData)
        return plainToInstance(CartItemResponseDto, updatedCartItem)
    }

    @Delete('items/:cartItemId')
    async deleteCartItem(@Param('cartItemId', ParseUUIDPipe) cartItemId: string): Promise<{ message: string }> {
        const { message } = await this.cartService.deleteCartItem(cartItemId)
        return {
            message
        }
    }
    // clear all items in cart
    @Delete('')
    async clearCart(@Req() req: Request): Promise<{ message: string }> {
        const user: User = req.user as User
        const { message } = await this.cartService.clearCart(user)
        return {
            message
        }
    }
}
