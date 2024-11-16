import { User } from '@/auth/users/entities/User.entity';
import { UsersService } from '@/auth/users/users.service';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class RemoveExpiredTokensService {
    private readonly logger = new Logger(RemoveExpiredTokensService.name);
    constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

    @Cron(CronExpression.EVERY_5_SECONDS)
    async handleCron() {
        const usersList = await this.usersService.getUsers();
        usersList.forEach(async (user: User) => {
            this.logger.log(`Checking user ${user.username}`);
            this.logger.log(`User ${user.username} has ${user.refreshTokens.length} refresh tokens`);
            user.refreshTokens.forEach(async (token: string) => {
                const decodedToken: { sub: string; iat: number; exp: number; username: string; id: string; } = this.jwtService.decode(token);
                if (decodedToken.exp * 1000 < Date.now()) {
                    this.logger.log(`Token ${token.substring(0, 10)}... expired`);
                    user.refreshTokens = user.refreshTokens.filter((t: string) => t !== token);
                    await this.usersService.updateUser({ id: user.id }, { refreshTokens: user.refreshTokens });
                }
            });
        });
    }
}