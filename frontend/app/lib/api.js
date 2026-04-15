const API_BASE_URL = typeof window !== 'undefined' 
  ? (process.env.NEXT_PUBLIC_API_URL || `${window.location.protocol}//${window.location.hostname}:5000/api`)
  : 'http://localhost:5000/api';

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    return { success: false, error: data.error || 'Something went wrong' };
  }
  return data;
};

const safeFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    return handleResponse(response);
  } catch (error) {
    // Server is offline or unreachable - return a graceful failure
    console.warn('API call failed (server may be offline):', url);
    return { success: false, error: 'Server unreachable' };
  }
};

// ========== STOCKS API ==========
export const getStocks = async () => {
  // Attempt to fetch real-time live stocks from the Next.js API
  try {
    const liveResponse = await fetch('/api/quotes');
    const liveData = await liveResponse.json();
    if (liveResponse.ok && liveData.success && liveData.data && liveData.data.length > 0) {
      return liveData;
    }
  } catch (error) {
    console.warn('Live quotes fetching failed, falling back to db stocks:', error);
  }
  // Fallback to static mock backend if API fails
  return safeFetch(`${API_BASE_URL}/stocks`);
};

export const getStock = async (symbol) => {
  return safeFetch(`${API_BASE_URL}/stocks/${symbol}`);
};

export const getStockDetails = async (symbol) => {
  return safeFetch(`${API_BASE_URL}/stocks/details/${symbol}`);
};

export const searchStocks = async (query) => {
  return safeFetch(`${API_BASE_URL}/stocks/search/${query}`);
};

export const trackStock = async (symbol) => {
  return safeFetch(`${API_BASE_URL}/stocks/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ symbol }),
  });
};

export const getNews = async (symbol) => {
  return safeFetch(`${API_BASE_URL}/stocks/news/${symbol}`);
};

// ========== USER API ==========
export const getMarketMovers = async () => {
  return safeFetch(`${API_BASE_URL}/stocks/movers`);
};

export const getPortfolio = async (userId = null) => {
  const url = userId ? `${API_BASE_URL}/user/portfolio?userId=${userId}` : `${API_BASE_URL}/user/portfolio`;
  return safeFetch(url);
};

export const getHoldings = async () => {
  return safeFetch(`${API_BASE_URL}/user/holdings`);
};

export const getOrders = async () => {
  return safeFetch(`${API_BASE_URL}/user/orders`);
};

export const getTrades = async () => {
  return safeFetch(`${API_BASE_URL}/user/trades`);
};

export const getFundTransactions = async () => {
  return safeFetch(`${API_BASE_URL}/user/funds/transactions`);
};

// ========== TRADING API ==========
export const executeTrade = async (tradeData) => {
  return safeFetch(`${API_BASE_URL}/trades`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tradeData),
  });
};

// ========== FUNDS API ==========
export const addFunds = async (amount, userId = null) => {
  return safeFetch(`${API_BASE_URL}/funds/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, userId }),
  });
};

export const withdrawFunds = async (amount, userId, upiId) => {
  return safeFetch(`${API_BASE_URL}/funds/withdraw`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, userId, upiId }),
  });
};

export const verifyPayment = async (paymentData) => {
  return safeFetch(`${API_BASE_URL}/payment/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentData),
  });
};

// ========== AUTH API ==========
export const login = async (email, password) => {
  return safeFetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
};

export const register = async (name, email, password) => {
  return safeFetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
};

export const resetPassword = async (email, password) => {
  return safeFetch(`${API_BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
};

// ========== ADMIN API ==========
export const getAdminUsers = async () => {
  return safeFetch(`${API_BASE_URL}/admin/users`);
};

export const getAdminTransactions = async () => {
  return safeFetch(`${API_BASE_URL}/admin/transactions`);
};

export const getAdminTrades = async () => {
  return safeFetch(`${API_BASE_URL}/admin/trades`);
};

export const getAdminStats = async () => {
  return safeFetch(`${API_BASE_URL}/admin/stats`);
};

export const updateUserStatus = async (userId, status) => {
  return safeFetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
};

export const updateKycStatus = async (userId, status) => {
  return safeFetch(`${API_BASE_URL}/admin/users/${userId}/kyc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
};
