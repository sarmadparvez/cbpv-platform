import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { packRules } from '@casl/ability/extra';
import * as contextService from 'request-context';

@ApiTags('IAM')
@Controller('iam')
export class IamController {
  /**
   * Get permissions of the calling user.
   */
  @ApiBearerAuth()
  @Get('getPermissions')
  getPermissions() {
    return packRules(
      contextService.get('userAbility')?.rules,
      (subjectType: any) => {
        if (typeof subjectType === 'string') {
          return subjectType;
        }
        return subjectType.name;
      },
    );
  }
}
