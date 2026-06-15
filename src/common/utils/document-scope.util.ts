import { SelectQueryBuilder } from 'typeorm';
import { EligiblePersons } from '@src/modules/manage/application/constants/status-key.const';
import { PurchaseRequestType } from '@src/modules/manage/application/dto/query/purchase-request.dto';

export interface DocumentScopeOptions {
  roles?: string[];
  companyId?: number;
  userId?: number;
  type?: PurchaseRequestType;
  /** Alias of the joined documents table (e.g. 'documents' | 'po_documents' | 'doc'). */
  documentAlias: string;
  approverAlias?: string;
  departmentAlias?: string;
  /** When type=all, also require the caller to be an approver (receipt parity). */
  approverOnAll?: boolean;
}

/**
 * Enforce company-scoped visibility on a document list/export/status query.
 *
 * Rules:
 *  - admin / super-admin       → unrestricted (no predicate added).
 *  - any other (non-admin)     → always scoped to their own company. A missing
 *                                company resolves to -1 (matches nothing) so the
 *                                caller sees nothing, never everything.
 *  - company-admin/company-user → whole company (no further narrowing).
 *  - general user              → narrowed within the company by `type`; a missing
 *                                `type` defaults to `only_user` (approver only).
 *
 * Bound params use unique names (`scopeCompanyId`, `scopeUserId`) to avoid
 * clashing with other predicates already on the builder.
 */
export function applyDocumentCompanyScope(
  query: SelectQueryBuilder<any>,
  opts: DocumentScopeOptions,
): SelectQueryBuilder<any> {
  const {
    roles,
    companyId,
    userId,
    type,
    documentAlias,
    approverAlias = 'document_approver',
    departmentAlias = 'departments_approver',
    approverOnAll = false,
  } = opts;

  // No role context → leave the query as the caller built it.
  if (!roles) return query;

  // Admins see everything.
  if (
    roles.includes(EligiblePersons.ADMIN) ||
    roles.includes(EligiblePersons.SUPER_ADMIN)
  ) {
    return query;
  }

  // Non-admins are ALWAYS company-scoped (fail-safe to nothing when no company).
  query.andWhere(`${documentAlias}.company_id = :scopeCompanyId`, {
    scopeCompanyId: companyId ?? -1,
  });

  // Company-admin / company-user see all documents in their company.
  if (
    roles.includes(EligiblePersons.COMPANY_ADMIN) ||
    roles.includes(EligiblePersons.COMPANY_USER)
  ) {
    return query;
  }

  // General users: narrow within the company. Missing type → strictest (only_user).
  const effectiveType = type ?? PurchaseRequestType.only_user;
  if (effectiveType === PurchaseRequestType.all) {
    query.andWhere(
      `${departmentAlias}.id IN (
        SELECT du.department_id
        FROM department_users du
        WHERE du.user_id = :scopeUserId
      )`,
      { scopeUserId: userId },
    );
    if (approverOnAll) {
      query.andWhere(`${approverAlias}.user_id = :scopeUserId`, {
        scopeUserId: userId,
      });
    }
  } else {
    query.andWhere(`${approverAlias}.user_id = :scopeUserId`, {
      scopeUserId: userId,
    });
  }

  return query;
}
