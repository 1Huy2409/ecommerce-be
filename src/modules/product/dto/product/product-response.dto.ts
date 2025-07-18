import { Expose } from "class-transformer"
import { ProductVariant } from "src/database/entities/product-variant.entity"
import { Image } from "src/database/entities/image.entity"
import { Product } from "src/database/entities/product.entity"
export class ProductResponseDto {
    id: string
    name: string
    description: string | null
    basePrice: number
    gender: string | null
    created_at: Date
    updated_at: Date

    @Expose()
    getBrandName(): string | undefined {
        return (this as any).brand ? (this as any).brand.name : undefined
    }
    @Expose()
    getCategoryName(): string | undefined {
        return (this as any).category ? (this as any).category.name : undefined
    }
    variants: ProductVariant[] | undefined
    images: Image[] | undefined

    constructor(partial: Partial<Product>) {
        Object.assign(this, partial)
    }
}