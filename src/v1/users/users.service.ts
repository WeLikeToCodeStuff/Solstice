import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../entities/User.entity';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UUID } from 'crypto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async getUsers(): Promise<User[]> {
        const users = await this.userModel.find().exec();
        return users.map((user) => {
            const { _id, password, ...res } = user.toObject();
            return res as User;
        });
    }

    async createUser(
        username: string,
        email: string,
        password: string,
    ): Promise<User> {
        if (await this.userModel.findOne({ username }))
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        if (await this.userModel.findOne({ email }))
            throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
        const user = new this.userModel({
            id: uuidv4().replaceAll('-', '').substring(0, 24),
            username,
            email,
            password,
        });
        return await user.save();
    }

    async deleteUserById(id: UUID): Promise<User> {
        const user = await this.userModel.findOne({ id });
        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        await this.userModel.deleteOne({ id }).exec();
        return user;
    }

    async updateUser({
        username,
        email,
        id,
        showPassword = false,
    }: {
        username?: string;
        email?: string;
        id?: UUID;
        showPassword?: boolean;
    },
    toUpdate: Partial<User>) : Promise<User> {
        // throw new HttpException('Not implemented', HttpStatus.NOT_IMPLEMENTED);
        const user = await this.userModel.findOne({ id });
        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        const updatedUser = await this.userModel.findOneAndUpdate(
            { id },
            { ...toUpdate },
            { new: true },
        );

        if (!updatedUser) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        const { _id, password, ...res } = updatedUser.toObject();
        return res as User;
    }

    async findOne({
        username,
        email,
        id,
        showPassword = false,
    }: {
        username?: string;
        email?: string;
        id?: UUID;
        showPassword?: boolean;
    }): Promise<User | undefined> {
        const user = await this.userModel.findOne({
            $or: [{ username }, { email }, { id }],
        });
        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        let result: User;
        if (showPassword) {
            const { _id, ...res } = user.toObject();
            result = res as User;
        } else {
            const { _id, password, ...res } = user.toObject();
            result = res as User;
        }
        const { __v, ...sanitizedResult } = result as any;
        return sanitizedResult as User;
    }
}
