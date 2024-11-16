import { Test, TestingModule } from '@nestjs/testing';
import { ServerController } from './server.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CaslModule } from '@/casl/casl.module';
import { AuthModule } from '@/auth/auth.module';
import { UserModule } from '@/auth/users/users.module';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '@/auth/users/entities/User.entity';
import { UsersService } from '@/auth/users/users.service';
import { AuthService } from '@/auth/auth.service';
import { ServerService } from './server.service';
import { Server } from './entities/Server.entity';

describe('ServerController', () => {
    let controller: ServerController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    cache: true,
                }),
                JwtModule.registerAsync({
                    imports: [ConfigModule],
                    inject: [ConfigService],
                    useFactory: async (configService: ConfigService) => ({
                        secret: configService.get<string>('JWT_SECRET'),
                        signOptions: { expiresIn: '60s' },
                    }),
                }),
                CaslModule,
            ],
            providers: [
                UsersService,
                AuthService,
                {
                    provide: getModelToken(User.name),
                    useValue: {
                        username: 'test',
                        email: 'test@ssmidge.xyz',
                        password: 'password',
                    } as User,
                },
                {
                    provide: getModelToken(Server.name),
                    useValue: {
                        name: "test",
                        ip: "127.0.0.1",
                        isOnline: true,
                    } as Server,
                },
                ServerService,
            ],
            controllers: [ServerController],
        }).compile();

        controller = module.get<ServerController>(ServerController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
