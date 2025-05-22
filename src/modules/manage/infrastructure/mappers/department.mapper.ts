import { DepartmentOrmEntity } from '@src/common/infrastructure/database/typeorm/department.orm';
import { DepartmentEntity } from '@src/modules/manage/domain/entities/department.entity';
import { DepartmentId } from '../../domain/value-objects/department-id.vo';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import moment from 'moment-timezone';
import { CodeGeneratorUtil } from '@src/common/utils/code-generator.util';
import { GENERTE_CODE_SERVICE } from '@src/common/constants/inject-key.const';
import { Inject } from '@nestjs/common';

export class DepartmentDataAccessMapper {
  constructor(
    @Inject(GENERTE_CODE_SERVICE)
    private readonly _generateCode: CodeGeneratorUtil,
  ) {}

  toOrmEntity(departmentEntity: DepartmentEntity): DepartmentOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = departmentEntity.getId();

    const mediaOrmEntity = new DepartmentOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    } else {
      // const code = await this._generateCode.generateUniqueCode(
      //   6,
      //   async (code: string) => {
      //     // ถ้ามีอยู่แล้ว -> return false เพื่อให้ generate ใหม่
      //     const exists = await this._generateCode.existsByCode(code);
      //     return !exists;
      //   },
      //   'DEP',
      // );
      mediaOrmEntity.code = 'DP-093';
    }
    mediaOrmEntity.name = departmentEntity.name;
    mediaOrmEntity.created_at = departmentEntity.createdAt ?? new Date(now);
    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(ormData: DepartmentOrmEntity): DepartmentEntity {
    return DepartmentEntity.builder()
      .setDepartmentId(new DepartmentId(ormData.id))
      .setName(ormData.name)
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at)
      .build();
  }
}
