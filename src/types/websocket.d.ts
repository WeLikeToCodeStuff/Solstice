import { UUID } from "crypto";

export interface IWebsocketMessage {
    name?: string;
    data?: any;
}

interface WsResponse<T = any> {
    event: string;
    name: string;
    data: T;
}

export interface HeartbeatMessage extends IWebsocketMessage {
    name: 'heartbeat';
    data: { server: UUID; timestamp: number; };
}

// export interface IWebsocketResponse extends IWebsocketMessage {
//     name?: string;
//     event: string;
//     data: any;
// }