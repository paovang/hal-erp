import { CommandHandler, IQueryHandler } from "@nestjs/cqrs";
import { UpdateCommand } from "../update.command";
import { ResponseResult } from "@src/common/application/interfaces/pagination.interface";
import { Inject, NotFoundException } from "@nestjs/common";
import { WRITE_DOCUMENT_TYPE_REPOSITORY } from "../../../constants/inject-key.const";
import { IWriteDocumentTypeRepository } from "@src/modules/manage/domain/ports/output/document-type-repository.interface";
import { DocumentTypeDataMapper } from "../../../mappers/document-type.mapper";
import { DocumentTypeEntity } from "@src/modules/manage/domain/entities/document-type.entity";
import { DocumentTypeId } from "@src/modules/manage/domain/value-objects/document-type-id.vo";
import { findOneOrFail } from "@src/common/utils/fine-one-orm.utils";
import { DocumentTypeOrmEntity } from "@src/common/infrastructure/database/typeorm/document-type.orm";
import { _checkColumnDuplicate } from "@src/common/utils/check-column-duplicate-orm.util";

@CommandHandler(UpdateCommand)
export class UpdateCommandHandler
  implements IQueryHandler<UpdateCommand, ResponseResult<DocumentTypeEntity>>
{
  constructor(
    @Inject(WRITE_DOCUMENT_TYPE_REPOSITORY)
    private readonly _write: IWriteDocumentTypeRepository,
    private readonly _dataMapper: DocumentTypeDataMapper,
  ) {}

    async execute(query: UpdateCommand): Promise<any> {
        let { code, name } = query.dto;

        if (isNaN(query.id)) {
            throw new Error('ID must be a number');
        }

        await findOneOrFail(query.manager, DocumentTypeOrmEntity, {
            id: query.id,
        });

        await _checkColumnDuplicate(DocumentTypeOrmEntity, 'name', query.dto.name, query.manager, 'Name already exists', query.id);
        

        // Validate existing name conflict
        // const existingByName = await query.manager.findOne(DocumentTypeOrmEntity, {
        //     where: { name },
        // });

        // if (existingByName && Number(existingByName.id) !== query.id) {
        //     throw new Error('Document type name already exists');
        // }

        if (code) {
            // Remove 'DT-' prefix if it already exists (case-insensitive optional)
            const cleanCode = code.toUpperCase().startsWith('DT-') ? code.slice(3) : code;
        
            // Format: always add DT- and uppercase the rest
            const formattedCode = `DT-${cleanCode.toUpperCase()}`;

            const existingByCode = await query.manager.findOne(DocumentTypeOrmEntity, {
                where: { code: formattedCode},
            });
        
            if (existingByCode && Number(existingByCode.id) !== Number(query.id)) {
                throw new NotFoundException('Document type code already exists');
            }
        
            code = formattedCode;
        
        } else {
            // No code provided — fallback to existing one in DB
            const existingEntity = await findOneOrFail(query.manager, DocumentTypeOrmEntity, {
                id: query.id,
            });
            code = existingEntity.code;
        }        

        // Map to entity
        const entity = this._dataMapper.toEntity(query.dto, code);

        // Set and validate ID
        await entity.initializeUpdateSetId(new DocumentTypeId(query.id));
        await entity.validateExistingIdForUpdate();

        // Final existence check for ID before update
        await findOneOrFail(query.manager, DocumentTypeOrmEntity, {
            id: entity.getId().value,
        });

        return this._write.update(entity, query.manager);
    }
}