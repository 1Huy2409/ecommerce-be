import { Strategy, StrategyOptions, VerifyCallback } from "passport-google-oauth20";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { User } from "src/database/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {
        super({
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: process.env.CALLBACK_URL,
            scope: ['email', 'profile'],
        } as StrategyOptions);
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> { // done is callback function
        try {
            const user: User | null = await this.usersRepository.createQueryBuilder('user')
                .where("providers->'google'->>'id' = :googleId", { googleId: profile.id })
                .getOne()
            if (user) {
                return done(null, user)
            }
            else {
                const fullname: string = profile._json.name;
                const username: string = profile._json.email;
                const email: string = profile._json.email;
                const providers: object = {
                    id: profile.id,
                    email: profile._json.email
                }
                const password: string = ""
                const newUser = this.usersRepository.create(
                    {
                        fullname,
                        username,
                        email,
                        providers,
                        password
                    }
                )
                const savedUser = await this.usersRepository.save(newUser)
                return done(null, savedUser)
            }
        }
        catch (error) {
            return done(error)
        }
    }
}