import { Injectable } from '@nestjs/common';
import { AvailableEndpoints } from './types/AvailableEndpoints';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, ConnectionStates } from 'mongoose';
import { FastifyRequest } from 'fastify';

@Injectable()
export class AppService {
    getAvailableEndpoints(): AvailableEndpoints {
        return {
            status: 'success',
            message: 'Available endpoints',
            endpoints: [
                {
                    url: '/v1',
                    description: 'Version 1 of the API',
                },
            ],
        };
    }
}
