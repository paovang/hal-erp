export interface ReceiptInterface {
  receipt_number?: string;
  purchase_order_id?: number;
  document_id?: number;
  received_by?: number;
  remark?: string;
  account_code?: string;
}

export interface CurrencyTotal {
  id: number;
  code: string;
  name?: string | null;
  total?: number | null;
  vat?: number | null;
  amount: number;
}
