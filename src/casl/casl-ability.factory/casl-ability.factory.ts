import {
    AbilityBuilder,
    AbilityClass,
    createMongoAbility,
    ExtractSubjectType,
    InferSubjects,
    MongoAbility,
    PureAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Action } from '../Action';
import { User } from '@/auth/users/entities/User.entity';
import { Server } from '@/v1/server/entities/Server.entity';

type Subjects = InferSubjects<typeof User> | InferSubjects<typeof Server> | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
    createForUser(user: User, otherUser?: User): MongoAbility {
        const {
            can: allow,
            cannot: forbid,
            build,
            rules,
        } = new AbilityBuilder<AppAbility>(createMongoAbility);

        if (user.isAdministrator) {
            allow(Action.Manage, User); // read-write access to everything
            allow(Action.Manage, Server); // read-write access to everything
        } else {
            allow(Action.Read, 'all'); // Regular users can read general information
            forbid(Action.Read, User).because(
                "You can not access other users' data.",
            ); // But cannot read other users' info
        }

        // Allow users to read their own information
        allow(Action.Read, User, { id: otherUser?.id ?? user.id });
        allow(Action.Read, Server);

        // allow(Action.Update, Article, { authorId: user.id });
        // forbid(Action.Delete, Article, { isPublished: true });

        return build({
            // Read https://casl.js.org/v6/en/guide/subject-type-detection#use-classes-as-subject-types for details
            detectSubjectType: (item) => {
                return item.constructor as ExtractSubjectType<Subjects>;
            },
        });
    }
}
