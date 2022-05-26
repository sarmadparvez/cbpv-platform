import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { classToPlain, plainToClass } from 'class-transformer';
import * as contextService from 'request-context';
import { Action } from '../iam/policy';
import { findWithPermissionCheck } from '../iam/utils';
import { getFileUploadSignature } from '../tasks/tasks.service';
import { ConfigService } from '@nestjs/config';
import { FindNdaUrlResponseDto } from './dto/find-nda-url-response.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private configService: ConfigService
  ) {}

  create(createProjectDto: CreateProjectDto) {
    const project = projectDtoEntity(createProjectDto);
    project.userId = contextService.get('user').id;
    return this.projectRepository.save(project);
  }

  findAll() {
    return this.projectRepository.find();
  }

  searchAll() {
    return this.projectRepository.find({
      where: {
        userId: contextService.get('user')?.id,
      },
    });
  }

  findOne(id: string) {
    return findWithPermissionCheck(id, Action.Read, this.projectRepository);
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    await findWithPermissionCheck(id, Action.Update, this.projectRepository);
    const project = projectDtoEntity(updateProjectDto);
    await this.projectRepository.update(id, project);
    return this.projectRepository.findOne(id);
  }

  async remove(id: string) {
    await findWithPermissionCheck(id, Action.Delete, this.projectRepository);
    return this.projectRepository.delete(id);
  }

  getFileUploadSignature(id: string) {
    const cloudinaryConfig = this.configService.get('cloudinary');
    return getFileUploadSignature(
      id,
      cloudinaryConfig,
      `${cloudinaryConfig.projectsFolder}/${id}`
    );
  }

  async getNdaUrl(id: string) {
    const project = await this.projectRepository.findOneOrFail(id);
    if (!project.ndaUrl) {
      // User does not have access to this Task.
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Non Disclosure Agreement not found.',
        },
        HttpStatus.NOT_FOUND
      );
    }
    const response: FindNdaUrlResponseDto = {
      ndaUrl: project.ndaUrl,
    };
    return response;
  }
}
function projectDtoEntity(dto: CreateProjectDto | UpdateProjectDto): Project {
  const data = classToPlain(dto);
  return plainToClass(Project, data);
}
