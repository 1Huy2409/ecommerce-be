import { Controller, Post, Param, Req, Body, UseInterceptors, ClassSerializerInterceptor, SerializeOptions, Get } from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from 'src/database/entities/cart.entity';
import { CreateCartItemDto } from './dto/cart-item/create-cart-item.dto';
import { User } from 'src/database/entities/user.entity';
import { Request } from 'express';
import { plainToInstance } from 'class-transformer';
import { CartResponseDto } from './dto/cart/cart-response.dto';

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
    @Post('items')
    async addToCart(@Req() req: Request, @Body() cartItemData: CreateCartItemDto): Promise<CartResponseDto> {
        const user: User = req.user as User
        const cart: Cart = await this.cartService.addToCart(user, cartItemData)

        return plainToInstance(CartResponseDto, cart)
    }
}
