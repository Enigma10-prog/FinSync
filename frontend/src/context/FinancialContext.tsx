import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface FinancialState {
  user: any;
  financialData: any;
  isLoading: boolean;
}

interface FinancialAction {
  type: string;
  payload?: any;
}

const initialState: FinancialState = {
  user: null,
  financialData: null,
  isLoading: false,
};

const financialReducer = (state: FinancialState, action: FinancialAction): FinancialState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_FINANCIAL_DATA':
      return { ...state, financialData: action.payload };
    default:
      return state;
  }
};

const FinancialContext = createContext<{
  state: FinancialState;
  dispatch: React.Dispatch<FinancialAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within FinancialProvider');
  }
  return context;
};

export const FinancialProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(financialReducer, initialState);

  return (
    <FinancialContext.Provider value={{ state, dispatch }}>
      {children}
    </FinancialContext.Provider>
  );
};