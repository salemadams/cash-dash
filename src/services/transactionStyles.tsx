import { TRANSACTION_COLORS } from '@/constants/styles';
import { MdAttachMoney } from 'react-icons/md';
import { FaRegCreditCard } from 'react-icons/fa';
import { AiOutlineBank } from 'react-icons/ai';
import { ReactElement } from 'react';

/**
 * Returns the background color class for a transaction type
 */
export const getBackgroundColor = (type: string): string => {
  if (type === 'income') return TRANSACTION_COLORS.income.background;
  if (type === 'expense') return TRANSACTION_COLORS.expense.background;
  return TRANSACTION_COLORS.savings.background;
};

/**
 * Returns the text color class for a transaction type
 */
export const getTextColor = (type: string): string => {
  if (type === 'income') return TRANSACTION_COLORS.income.text;
  if (type === 'expense') return TRANSACTION_COLORS.expense.text;
  return TRANSACTION_COLORS.savings.text;
};

/**
 * Returns the badge style classes for a transaction type
 */
export const getBadgeStyles = (type: string): string => {
  if (type === 'income') return TRANSACTION_COLORS.income.badge;
  if (type === 'expense') return TRANSACTION_COLORS.expense.badge;
  return TRANSACTION_COLORS.savings.badge;
};

/**
 * Returns the appropriate icon component for a transaction type
 */
export const getTypeIcon = (type: string): ReactElement => {
  if (type === 'income') return <MdAttachMoney size={20} />;
  if (type === 'expense') return <FaRegCreditCard size={20} />;
  return <AiOutlineBank size={20} />;
};
