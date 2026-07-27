export function formatScore(value) {
  const number = Number(value ?? 0);
  return number.toFixed(2);
}

export function formatDateTime(value) {
  if (!value) {
    return '—';
  }

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function formatShortDate(value) {
  if (!value) {
    return '—';
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}

export function formatPercent(value) {
  const number = Number(value ?? 0);
  return `${number.toFixed(1)}%`;
}

export function formatNumber(value) {
  return new Intl.NumberFormat('en').format(Number(value ?? 0));
}