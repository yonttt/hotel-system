// Today's date as YYYY-MM-DD in LOCAL time (WIB), not UTC.
// new Date().toISOString() shifts to UTC, so between 00:00-07:00 WIB it would
// return the previous day and let a guest pick a past check-in date.
export const getLocalToday = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};
