import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ServerService } from './server.service';
import { AuthGuard } from '@/auth/auth.guard';
import { PoliciesGuard } from '@/auth/policies-guard/policies-guard.guard';
import { CheckPolicies } from '@/auth/policies-guard/check-policies.decorator';
import { MongoAbility } from '@casl/ability';
import { Action } from '@/casl/Action';
import { Server } from './entities/Server.entity';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';
import { UUID } from 'crypto';

@Controller({ path: 'server', version: "1" })
@ApiTags("Server")
export class ServerController {
    constructor(
        private readonly serverService: ServerService,
    ) {}

    @Get()
    @ApiOkResponse({ description: 'Public information about server counts and stats' })
    async getServerStatistics() {
        return this.serverService.getServerStatistics();
    }

    @Post()
    @UseGuards(AuthGuard, PoliciesGuard)
    @CheckPolicies((ability: MongoAbility) => ability.can(Action.Create, Server))
    create(@Body() createServerDto: CreateServerDto) {
        return this.serverService.create(createServerDto);
    }

    @Get("/list")
    @UseGuards(AuthGuard, PoliciesGuard)
    @CheckPolicies((ability: MongoAbility) => ability.can(Action.Read, Server))
    findAll() {
        return this.serverService.findAll();
    }

    @Get(':id')
    @UseGuards(AuthGuard, PoliciesGuard)
    @CheckPolicies((ability: MongoAbility) => ability.can(Action.Read, Server))
    findOne(@Param('id') id: UUID | string) {
        return this.serverService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AuthGuard, PoliciesGuard)
    @CheckPolicies((ability: MongoAbility) => ability.can(Action.Update, Server))
    update(@Param('id') id: UUID | string, @Body() updateServerDto: UpdateServerDto) {
        if (!updateServerDto || Object.keys(updateServerDto).length <= 0) return { success: false, error: "No update data provided" };
        return this.serverService.update(id, updateServerDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard, PoliciesGuard)
    @CheckPolicies((ability: MongoAbility) => ability.can(Action.Delete, Server))
    remove(@Param('id') id: UUID | string) {
        return this.serverService.remove(id);
    }
}