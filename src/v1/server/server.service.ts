import { Injectable } from '@nestjs/common';
import { Server, ServerDocument, ServerSchema } from './entities/Server.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateServerDto } from './dto/update-server.dto';
import { CreateServerDto } from './dto/create-server.dto';
import { UUID } from 'crypto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ServerService {
    constructor(
        @InjectModel(Server.name) private serverModel: Model<Server>,
    ) {}

    async create(createServerDto: CreateServerDto) {
        if (await this.serverModel.exists({ ip: createServerDto.ip })) return { success: false, error: "Duplicate IP"}
        return { success: true, ...(await this.serverModel.create({ ...createServerDto })).toObject() };
    }

    async findAll(): Promise<Server[]> {
        const serverList = await this.serverModel.find({}).lean().exec() as Server[];
        return serverList.map((server: Server) => Object.fromEntries(Object.entries(server).filter(([key]) => Object.keys(ServerSchema.obj).includes(key)))) as unknown as Server[];
    }

    async findOne(id: UUID | string) {
        return await this.serverModel.findOne({ id }).lean().exec() as Server;
    }

    async update(id: UUID | string, updateServerDto: UpdateServerDto) {
        return `This action updates a #${id} server`;
    }

    async remove(id: UUID | string) {
        const deleteOperation = await this.serverModel.deleteOne({ id }).exec();
        return {
            success: deleteOperation.acknowledged && deleteOperation.deletedCount === 1,
            ...deleteOperation,
        }
    }

    async getServerStatistics() {
        const totalCount = await this.serverModel.countDocuments();
        const onlineCount = await this.serverModel.countDocuments({ isOnline: true });
        const offlineCount = await this.serverModel.countDocuments({ isOnline: false });
        return {
            count: {
                total: totalCount,
                online: onlineCount,
                offline: offlineCount,
            },
        };
    }

}
