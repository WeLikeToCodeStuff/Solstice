import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './auth/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { CaslModule } from './casl/casl.module';
import { configuration } from '@/config/Configuration';
import * as Joi from 'joi';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { HealthModule } from './health/health.module';
import { ServerModule } from './v1/server/server.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            load: [configuration],
            validationSchema: Joi.object({
                NODE_ENV: Joi.string()
                    .valid('development', 'production', 'test', 'provision')
                    .default('development'),
                PORT: Joi.number().default(3000),
                DATABASE: {
                    HOST: Joi.string().required(),
                    PORT: Joi.number().default(27017),
                    USERNAME: Joi.string().required(),
                    PASSWORD: Joi.string().required(),
                    NAME: Joi.string().default('Solstice'),
                },
            }),
            validationOptions: {
                allowUnknown: true,
                abortEarly: true,
            },
        }),
        MongooseModule.forRoot('mongodb://localhost/Solstice'),
        ScheduleModule.forRoot(),
        BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                connection: {
                    host: configService.get('QUEUE_HOST'),
                    port: configService.get('QUEUE_PORT'),
                },
            }),
            inject: [ConfigService],
        }),
        // CacheModule.register(),
        UserModule,
        AuthModule,
        CaslModule,
        HealthModule,
        ServerModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
    // consumer.apply(HeaderMiddleware).forRoutes('*');
    }
}
