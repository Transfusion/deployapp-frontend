import axios from 'axios';
import { parseISO } from 'rsuite/esm/utils/dateUtils';

const axiosClient = axios.create({
  withCredentials: true,
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

/**
 * https://stackoverflow.com/questions/65692061/casting-dates-properly-from-an-api-response-in-typescript
 */
const isoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?(?:[-+]\d{2}:?\d{2}|Z)?$/;
function isIsoDateString(value: any): boolean {
  return value && typeof value === "string" && isoDateFormat.test(value);
}

export function handleDates(body: any) {
  if (body === null || body === undefined || typeof body !== "object")
    return body;

  for (const key of Object.keys(body)) {
    const value = body[key];
    if (isIsoDateString(value)) body[key] = parseISO(value);
    else if (typeof value === "object") handleDates(value);
  }
}


axiosClient.interceptors.response.use(originalResponse => {
  handleDates(originalResponse.data);
  return originalResponse;
});


export default axiosClient