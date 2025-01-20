import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Server } from '../entities/Server.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { CreateServerDto } from '../dto/create-server.dto';
import { UpdateServerDto } from '../dto/update-server.dto';

@Processor('server')
export class ServerCRUDConsumer extends WorkerHost {

    @InjectModel(Server.name)
    private readonly serverModel: Model<Server>;

    async process(job: Job<any, any, string>): Promise<any> {}

    @OnWorkerEvent('active')
    async onActive(job: Job<CreateServerDto | UpdateServerDto, any, string>): Promise<any> {
        console.log(`Processing job ${job.id} of type ${job.name} with data ${JSON.stringify(job.data)}...`);
        switch (job.name) {
            default:
                console.log(`Unknown job type ${job.name}`);
                break;
        }
    }
}