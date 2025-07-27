import { Expose } from "class-transformer";

export class ImageResponseDto {
    @Expose()
    id: string

    @Expose()
    fileName: string

    @Expose()
    url: string

    @Expose()
    publicId: string

    @Expose()
    isThumbnail: boolean

    @Expose()
    order: number
}