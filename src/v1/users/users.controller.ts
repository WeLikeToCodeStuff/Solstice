import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../entities/User.entity';
import { createUserDto } from '../dtos/createUser.dto';
import { UUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller({ path: 'users', version: '1' })
@ApiTags("Authentication")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('/list')
    @ApiOkResponse({ description: 'List of users' })
    async getUsers(): Promise<User[]> {
        return await this.usersService.getUsers();
    }

    @Post('/create')
    @ApiCreatedResponse({ description: 'User created' })
    @ApiBody({ type: createUserDto })
    async createUser(@Body() params: createUserDto): Promise<User> {
        const { username, email, password } = params;
        return await this.usersService.createUser(
            username,
            email,
            await bcrypt.hash(password, 1),
        );
    }

    @Delete('/delete')
    @ApiResponse({ status: 200, description: 'User deleted' })
    async deleteUser(@Body() params: { id: string }): Promise<User> {
        const { id } = params;
        return await this.usersService.deleteUserById(id as UUID);
    }
}
