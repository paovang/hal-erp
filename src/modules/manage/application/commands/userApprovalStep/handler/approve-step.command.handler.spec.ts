import { ApproveStepCommandHandler } from './approve-step.command.handler';
import { ExchangeRateOrmEntity } from '@src/common/infrastructure/database/typeorm/exchange-rate.orm';
import { BudgetItemOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-item.orm';
import { PurchaseOrderItemOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-order-item.orm';
import { PurchaseRequestItemOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-request-item.orm';
import { ReceiptItemOrmEntity } from '@src/common/infrastructure/database/typeorm/receipt.item.orm';
import { PurchaseOrderSelectedVendorOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-order-selected-vendor.orm';
import { VendorBankAccountOrmEntity } from '@src/common/infrastructure/database/typeorm/vendor_bank_account.orm';

interface FakeDb {
  pos: Record<number, any>;
  prs: Record<number, any>;
  receiptItems: Record<number, any>;
  rates: Array<{ from_currency_id: number; to_code: string; rate: string }>;
  budgetItems: Record<number, any>;
  vendors: Record<number, any>;
  vendorBanks: Record<number, any>;
  documentTransactions: Array<any>;
  updates: {
    po: Array<{ id: number; patch: any }>;
    pr: Array<{ id: number; patch: any }>;
    receipt: Array<{ id: number; patch: any }>;
  };
}

function makeManager(db: FakeDb) {
  return {
    findOne: jest.fn(async (entity: any, opts: any) => {
      if (entity === BudgetItemOrmEntity)
        return db.budgetItems[opts.where.id] ?? null;
      if (entity === PurchaseOrderItemOrmEntity)
        return db.pos[opts.where.id] ?? null;
      if (entity === PurchaseOrderSelectedVendorOrmEntity)
        return db.vendors[opts.where.purchase_order_item_id] ?? null;
      if (entity === VendorBankAccountOrmEntity)
        return db.vendorBanks[opts.where.id] ?? null;
      if (entity === PurchaseRequestItemOrmEntity)
        return db.prs[opts.where.id] ?? null;
      return null;
    }),
    findOneOrFail: jest.fn(async (entity: any, opts: any) => {
      if (entity === PurchaseOrderItemOrmEntity) {
        const r = db.pos[opts.where.id];
        if (!r) throw new Error('po not found');
        return r;
      }
      throw new Error('unmocked findOneOrFail');
    }),
    exists: jest.fn(async (_entity: any, opts: any) => {
      return db.documentTransactions.some(
        (t) =>
          t.document_id === opts.where.document_id &&
          t.budget_item_id === opts.where.budget_item_id,
      );
    }),
    update: jest.fn(async (entity: any, where: any, patch: any) => {
      if (entity === PurchaseOrderItemOrmEntity)
        db.updates.po.push({ id: where.id, patch });
      else if (entity === PurchaseRequestItemOrmEntity)
        db.updates.pr.push({ id: where.id, patch });
      else if (entity === ReceiptItemOrmEntity)
        db.updates.receipt.push({ id: where.id, patch });
    }),
    getRepository: jest.fn((entity: any) => ({
      find: jest.fn(async (opts: any) => {
        if (entity === ExchangeRateOrmEntity) {
          return db.rates
            .filter((r) => r.to_code === opts.where?.to_currency?.code)
            .map((r) => ({
              from_currency: { id: r.from_currency_id },
              to_currency: { code: r.to_code },
              rate: r.rate,
            }));
        }
        return [];
      }),
    })),
  } as any;
}

function makeHandler(): {
  handler: ApproveStepCommandHandler;
  writeTransactionCreate: jest.Mock;
} {
  const writeTransactionCreate = jest.fn(async () => undefined);
  const noop = jest.fn();
  const handler = new (ApproveStepCommandHandler as any)(
    {}, // _write
    { toEntity: noop }, // _dataMapper
    {}, // _writeUA
    { toEntityUpdate: noop }, // _dataUAMapper
    { getAuthUser: noop }, // _userContextService
    {}, // _writeDocumentApprover
    { toEntity: noop }, // _dataDocumentApproverMapper
    { toEntity: noop }, // _userDataAccessMapper
    {}, // _writeDocumentAttachment
    { toEntity: noop }, // _dataDocumentAttachmentMapper
    {}, // _writeReceipt
    { toEntity: noop }, // _dataReceiptMapper
    {}, // _writePoItem
    { toEntityForUpdate: noop }, // _dataPoItemMapper
    { create: writeTransactionCreate }, // _writeTransaction
    {
      toEntity: jest.fn((data) => data),
    }, // _dataTransactionMapper
    { getTotal: noop, calculate: noop }, // _readBudget
    { runInTransaction: noop }, // _transactionManagerService
    {}, // _dataSource
    {}, // _optimizeService
    {}, // _amazonS3ServiceKey
    {
      generateUniqueCode: jest.fn(async () => 'TN-XXXX'),
    }, // _codeGeneratorUtil
  );
  return { handler, writeTransactionCreate };
}

function freshDb(): FakeDb {
  return {
    pos: {},
    prs: {},
    receiptItems: {},
    rates: [],
    budgetItems: {},
    vendors: {},
    vendorBanks: {},
    documentTransactions: [],
    updates: { po: [], pr: [], receipt: [] },
  };
}

const USD_ID = 2;
const THB_ID = 3;
const LAK_ID = 1;

describe('ApproveStepCommandHandler.insertDataInTransaction', () => {
  it('refreshes PR/PO/receipt with the same rate and DocumentTransaction.amount = Σ(total_in_lak + vat_in_lak)', async () => {
    const db = freshDb();
    db.budgetItems[10] = { id: 10 };
    db.vendors[101] = { vendor_bank_account_id: 201 };
    db.vendorBanks[201] = { id: 201 };
    db.prs[1001] = { id: 1001, total_price: 100 };
    db.pos[101] = {
      id: 101,
      total: 200,
      vat: 20,
      currency: { id: USD_ID, code: 'USD' },
      purchase_request_item_id: 1001,
    };
    db.rates = [{ from_currency_id: USD_ID, to_code: 'LAK', rate: '21000' }];

    const receipt = {
      id: 5000,
      document_id: 9000,
      receipt_items: [
        {
          id: 5001,
          purchase_order_item_id: 101,
          purchase_order_items: { budget_item_id: 10 },
        },
      ],
    } as any;

    const manager = makeManager(db);
    const { handler, writeTransactionCreate } = makeHandler();

    await (handler as any).insertDataInTransaction(manager, receipt);

    expect(db.updates.po).toEqual([
      {
        id: 101,
        patch: {
          rate: '21000',
          total_in_lak: '4200000.00',
          vat_in_lak: '420000.00',
        },
      },
    ]);
    expect(db.updates.pr).toEqual([
      { id: 1001, patch: { rate: '21000', total_in_lak: '2100000.00' } },
    ]);
    expect(db.updates.receipt).toEqual([
      { id: 5001, patch: { rate: 21000, payment_total: 4620000 } },
    ]);

    const txArg = (writeTransactionCreate.mock.calls[0] ?? [])[0];
    expect(txArg.amount).toBeCloseTo(4200000 + 420000, 2);
  });

  it('uses each item own currency rate for mixed-currency PO in one budget group', async () => {
    const db = freshDb();
    db.budgetItems[10] = { id: 10 };
    db.vendors[101] = { vendor_bank_account_id: 201 };
    db.vendorBanks[201] = { id: 201 };
    db.prs[1001] = { id: 1001, total_price: 100 };
    db.prs[1002] = { id: 1002, total_price: 50 };
    db.pos[101] = {
      id: 101,
      total: 200,
      vat: 20,
      currency: { id: USD_ID, code: 'USD' },
      purchase_request_item_id: 1001,
    };
    db.pos[102] = {
      id: 102,
      total: 100,
      vat: 0,
      currency: { id: THB_ID, code: 'THB' },
      purchase_request_item_id: 1002,
    };
    db.rates = [
      { from_currency_id: USD_ID, to_code: 'LAK', rate: '21000' },
      { from_currency_id: THB_ID, to_code: 'LAK', rate: '600' },
    ];

    const receipt = {
      id: 5000,
      document_id: 9000,
      receipt_items: [
        {
          id: 5001,
          purchase_order_item_id: 101,
          purchase_order_items: { budget_item_id: 10 },
        },
        {
          id: 5002,
          purchase_order_item_id: 102,
          purchase_order_items: { budget_item_id: 10 },
        },
      ],
    } as any;

    const manager = makeManager(db);
    const { handler, writeTransactionCreate } = makeHandler();

    await (handler as any).insertDataInTransaction(manager, receipt);

    // PO item 101 at 21000, item 102 at 600 — different rates per item
    expect(db.updates.po.find((u) => u.id === 101)?.patch.rate).toBe('21000');
    expect(db.updates.po.find((u) => u.id === 102)?.patch.rate).toBe('600');
    // Linked PR items inherit each PO's own rate
    expect(db.updates.pr.find((u) => u.id === 1001)?.patch.rate).toBe('21000');
    expect(db.updates.pr.find((u) => u.id === 1002)?.patch.rate).toBe('600');

    // Σ total_in_lak + Σ vat_in_lak
    // = 200*21000 + 20*21000 + 100*600 + 0*600
    // = 4200000 + 420000 + 60000 + 0 = 4680000
    const txArg = (writeTransactionCreate.mock.calls[0] ?? [])[0];
    expect(txArg.amount).toBeCloseTo(4680000, 2);
  });

  it('short-circuits to rate=1 when PO item currency is LAK', async () => {
    const db = freshDb();
    db.budgetItems[10] = { id: 10 };
    db.vendors[101] = { vendor_bank_account_id: 201 };
    db.vendorBanks[201] = { id: 201 };
    db.prs[1001] = { id: 1001, total_price: 100 };
    db.pos[101] = {
      id: 101,
      total: 500,
      vat: 50,
      currency: { id: LAK_ID, code: 'LAK' },
      purchase_request_item_id: 1001,
    };
    db.rates = []; // no exchange rates needed

    const receipt = {
      id: 5000,
      document_id: 9000,
      receipt_items: [
        {
          id: 5001,
          purchase_order_item_id: 101,
          purchase_order_items: { budget_item_id: 10 },
        },
      ],
    } as any;

    const manager = makeManager(db);
    const { handler, writeTransactionCreate } = makeHandler();

    await (handler as any).insertDataInTransaction(manager, receipt);

    expect(db.updates.po[0].patch).toEqual({
      rate: '1',
      total_in_lak: '500.00',
      vat_in_lak: '50.00',
    });
    expect(db.updates.pr[0].patch).toEqual({
      rate: '1',
      total_in_lak: '100.00',
    });
    const txArg = (writeTransactionCreate.mock.calls[0] ?? [])[0];
    expect(txArg.amount).toBe(550);
  });

  it('throws BadRequestException when no exchange rate configured for non-LAK currency', async () => {
    const db = freshDb();
    db.budgetItems[10] = { id: 10 };
    db.vendors[101] = { vendor_bank_account_id: 201 };
    db.vendorBanks[201] = { id: 201 };
    db.pos[101] = {
      id: 101,
      total: 200,
      vat: 0,
      currency: { id: 99, code: 'CNY' },
      purchase_request_item_id: null,
    };
    db.rates = []; // no rate for CNY

    const receipt = {
      id: 5000,
      document_id: 9000,
      receipt_items: [
        {
          id: 5001,
          purchase_order_item_id: 101,
          purchase_order_items: { budget_item_id: 10 },
        },
      ],
    } as any;

    const manager = makeManager(db);
    const { handler, writeTransactionCreate } = makeHandler();

    await expect(
      (handler as any).insertDataInTransaction(manager, receipt),
    ).rejects.toThrow(/Currency 99 to LAK is not found/);

    expect(writeTransactionCreate).not.toHaveBeenCalled();
  });

  it('skips group when DocumentTransaction already exists (idempotency)', async () => {
    const db = freshDb();
    db.budgetItems[10] = { id: 10 };
    db.vendors[101] = { vendor_bank_account_id: 201 };
    db.vendorBanks[201] = { id: 201 };
    db.prs[1001] = { id: 1001, total_price: 100 };
    db.pos[101] = {
      id: 101,
      total: 200,
      vat: 20,
      currency: { id: USD_ID, code: 'USD' },
      purchase_request_item_id: 1001,
    };
    db.rates = [{ from_currency_id: USD_ID, to_code: 'LAK', rate: '21000' }];
    db.documentTransactions = [{ document_id: 9000, budget_item_id: 10 }];

    const receipt = {
      id: 5000,
      document_id: 9000,
      receipt_items: [
        {
          id: 5001,
          purchase_order_item_id: 101,
          purchase_order_items: { budget_item_id: 10 },
        },
      ],
    } as any;

    const manager = makeManager(db);
    const { handler, writeTransactionCreate } = makeHandler();

    await (handler as any).insertDataInTransaction(manager, receipt);

    expect(db.updates.po).toEqual([]);
    expect(db.updates.pr).toEqual([]);
    expect(db.updates.receipt).toEqual([]);
    expect(writeTransactionCreate).not.toHaveBeenCalled();
  });
});
