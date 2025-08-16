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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('Cart')
@ApiBearerAuth()
@Controller('carts')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
    excludeExtraneousValues: true
})
export class CartController {
    constructor(
        private cartService: CartService
    ) { }

    @Get('')
    @ApiOperation({ summary: 'View all items in cart' })
    @ApiResponse({ status: 200, description: 'View cart successfully!' })
    async viewCart(@Req() req: Request): Promise<CartResponseDto> {
        const user: User = req.user as User
        const cart: Cart = await this.cartService.viewCart(user)
        return plainToInstance(CartResponseDto, cart)
    }

    @Post('items')
    @ApiOperation({ summary: 'Add item into cart' })
    @ApiResponse({ status: 201, description: 'Add item into cart successfully!' })
    async addToCart(@Req() req: Request, @Body() cartItemData: CreateCartItemDto): Promise<CartResponseDto> {
        const user: User = req.user as User
        const cart: Cart = await this.cartService.addToCart(user, cartItemData)

        return plainToInstance(CartResponseDto, cart)
    }

    @Put('items/:cartItemId')
    @ApiOperation({ summary: 'Update item in cart' })
    @ApiResponse({ status: 200, description: 'Update item in cart successfully!' })
    async updateCartItem(@Param('cartItemId', ParseUUIDPipe) cartItemId: string, @Body() updateData: UpdateCartItemDto): Promise<CartItemResponseDto> {
        const updatedCartItem = await this.cartService.updateCartItem(cartItemId, updateData)
        return plainToInstance(CartItemResponseDto, updatedCartItem)
    }

    @Delete('items/:cartItemId')
    @ApiOperation({ summary: 'Delete item in cart' })
    @ApiResponse({ status: 200, description: 'Delete item in cart successfully!' })
    async deleteCartItem(@Param('cartItemId', ParseUUIDPipe) cartItemId: string): Promise<{ message: string }> {
        const { message } = await this.cartService.deleteCartItem(cartItemId)
        return {
            message
        }
    }

    @Delete('')
    @ApiOperation({ summary: 'Clear all cart items' })
    @ApiResponse({ status: 200, description: 'Clear cart successfully!' })
    async clearCart(@Req() req: Request): Promise<{ message: string }> {
        const user: User = req.user as User
        const { message } = await this.cartService.clearCart(user)
        return {
            message
        }
    }
}
