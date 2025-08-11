// vat
export const VAT_RATE = 10;

export const STATUS_KEY = {
  CANCELLED: 4,
  APPROVED: 2,
  REJECTED: 3,
  PENDING: 1,
};

export enum EnumType {
  BUDGET_ITEM_DETAIL = 'budget_item_detail',
  VENDOR = 'vendor',
}

export enum SelectStatus {
  FALSE = 'false',
  TRUE = 'true',
}

// payment type
export enum EnumPaymentType {
  CASH = 'cash',
  TRANSFER = 'transfer',
}

// pr or po
export enum EnumPrOrPo {
  PO = 'po', // purchase order
  PR = 'pr', // purchase request
  R = 'r', // receipt
}

export enum EnumWorkflowStep {
  DEPARTMENT_HEAD = 'department_head',
  SPECIFIC_USER = 'specific_user',
  LINE_MANAGER = 'line_manager',
  DEPARTMENT = 'department',
  CONDITION = 'condition',
}

export enum EnumStatus {
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PENDING = 'pending',
  WATING = 'wating',
}

export enum EligiblePersons {
  DEPARTMENT_HEAD = 'department_head',
  LINE_MANAGER = 'line_manager',
  SUPER_ADMIN = 'super-admin',
  ADMIN = 'admin',
}

// document transaction
export enum EnumDocumentTransactionType {
  COMMIT = 'commit',
  RELEASE = 'release',
}

// budget item detail type
export enum EnumBudgetItemDetailType {
  ADD = 'add',
  SPEND = 'spend',
}

// budget type
export enum EnumBudgetType {
  EXPENDITURE = 'expenditure',
  ADVANCE = 'advance',
}

// request approval type
export enum EnumRequestApprovalType {
  PR = 'PR',
  PO = 'PO',
  RC = 'RC',
}
