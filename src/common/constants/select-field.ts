// select purchase orders
export const selectPurchaseOrderItems = [
  'purchase_order_items.id',
  'purchase_order_items.purchase_order_id',
  'purchase_order_items.purchase_request_item_id',
  'purchase_order_items.budget_item_id',
  'purchase_order_items.remark',
  'purchase_order_items.price',
  'purchase_order_items.quantity',
  'purchase_order_items.total',
  'purchase_order_items.is_vat',
  'purchase_order_items.created_at',
  'purchase_order_items.updated_at',
];

// select purchase order selected vendors
export const selectPurchaseOrderSelectedVendors = [
  'purchase_order_selected_vendors.id',
  'purchase_order_selected_vendors.purchase_order_item_id',
  'purchase_order_selected_vendors.vendor_id',
  'purchase_order_selected_vendors.vendor_bank_account_id',
  'purchase_order_selected_vendors.filename',
  'purchase_order_selected_vendors.reason',
  'purchase_order_selected_vendors.is_selected',
  'purchase_order_selected_vendors.created_at',
  'purchase_order_selected_vendors.updated_at',
];

// select quotes
// export const selectQuotes = [
//   'quotes.id',
//   'quotes.purchase_order_item_id',
//   'quotes.vendor_id',
//   'quotes.price',
//   'quotes.total',
//   'quotes.is_selected',
//   'quotes.created_at',
//   'quotes.updated_at',
// ];

// select purchase requests
export const selectPurchaseRequests = [
  'purchase_requests.id',
  'purchase_requests.document_id',
  'purchase_requests.pr_number',
  'purchase_requests.requested_date',
  'purchase_requests.expired_date',
  'purchase_requests.purposes',
  'purchase_requests.created_at',
  'purchase_requests.updated_at',
];

// select documents
export const selectDocuments = [
  'documents.id',
  'documents.document_number',
  'documents.title',
  'documents.description',
  'documents.total_amount',
  'documents.department_id',
  'documents.document_type_id',
  'documents.requester_id',
  'documents.created_at',
  'documents.updated_at',
];

// select document types
export const selectDocumentTypes = [
  'document_types.id',
  'document_types.code',
  'document_types.name',
  'document_types.created_at',
  'document_types.updated_at',
];

// select users
export const selectUsers = [
  'users.id',
  'users.username',
  'users.email',
  'users.tel',
  'users.created_at',
  'users.updated_at',
  'users.deleted_at',
];

// increase_budget_details
export const selectIncreaseBudgetDetails = [
  'details.id',
  'details.increase_budget_id',
  'details.budget_item_id',
  'details.allocated_amount',
  'details.created_at',
  'details.updated_at',
  'details.deleted_at',
];

// select user signatures
export const selectUserSignatures = [
  'user_signatures.id',
  'user_signatures.user_id',
  'user_signatures.signature_file',
];

// select departments
export const selectDepartments = [
  'departments.id',
  'departments.name',
  'departments.code',
  'departments.created_at',
  'departments.updated_at',
];

// select budget account
export const selectBudgetAccounts = [
  'budget_accounts.id',
  'budget_accounts.code',
  'budget_accounts.name',
  'budget_accounts.fiscal_year',
  // 'budget_accounts.allocated_amount',
  'budget_accounts.department_id',
  'budget_accounts.type',
  'budget_accounts.created_at',
  'budget_accounts.updated_at',
];

// increase_budget_files
export const selectIncreaseBudgetFiles = [
  'increase_budget_files.id',
  'increase_budget_files.increase_budget_id',
  'increase_budget_files.file_name',
  'increase_budget_files.created_at',
  'increase_budget_files.updated_at',
];

// select department users
export const selectDepartmentUsers = [
  'department_users.id',
  'department_users.department_id',
  'department_users.user_id',
  'department_users.position_id',
];

// select positions
export const selectPositions = ['positions.id', 'positions.name'];

// select purchase request items
export const selectPurchaseRequestItems = [
  'purchase_request_items.id',
  'purchase_request_items.purchase_request_id',
  'purchase_request_items.title',
  'purchase_request_items.file_name',
  'purchase_request_items.quantity',
  'purchase_request_items.unit_id',
  'purchase_request_items.price',
  'purchase_request_items.total_price',
  'purchase_request_items.remark',
  'purchase_request_items.created_at',
  'purchase_request_items.updated_at',
];

// select units
export const selectUnits = [
  'units.id',
  'units.name',
  'units.created_at',
  'units.updated_at',
];

