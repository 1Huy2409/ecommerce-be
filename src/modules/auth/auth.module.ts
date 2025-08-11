import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/database/entities/user.entity";
import { Role } from "src/database/entities/role.entity";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./guards/auth.guard";
import { GoogleStrategy } from "./strategies/google.strategy";
import { CartModule } from "../cart/cart.module";
@Module({
    imports: [
        TypeOrmModule.forFeature([User, Role]),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: config.get<string>('JWT_EXPIRE')
                }
            })
        }),
        CartModule
    ],
    exports: [AuthModule],
    controllers: [AuthController],
    providers: [AuthService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard
        },
        GoogleStrategy
    ]
})
export class AuthModule { }