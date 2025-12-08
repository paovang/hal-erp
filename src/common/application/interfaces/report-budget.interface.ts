export interface ReportBudgetInterface {
  budget_overruns: {
    amount: number;
    total: number;
    budget: CompanyInterface[];
  };
  within_budget: {
    amount: number;
    total: number;
    budget: CompanyInterface[];
  };
}

export interface CompanyInterface {
  id: number | null;
  name: string;
  logo: string;
  allocated_amount: number;
  total: number;
}

export interface ReportToUseBudget {
  allocated_total: number;
  use_total: number;
  balance_total: number;
}
