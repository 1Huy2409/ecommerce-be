import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductVariant } from "src/database/entities/product-variant.entity";
import { Repository } from "typeorm";
import { CreateProductVariantDto } from "./dto/variant/create-product-variant.dto";
import { Product } from "src/database/entities/product.entity";
import { ImageService } from "../image/image.service";
@Injectable()
export class ProductVariantService {
    constructor(
        @InjectRepository(ProductVariant)
        private variantsRepository: Repository<ProductVariant>,
        private imageService: ImageService
    ) { }
    async createVariant(variantData: CreateProductVariantDto, parentProduct: Product): Promise<ProductVariant> {
        const { size, sku, additionalPrice, stockQuantity, productVariantImageIds } = variantData
        const newVariant = this.variantsRepository.create({
            size,
            sku,
            additionalPrice,
            stockQuantity,
            product: parentProduct
        })
        const savedVariant = await this.variantsRepository.save(newVariant)
        if (productVariantImageIds && productVariantImageIds.length > 0) {
            for (let i = 0; i < productVariantImageIds.length; i++) {
                let variantImageId = productVariantImageIds[i]
                await this.imageService.attachImageToVariant(
                    variantImageId,
                    savedVariant,
                    i === 0,
                    i
                )
            }
        }
        return savedVariant
    }
}