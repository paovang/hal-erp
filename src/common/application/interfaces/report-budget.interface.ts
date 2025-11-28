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
