import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { CreateCommand } from '../create.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ReceiptEntity } from '@src/modules/manage/domain/entities/receipt.entity';
import { HttpException, HttpStatus, Inject } from '@nestjs/common';
import {
  LENGTH_DOCUMENT_CODE,
  LENGTH_RECEIPT_CODE,
  WRITE_DOCUMENT_APPROVER_REPOSITORY,
  WRITE_DOCUMENT_REPOSITORY,
  WRITE_RECEIPT_ITEM_REPOSITORY,
  WRITE_RECEIPT_REPOSITORY,
  WRITE_USER_APPROVAL_REPOSITORY,
  WRITE_USER_APPROVAL_STEP_REPOSITORY,
} from '../../../constants/inject-key.const';
import { ReceiptDataMapper } from '../../../mappers/receipt.mapper';
import { IWriteReceiptRepository } from '@src/modules/manage/domain/ports/output/receipt-repository.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { IWriteDocumentRepository } from '@src/modules/manage/domain/ports/output/document-repository.interface';
import { DocumentDataMapper } from '../../../mappers/document.mapper';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { DepartmentUserOrmEntity } from '@src/common/infrastructure/database/typeorm/department-user.orm';
import { DocumentOrmEntity } from '@src/common/infrastructure/database/typeorm/document.orm';
import { CodeGeneratorUtil } from '@src/common/utils/code-generator.util';
import { DocumentEntityMode } from '@src/common/utils/orm-entity-method.enum';
import { ReceiptItemDataMapper } from '../../../mappers/receipt-item.mapper';
import { IWriteReceiptItemRepository } from '@src/modules/manage/domain/ports/output/receipt-item-repository.interface';
import { PurchaseOrderItemOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-order-item.orm';
import { assertOrThrow } from '@src/common/utils/assert.util';
import { ExchangeRateOrmEntity } from '@src/common/infrastructure/database/typeorm/exchange-rate.orm';
import { CurrencyOrmEntity } from '@src/common/infrastructure/database/typeorm/currency.orm';
import { ApprovalWorkflowOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow.orm';
import { ApprovalWorkflowStepOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow-step.orm';
import {
  EnumPaymentType,
  SelectStatus,
  STATUS_KEY,
} from '../../../constants/status-key.const';
import { handleApprovalStep } from '@src/common/utils/approval-step.utils';
import { IWriteUserApprovalRepository } from '@src/modules/manage/domain/ports/output/user-approval-repository.interface';
import { UserApprovalDataMapper } from '../../../mappers/user-approval.mapper';
import { IWriteUserApprovalStepRepository } from '@src/modules/manage/domain/ports/output/user-approval-step-repository.interface';
import { UserApprovalStepDataMapper } from '../../../mappers/user-approval-step.mapper';
import { IWriteDocumentApproverRepository } from '@src/modules/manage/domain/ports/output/document-approver-repository.interface';
import { DocumentApproverDataMapper } from '../../../mappers/document-approver.mapper';
import { ApprovalDto } from '../../../dto/create/userApprovalStep/update-statue.dto';
import { CreateUserApprovalDto } from '../../../dto/create/userApproval/create.dto';
import { BudgetApprovalRuleOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-approval-rule.orm';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { ReceiptItemOrmEntity } from '@src/common/infrastructure/database/typeorm/receipt.item.orm';
import { ReceiptOrmEntity } from '@src/common/infrastructure/database/typeorm/receipt.orm';
import { VatOrmEntity } from '@src/common/infrastructure/database/typeorm/vat.orm';
import { PurchaseOrderSelectedVendorOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-order-selected-vendor.orm';
import { VendorBankAccountOrmEntity } from '@src/common/infrastructure/database/typeorm/vendor_bank_account.orm';

interface ReceiptInterface {
  receipt_number: string;
  purchase_order_id: number;
  document_id: number;
  received_by: number;
  remark: string;
}

interface ReceiptInterItemInterface {
  receipt_id: number;
  purchase_order_item_id: number;
  quantity: number;
  price: number;
  total: number;
  currency_id: number;
  payment_currency_id: number;
  exchange_rate: number;
  vat: number;
  payment_total: number;
  payment_type: EnumPaymentType;
  remark: string;
}

interface CustomApprovalDto extends ApprovalDto {
  user_approval_id: number;
  // approval_workflow_step_id: number;
  step_number: number;
}

interface CustomUserApprovalDto extends CreateUserApprovalDto {
  status: number;
}

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements IQueryHandler<CreateCommand, ResponseResult<ReceiptEntity>>
{
  constructor(
    @Inject(WRITE_RECEIPT_REPOSITORY)
    private readonly _write: IWriteReceiptRepository,
    private readonly _dataMapper: ReceiptDataMapper,
    // document
    @Inject(WRITE_DOCUMENT_REPOSITORY)
    private readonly _writeD: IWriteDocumentRepository,
    private readonly _dataDMapper: DocumentDataMapper,
    // item
    @Inject(WRITE_RECEIPT_ITEM_REPOSITORY)
    private readonly _writeItem: IWriteReceiptItemRepository,
    private readonly _dataItemMapper: ReceiptItemDataMapper,
    // user approval
    @Inject(WRITE_USER_APPROVAL_REPOSITORY)
    private readonly _writeUserApproval: IWriteUserApprovalRepository,
    private readonly _dataUserApprovalMapper: UserApprovalDataMapper,
    // user approval step
    @Inject(WRITE_USER_APPROVAL_STEP_REPOSITORY)
    private readonly _writeUserApprovalStep: IWriteUserApprovalStepRepository,
    private readonly _dataUserApprovalMapperStep: UserApprovalStepDataMapper,
    // document approver
    @Inject(WRITE_DOCUMENT_APPROVER_REPOSITORY)
    private readonly _writeDocumentApprover: IWriteDocumentApproverRepository,
    private readonly _dataDocumentApproverMapper: DocumentApproverDataMapper,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
    private readonly _userContextService: UserContextService,
    private readonly _codeGeneratorUtil: CodeGeneratorUtil,
  ) {}

  async execute(query: CreateCommand): Promise<ResponseResult<ReceiptEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        const user_id = this.getUserId();

        const department_id = await this.getDepartmentId(
          query.manager,
          user_id,
        );

        const document_number = await this.generateDocumentNumber(
          query.manager,
        );

        const receipt_number = await this.generateReceiptNumber(query.manager);

        const document_id = await this.createDocument(
          query,
          document_number,
          user_id,
          department_id,
          manager,
        );

        const entity = this.createReceiptEntity(
          query,
          receipt_number,
          document_id,
          user_id,
        );
        const responseReceipt = await this._write.create(entity, manager);
        const receipt_id = (responseReceipt as any)._id._value;

        await this.saveItem(query, manager, receipt_id);

        const total = await this.getSumTotal(manager, receipt_id);

        const { a_w_s } = await this.getApprovalWorkflow(
          manager,
          query.dto.document.documentTypeId,
        );

        const ua_id = await this.createUserApproval(document_id, manager);

        const user_approval_step_id = await this.createUserApprovalStep(
          ua_id,
          a_w_s,
          manager,
        );

        await this.handleApprovalStepCall(
          a_w_s,
          total,
          user_id,
          user_approval_step_id,
          manager,
        );

        return responseReceipt;
      },
    );
  }

  // ฟังก์ชันย่อยแต่ละตัว
  private getUserId(): number {
    return this._userContextService.getAuthUser()?.user.id;
  }

  private async getDepartmentId(
    manager: EntityManager,
    user_id: number,
  ): Promise<number> {
    const department = await findOneOrFail(manager, DepartmentUserOrmEntity, {
      user_id,
    });
    return (department as any).department_id;
  }

  private async generateDocumentNumber(
    manager: EntityManager,
  ): Promise<string> {
    return await this._codeGeneratorUtil.generateUniqueCode(
      LENGTH_DOCUMENT_CODE,
      async (generatedCode: string) => {
        try {
          await findOneOrFail(manager, DocumentOrmEntity, {
            document_number: generatedCode,
          });
          return false;
        } catch {
          return true;
        }
      },
      'D',
    );
  }

  private async generateReceiptNumber(manager: EntityManager): Promise<string> {
    return await this._codeGeneratorUtil.generateUniqueCode(
      LENGTH_RECEIPT_CODE,
      async (generatedCode: string) => {
        try {
          await findOneOrFail(manager, ReceiptOrmEntity, {
            receipt_number: generatedCode,
          });
          return false;
        } catch {
          return true;
        }
      },
      'RN',
    );
  }

  private async createDocument(
    query: CreateCommand,
    document_number: string,
    user_id: number,
    department_id: number,
    manager: EntityManager,
  ): Promise<number> {
    const DEntity = this._dataDMapper.toEntity(
      query.dto.document,
      DocumentEntityMode.CREATE,
      document_number,
      user_id,
      department_id,
    );
    const D = await this._writeD.create(DEntity, manager);
    return (D as any)._id._value;
  }

  private createReceiptEntity(
    query: CreateCommand,
    receipt_number: string,
    document_id: number,
    user_id: number,
  ): ReceiptEntity {
    const interface_data: ReceiptInterface = {
      receipt_number: receipt_number,
      purchase_order_id: query.dto.purchase_order_id,
      document_id: document_id,
      received_by: user_id,
      remark: query.dto.remark,
    };
    return this._dataMapper.toEntity(interface_data);
  }

  private async getSumTotal(
    manager: EntityManager,
    receipt_id: number,
  ): Promise<number> {
    const sum_total = await this.sumItemTotal(manager, receipt_id);
    return sum_total?.total ?? 0;
  }

  private async getApprovalWorkflow(
    manager: EntityManager,
    documentTypeId: number,
  ): Promise<{ aw_id: number; a_w_s: any }> {
    const approval_workflow = await findOneOrFail(
      manager,
      ApprovalWorkflowOrmEntity,
      {
        document_type_id: documentTypeId,
      },
    );
    const aw_id = (approval_workflow as any).id;
    const a_w_s = await manager.findOne(ApprovalWorkflowStepOrmEntity, {
      where: { approval_workflow_id: aw_id },
      order: { step_number: 'ASC' },
    });
    return { aw_id, a_w_s };
  }

  private async createUserApproval(
    document_id: number,
    manager: EntityManager,
  ): Promise<number> {
    const merge: CustomUserApprovalDto = {
      documentId: document_id,
      status: STATUS_KEY.PENDING,
    };
    const user_approval_entity = this._dataUserApprovalMapper.toEntity(merge);
    const user_approval = await this._writeUserApproval.create(
      user_approval_entity,
      manager,
    );
    return (user_approval as any)._id._value;
  }

  private async createUserApprovalStep(
    ua_id: number,
    a_w_s: any,
    manager: EntityManager,
  ): Promise<number> {
    const pendingDto: CustomApprovalDto = {
      user_approval_id: ua_id,
      step_number: a_w_s?.step_number ?? 1,
      statusId: STATUS_KEY.PENDING,
      remark: null,
    };
    const aw_step =
      this._dataUserApprovalMapperStep.toEntityForInsert(pendingDto);
    const user_approval_step = await this._writeUserApprovalStep.create(
      aw_step,
      manager,
    );
    return (user_approval_step as any)._id._value;
  }

  private async handleApprovalStepCall(
    a_w_s: any,
    total: number,
    user_id: number,
    user_approval_step_id: number,
    manager: EntityManager,
  ) {
    await handleApprovalStep({
      a_w_s,
      total,
      user_id,
      user_approval_step_id,
      manager,
      dataDocumentApproverMapper: this._dataDocumentApproverMapper,
      writeDocumentApprover: this._writeDocumentApprover,
      getApprover: this.getApprover.bind(this),
    });
  }

  private async checkCurrency(
    currency: number,
    manager: EntityManager,
  ): Promise<void> {
    await findOneOrFail(manager, CurrencyOrmEntity, {
      id: currency,
    });
  }

  private async getCurrency(
    currency: number,
    manager: EntityManager,
  ): Promise<CurrencyOrmEntity> {
    return await findOneOrFail(manager, CurrencyOrmEntity, {
      id: currency,
    });
  }

  private async getApprover(
    sum_total: number,
    manager: EntityManager,
  ): Promise<BudgetApprovalRuleOrmEntity[]> {
    const budgetApprovalRule = await manager
      .getRepository(BudgetApprovalRuleOrmEntity)
      .createQueryBuilder('rule')
      .where(':sum_total BETWEEN rule.min_amount AND rule.max_amount', {
        sum_total,
      })
      .getMany();

    if (budgetApprovalRule.length > 0) {
      return budgetApprovalRule;
    } else {
      throw new ManageDomainException(
        'errors.set_budget_approver_rule',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async sumItemTotal(manage: EntityManager, receipt_id: number) {
    return await manage
      .getRepository(ReceiptItemOrmEntity)
      .createQueryBuilder('item')
      .select('SUM(item.total) AS total')
      .where('item.receipt_id = :receipt_id', { receipt_id: receipt_id })
      .getRawOne();
  }

  private async saveItem(
    query: CreateCommand,
    manager: EntityManager,
    receipt_id: number,
  ): Promise<void> {
    for (const item of query.dto.receipt_items) {
      // await this.checkCurrency(item.currency_id, manager);
      await this.checkCurrency(item.payment_currency_id, manager);
      const amount = await this.getVat(manager);

      const purchase_order_item = await manager.findOne(
        PurchaseOrderItemOrmEntity,
        {
          where: {
            id: item.purchase_order_item_id,
          },
        },
      );

      assertOrThrow(
        purchase_order_item,
        'errors.not_found',
        HttpStatus.NOT_FOUND,
      );

      const order_item_select_vendor = await manager.findOne(
        PurchaseOrderSelectedVendorOrmEntity,
        {
          where: {
            purchase_order_item_id: item.purchase_order_item_id,
          },
        },
      );
      assertOrThrow(
        order_item_select_vendor,
        'errors.not_found',
        HttpStatus.NOT_FOUND,
      );

      const vendor_bank_account = await manager.findOne(
        VendorBankAccountOrmEntity,
        {
          where: {
            id: order_item_select_vendor?.vendor_bank_account_id,
          },
        },
      );

      assertOrThrow(
        vendor_bank_account,
        'errors.not_found',
        HttpStatus.NOT_FOUND,
      );

      const exchange_rate = await manager.findOne(ExchangeRateOrmEntity, {
        where: {
          from_currency_id: vendor_bank_account?.currency_id,
          to_currency_id: item.payment_currency_id,
          is_active: true,
        },
      });

      assertOrThrow(exchange_rate, 'errors.not_found', HttpStatus.NOT_FOUND);

      const currency = await this.getCurrency(
        exchange_rate!.from_currency_id,
        manager,
      );
      const payment_currency = await this.getCurrency(
        exchange_rate!.to_currency_id,
        manager,
      );

      let payment_total = 0;
      let vat = 0;
      let sum_total = 0;
      const quantity = purchase_order_item?.quantity ?? 0;
      const price = purchase_order_item?.price ?? 0;
      const get_total = purchase_order_item?.total ?? 0;
      const rate = exchange_rate?.rate ?? 0;

      if (purchase_order_item?.is_vat === SelectStatus.TRUE) {
        vat = amount ?? 0;
        const vat_total = get_total * (vat / 100);
        sum_total = get_total + vat_total;
      } else {
        vat = 0;
        sum_total = get_total;
      }

      if (currency.code === 'USD' && payment_currency.code === 'LAK') {
        payment_total = sum_total / rate;
      } else if (currency.code === 'LAK' && payment_currency.code === 'USD') {
        payment_total = sum_total * rate;
      } else if (currency.code === 'LAK' && payment_currency.code === 'LAK') {
        payment_total = sum_total * rate;
      } else if (currency.code === 'THB' && payment_currency.code === 'LAK') {
        payment_total = sum_total / rate;
      } else if (currency.code === 'LAK' && payment_currency.code === 'THB') {
        payment_total = sum_total * rate;
      } else if (currency.code === 'THB' && payment_currency.code === 'USD') {
        payment_total = sum_total * rate;
      } else if (currency.code === 'USD' && payment_currency.code === 'THB') {
        payment_total = sum_total / rate;
      } else if (currency.code === 'USD' && payment_currency.code === 'USD') {
        payment_total = sum_total * rate;
      } else if (currency.code === 'THB' && payment_currency.code === 'THB') {
        payment_total = sum_total * rate;
      }

      const interface_item: ReceiptInterItemInterface = {
        receipt_id: receipt_id,
        purchase_order_item_id: item.purchase_order_item_id,
        quantity: quantity,
        price: price,
        total: get_total,
        currency_id: vendor_bank_account?.currency_id ?? 0,
        payment_currency_id: item.payment_currency_id,
        exchange_rate: rate,
        vat: vat,
        payment_total: payment_total,
        payment_type: item.payment_type,
        remark: item.remark,
      };

      const itemEntity = this._dataItemMapper.toEntity(interface_item);
      await this._writeItem.create(itemEntity, manager);
    }
  }

  private async getVat(manager: EntityManager): Promise<number> {
    const vat = await manager.createQueryBuilder(VatOrmEntity, 'vat').getOne();
    if (!vat) {
      throw new HttpException('errors.not_found', HttpStatus.NOT_FOUND);
    }
    const { amount } = vat;
    return amount;
  }
}
