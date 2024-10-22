import { User } from '@/v1/entities/User.entity';
import { UsersService } from '@/v1/users/users.service';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class RemoveExpiredTokensService {
    private readonly logger = new Logger(RemoveExpiredTokensService.name);
    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

    @Cron(CronExpression.EVERY_30_SECONDS)
    async handleCron() {
        const usersList = await this.usersService.getUsers();
        usersList.forEach(async (user: User) => {
            this.logger.log(`Checking user ${user.username}`);
            this.logger.log(`User ${user.username} has ${user.refreshTokens.length} refresh tokens`);
            user.refreshTokens.forEach(async (token: string) => {
                const decoded = this.jwtService.decode(token);
                console.log(decoded);
            });
        });
    }
}