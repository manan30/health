import { z } from "zod";

export const createOrUpdateRecipeRequest = z.object({
  name: z
    .string({
      required_error: "Name is a required field",
      invalid_type_error: "Name must be a string",
    })
    .min(1, "Name must be at least 1 character long"),
  items: z
    .array(
      z.object({
        id: z.number(),
        quantity: z.number(),
        type: z.enum(["recipe", "ingredient"]),
      })
    )
    .nonempty("Items must have at least 1 item"),
});

export const getRecipeRequest = z.object({ id: z.string() });

export const deleteRecipeRequest = z.object({ id: z.string() });

export const toggleCompletionRecipeRequest = z.object({ id: z.string() });
