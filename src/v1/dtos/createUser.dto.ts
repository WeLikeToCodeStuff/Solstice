import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class createUserDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Length(3, 20)
    username: string;

    @IsNotEmpty()
    @Length(8, 20)
    password: string;
}