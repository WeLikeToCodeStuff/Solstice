import { AppAbility, CaslAbilityFactory } from "@/casl/casl-ability.factory/casl-ability.factory";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { CHECK_POLICIES_KEY } from "./check-policies.decorator";
import { PolicyHandler } from "./policies.handler";
import { MongoAbility } from "@casl/ability";
import { User } from "../users/entities/User.entity";
import { UsersService } from "../users/users.service";

@Injectable()
export class PoliciesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private caslAbilityFactory: CaslAbilityFactory,
        private readonly usersService: UsersService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const policyHandlers =
      this.reflector.get<PolicyHandler[]>(
          CHECK_POLICIES_KEY,
          context.getHandler(),
      ) || [];

        const { user } = context.switchToHttp().getRequest();
        const userData = Object.assign(new User(), await this.usersService.findOne({ id: user.id }));
        const ability = this.caslAbilityFactory.createForUser(userData);


        return policyHandlers.every((handler) =>
            this.execPolicyHandler(handler, ability),
        );
    }

    private execPolicyHandler(handler: PolicyHandler, ability: MongoAbility) {
        if (typeof handler === 'function') {
            return handler(ability);
        }
        return handler.handle(ability);
    }
}