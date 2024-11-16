import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ _id: false })
export class User {
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
    username: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true, default: 'test' })
    password: string;

    @Prop({ default: Date.now })
    createdTimestamp: number;

    @Prop({ default: Date.now })
    updatedTimestamp: number;

    @Prop({ default: false })
    isAdministrator: boolean;

    @Prop({ default: [] })
    refreshTokens: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);