"use client";

import React from "react";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FetchError } from "ofetch";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import useSWRMutation from "swr/mutation";
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
  ItemType,
  createRecipe,
  updateRecipe,
} from "~/lib/data-fetching/recipes";
import { IngredientsCombobox } from "~/components/combobox/ingredients";
import { RecipesCombobox } from "~/components/combobox/recipes";

type RecipeFormProps = {
  isNew?: boolean;
  recipe: {
    id: number;
    name: string;
    recipeIngredients: {
      id: number;
      itemId: number;
      quantity: string;
      type: ItemType;
    }[];
  } | null;
};

type FormValues = {
  name: string;
  items: {
    itemId: number | null;
    quantity: number | null;
    type: ItemType;
    recipeIngId: number | null;
  }[];
};

export function RecipeForm({ isNew, recipe }: RecipeFormProps) {
  const router = useRouter();

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          router.push("/nutrition/recipes");
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
          <DialogTitle>{isNew ? "Add New" : "Edit"} Recipe</DialogTitle>
          <DialogDescription>
            Fill in the details of the recipe. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-full overflow-auto">
          <InnerForm recipe={recipe} isNew={isNew} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InnerForm({ recipe }: RecipeFormProps) {
  const router = useRouter();
  const { handleSubmit, register, formState, setValue, control } =
    useForm<FormValues>({
      defaultValues: {
        name: recipe?.name || "",
        items:
          recipe?.recipeIngredients.map((ing) => ({
            itemId: ing.itemId,
            quantity: Number(ing.quantity),
            type: ing.type,
          })) || [],
      },
    });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
    rules: { minLength: 1, required: true },
  });
  const [error, setError] = useState<string | string[] | null>(null);
  const { trigger } = useSWRMutation(
    [recipe ? "update" : "create", "ingredient", recipe?.id].filter(Boolean),
    (_url, { arg }: { arg: FormValues }) => {
      const values = {
        ...arg,
        items: arg.items.map((item) => ({
          id: item.itemId,
          quantity: item.quantity,
          type: item.type,
          recipeIngId: item.recipeIngId,
        })),
      };
      if (recipe) {
        return updateRecipe(recipe.id, values);
      }
      return createRecipe(values);
    },
    {
      onSuccess: async () => {
        router.push("/nutrition/recipes");
        router.refresh();
        toast.success(
          recipe
            ? "Recipe updated successfully"
            : "New Recipe added successfully"
        );
      },
      onError: (error) => {
        if (error instanceof FetchError) {
          if (error.data.error.issues) {
            setError(
              error.data.error?.issues.map(
                (issue: { message: string }) => issue.message
              )
            );
          }
          return;
        }
        setError(`An error occurred while saving the recipe: ${error}`);
      },
    }
  );

  return (
    <form
      className="px-1"
      onSubmit={handleSubmit(
        async (data) => {
          setError(null);
          await trigger(data);
        },
        (errors) => {
          setError(
            Object.entries(errors).map(
              ([key, value]) =>
                value.message ||
                value.root?.message ||
                `${key}: ${value.root?.type}`
            )
          );
        }
      )}
    >
      <div className="grid gap-4 pb-4">
        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label className="text-sm" htmlFor="name">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Enter the name of the recipe"
              required
              type="text"
              disabled={formState.isSubmitting}
              {...register("name", { required: true })}
            />
          </div>
          <h3 className="font-medium">Ingredients</h3>
          {fields.map((field, id) => (
            <div key={id} className="flex items-end gap-2">
              <div className="grid gap-1.5 flex-1 shrink-0">
                <Label className="text-sm" htmlFor="serving-unit">
                  Name
                </Label>
                {(field.itemId || field.itemId === null) &&
                field.type === ItemType.Ingredient ? (
                  <IngredientsCombobox
                    val={field.itemId}
                    onSelect={(ingredient) => {
                      setValue(`items.${id}.itemId`, ingredient);
                    }}
                  />
                ) : null}
                {(field.itemId || field.itemId === null) &&
                field.type === ItemType.Recipe ? (
                  <RecipesCombobox
                    val={field.itemId}
                    onSelect={(recipe) => {
                      setValue(`items.${id}.itemId`, recipe);
                    }}
                  />
                ) : null}
              </div>
              <div className="grid gap-1.5 w-[5.5rem]">
                <Label className="text-sm" htmlFor="name">
                  Quantity
                </Label>
                <Input
                  id="name"
                  placeholder="Quantity"
                  required
                  type="tel"
                  disabled={formState.isSubmitting}
                  {...register(`items.${id}.quantity`, {
                    required: true,
                    valueAsNumber: true,
                  })}
                />
              </div>
              <Button
                variant="link"
                className="ml-auto p-0 text-destructive"
                onClick={() => {
                  if (fields.length > 1 || recipe) remove(id);
                }}
                type="button"
              >
                <Trash2 className="h-4 w-4 ml-2" />
              </Button>
            </div>
          ))}
          <div className="flex justify-start w-full space-x-3">
            <Button
              variant="link"
              className="w-fit content-end p-0"
              onClick={() => {
                append({
                  itemId: null,
                  quantity: null,
                  recipeIngId: null,
                  type: ItemType.Recipe,
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
                append({
                  itemId: null,
                  quantity: null,
                  recipeIngId: null,
                  type: ItemType.Ingredient,
                });
              }}
              type="button"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Ingredient
            </Button>
          </div>
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
        <Button disabled={formState.isSubmitting} type="submit">
          {formState.isSubmitting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : null}
          Save
        </Button>
        <DialogClose asChild>
          <Button
            disabled={formState.isSubmitting}
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
        </DialogClose>
      </div>
    </form>
  );
}
