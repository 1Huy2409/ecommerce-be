import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'src/database/entities/cart.entity';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private cartRepository: Repository<Cart>
    ) { }
    async createCart(user: User): Promise<Cart> {
        console.log("USER HAVE CART: ", user)
        const newCart = this.cartRepository.create(
            {
                user: user
            }
        )
        return await this.cartRepository.save(newCart)
    }
}
