import { offlineTransactionInterface, transactionInterface } from '@/types/api.types';
import { BASE_URL, COMMON_HEADER } from '..';

const createTransaction = async (body: transactionInterface) => {
  try {
    const res = await fetch(`${BASE_URL}/api/transactions`, {
      headers: {
        ...COMMON_HEADER.headers,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(body)
    });
    return res.json();
  } catch (err) {
    console.log('err', err);
  }
};

const createOfflineOrder = async (body: offlineTransactionInterface) => {
  try {
    const res = await fetch(`${BASE_URL}/api/offline-orders`, {
      headers: {
        ...COMMON_HEADER.headers,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(body)
    });
    return res.json();
  } catch (err) {
    console.log('err', err);
  }
};

const transactionService = {
  createTransaction,
  createOfflineOrder
};

export default transactionService;
