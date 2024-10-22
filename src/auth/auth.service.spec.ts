import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '@/v1/users/users.service';
import { UserModule } from '@/v1/users/users.module';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '@/v1/entities/User.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                JwtModule.registerAsync({
                    imports: [ConfigModule],
                    inject: [ConfigService],
                    useFactory: async (configService: ConfigService) => ({
                        secret: configService.get<string>('JWT_SECRET'),
                        signOptions: { expiresIn: '60s' },
                    }),
                }),
            ],
            providers: [
                AuthService,
                UsersService,
                {
                    provide: getModelToken(User.name),
                    useValue: {
                        username: 'test',
                        email: 'test@ssmidge.xyz',
                        password: 'password',
                    } as User,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
