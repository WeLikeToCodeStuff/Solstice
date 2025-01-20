import { PartialType } from '@nestjs/swagger';
import { CreateServerDto } from './create-server.dto';
import { Server } from '../entities/Server.entity';

export class UpdateServerDto extends PartialType(Server) {
}
