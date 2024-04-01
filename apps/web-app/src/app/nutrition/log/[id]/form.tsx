"use client";

import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FetchError } from "ofetch";
import { useState } from "react";
import {
  FieldArrayWithId,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import { toast } from "sonner";
import useSWRMutation from "swr/mutation";
import { IngredientsCombobox } from "~/components/combobox/ingredients";
import { RecipesCombobox } from "~/components/combobox/recipes";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Ingredient,
  createIngredient,
  updateIngredient,
} from "~/lib/data-fetching/ingredients";
import { cn } from "~/lib/utils";

enum MealType {
  BREAKFAST = "breakfast",
  LUNCH = "lunch",
  DINNER = "dinner",
  EVENING_SNACK = "evening-snack",
  MORNING_SNACK = "morning-snack",
  AFTERNOON_SNACK = "afternoon-snack",
  ANYTIME = "anytime",
}

type LogFormProps = {
  isNew?: boolean;
  // ingredient: Ingredient | null;
};

type FormValues = {
  meals: {
    name: string;
    items: {
      mealType: MealType;
      recipeId: number | null;
      ingredientId: number | null;
      quantity: number | null;
    }[];
  }[];
  ingredients: {
    mealType: MealType | null;
    ingId: number | null;
    quantity: number | null;
  }[];
  recipes: {
    mealType: MealType | null;
    recipeId: number | null;
    quantity: number | null;
  }[];
};

