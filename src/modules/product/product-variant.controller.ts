import { Body, ClassSerializerInterceptor, Controller, Get, Param, ParseUUIDPipe, Put, UseGuards, UseInterceptors } from "@nestjs/common";
import { ProductVariantService } from "./product-variant.service";
import { VariantResponseDto } from "./dto/variant/variant-response.dto";
import { instanceToPlain } from "class-transformer";
import { PermissionGuard } from "../auth/guards/permission.guard";
import { RequirePermission } from "src/core/decorators/permission.decorator";
import { UpdateProductVariantDto } from "./dto/variant/update-product-variant.dto";
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(PermissionGuard)
@Controller('variants')
export class VariantController {
    constructor(
        private variantService: ProductVariantService
    ) { }

    @RequirePermission('product:read')
    @Get(':productId')
    async getVariantByProduct(@Param('productId', ParseUUIDPipe) productId: string): Promise<VariantResponseDto[]> {
        const variants = await this.variantService.getVariantByProduct(productId)
        return instanceToPlain(variants) as VariantResponseDto[]
    }

    @RequirePermission('product:update')
    @Put(':variantId')
    async updateVariant(@Param('variantId', ParseUUIDPipe) variantId: string, @Body() updateData: UpdateProductVariantDto): Promise<VariantResponseDto> {
        const updateVariant = await this.variantService.updateVariant(variantId, updateData)
        return instanceToPlain(updateVariant) as VariantResponseDto
    }
}