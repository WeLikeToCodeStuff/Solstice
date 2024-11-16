import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '@/auth/users/users.service';
import { User } from '@/auth/users/entities/User.entity';
import { getModelToken } from '@nestjs/mongoose';
import { CaslAbilityFactory } from '@/casl/casl-ability.factory/casl-ability.factory';
import { ConfigModule } from '@nestjs/config';

describe('AuthGuard', () => {
    let guard: AuthGuard;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                AuthService,
                UsersService,
                CaslAbilityFactory,
                {
                    provide: getModelToken(User.name),
                    useValue: {
                        username: 'test',
                        email: 'test@ssmidge.xyz',
                        password: 'password',
                    } as User,
                },
            ],
            imports: [
                JwtModule.register({
                    global: true,
                    secret: 'secret',
                    signOptions: { expiresIn: '60s' },
                }),
                ConfigModule.forRoot({
                    cache: true,
                }),
            ],
        }).compile();

        guard = module.get<AuthGuard>(AuthGuard);
    });

    it('should be defined', () => {
        expect(guard).toBeDefined();
    });
});
