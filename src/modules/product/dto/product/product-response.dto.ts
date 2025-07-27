import { Expose, Type } from "class-transformer"
import { VariantResponseDto } from "../variant/variant-response.dto"
import { ImageResponseDto } from "src/modules/image/dto/image-response.dto"
export class ProductResponseDto {
    @Expose()
    id: string
    @Expose()
    name: string
    @Expose()
    description: string | null
    @Expose()
    basePrice: number
    @Expose()
    gender: string | null
    @Expose()
    isLocked: boolean
    @Expose()
    created_at: Date
    @Expose()
    updated_at: Date

    @Expose()
    get brandName(): string | undefined {
        return (this as any).brand ? (this as any).brand.name : undefined
    }
    @Expose()
    get categoryName(): string | undefined {
        return (this as any).category ? (this as any).category.name : undefined
    }

    @Expose()
    @Type(() => VariantResponseDto)
    variants: VariantResponseDto[]

    @Expose()
    @Type(() => ImageResponseDto)
    images: ImageResponseDto[]

}