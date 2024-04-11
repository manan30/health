import { z } from 'zod';

export const createOrUpdateMealRequest = z.object({
	items: z
		.array(
			z.object({
				id: z.number(),
				recipeId: z.number().optional(),
				ingredientId: z.number().optional(),
				mealType: z.enum([
					'breakfast',
					'lunch',
					'dinner',
					'evening-snack',
					'morning-snack',
					'afternoon-snack',
					'anytime',
				]),
				quantity: z.string(),
				calories: z.string(),
			}),
		)
		.nonempty('Items must have at least 1 item'),
});
