import { HeartbeatMessage, IWebsocketMessage, WsResponse } from '@/types/websocket';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { from, map, Observable } from 'rxjs';
import { Server } from './entities/Server.entity';
import { Model } from 'mongoose';
import { UUID } from 'crypto';

@WebSocketGateway({ namespace: 'server', transports: ["websocket"] })
@Injectable()
export class ServerGateway {

    constructor(
        @InjectModel(Server.name) private readonly serverModel: Model<Server>,
    ) { }

    @SubscribeMessage('server')
    async handleEvent(@ConnectedSocket() client: WebSocket, @MessageBody() data: unknown): Promise<WsResponse<string | { server: UUID | string; timestamp: number; }>> {
        // Make sure it's actually a JSON string and not just a random bot or something
        if ((typeof data !== 'object' && typeof data !== typeof Array) || !data) return { event: 'server', name: 'heartbeat', data: 'Invalid JSON data' };

        // Unserialize the JSON data
        const message: IWebsocketMessage = data as IWebsocketMessage;

        switch (message.name) {
            case 'heartbeat': {
                const heartbeatMessage: HeartbeatMessage = message as HeartbeatMessage;
                if (!heartbeatMessage.data.server) return { event: 'server', name: 'heartbeat', data: 'Invalid server UUID' };
                if (!heartbeatMessage.data.timestamp) heartbeatMessage.data.timestamp = Date.now();

                const server = (await this.serverModel.findOne({ id: heartbeatMessage.data.server }))?.toObject();
                if (!server) return { event: 'server', name: 'heartbeat', data: 'Server not found' };

                console.log(`Received heartbeat from ${server.name} (${server.id})`);
                if (Date.now() - heartbeatMessage.data.timestamp <= 5 * 1000) {
                    await this.serverModel.updateOne({ id: heartbeatMessage.data.server }, { lastHeartbeat: heartbeatMessage.data.timestamp, isOnline: true });
                    return { event: 'server', name: 'heartbeat', data: JSON.stringify({ name: 'heartbeat', data: { server: heartbeatMessage.data.server, timestamp: heartbeatMessage.data.timestamp } }) };
                }

                return { event: 'server', name: 'heartbeat', data: { server: heartbeatMessage.data.server, timestamp: server.lastHeartbeat } };
            }
                break;
        }
    }
}
