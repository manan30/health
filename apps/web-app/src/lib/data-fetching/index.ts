import { ofetch as fetch } from "ofetch";

export const fetchInstance = fetch.create({
  baseURL: "http://localhost:8787/v1",
  headers: {
    "Content-Type": "application/json",
  },
});
