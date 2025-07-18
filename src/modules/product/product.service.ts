import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/product/create-product.dto';
import { Product } from 'src/database/entities/product.entity';
import { Category } from 'src/database/entities/category.entity';
import { Brand } from 'src/database/entities/brand.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageService } from '../image/image.service';
import { ProductVariantService } from './product-variant.service';
import { ProductVariant } from 'src/database/entities/product-variant.entity';
@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
        @InjectRepository(Brand)
        private brandsRepository: Repository<Brand>,
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>,
        private imageService: ImageService,
        private variantService: ProductVariantService
    ) { }
    async createProductWithVariant(productData: CreateProductDto): Promise<Product> {
        const { name, description, basePrice, gender, brandId, categoryId, productImageIds, variants } = productData
        const existingBrand = await this.brandsRepository.findOne({ where: { id: brandId } })
        if (!existingBrand) {
            throw new BadRequestException(`Brand with ID ${brandId} doesnt exist!`)
        }
        const existingCategory = await this.categoriesRepository.findOne({ where: { id: categoryId } })
        if (!existingCategory) {
            throw new BadRequestException(`Category with ID ${categoryId} doesnt exist!`)
        }
        const existingProduct = await this.productsRepository.findOne({ where: { name: name } })
        if (existingProduct) {
            throw new ConflictException("This product have already exist!")
        }
        // create product entity
        const newProduct = this.productsRepository.create({
            name,
            description,
            basePrice,
            gender,
            brand: existingBrand,
            category: existingCategory,
        })
        const savedProduct = await this.productsRepository.save(newProduct)

        // attach image to product by productImageIds
        if (productImageIds && productImageIds.length > 0) {
            for (let i = 0; i < productImageIds.length; i++) {
                const imageId = productImageIds[i]
                await this.imageService.attachImageToProduct(
                    imageId,
                    savedProduct,
                    i === 0,
                    i
                )
            }
        }

        // call variant service
        const productVariants: ProductVariant[] = []
        if (variants && variants.length > 0) {
            for (let i = 0; i < variants.length; i++) {
                const variant = variants[i]
                const newVariant: ProductVariant = await this.variantService.createVariant(variant, savedProduct)
                productVariants.push(newVariant)
            }
        }
        savedProduct.variants = productVariants
        return await this.productsRepository.save(savedProduct)
    }
}


