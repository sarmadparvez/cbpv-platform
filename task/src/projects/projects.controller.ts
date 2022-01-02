import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiTags } from '@nestjs/swagger';
import { ForbiddenError } from '@casl/ability';
import * as contextService from 'request-context';
import { Action } from '../iam/policy';
import { Project } from './entities/project.entity';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  /**
   * Create a new Project. The user must have Create permission for Projects.
   */
  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    // check if user have permission to create project
    ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(
      Action.Create,
      Project,
    );
    return this.projectsService.create(createProjectDto);
  }

  /**
   * Get a list of all Projects. The user must have permission to Read all Projects.
   */
  @Get()
  findAll() {
    // check if user have permission to list projects
    ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(
      Action.Read,
      new Project(),
    );
    return this.projectsService.findAll();
  }

  /**
   * Get a list of Projects on which the calling user have access to.
   * The user must have Read permission on the Projects.
   */
  @Get('search')
  searchAll() {
    // check if user have permission to read projects
    ForbiddenError.from(contextService.get('userAbility')).throwUnlessCan(
      Action.Read,
      Project,
    );
    return this.projectsService.searchAll();
  }

  /**
   * Get a Project. The calling user must have Read permission the Project.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  /**
   * Update a Project. The calling user must have Update permission the Project.
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  /**
   * Delete a Project. The calling user must have Delete permission the Project.
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
