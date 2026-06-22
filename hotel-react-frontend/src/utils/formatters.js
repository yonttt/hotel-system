/**
 * Shared display formatters used across the unified list/table pages.
 * Multiple currency formats are intentionally kept distinct (not merged into
 * one "smart" function) because different screens genuinely display
 * different precision/style and were already inconsistent before this file
 * existed — this just gives each existing format a name instead of a
 * re-typed inline implementation.
 */

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
};

// e.g. 270000 -> "270000.0000" (used by front office reservation/guest tables)
export const formatCurrencyFixed4 = (amount) => {
  if (!amount) return '0.0000';
  return parseFloat(amount).toFixed(4);
};

// e.g. 270000 -> "270.000" (used by master data / night audit tables)
export const formatCurrencyIDR = (amount) => {
  if (!amount) return '0';
  return new Intl.NumberFormat('id-ID').format(amount);
};

// e.g. 270000 -> "Rp270.000" (used by group booking tables)
export const formatCurrencyIDRSymbol = (amount) => {
  if (!amount) return 'Rp0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

export const calculateBalance = (totalCharge, totalDeposit) => {
  const charge = parseFloat(totalCharge || 0);
  const deposit = parseFloat(totalDeposit || 0);
  return charge - deposit;
};
