import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class loginDto {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;
}

export class refreshTokenDto {
    @IsNotEmpty() @IsEmail()
    email: string;

    @IsNotEmpty()
    refreshToken: string;
}

export class profileDto {
    @Length(24, 24)
    @IsOptional()
    @ApiProperty({ required: false })
    id?: string;
}