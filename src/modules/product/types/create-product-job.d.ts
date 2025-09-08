export interface CreateProductJobData {
    name: string
    description?: string
    basePrice: number
    gender?: string
    brandId: string
    categoryId: string
    productImageIds?: string[]
}