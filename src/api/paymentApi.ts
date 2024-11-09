import API from '../services/axios';
import { paymentRoutes } from '../services/endpoints/userEndpoints';

interface SubscriptionPlan {
  planType: 'monthly' | 'yearly';
  priceId: string;
}

export const paymentApi = {
  createSubscription: async (plan: SubscriptionPlan) => {
    const response = await API.post(paymentRoutes.createSubscription, plan, {
      withCredentials: true
    });
    return response.data;
  },
  verifyPayment: async (sessionId: string) => {
    const response = await API.get(`${paymentRoutes.verifyPayment}?session_id=${sessionId}`, {
      withCredentials: true
    });
    return response.data;
  }
};
