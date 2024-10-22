import { Controller, Get, Req, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';
import { HealthCheck, HealthCheckService, HealthIndicatorResult, MongooseHealthIndicator } from '@nestjs/terminus';
import { LatencyInterceptor } from '@/interceptors/latency/latency.interceptor';

@Controller('health')
@ApiTags("Global")
@UseInterceptors(new LatencyInterceptor())
export class HealthController {
    constructor(
        private readonly healthCheckService: HealthCheckService,
        private readonly mongoIndicator: MongooseHealthIndicator,
    ) {}

    @Get()
    @HealthCheck({ swaggerDocumentation: false })
    @ApiOkResponse({ description: 'Health check' })
    async getHealth(@Req() request: FastifyRequest) : Promise<{ status: string, database: string, latency: number }> {
        const databaseStatus: string = (await this.mongoIndicator.pingCheck('mongo') as HealthIndicatorResult).mongo.status;
        return {
            status: "OK",
            database: databaseStatus,
            latency: Date.now() - request.timestamp,
        }
    }
}
