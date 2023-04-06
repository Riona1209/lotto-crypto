export const getDateFromTimestamp = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  const dateStr = date.toISOString().substring(0, 10).replace(/-/g, "");
  return dateStr;
};
