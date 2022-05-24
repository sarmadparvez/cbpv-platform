import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { IamService } from './iam.service';
import { Action as ActionEnum } from './policy';

class Action {
  @ApiProperty({
    type: 'enum',
    enum: ActionEnum,
  })
  action: ActionEnum;
}

@ApiTags('IAM')
@ApiExtraModels(Action)
@Controller('iam')
export class IamController {
  constructor(private readonly iamService: IamService) {}
  /**
   * Get permissions of the calling user.
   */
  @ApiBearerAuth()
  @Get('getPermissions')
  getPermissions() {
    return this.iamService.getPermissions();
  }
}
