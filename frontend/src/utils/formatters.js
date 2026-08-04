export function formatScore(value) {
  const number = Number(value ?? 0);
  return number.toFixed(2);
}

export function formatDateTime(value) {
  if (!value) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-PK', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Karachi',
  }).format(new Date(`${value}Z`));
}

export function formatShortDate(value) {
  if (!value) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-PK', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'Asia/Karachi',
  }).format(new Date(`${value}Z`));
}

export function formatPercent(value) {
  const number = Number(value ?? 0);
  return `${number.toFixed(1)}%`;
}

export function formatNumber(value) {
  return new Intl.NumberFormat('en').format(Number(value ?? 0));
}