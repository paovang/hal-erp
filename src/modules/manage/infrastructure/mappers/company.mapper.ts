import { CompanyOrmEntity } from '@src/common/infrastructure/database/typeorm/company.orm';
import { CompanyEntity } from '@src/modules/manage/domain/entities/company.entity';
import { CompanyId } from '../../domain/value-objects/company-id.vo';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import moment from 'moment-timezone';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CompanyDataAccessMapper {
  toOrmEntity(
    companyEntity: CompanyEntity,
    method: OrmEntityMethod,
  ): CompanyOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = companyEntity.getId();

    const companyOrmEntity = new CompanyOrmEntity();
    if (id) {
      companyOrmEntity.id = id.value;
    }

    companyOrmEntity.name = companyEntity.name ?? null;
    if (method === OrmEntityMethod.UPDATE) {
      if (companyEntity.logo && companyEntity.logo !== undefined) {
        companyOrmEntity.logo = companyEntity.logo;
      }
    }
    companyOrmEntity.tel = companyEntity.tel ?? null;
    companyOrmEntity.email = companyEntity.email ?? null;
    companyOrmEntity.address = companyEntity.address ?? null;

    if (method === OrmEntityMethod.CREATE) {
      companyOrmEntity.logo = companyEntity.logo ?? null;
      companyOrmEntity.created_at = companyEntity.createdAt ?? new Date(now);
    }
    companyOrmEntity.updated_at = new Date(now);

    return companyOrmEntity;
  }

  toEntity(ormData: CompanyOrmEntity): CompanyEntity {
    const builder = CompanyEntity.builder()
      .setCompanyId(new CompanyId(ormData.id))
      .setName(ormData.name ?? '')
      .setLogo(ormData.logo ?? '')
      .setTel(ormData.tel ?? '')
      .setEmail(ormData.email ?? '')
      .setAddress(ormData.address ?? '')
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at)
      .setDeletedAt(ormData.deleted_at);

    return builder.build();
  }

  toEntityReportReceipt(ormData: CompanyOrmEntity): CompanyEntity {
    const documents = ormData?.documents || [];

    // Get all receipts from documents
    const allReceipts = documents.flatMap((doc: any) => doc.receipts || []);

    // Filter receipts that have id
    const validReceipts = allReceipts.filter((receipt: any) => receipt.id);

    // Count receipt IDs
    const receipt_count = validReceipts.length;

    const total_allocated_amount =
      ormData?.budget_accounts?.reduce((sum: number, budgetAccount: any) => {
        const accountIncreaseBudgets = budgetAccount?.increase_budgets || [];
        const accountAllocatedAmount = accountIncreaseBudgets.reduce(
          (accountSum: number, increaseBudget: any) =>
            accountSum + Number(increaseBudget.allocated_amount || 0),
          0,
        );
        return sum + accountAllocatedAmount;
      }, 0) || 0;

    const total_used_amount =
      ormData?.budget_accounts
        ?.flatMap((ba: any) => ba.budget_items ?? [])
        ?.flatMap((bi: any) => bi.document_transactions ?? [])
        ?.reduce((sum: number, dt: any) => sum + Number(dt.amount ?? 0), 0) ??
      0;

    console.log('receipt_count', receipt_count);
    console.log('total_allocated_amount', total_allocated_amount);
    console.log('total_used_amount', total_used_amount);

    const builder = CompanyEntity.builder()
      .setCompanyId(new CompanyId(ormData.id))
      .setName(ormData.name ?? '')
      .setLogo(ormData.logo ?? '')
      .setTel(ormData.tel ?? '')
      .setEmail(ormData.email ?? '')
      .setAddress(ormData.address ?? '')
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at)
      .setDeletedAt(ormData.deleted_at)
      .setReceiptCount(receipt_count)
      .setTotalAllocated(total_allocated_amount)
      .setTotalUsedAmount(total_used_amount);

    return builder.build();
  }
}
