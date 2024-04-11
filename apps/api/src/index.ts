import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { showRoutes } from 'hono/dev';
import workoutRoutes from '~/routes/fitness/workout';
import { db } from './middlewares/db';
import { nutritionRoutes } from './modules/nutrition';
import type { Env, Variables } from './types';

const app = new Hono<{ Bindings: Env; Variables: Variables }>().basePath(
	'/health/v1',
);

app.use('*', db(), cors());

app.route('/workouts', workoutRoutes);
app.route('/', nutritionRoutes);

app.notFound((c) => {
	return c.text('Nothing to see here!', 404);
});

app.onError((err, c) => {
	console.error(`${err}`);
	console.error(err.stack);
	return c.text('Internal Server Error', 500);
});

showRoutes(app);

export default {
	fetch: app.fetch,
};
