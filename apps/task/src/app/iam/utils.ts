import { Action } from './policy';
import { FindOneOptions, Repository } from 'typeorm';
import { ForbiddenError } from '@casl/ability';
import * as contextService from 'request-context';

/**
 * Retrieve an entity from database and check permissions on it
 * @param id The id of the entity in database
 * @param action The action to check permission for
 * @param repository The repository to use to retrieve record from databae
 */
export async function findWithPermissionCheck<T>(
  id: string,
  action: Action,
  repository: Repository<T>,
  findOneOptions?: FindOneOptions<T>
): Promise<T> {
  const entity: T = await repository.findOneOrFail(id, findOneOptions);
  // check if user have permission
  ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(
    action,
    entity
  );
  return entity;
}
