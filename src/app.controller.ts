import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AvailableEndpoints } from './types/AvailableEndpoints';
import { ConfigService } from '@nestjs/config';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags("Global")
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly configService: ConfigService,
    ) {}

    @Get()
    @ApiOkResponse({ description: 'Available endpoints' })
    getAvailableEndpoints(): AvailableEndpoints {
        return this.appService.getAvailableEndpoints();
    }
}
