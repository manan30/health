import { ofetch as fetch } from "ofetch";

export const fetchInstance = fetch.create({
  baseURL: process.env.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
