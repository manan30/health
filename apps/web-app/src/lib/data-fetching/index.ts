import { ofetch as fetch } from 'ofetch';

export const fetchInstance = fetch.create({
	baseURL: process.env.BASE_API_URL as string,
	headers: {
		'Content-Type': 'application/json',
	},
});
