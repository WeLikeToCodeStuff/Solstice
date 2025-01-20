import { Injectable } from '@nestjs/common';
import { Server, ServerSchema } from './entities/Server.entity';
import { isValidObjectId, Model, UpdateResult } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateServerDto } from './dto/update-server.dto';
import { CreateServerDto } from './dto/create-server.dto';
import { UUID } from 'crypto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class ServerService {
    constructor(
        @InjectModel(Server.name) private serverModel: Model<Server>,
        @InjectQueue('server') private serverQueue: Queue,
    ) {}

    async create(createServerDto: CreateServerDto) {
        if (await this.serverModel.exists({ ip: createServerDto.ip })) return { success: false, error: "Duplicate IP"}
        return { success: true, ...(await this.serverModel.create({ ...createServerDto })).toObject() };
    }

    async findAll(): Promise<Server[]> {
        const serverList = await this.serverModel.find({}).lean().exec() as Server[];
        return serverList.map((server: Server) => Object.fromEntries(Object.entries(server).filter(([key]) => Object.keys(ServerSchema.obj).includes(key)))) as unknown as Server[];
    }

    async findOne(id: UUID | string): Promise<Server> {
        const server: Server = await this.serverModel.findOne({ id }).lean().exec();
        return Object.fromEntries(Object.entries(server).filter(([key]) => Object.keys(ServerSchema.obj).includes(key))) as unknown as Server;
    }

    async update(id: UUID | string, updateServerDto: UpdateServerDto): Promise<UpdateResult & { success: boolean, changed: Partial<Server> }> {
        if (updateServerDto?.id) delete updateServerDto.id;
        const originalServer = await this.serverModel.findOne({ id }).lean().exec();
        const updateOperation = await this.serverModel.updateOne({ id }, updateServerDto).exec();
        const updatedServer = await this.serverModel.findOne({ id }).lean().exec();
        const modifiedFields = Object.entries(updatedServer).filter(([key, value]) => {
            if (isValidObjectId(originalServer[key]) && isValidObjectId(value))
                return originalServer[key].toString() !== value.toString();
            return originalServer[key] !== value;
        });
        return {
            success: updateOperation.acknowledged && updateOperation.modifiedCount === 1,
            ...updateOperation,
            changed: modifiedFields.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
        }
    }

    async remove(id: UUID | string) {
        const deleteOperation = await this.serverModel.deleteOne({ id }).exec();
        return {
            success: deleteOperation.acknowledged && deleteOperation.deletedCount === 1,
            ...deleteOperation,
        }
    }

    async getServerStatistics() {
        return {
            count: {
                total: await this.serverModel.countDocuments(),
                online: await this.serverModel.countDocuments({ isOnline: true }),
                offline: await this.serverModel.countDocuments({ isOnline: false }),
            },
        };
    }

}
