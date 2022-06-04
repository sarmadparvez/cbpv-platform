import {
  Ability,
  AbilityClass,
  AbilityBuilder,
  InferSubjects,
  ExtractSubjectType,
} from '@casl/ability';
import { User } from '../users/entities/user.entity';
import { UserReport } from '../user-reports/entities/user-report.entity';
import { Role } from '@cbpv-platform/roles';

/**
 * Defines the policy for a User.
 * The policy includes the actions a User can perform on entities.
 */
export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

type Subjects = InferSubjects<typeof User | typeof UserReport> | 'all';

type AppAbilities = [Action, Subjects];
export type AppAbility = Ability<AppAbilities>;
export const AppAbility = Ability as AbilityClass<AppAbility>;

type DefinePermissions = (
  user: User,
  builder: AbilityBuilder<AppAbility>
) => void;

// For each role, define the permissions
const rolePermissions: Record<Role, DefinePermissions> = {
  admin(user, { can }) {
    can(Action.Manage, 'all');
  },
  developer(user, { can }) {
    can([Action.Update, Action.Read], User, { id: user.id });
    can(Action.Create, UserReport);
  },
  crowdworker(user, { can }) {
    can([Action.Update, Action.Read], User, { id: user.id });
  },
};

export function defineAbilityFor(user: User): AppAbility {
  const builder = new AbilityBuilder(AppAbility);

  user.roles.forEach((role) => {
    if (typeof rolePermissions[role] === 'function') {
      rolePermissions[role](user, builder);
    } else {
      throw new Error(`Trying to use unknown role "${role}"`);
    }
  });

  return builder.build({
    detectSubjectType: (item) =>
      item.constructor as ExtractSubjectType<Subjects>,
  });
}
