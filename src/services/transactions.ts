import { Transaction } from '@/types/transaction';
import { TransactionType } from '@/constants/transactions';

/**
 * Filters transactions based on search term and transaction type
 */
export const filterTransactions = (
  transactions: Transaction[],
  searchInput: string,
  typeFilter: TransactionType
): Transaction[] => {
  return transactions.filter((t) => {
    const matchesSearch =
      t.category
        ?.toLowerCase()
        .includes(searchInput.toLocaleLowerCase()) ||
      t.description
        .toLowerCase()
        .includes(searchInput.toLocaleLowerCase()) ||
      t.merchant
        .toLowerCase()
        .includes(searchInput.toLocaleLowerCase());
    if (typeFilter === TransactionType.All) return matchesSearch;
    const matchesType = t.type === typeFilter;
    return matchesSearch && matchesType;
  });
};

/**
 * Calculates total income and expenses from transactions
 */
export const calculateTransactionTotals = (
  transactions: Transaction[]
): { income: number; expenses: number; net: number } => {
  const income = transactions.reduce((acc, t) => {
    return t.type === TransactionType.Income ? acc + t.amount : acc;
  }, 0);

  const expenses = transactions.reduce((acc, t) => {
    return t.type === TransactionType.Expense ? acc + t.amount : acc;
  }, 0);

  const net = income - Math.abs(expenses);

  return { income, expenses, net };
};

/**
 * Aggregates transaction amounts by type
 */
export const aggregateByType = (
  transactions: Transaction[]
): Record<string, number> => {
  return transactions.reduce((acc, transaction) => {
    const type = transaction.type;
    acc[type] = (acc[type] || 0) + Math.abs(transaction.amount);
    return acc;
  }, {} as Record<string, number>);
};
