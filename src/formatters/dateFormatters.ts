export function formatWeekRange(weekStart: string, locale: string) {
  const start = parseDateOnly(weekStart);
  const end = parseDateOnly(weekStart);
  end.setDate(end.getDate() + 6);

  return `${formatDate(start, locale)} - ${formatDate(end, locale)}`;
}

export function formatCreatedAt(createdAt: string, locale: string) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function formatDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

function parseDateOnly(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year || 0, (month || 1) - 1, day || 1);
}
