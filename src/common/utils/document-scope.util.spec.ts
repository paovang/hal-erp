import { applyDocumentCompanyScope } from './document-scope.util';
import { EligiblePersons } from '@src/modules/manage/application/constants/status-key.const';
import { PurchaseRequestType } from '@src/modules/manage/application/dto/query/purchase-request.dto';

/**
 * Fake SelectQueryBuilder that records every andWhere(condition, params) call.
 */
function fakeQuery() {
  const calls: { condition: string; params?: any }[] = [];
  const qb: any = {
    calls,
    andWhere(condition: string, params?: any) {
      calls.push({ condition, params });
      return qb;
    },
  };
  return qb;
}

const base = {
  companyId: 5,
  userId: 9,
  documentAlias: 'documents',
};

describe('applyDocumentCompanyScope', () => {
  it('adds no predicate for super-admin / admin', () => {
    for (const role of [EligiblePersons.SUPER_ADMIN, EligiblePersons.ADMIN]) {
      const q = fakeQuery();
      applyDocumentCompanyScope(q, { ...base, roles: [role] });
      expect(q.calls).toHaveLength(0);
    }
  });

  it('leaves the query untouched when roles is undefined', () => {
    const q = fakeQuery();
    applyDocumentCompanyScope(q, { ...base, roles: undefined });
    expect(q.calls).toHaveLength(0);
  });

  it('company-user → company scope only', () => {
    const q = fakeQuery();
    applyDocumentCompanyScope(q, {
      ...base,
      roles: [EligiblePersons.COMPANY_USER],
    });
    expect(q.calls).toHaveLength(1);
    expect(q.calls[0].condition).toBe('documents.company_id = :scopeCompanyId');
    expect(q.calls[0].params).toEqual({ scopeCompanyId: 5 });
  });

  it('non-admin with no company → scopeCompanyId = -1 (fail-safe)', () => {
    const q = fakeQuery();
    applyDocumentCompanyScope(q, {
      ...base,
      companyId: undefined,
      roles: [EligiblePersons.COMPANY_ADMIN],
    });
    expect(q.calls[0].params).toEqual({ scopeCompanyId: -1 });
  });

  it('general user, no type → company + approver (only_user default)', () => {
    const q = fakeQuery();
    applyDocumentCompanyScope(q, { ...base, roles: ['budget-user'] });
    expect(q.calls.map((c: any) => c.condition)).toEqual([
      'documents.company_id = :scopeCompanyId',
      'document_approver.user_id = :scopeUserId',
    ]);
    expect(q.calls[1].params).toEqual({ scopeUserId: 9 });
  });

  it('general user, type=only_user → company + approver', () => {
    const q = fakeQuery();
    applyDocumentCompanyScope(q, {
      ...base,
      roles: ['budget-user'],
      type: PurchaseRequestType.only_user,
    });
    expect(q.calls.map((c: any) => c.condition)).toEqual([
      'documents.company_id = :scopeCompanyId',
      'document_approver.user_id = :scopeUserId',
    ]);
  });

  it('general user, type=all → company + department (no approver by default)', () => {
    const q = fakeQuery();
    applyDocumentCompanyScope(q, {
      ...base,
      roles: ['budget-user'],
      type: PurchaseRequestType.all,
    });
    expect(q.calls).toHaveLength(2);
    expect(q.calls[0].condition).toBe('documents.company_id = :scopeCompanyId');
    expect(q.calls[1].condition).toContain('departments_approver.id IN');
  });

  it('general user, type=all with approverOnAll → also requires approver', () => {
    const q = fakeQuery();
    applyDocumentCompanyScope(q, {
      ...base,
      roles: ['budget-user'],
      type: PurchaseRequestType.all,
      approverOnAll: true,
    });
    expect(q.calls).toHaveLength(3);
    expect(q.calls[2].condition).toBe(
      'document_approver.user_id = :scopeUserId',
    );
  });

  it('honors a custom documentAlias', () => {
    const q = fakeQuery();
    applyDocumentCompanyScope(q, {
      ...base,
      documentAlias: 'po_documents',
      roles: [EligiblePersons.COMPANY_USER],
    });
    expect(q.calls[0].condition).toBe(
      'po_documents.company_id = :scopeCompanyId',
    );
  });
});
