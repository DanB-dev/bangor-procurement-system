// Some Helpful formatter functions. Pretty self explanatory.

// Formats a number (int or float) as a currency marked as GBP but formatted based on the users locale.
const CURRENCY_FORMATTER = new Intl.NumberFormat(undefined, {
  currency: 'GBP',
  style: 'currency',
});
export const formatCurrency = (number) => {
  return CURRENCY_FORMATTER.format(number);
};

// Formats a number (int or float) based on the users locale.
const NUMBER_FORMATTER = new Intl.NumberFormat(undefined);
export const formatNumber = (number) => {
  return NUMBER_FORMATTER.format(number);
};

// Formats a number (int or float) to a compact number based on the users locale.
const COMPACT_NUMBER_FORMATTER = new Intl.NumberFormat(undefined, {
  notation: 'compact',
});
export const formatCompactNumber = (number) => {
  return COMPACT_NUMBER_FORMATTER.format(number);
};
