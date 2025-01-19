import { format } from 'date-fns';

const useFormatters = () => {
  const formatCurrency = (
    value: number | undefined,
    currency: string = 'USD',
    language: string = 'en-US'
  ) => {
    if (value === undefined) {
      value = 0;
    }
    return new Intl.NumberFormat(language, {
      style: 'currency',
      currency: currency,
    }).format(value);
  };

  const formatDate = (
    date: Date | undefined,
    formatStr: string = 'MMM dd, yyyy'
  ) => {
    return date ? format(date, formatStr) : '';
  };

  const formatNumber = (
    value: number | undefined,
    decimals: number = 0,
    language: string = 'en-US'
  ) => {
    if (value === undefined) {
      value = 0;
    }
    return new Intl.NumberFormat(language, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  };

  return {
    formatCurrency,
    formatDate,
    formatNumber,
  };
};

export default useFormatters;
