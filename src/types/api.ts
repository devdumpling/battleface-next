export interface QuotationRequest {
  age: number;
  currency_id: string;
  start_date: string;
  end_date: string;
}

export interface QuotationResponse {
  total: number;
  currency_id: string;
  quotation_id: number;
}
