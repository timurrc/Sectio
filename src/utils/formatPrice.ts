const formatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "KZT",
  maximumFractionDigits: 0,
});

export const formatPrice = (value: number) => formatter.format(value);