// select request items
export const selectRequestItems = [
  'request_items.id',
  'request_items.purchase_request_id',
  'request_items.title',
  'request_items.file_name',
  'request_items.quantity',
  'request_items.unit_id',
  'request_items.price',
  'request_items.total_price',
  'request_items.remark',
  'request_items.created_at',
  'request_items.updated_at',
];

// select request item units
export const selectRequestItemUnits = [
  'request_item_unit.id',
  'request_item_unit.name',
  'request_item_unit.created_at',
  'request_item_unit.updated_at',
];

// select budget item details
export const selectBudgetItemDetails = [
  'budget_item_details.id',
  'budget_item_details.budget_item_id',
  'budget_item_details.name',
  'budget_item_details.province_id',
  'budget_item_details.allocated_amount',
  'budget_item_details.description',
  'budget_item_details.created_at',
  'budget_item_details.updated_at',
];

// select budget items
export const selectBudgetItems = [
  'budget_items.id',
  'budget_items.budget_account_id',
  'budget_items.name',
  // 'budget_items.allocated_amount',
  'budget_items.created_at',
  'budget_items.updated_at',
];

// select provinces
export const selectProvinces = [
  'provinces.id',
  'provinces.name',
  'provinces.created_at',
  'provinces.updated_at',
];

// select vendor
export const selectVendors = [
  'vendors.id',
  'vendors.name',
  'vendors.contact_info',
  'vendors.created_at',
  'vendors.updated_at',
];

// currencies
export const selectCurrencies = [
  'currencies.id',
  'currencies.code',
  'currencies.name',
  'currencies.created_at',
  'currencies.updated_at',
];

// bank_account_currency
export const selectBankAccountCurrencies = [
  'bank_account_currency.id',
  'bank_account_currency.code',
  'bank_account_currency.name',
  'bank_account_currency.created_at',
  'bank_account_currency.updated_at',
];

// select document approver
export const selectDocumentApprover = [
  'document_approver.id',
  'document_approver.user_approval_step_id',
  'document_approver.user_id',
  'document_approver.created_at',
  'document_approver.updated_at',
];

//  select doc_approver user
export const selectDocApproverUser = [
  'doc_approver_user.id',
  'doc_approver_user.username',
  'doc_approver_user.email',
  'doc_approver_user.tel',
  'doc_approver_user.created_at',
  'doc_approver_user.updated_at',
];

// select doc_dept_user
export const selectDocDeptUser = [
  'doc_dept_user.id',
  'doc_dept_user.department_id',
  'doc_dept_user.position_id',
  'doc_dept_user.user_id',
  'doc_dept_user.created_at',
  'doc_dept_user.updated_at',
];

// select departments_approver
export const selectDepartmentsApprover = [
  'departments_approver.id',
  'departments_approver.code',
  'departments_approver.name',
  'departments_approver.created_at',
  'departments_approver.updated_at',
];

export const selectSelectedVendors = [
  'selected_vendors.id',
  'selected_vendors.name',
  'selected_vendors.contact_info',
  'selected_vendors.created_at',
  'selected_vendors.updated_at',
];

// currency
export const selectCurrency = [
  'currency.id',
  'currency.code',
  'currency.name',
  'currency.created_at',
  'currency.updated_at',
];

// vendor_bank_accounts
export const selectVendorBankAccounts = [
  'vendor_bank_accounts.id',
  'vendor_bank_accounts.vendor_id',
  'vendor_bank_accounts.currency_id',
  'vendor_bank_accounts.bank_id',
  'vendor_bank_accounts.account_name',
  'vendor_bank_accounts.account_number',
  'vendor_bank_accounts.is_selected',
  'vendor_bank_accounts.created_at',
  'vendor_bank_accounts.updated_at',
];

// banks
export const selectBanks = [
  'bank.id',
  'bank.name',
  'bank.short_name',
  'bank.logo',
  'bank.created_at',
  'bank.updated_at',
];

// user_approvals
export const selectUserApprovals = [
  'user_approvals.id',
  'user_approvals.document_id',
  'user_approvals.status_id',
  'user_approvals.created_at',
  'user_approvals.updated_at',
];

// document_statuses
export const selectDocumentStatuses = [
  'document_statuses.id',
  'document_statuses.name',
  'document_statuses.created_at',
  'document_statuses.updated_at',
];

// user_approval_steps
export const selectUserApprovalSteps = [
  'user_approval_steps.id',
  'user_approval_steps.user_approval_id',
  'user_approval_steps.step_number',
  'user_approval_steps.approver_id',
  'user_approval_steps.approved_at',
  'user_approval_steps.status_id',
  'user_approval_steps.remark',
  'user_approval_steps.requires_file_upload',
  'user_approval_steps.is_otp',
  'user_approval_steps.created_at',
  'user_approval_steps.updated_at',
];

