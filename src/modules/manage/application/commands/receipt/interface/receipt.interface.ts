export interface ReceiptInterface {
  receipt_number?: string;
  purchase_order_id?: number;
  document_id?: number;
  received_by?: number;
  remark?: string;
}

export interface CurrencyTotal {
  id: number;
  code: string;
  name?: string | null;
  amount: number;
}