export function LogForm({ isNew }: LogFormProps) {
  const router = useRouter();

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          router.back();
        }
      }}
    >
      <DialogContent
        className="flex flex-col max-h-full sm:max-h-[32rem] overflow-auto"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Log Food</DialogTitle>
          <DialogDescription>
            Fill in the details of the log. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-full overflow-auto">
          <InnerForm isNew={isNew} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function IngredientSection({
  id,
  removeIng,
}: {
  id: number;
  removeIng: () => void;
}) {
  const { formState, setValue, watch, register } = useFormContext<FormValues>();
  const field = watch(`ingredients.${id}`);

  return (
    <div className="flex items-end space-x-2">
      <div className="grid gap-1.5 shrink-0 grow">
        <Label className="text-xs" htmlFor="name">
          Ingredient
        </Label>
        <IngredientsCombobox
          val={field.ingId}
          onSelect={(ingredient) => {
            setValue(`ingredients.${id}.ingId`, ingredient);
          }}
          disabled={formState.isSubmitting}
          styles={{
            inputClassNames: "placeholder:text-xs text-xs",
            optionClassNames: "text-xs",
          }}
        />
      </div>
      <div className="grid gap-1.5 shrink-0 w-20">
        <Label className="text-xs" htmlFor="quantity">
          Quantity
        </Label>
        <Input
          className="placeholder:text-xs text-xs"
          required
          id="quantity"
          placeholder="Quantity"
          type="tel"
          disabled={formState.isSubmitting}
          {...register(`ingredients.${id}.quantity`, {
            required: true,
            valueAsNumber: true,
            value: Number.isNaN(field.quantity) ? null : field.quantity,
          })}
        />
      </div>
      <div className="grid gap-1.5 shrink-0">
        <Label className="text-xs" htmlFor="name">
          Meal Type
        </Label>
        <Select
          value={field.mealType ?? ""}
          onValueChange={(value) => {
            setValue(`ingredients.${id}.mealType`, value as MealType);
          }}
        >
          <SelectTrigger
            className={cn(
              "w-full text-xs capitalize",
              !field.mealType && "text-muted-foreground"
            )}
          >
            <SelectValue className="text-xs" placeholder="" />
          </SelectTrigger>
          <SelectContent side="top">
            {[
              "breakfast",
              "lunch",
              "dinner",
              "morning-snack",
              "afternoon-snack",
              "evening-snack",
              "anytime",
            ].map((type) => (
              <SelectItem
                className="capitalize text-xs"
                key={type}
                value={`${type}`}
              >
                {type.replace("-", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        variant="link"
        className="ml-auto p-0 text-destructive"
        onClick={removeIng}
        type="button"
      >
        <Trash2 className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
}

function RecipeSection({
  id,
  removeRecipe,
}: {
  id: number;
  removeRecipe: () => void;
}) {
  const { formState, setValue, watch, register } = useFormContext<FormValues>();
  const field = watch(`recipes.${id}`);

  return (
    <div className="flex items-end space-x-2">
      <div className="grid gap-1.5 shrink-0 grow">
        <Label className="text-xs" htmlFor="name">
          Recipe
        </Label>
        <RecipesCombobox
          val={field.recipeId}
          onSelect={(recipe) => {
            setValue(`recipes.${id}.recipeId`, recipe);
          }}
          disabled={formState.isSubmitting}
          styles={{
            inputClassNames: "placeholder:text-xs text-xs",
            optionClassNames: "text-xs",
          }}
        />
      </div>
      <div className="grid gap-1.5 shrink-0 w-20">
        <Label className="text-xs" htmlFor="quantity">
          Quantity
        </Label>
        <Input
          className="placeholder:text-xs text-xs"
          required
          id="quantity"
          placeholder="Quantity"
          type="tel"
          disabled={formState.isSubmitting}
          {...register(`recipes.${id}.quantity`, {
            required: true,
            valueAsNumber: true,
            value: Number.isNaN(field.quantity) ? null : field.quantity,
          })}
        />
      </div>
      <div className="grid gap-1.5 shrink-0">
        <Label className="text-xs" htmlFor="mealType">
          Meal Type
        </Label>
        <Select
          name="mealType"
          value={field.mealType ?? ""}
          onValueChange={(value) => {
            setValue(`recipes.${id}.mealType`, value as MealType);
          }}
        >
          <SelectTrigger
            className={cn(
              "w-full text-xs capitalize",
              !field.mealType && "text-muted-foreground"
            )}
          >
            <SelectValue className="text-xs" placeholder="" />
          </SelectTrigger>
          <SelectContent side="top">
            {[
              "breakfast",
              "lunch",
              "dinner",
              "morning-snack",
              "afternoon-snack",
              "evening-snack",
              "anytime",
            ].map((type) => (
              <SelectItem
                className="capitalize text-xs"
                key={type}
                value={`${type}`}
              >
                {type.replace("-", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        variant="link"
        className="ml-auto p-0 text-destructive"
        onClick={removeRecipe}
        type="button"
      >
        <Trash2 className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
}

function InnerForm({ isNew }: LogFormProps) {
  const router = useRouter();
  const methods = useForm<FormValues>({
    defaultValues: {
      meals: [],
      ingredients: [],
      recipes: [],
    },
  });
  // const {
  //   fields: meals,
  //   append: appendMeal,
  //   remove: removeMeal,
  // } = useFieldArray({ name: "meals", control });
  const {
    fields: recipes,
    append: appendRecipe,
    remove: removeRecipe,
  } = useFieldArray({ name: "recipes", control: methods.control });
  const {
    fields: ingredients,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({ name: "ingredients", control: methods.control });
  const [error, setError] = useState<string | string[] | null>(null);
  // const { trigger } = useSWRMutation(
  //   [ingredient ? "update" : "create", "ingredient", ingredient?.id].filter(
  //     Boolean
  //   ),
  //   (_url, { arg }: { arg: FormValues }) => {
  //     if (ingredient) {
  //       return updateIngredient(ingredient.id, arg);
  //     }
  //     return createIngredient(arg);
  //   },
  //   {
  //     onSuccess: async () => {
  //       router.push("/nutrition/ingredients");
  //       router.refresh();
  //       toast.success(
  //         ingredient
  //           ? "Ingredient updated successfully"
  //           : "New ingredient added successfully"
  //       );
  //     },
  //     onError: (error) => {
  //       if (error instanceof FetchError) {
  //         if (error.data.error.issues) {
  //           setError(
  //             error.data.error.issues.map(
  //               (issue: { message: string }) => issue.message
  //             )
  //           );
  //         }
  //         return;
  //       }
  //       setError(`An error occurred while saving the ingredient: ${error}`);
  //     },
  //   }
  // );

  // const servingUnit = watch("servingUnit");

  return (
    <FormProvider {...methods}>
      <form
        className="px-1"
        onSubmit={methods.handleSubmit(async (data) => {
          setError(null);
          // await trigger(data);
        })}
      >
        <div className="grid gap-4 pb-4">
          {ingredients.length ? (
            <div>
              <h3 className="font-semibold mb-2 text-sm">
                Ingredients Section
              </h3>
              <div className="flex flex-col space-y-2">
                {ingredients.map((_ingredient, idx) => (
                  <IngredientSection
                    id={idx}
                    key={idx}
                    removeIng={() => {
                      removeIngredient(idx);
                    }}
                  />
                ))}
              </div>
            </div>
          ) : null}
          {recipes.length ? (
            <div>
              <h3 className="font-semibold mb-2 text-sm">Recipes Section</h3>
              <div className="flex flex-col space-y-2">
                {recipes.map((_recipe, idx) => (
                  <RecipeSection
                    id={idx}
                    key={idx}
                    removeRecipe={() => {
                      removeIngredient(idx);
                    }}
                  />
                ))}
              </div>
            </div>
          ) : null}
          <div className="flex justify-start w-full space-x-3">
            <Button
              variant="link"
              className="w-fit content-end p-0"
              onClick={() => {
                appendRecipe({
                  mealType: null,
                  recipeId: null,
                  quantity: null,
                });
              }}
              type="button"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Recipe
            </Button>
            <Button
              variant="link"
              className="w-fit content-end p-0"
              onClick={() => {
                appendIngredient({
                  quantity: null,
                  ingId: null,
                  mealType: null,
                });
              }}
              type="button"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Ingredient
            </Button>
          </div>
        </div>
        {error ? (
          <Alert className="mb-4" variant="destructive">
            <AlertDescription className="text-xs px-2">
              {error instanceof Array ? (
                <ul className="list-disc">
                  {error.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              ) : (
                error
              )}
            </AlertDescription>
          </Alert>
        ) : null}
        <div className="flex items-center justify-end gap-2">
          <Button disabled={methods.formState.isSubmitting} type="submit">
            {methods.formState.isSubmitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            Save
          </Button>
          <DialogClose asChild>
            <Button
              disabled={methods.formState.isSubmitting}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
          </DialogClose>
        </div>
      </form>
    </FormProvider>
  );
}
