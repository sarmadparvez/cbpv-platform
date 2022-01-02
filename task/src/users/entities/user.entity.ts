export enum Role {
  Admin = 'admin',
  Developer = 'developer',
  Crowdworker = 'crowdworker',
}

export class User {
  id: string;
  username: string;
  roles: Role[];
}
