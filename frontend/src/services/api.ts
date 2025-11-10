const API_BASE_URL = import.meta.env.VITE_API_URL;;

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  residence?: {
    city: string;
    state: string;
    isMetro: boolean;
  };
  employmentInfo?: {
    type: string;
    employerName?: string;
    designation?: string;
    monthlyIncome: number;
  };
  financialProfile?: {
    cibilScore?: number;
    existingInvestments?: {
      elss: number;
      ppf: number;
      nps: number;
      fd: number;
      mutualFunds: number;
      stocks: number;
      others: number;
    };
    expenses?: {
      rent: number;
      educationLoan: number;
      homeLoan: {
        principal: number;
        interest: number;
      };
      insurance: {
        health: number;
        life: number;
      };
    };
    spendingPattern?: {
      groceries: number;
      dining: number;
      travel: number;
      fuel: number;
      shopping: number;
      entertainment: number;
    };
  };
  preferences?: {
    riskAppetite: string;
    financialGoals: Array<{
      name: string;
      targetAmount: number;
      targetYear: number;
      priority: string;
    }>;
    cardPreferences: Array<{
      rewardType: string;
      feeSensitivity: boolean;
    }>;
  };
  age?: number;
}

export interface CreditCard {
  _id: string;
  name: string;
  issuer: string;
  category: string;
  joiningFee: number;
  annualFee: number;
  renewalConditions: string;
  eligibility: {
    minIncome: number;
    minCibilScore: number;
    employmentType: string[];
  };
  features: {
    rewardRate: number;
    rewardCategories: Array<{
      category: string;
      rate: number;
      capping?: number;
    }>;
    airportLoungeAccess: boolean;
    loungeAccessCount: number;
    fuelSurchargeWaiver: boolean;
    surchargeWaiverLimit: number;
    domesticTravelInsurance: number;
    internationalTravelInsurance: number;
    rentalCarDiscount: boolean;
    golfAccess: boolean;
  };
  interestRates: {
    purchase: number;
    cashAdvance: number;
  };
  fees: {
    cashAdvance: number;
    latePayment: number;
    overLimit: number;
  };
  benefits: Array<{
    type: string;
    description: string;
  }>;
  applicationProcess: {
    documentation: string[];
    processingTime: string;
  };
  rating: number;
  reviewCount: number;
  approvalRate: number;
  imageUrl?: string;
  applyUrl: string;
  isActive: boolean;
}

export interface CreditCardRecommendation extends CreditCard {
  matchScore: number;
}

export interface TaxCalculation {
  _id: string;
  userId: string;
  calculationDate: string;
  financialYear: string;
  inputs: {
    salary: {
      basic: number;
      hra: number;
      specialAllowance: number;
      otherAllowances: number;
      professionalTax: number;
    };
    otherIncome: {
      interest: number;
      rental: number;
      capitalGains: number;
      other: number;
    };
    deductions: {
      section80C: number;
      section80D: number;
      section80E: number;
      section80G: number;
      section80TTA: number;
      nps: number;
      hraExemption: number;
      homeLoanInterest: number;
      otherDeductions: number;
    };
    regime: 'OLD' | 'NEW';
  };
  results: {
    oldRegime: {
      grossIncome: number;
      totalDeductions: number;
      taxableIncome: number;
      taxAmount: number;
      cess: number;
      totalTax: number;
    };
    newRegime: {
      grossIncome: number;
      totalDeductions: number;
      taxableIncome: number;
      taxAmount: number;
      cess: number;
      totalTax: number;
    };
    recommendedRegime: 'OLD' | 'NEW';
    potentialSavings: number;
  };
  suggestions: Array<{
    category: string;
    instrument: string;
    section: string;
    suggestedAmount: number;
    potentialSavings: number;
    priority: string;
  }>;
}

