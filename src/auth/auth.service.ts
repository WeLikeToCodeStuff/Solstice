import { User } from '@/v1/entities/User.entity';
import { UsersService } from '../v1/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UUID } from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async signIn(
        username: string,
        password: string,
    ): Promise<{ access_token: string, refresh_token: string }> {
        const user: User = await this.usersService.findOne({
            username,
            showPassword: true,
        });
        if (!(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException();
        }

        const payload = { sub: user.id, username: user.username, id: user.id };
        return {
            access_token: await this.jwtService.signAsync(payload),
            refresh_token: await this.jwtService.signAsync(payload, {
                expiresIn: '7d',
            }),
        };
    }

    async refresh(email: string, refreshToken: string): Promise<{ access_token: string, refresh_token: string }> {
        const user: User = await this.usersService.findOne({ email });
        const payload = { sub: user.id, username: user.username, id: user.id };
        // invalid refresh token
        if (!await this.jwtService.verifyAsync(refreshToken)) {
            throw new UnauthorizedException();
        }

        const newRefreshToken = await this.jwtService.signAsync(payload, {
            expiresIn: '7d',
        });

        await this.usersService.updateUser({
            id: user.id as UUID,
        }, {
            refreshTokens: [...user.refreshTokens, newRefreshToken],
        });

        return {
            access_token: await this.jwtService.signAsync(payload),
            refresh_token: newRefreshToken,
        };
    }
}
