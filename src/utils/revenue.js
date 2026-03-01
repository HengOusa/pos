// utils/revenue.js
export const buildDailyRevenue = (orders = []) => {
  const map = {};

  orders.forEach((order) => {
    const date = order.created_at.slice(0, 10); // YYYY-MM-DD
    const revenue = Number(order.total_price || 0);

    map[date] = (map[date] || 0) + revenue;
  });

  return Object.entries(map).map(([date, revenue]) => ({
    date,
    revenue,
  }));
};
