import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '@/auth/users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@/auth/users/entities/User.entity';
import { UserModule } from '@/auth/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CaslModule } from '@/casl/casl.module';
import { RemoveExpiredTokensService } from './tasks/RemoveExpiredTokens';

@Module({
    imports: [
        UserModule,
        CaslModule,
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '60s' },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, UsersService, RemoveExpiredTokensService],
})
export class AuthModule {}
