// createSubscription.js
import axios from 'axios';
import { getAccessToken } from '../../service/payment.js';
import dotenv from "dotenv";
dotenv.config({path: "./config/.env"});


export async function createSubscription(email) {
    
  const token = await getAccessToken();
  const planId = process.env.PAYPAL_PLAN_ID;
   const res = await axios.post(
    `${process.env.PAYPAL_BASE_URl}/v1/billing/subscriptions`,
    {
      plan_id: planId,
      subscriber: { email_address: email },
      application_context: {
        brand_name: 'JobSearchApp',
        locale: 'en-US',
        user_action: 'SUBSCRIBE_NOW',
        return_url: `${process.env.SUCCESS}`,
        cancel_url: `${process.env.CANCELLED}`,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const approveLink = res.data.links.find((l) => l.rel === 'approve')?.href;
  return approveLink;
}