// approver
export const selectApprover = [
  'approver.id',
  'approver.username',
  'approver.email',
  'approver.tel',
  'approver.created_at',
  'approver.updated_at',
];

// approver_user_signatures
export const selectApproverUserSignatures = [
  'approver_user_signatures.id',
  'approver_user_signatures.user_id',
  'approver_user_signatures.signature_file',
];

// status
export const selectStatus = [
  'status.id',
  'status.name',
  'status.created_at',
  'status.updated_at',
];

// department_user_approvers
export const selectDepartmentUserApprovers = [
  'department_user_approver.id',
  'department_user_approver.department_id',
  'department_user_approver.position_id',
  'department_user_approver.user_id',
  'department_user_approver.created_at',
  'department_user_approver.updated_at',
];

// position_approver
export const selectPositionApprover = [
  'position_approver.id',
  'position_approver.name',
  'position_approver.created_at',
  'position_approver.updated_at',
];

// approval_workflow_steps
export const selectApprovalWorkflowSteps = [
  'approval_workflow_steps.id',
  'approval_workflow_steps.approval_workflow_id',
  'approval_workflow_steps.step_name',
  'approval_workflow_steps.step_number',
  'approval_workflow_steps.department_id',
  'approval_workflow_steps.user_id',
  'approval_workflow_steps.type',
  'approval_workflow_steps.requires_file_upload',
  'approval_workflow_steps.created_at',
  'approval_workflow_steps.updated_at',
];

// workflow_steps_department
export const selectWorkflowStepsDepartment = [
  'workflow_steps_department.id',
  'workflow_steps_department.code',
  'workflow_steps_department.name',
  'workflow_steps_department.created_at',
  'workflow_steps_department.updated_at',
];

// po_documents
export const selectPoDocuments = [
  'po_documents.id',
  'po_documents.document_number',
  'po_documents.title',
  'po_documents.description',
  'po_documents.total_amount',
  'po_documents.department_id',
  'po_documents.document_type_id',
  'po_documents.requester_id',
  'po_documents.created_at',
  'po_documents.updated_at',
];

// po_departments
export const selectPoDepartments = [
  'po_departments.id',
  'po_departments.code',
  'po_departments.name',
  'po_departments.created_at',
  'po_departments.updated_at',
];

// po_users
export const selectPoUsers = [
  'po_users.id',
  'po_users.username',
  'po_users.email',
  'po_users.tel',
  'po_users.created_at',
  'po_users.updated_at',
];

// po_document_types
export const selectPoDocumentTypes = [
  'po_document_types.id',
  'po_document_types.code',
  'po_document_types.name',
  'po_document_types.created_at',
  'po_document_types.updated_at',
];

// po_user_signatures
export const selectPoUserSignatures = [
  'po_user_signatures.id',
  'po_user_signatures.user_id',
  'po_user_signatures.signature_file',
  'po_user_signatures.created_at',
  'po_user_signatures.updated_at',
];

// po_department_users
export const selectPoDepartmentUsers = [
  'po_department_users.id',
  'po_department_users.department_id',
  'po_department_users.user_id',
  'po_department_users.created_at',
  'po_department_users.updated_at',
];

// po_positions
export const selectPoPositions = [
  'po_positions.id',
  'po_positions.name',
  'po_positions.created_at',
  'po_positions.updated_at',
];

// receipt item
export const selectReceiptItems = [
  'receipt_items.id',
  'receipt_items.receipt_id',
  'receipt_items.purchase_order_item_id',
  'receipt_items.quantity',
  'receipt_items.price',
  'receipt_items.total',
  'receipt_items.currency_id',
  'receipt_items.payment_currency_id',
  'receipt_items.exchange_rate',
  'receipt_items.vat',
  'receipt_items.payment_total',
  'receipt_items.payment_type',
  'receipt_items.remark',
  'receipt_items.created_at',
  'receipt_items.updated_at',
];

// receipt by
export const selectReceiptBy = [
  'receipt_by.id',
  'receipt_by.username',
  'receipt_by.email',
  'receipt_by.tel',
  'receipt_by.created_at',
  'receipt_by.updated_at',
];

// created by
export const selectCreatedBy = [
  'created_by.id',
  'created_by.username',
  'created_by.email',
  'created_by.tel',
  'created_by.created_at',
  'created_by.updated_at',
];

// select document attachments
export const selectDocumentAttachments = [
  'document_attachments.id',
  'document_attachments.document_id',
  'document_attachments.file_name',
  'document_attachments.created_by',
  'document_attachments.created_at',
  'document_attachments.updated_at',
];
