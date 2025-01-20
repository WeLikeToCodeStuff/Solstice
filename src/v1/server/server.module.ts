import { Module } from '@nestjs/common';
import { ServerController } from './server.controller';
import { ServerService } from './server.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CaslModule } from '@/casl/casl.module';
import { Server, ServerDocument, ServerSchema } from './entities/Server.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { UserModule } from '@/auth/users/users.module';
import { BullModule } from '@nestjs/bullmq';
import { ServerCRUDConsumer } from './consumers/ServerCRUD.consumer';
import { ServerGateway } from './server.gateway';

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: Server.name,
                useFactory: () => {
                    const schema = ServerSchema;
                    schema.pre('save', function (next) {
                        if (!this.id) this.id = uuidv4().replaceAll('-', '').substring(0, 24);
                        if (!this._id) this._id = this.id;
                        next();
                    });

                    schema.pre('find', function (next) {
                        // hide _id field
                        this.select('-_id');
                        next();
                    });

                    schema.pre('updateOne', async function (next) {
                        this.set({ updatedTimestamp: Date.now() });
                        next();
                    });
                    return schema;
                },
            },
        ]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '60s' },
            }),
        }),
        BullModule.registerQueue({
            name: 'server',
        }),
        CaslModule,
        UserModule,
    ],
    controllers: [ServerController],
    providers: [
        ServerService,
        ServerGateway,
        // BullMQ Consumers
        ServerCRUDConsumer,
    ],
})
export class ServerModule {}