export interface FinancialDashboard {
  _id: string;
  userId: string;
  netWorth: {
    totalAssets: number;
    totalLiabilities: number;
    netWorth: number;
    lastUpdated: string;
  };
  assets: {
    cash: number;
    savingsAccounts: number;
    fixedDeposits: number;
    mutualFunds: number;
    stocks: number;
    ppf: number;
    epf: number;
    nps: number;
    realEstate: number;
    gold: number;
    otherAssets: number;
  };
  liabilities: {
    homeLoan: number;
    carLoan: number;
    personalLoan: number;
    educationLoan: number;
    creditCardDebt: number;
    otherLiabilities: number;
  };
  cashFlow: {
    monthlyIncome: number;
    monthlyExpenses: number;
    monthlySavings: number;
    expenseBreakdown: {
      housing: number;
      food: number;
      transportation: number;
      healthcare: number;
      entertainment: number;
      education: number;
      other: number;
    };
  };
  financialGoals: Array<{
    name: string;
    targetAmount: number;
    currentAmount: number;
    targetDate: string;
    priority: string;
    completed: boolean;
  }>;
  creditScore: {
    score: number;
    lastUpdated: string;
    factors: Array<{
      name: string;
      impact: string;
    }>;
  };
  lastSynced: string;
}

// API Response wrapper
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Auth token management
class TokenManager {
  private static getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private static setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  private static removeToken(): void {
    localStorage.removeItem('authToken');
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static getAuthHeaders(): HeadersInit {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...TokenManager.getAuthHeaders(),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      if (response.status === 401) {
        TokenManager.removeToken();
        throw new Error('Authentication required');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<T> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'API request failed');
    }

    return result.data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Auth API
export const authAPI = {
  async register(userData: {
    name: string;
    email: string;
    password: string;
    dateOfBirth: string;
    city: string;
    state: string;
    employmentType: string;
    monthlyIncome: number;
  }): Promise<{ user: User; token: string }> {
    const result = await apiRequest<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    // Store token
    localStorage.setItem('authToken', result.token);
    return result;
  },

  async login(credentials: { email: string; password: string }): Promise<{ user: User; token: string }> {
    const result = await apiRequest<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Store token
    localStorage.setItem('authToken', result.token);
    return result;
  },

  async getCurrentUser(): Promise<User> {
    return apiRequest<User>('/auth/me');
  },

  async logout(): Promise<void> {
    await apiRequest('/auth/logout', { method: 'POST' });
    localStorage.removeItem('authToken');
  },

  isAuthenticated(): boolean {
    return TokenManager.isAuthenticated();
  },
};

// Credit Cards API
export const creditCardsAPI = {
  async getAllCards(filters?: {
    category?: string;
    issuer?: string;
    minIncome?: number;
    maxFee?: number;
  }): Promise<CreditCard[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.issuer) params.append('issuer', filters.issuer);
    if (filters?.minIncome) params.append('minIncome', filters.minIncome.toString());
    if (filters?.maxFee) params.append('maxFee', filters.maxFee.toString());

    const queryString = params.toString();
    const endpoint = queryString ? `/credit-cards?${queryString}` : '/credit-cards';
    
    return apiRequest<CreditCard[]>(endpoint);
  },

  async getCardById(id: string): Promise<CreditCard> {
    return apiRequest<CreditCard>(`/credit-cards/${id}`);
  },

  async getRecommendations(userProfile: {
    income: number;
    creditScore: number;
    spendingPattern: Record<string, number>;
    preferences?: {
      rewardTypes: string[];
      feeSensitivity: boolean;
    };
  }): Promise<CreditCardRecommendation[]> {
    return apiRequest<CreditCardRecommendation[]>('/credit-cards/recommend', {
      method: 'POST',
      body: JSON.stringify(userProfile),
    });
  },

  async compareCards(cardIds: string[], userProfile: any): Promise<any[]> {
    return apiRequest<any[]>('/credit-cards/compare', {
      method: 'POST',
      body: JSON.stringify({ cardIds, userProfile }),
    });
  },

  async getCategories(): Promise<string[]> {
    return apiRequest<string[]>('/credit-cards/categories');
  },
};

// Tax API
export const taxAPI = {
  async calculateTax(taxData: {
    salary: {
      basic: number;
      hra: number;
      specialAllowance: number;
      otherAllowances: number;
      professionalTax: number;
    };
    otherIncome: {
      interest: number;
      rental: number;
      capitalGains: number;
      other: number;
    };
    deductions: {
      section80C: number;
      section80D: number;
      section80E: number;
      section80G: number;
      section80TTA: number;
      nps: number;
      hraExemption: number;
      homeLoanInterest: number;
      otherDeductions: number;
    };
    regime: 'OLD' | 'NEW';
    financialYear?: string;
  }): Promise<{
    calculation: TaxCalculation;
    comparison: any;
    suggestions: any[];
  }> {
    return apiRequest<{
      calculation: TaxCalculation;
      comparison: any;
      suggestions: any[];
    }>('/tax/calculate', {
      method: 'POST',
      body: JSON.stringify(taxData),
    });
  },

  async getTaxHistory(): Promise<TaxCalculation[]> {
    return apiRequest<TaxCalculation[]>('/tax/history');
  },

  async getTaxCalculation(id: string): Promise<TaxCalculation> {
    return apiRequest<TaxCalculation>(`/tax/calculations/${id}`);
  },

  async getTaxSuggestions(currentInvestments: any): Promise<any[]> {
    return apiRequest<any[]>('/tax/suggestions', {
      method: 'POST',
      body: JSON.stringify({ currentInvestments }),
    });
  },

  async getLatestRules(): Promise<any> {
    return apiRequest<any>('/tax/latest-rules');
  },
};

// Dashboard API
export const dashboardAPI = {
  async getOverview(): Promise<FinancialDashboard> {
    return apiRequest<FinancialDashboard>('/dashboard/overview');
  },

  async updateOverview(updates: {
    assets?: Partial<FinancialDashboard['assets']>;
    liabilities?: Partial<FinancialDashboard['liabilities']>;
    cashFlow?: Partial<FinancialDashboard['cashFlow']>;
    financialGoals?: FinancialDashboard['financialGoals'];
  }): Promise<FinancialDashboard> {
    return apiRequest<FinancialDashboard>('/dashboard/overview', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async getNetWorth(): Promise<FinancialDashboard['netWorth']> {
    return apiRequest<FinancialDashboard['netWorth']>('/dashboard/net-worth');
  },

  async getCashFlow(): Promise<FinancialDashboard['cashFlow']> {
    return apiRequest<FinancialDashboard['cashFlow']>('/dashboard/cash-flow');
  },

  async getAssetAllocation(): Promise<{
    assets: FinancialDashboard['assets'];
    liabilities: FinancialDashboard['liabilities'];
    allocation: Array<{
      category: string;
      amount: number;
      percentage: number;
    }>;
  }> {
    return apiRequest<{
      assets: FinancialDashboard['assets'];
      liabilities: FinancialDashboard['liabilities'];
      allocation: Array<{
        category: string;
        amount: number;
        percentage: number;
      }>;
    }>('/dashboard/asset-allocation');
  },
};

// Users API
export const usersAPI = {
  async getProfile(): Promise<User> {
    return apiRequest<User>('/users/profile');
  },

  async updateProfile(updates: {
    personalInfo?: Partial<User['personalInfo']>;
    employmentInfo?: Partial<User['employmentInfo']>;
    financialProfile?: Partial<User['financialProfile']>;
    preferences?: Partial<User['preferences']>;
  }): Promise<User> {
    return apiRequest<User>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async getFinancialProfile(): Promise<{
    financialProfile: User['financialProfile'];
    employmentInfo: User['employmentInfo'];
    preferences: User['preferences'];
  }> {
    return apiRequest<{
      financialProfile: User['financialProfile'];
      employmentInfo: User['employmentInfo'];
      preferences: User['preferences'];
    }>('/users/financial-profile');
  },

  async updateFinancialProfile(updates: {
    financialProfile?: Partial<User['financialProfile']>;
    employmentInfo?: Partial<User['employmentInfo']>;
    preferences?: Partial<User['preferences']>;
  }): Promise<{
    financialProfile: User['financialProfile'];
    employmentInfo: User['employmentInfo'];
    preferences: User['preferences'];
  }> {
    return apiRequest<{
      financialProfile: User['financialProfile'];
      employmentInfo: User['employmentInfo'];
      preferences: User['preferences'];
    }>('/users/financial-profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteAccount(): Promise<void> {
    await apiRequest('/users/account', { method: 'DELETE' });
    localStorage.removeItem('authToken');
  },
};

// Health check
export const healthAPI = {
  async checkHealth(): Promise<{ message: string; timestamp: string }> {
    return apiRequest<{ message: string; timestamp: string }>('/health');
  },
};

export default {
  auth: authAPI,
  creditCards: creditCardsAPI,
  tax: taxAPI,
  dashboard: dashboardAPI,
  users: usersAPI,
  health: healthAPI,
}; 