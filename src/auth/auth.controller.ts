import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    Request,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDto, profileDto, refreshTokenDto } from './dto/Auth.dto';
import { AuthGuard } from './auth.guard';
import { CaslAbilityFactory } from '@/casl/casl-ability.factory/casl-ability.factory';
import { Action } from '@/casl/Action';
import { User } from '@/v1/entities/User.entity';
import { UsersService } from '@/v1/users/users.service';
import { MongoAbility } from '@casl/ability';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags("Authentication")
@ApiBearerAuth()
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
        private readonly caslAbilityFactory: CaslAbilityFactory,
    ) {}

    @Post('login')
    @ApiResponse({ status: 200, description: 'Login successful' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    signIn(@Body() loginDto: loginDto) {
        return this.authService.signIn(loginDto.username, loginDto.password);
    }

    @Post('refresh')
    @ApiResponse({ status: 200, description: 'Invalid refresh token' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    refresh(@Body() refreshTokenDto: refreshTokenDto) {
        return this.authService.refresh(refreshTokenDto.email, refreshTokenDto.refreshToken);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    @ApiResponse({ status: 200, description: 'Profile retrieved' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getProfile(@Request() req: any, @Query() profileDto: profileDto): Promise<User> {
        console.log(profileDto);
        const user = Object.assign(
            new User(),
            await this.usersService.findOne({ id: req.user.id }),
        );
        const otherUser = Object.assign(
            new User(),
            await this.usersService.findOne({ id: profileDto.id || req.user.id }),
        );
        // set the ids to their toString
        user.id = user.id.toString();
        otherUser.id = otherUser.id.toString();
        const ability: MongoAbility = this.caslAbilityFactory.createForUser(
            user,
            otherUser,
        );
        // check if the user can read users with the same id
        if (ability.can(Action.Read, user)) {
            return otherUser;
        } else {
            const rule = ability
                .possibleRulesFor(Action.Read, User)
                .filter((rule) => rule.inverted)
                .pop();
            throw new UnauthorizedException(rule.reason);
        }
    }
}