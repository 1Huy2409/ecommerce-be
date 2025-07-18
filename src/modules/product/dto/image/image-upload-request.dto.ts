import { IsInt, IsNotEmpty, Min, IsOptional, IsBoolean } from "class-validator";


export class ImageUploadRequestDto {
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    fileIndex: number

    @IsOptional()
    @IsBoolean()
    isThumbnail?: boolean;

    @IsOptional()
    @IsInt()
    @Min(0)
    order?: number;
}