import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

export type ServerDocument = HydratedDocument<Server>;

@Schema({ _id: false })
export class Server {
    @Prop({
        required: true,
        unique: true,
        default: uuidv4().replaceAll('-', '').substring(0, 24),
        type: SchemaTypes.ObjectId,
    })
    id: string;

    @Prop({ type: SchemaTypes.ObjectId })
    _id: Types.ObjectId;

    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ required: true })
    ip: string;

    @Prop({ default: 0 })
    lastHeartbeat: number;

    @Prop({ default: false })
    isOnline: boolean;

    @Prop({ default: Date.now })
    createdTimestamp: number;

    @Prop({ default: Date.now })
    updatedTimestamp: number;
}

export const ServerSchema = SchemaFactory.createForClass(Server);