const RTF = new Intl.RelativeTimeFormat("ru", { numeric: "auto" });

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["day", 86_400_000],
  ["hour", 3_600_000],
  ["minute", 60_000],
];

/** «5 минут назад», «вчера». Меньше минуты — «только что» */
export const formatRelativeTime = (timestamp: number, now = Date.now()): string => {
  const diff = timestamp - now;
  for (const [unit, ms] of UNITS) {
    if (Math.abs(diff) >= ms) return RTF.format(Math.round(diff / ms), unit);
  }
  return "только что";
};
