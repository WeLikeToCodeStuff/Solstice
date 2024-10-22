import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '@/v1/users/users.service';
import { User } from '@/v1/entities/User.entity';
import { getModelToken } from '@nestjs/mongoose';
import { CaslAbilityFactory } from '@/casl/casl-ability.factory/casl-ability.factory';
import { ConfigModule } from '@nestjs/config';

describe('AuthController', () => {
    let controller: AuthController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                UsersService,
                AuthService,
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

        controller = module.get<AuthController>(AuthController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
