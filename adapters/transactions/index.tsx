import { offlineTransactionInterface, transactionInterface } from '@/types/api.types';
import { BASE_URL, COMMON_HEADER } from '..';

const createTransaction = async (body: transactionInterface) => {
  const res = await fetch(`${BASE_URL}/api/transactions`, {
    headers: {
      ...COMMON_HEADER.headers,
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.error?.message ?? `Request failed with status ${res.status}`);
  }

  return res.json();
};

const createOfflineOrder = async (body: offlineTransactionInterface) => {
  const res = await fetch(`${BASE_URL}/api/offline-orders`, {
    headers: {
      ...COMMON_HEADER.headers,
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.error?.message ?? `Request failed with status ${res.status}`);
  }

  return res.json();
};

const transactionService = {
  createTransaction,
  createOfflineOrder
};

export default transactionService;
