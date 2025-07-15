

// DataContext_Rules.tsx
"use client"
import React, { createContext, useContext, useState } from 'react';
import { RuleRow } from './lib';
import { DataContextReturn } from '@/lib/types';

interface RulesDataContextType {
  dataRules: RuleRow[];
  setDataRules: React.Dispatch<React.SetStateAction<RuleRow[]>>;

  selectedRules: RuleRow | null;
  setSelctedRules: React.Dispatch<React.SetStateAction<RuleRow | null>>;

  dataRulesLength: number | null;
  setRulesDataLength: React.Dispatch<React.SetStateAction<number | null>>;

  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}

const RulesDataContext = createContext<RulesDataContextType | undefined>(undefined);

export const RulesDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filter, setFilter] = useState('');
  const [dataRulesLength, setRulesDataLength] = useState<number | null>(0);
  const [dataRules, setDataRules] = useState<RuleRow[]>([]);
  const [selectedRules, setSelctedRules] = useState<RuleRow | null>(null);;

  return (
    <RulesDataContext.Provider value={{
      dataRules, setDataRules,
      dataRulesLength, setRulesDataLength,
      filter, setFilter,
      selectedRules, setSelctedRules
    }}>
      {children}
    </RulesDataContext.Provider>
  );
};

export const useRulesDataContext = () => {
  const context = useContext(RulesDataContext);
  if (!context) {
    throw new Error('useRulesDataContext must be used within a RulesDataProvider');
  }
  return context;
};

// export function createContextAdapter<T>(
//   selector: (ctx: any) => DataContextReturn<T>
// ): () => DataContextReturn<T> {
//   return () => selector(useRulesDataContext());
// }

export const useRulesAdapter = (): DataContextReturn<RuleRow> => {
  const ctx = useRulesDataContext();
  return {
    data: ctx.dataRules,
    dataLength: ctx.dataRulesLength ?? 0,
    filter: ctx.filter,
    setFilter: ctx.setFilter,
  };
};
