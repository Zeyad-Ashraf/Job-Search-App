import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config('./config/.env');

export async function getAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_SECRET;

  const auth = Buffer.from(`${clientId}:${secret}`).toString('base64');

  const response = await axios.post(
    `${process.env.PAYPAL_BASE_URl}/v1/oauth2/token`,
    new URLSearchParams({ grant_type: 'client_credentials' }),
    {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return response.data.access_token;
}
