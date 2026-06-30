import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { IDocumentAttachmentServiceInterface } from '../../domain/ports/input/document-attachment-domain-service.interface';
import { DocumentAttachmentEntity } from '../../domain/entities/document-attachment.entity';
import { UpdateDocumentAttachmentDto } from '../dto/create/documentSttachment/update.dto';
import { UpdateCommand } from '../commands/documentAttachment/update.command';

@Injectable()
export class DocumentAttachmentService
  implements IDocumentAttachmentServiceInterface
{
  constructor(
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async update(
    id: number,
    dto: UpdateDocumentAttachmentDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<DocumentAttachmentEntity>> {
    return await this._commandBus.execute(
      new UpdateCommand(id, dto, manager ?? this._readEntityManager),
    );
  }
}
