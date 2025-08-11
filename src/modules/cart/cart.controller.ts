import { Controller, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from 'src/database/entities/cart.entity';

@Controller('carts')
export class CartController {
    constructor(
        private cartService: CartService
    ) { }
    // @Post('')
    // async createCart(): Promise<Cart> {
    //     const newCart = await this.cartService.createCart()
    //     return newCart
    // }
}
