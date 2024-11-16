import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/User.entity';
import { v4 as uuidv4 } from 'uuid';

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: User.name,
                useFactory: () => {
                    const schema = UserSchema;
                    schema.pre('save', function (next) {
                        if (!this.id) this.id = uuidv4().replaceAll('-', '').substring(0, 24);
                        if (!this._id) this._id = this.id;
                        next();
                    });

                    schema.pre('find', function (next) {
                        // hide _id field
                        this.select('-_id');
                        next();
                    });
                    return schema;
                },
            },
        ]),
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UserModule {}
