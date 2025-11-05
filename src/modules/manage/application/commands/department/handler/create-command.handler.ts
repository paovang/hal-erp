import { CreateCommand } from '@src/modules/manage/application/commands/department/create.command';
import { IQueryHandler, CommandHandler } from '@nestjs/cqrs';
import {
  LENGTH_DEPARTMENT_CODE,
  WRITE_DEPARTMENT_REPOSITORY,
} from '@src/modules/manage/application/constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { DepartmentEntity } from '@src/modules/manage/domain/entities/department.entity';
import { IWriteDepartmentRepository } from '@src/modules/manage/domain/ports/output/department-repository.interface';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { DepartmentDataMapper } from '@src/modules/manage/application/mappers/department.mapper';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { DocumentTypeOrmEntity } from '@src/common/infrastructure/database/typeorm/document-type.orm';
import { CodeGeneratorUtil } from '@src/common/utils/code-generator.util';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { CompanyUserOrmEntity } from '@src/common/infrastructure/database/typeorm/company-user.orm';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { EligiblePersons } from '../../../constants/status-key.const';

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements IQueryHandler<CreateCommand, ResponseResult<DepartmentEntity>>
{
  constructor(
    @Inject(WRITE_DEPARTMENT_REPOSITORY)
    private readonly _write: IWriteDepartmentRepository,
    private readonly _dataMapper: DepartmentDataMapper,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
    private readonly _codeGeneratorUtil: CodeGeneratorUtil,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(
    query: CreateCommand,
  ): Promise<ResponseResult<DepartmentEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        let isLineManager: boolean;
        let code: string;
        const user = this._userContextService.getAuthUser()?.user;
        const user_id = user.id;
        const roles = user?.roles?.map((r: any) => r.name) ?? [];

        if (
          roles.includes(EligiblePersons.SUPER_ADMIN) ||
          roles.includes(EligiblePersons.ADMIN)
        ) {
        }

        const company_user = await findOneOrFail(
          query.manager,
          CompanyUserOrmEntity,
          {
            user_id: user_id,
          },
          `company user id ${user_id}`,
        );

        const company_id = company_user.company_id;
        if (!company_id)
          throw new ManageDomainException(
            'errors.not_found',
            HttpStatus.NOT_FOUND,
            { property: `${company_id}` },
          );

        if (!query.dto.code) {
          code = await this.generateUniqueDepartmentCode(query);
        } else {
          code = query.dto.code;
        }

        if (
          query.dto.department_head_id &&
          query.dto.department_head_id > 0 &&
          query.dto.department_head_id != null
        ) {
          isLineManager = false;
        } else {
          isLineManager = true;
        }

        const mapToEntity = this._dataMapper.toEntity(
          query.dto,
          isLineManager,
          code,
        );

        return await this._write.create(mapToEntity, manager);
      },
    );
  }

  private async generateUniqueDepartmentCode(
    query: CreateCommand,
  ): Promise<string> {
    return await this._codeGeneratorUtil.generateUniqueCode(
      LENGTH_DEPARTMENT_CODE,
      async (generatedCode: string) => {
        try {
          await findOneOrFail(query.manager, DocumentTypeOrmEntity, {
            code: generatedCode,
          });
          return false;
        } catch {
          return true;
        }
      },
      'DP',
    );
  }
}
