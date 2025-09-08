import { CreateProductVariantDto } from './../dto/variant/create-product-variant.dto';

export interface CreateVariantJobData {
    productId?: string // Optional vì có thể null trong flow jobs
    variants: CreateProductVariantDto[]
}