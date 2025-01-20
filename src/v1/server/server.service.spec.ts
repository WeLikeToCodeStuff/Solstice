import { Test, TestingModule } from '@nestjs/testing';
import { ServerService } from './server.service';
import { getModelToken } from '@nestjs/mongoose';
import { Server } from './entities/Server.entity';
import { BullModule } from '@nestjs/bullmq';

describe('ServerService', () => {
    let service: ServerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                BullModule.registerQueue({
                    name: 'server',
                }),
            ],
            providers: [
                ServerService,
                {
                    provide: getModelToken(Server.name),
                    useValue: {
                        name: 'test',
                        ip: '127.0.0.1',
                        isOnline: true,
                    } as Server,
                },
            ],
        }).compile();

        service = module.get<ServerService>(ServerService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
