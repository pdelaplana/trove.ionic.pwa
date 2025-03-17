import { differenceInCalendarDays, format } from 'date-fns';

export const DateFormatString = {
  MMM_DD_YYYY: 'MMM dd, yyyy',
  MM_DD_YYYY: 'MM/dd/yyyy',
  MM_DD_YYYY_HH_MM_A: 'MM/dd/yyyy hh:mm a',
  MM_DD_YYYY_HH_MM: 'MM/dd/yyyy HH:mm',
  MM_DD_YYYY_HH_MM_SS: 'MM/dd/yyyy HH:mm:ss',
  MM_DD_YYYY_HH_MM_SS_A: 'MM/dd/yyyy hh:mm:ss a',
  YYYY_MM_DD: 'yyyy-MM-dd',
  EEE_MM_DD_YYYY: 'EEE MMM dd',
};

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

  const formatDaysUntil = (date: Date | undefined) => {
    if (!date) {
      return '';
    }

    const diffDays = differenceInCalendarDays(date, new Date());

    return `${diffDays}`;
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
    formatDaysUntil,
    formatNumber,
  };
};

export default useFormatters;
