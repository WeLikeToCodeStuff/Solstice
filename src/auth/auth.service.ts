import { User } from '@/auth/users/entities/User.entity';
import { UsersService } from './users/users.service';
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
        const refreshToken = await this.jwtService.signAsync(payload, { expiresIn: '7d' });
        await this.usersService.updateUser({ id: user.id }, { refreshTokens: [...user.refreshTokens, refreshToken] });
        return {
            access_token: await this.jwtService.signAsync(payload, { expiresIn: "1d" }),
            refresh_token: refreshToken,
        };
    }

    async refresh(email: string, refreshToken: string): Promise<{ access_token: string, refresh_token: string }> {
        const user: User = await this.usersService.findOne({ email });
        const payload = { sub: user.id, username: user.username, id: user.id };
        try {
            // invalid refresh token
            if (!await this.jwtService.verifyAsync(refreshToken))
                throw new UnauthorizedException("Invalid refresh token");
        } catch (e) {
            const error: Error = e as Error;
            throw new UnauthorizedException(error.message, { cause: error.cause, description: error.name });
        }

        const newRefreshToken = await this.jwtService.signAsync(payload, {
            expiresIn: '7d',
        });

        await this.usersService.updateUser(
            { id: user.id as UUID },
            { refreshTokens: [...user.refreshTokens.filter((t) => t !== refreshToken), newRefreshToken] },
        );

        return {
            access_token: await this.jwtService.signAsync(payload, { expiresIn: "1d" }),
            refresh_token: newRefreshToken,
        };
    }
}
