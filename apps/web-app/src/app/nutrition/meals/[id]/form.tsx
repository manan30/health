"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FetchError } from "ofetch";
import { useState } from "react";
import { useForm } from "react-hook-form";
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

type MealFormProps = {
  isNew?: boolean;
  // ingredient: Ingredient | null;
};

type FormValues = {};

export function MealForm({ isNew }: MealFormProps) {
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
          <DialogTitle>{isNew ? "Add New" : "Edit"} Meal</DialogTitle>
          <DialogDescription>
            Fill in the details of the meal. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-full overflow-auto">
          <InnerForm isNew={isNew} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InnerForm({ isNew }: { isNew?: boolean }) {
  const router = useRouter();
  const { handleSubmit, register, formState, setValue, watch } =
    useForm<FormValues>({
      defaultValues: {},
    });
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
    <form
      className="px-1"
      onSubmit={handleSubmit(async (data) => {
        setError(null);
        // await trigger(data);
      })}
    >
      <div className="grid gap-4 pb-4">
        <div className="grid gap-4">
          <div className="grid gap-1.5">
            {/* <Label className="text-sm" htmlFor="name">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Enter the name of the ingredient"
              required
              type="text"
              disabled={formState.isSubmitting}
              {...register("name", { required: true })}
            /> */}
          </div>
          <div className="grid gap-1.5">
            {/* <Label className="text-sm" htmlFor="calories">
              Calories
            </Label>
            <Input
              id="calories"
              placeholder="0"
              required
              type="tel"
              disabled={formState.isSubmitting}
              {...register("calories", {
                required: true,
                valueAsNumber: true,
              })}
            /> */}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-1.5">
              {/* <Label className="text-sm" htmlFor="serving-size">
                Serving Size
              </Label>
              <Input
                id="serving-size"
                placeholder="0"
                required
                type="tel"
                disabled={formState.isSubmitting}
                {...register("servingSize", {
                  required: true,
                  valueAsNumber: true,
                })}
              /> */}
            </div>
            <div className="grid gap-1.5">
              {/* <Label className="text-sm" htmlFor="serving-unit">
                Serving Unit
              </Label>
              <Select
                value={ingredient?.servingUnit}
                onValueChange={(value) => {
                  setValue("servingUnit", value);
                }}
              >
                <SelectTrigger
                  className={cn(
                    "w-full",
                    !servingUnit && "text-muted-foreground"
                  )}
                >
                  <SelectValue placeholder="gm" />
                </SelectTrigger>
                <SelectContent side="top">
                  {["gm", "ml", "unit", "lbs", "oz", "fl oz"].map(
                    (pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select> */}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-1.5">
              {/* <Label className="text-sm" htmlFor="store">
                Store
              </Label>
              <Input
                id="store"
                placeholder="Optional"
                type="text"
                disabled={formState.isSubmitting}
                {...register("store")}
              /> */}
            </div>
            <div className="grid gap-1.5">
              {/* <Label className="text-sm" htmlFor="brand">
                Brand
              </Label>
              <Input
                id="brand"
                placeholder="Optional"
                type="text"
                disabled={formState.isSubmitting}
                {...register("brand")}
              /> */}
            </div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-1.5">
            {/* <Label className="text-sm" htmlFor="protein">
              Protein (g)
            </Label>
            <Input
              id="protein"
              placeholder="0"
              type="tel"
              disabled={formState.isSubmitting}
              {...register("protein", { valueAsNumber: true })}
            /> */}
          </div>
          <div className="grid gap-1.5">
            {/* <Label className="text-sm" htmlFor="fat">
              Fat (g)
            </Label>
            <Input
              id="fat"
              placeholder="0"
              type="tel"
              disabled={formState.isSubmitting}
              {...register("fat", { valueAsNumber: true })}
            /> */}
          </div>
          <div className="grid gap-1.5">
            {/* <Label className="text-sm" htmlFor="carbs">
              Carbs (g)
            </Label>
            <Input
              id="carbs"
              placeholder="0"
              type="tel"
              disabled={formState.isSubmitting}
              {...register("carbs", { valueAsNumber: true })}
            /> */}
          </div>
          <div className="grid gap-1.5">
            {/* <Label className="text-sm" htmlFor="fiber">
              Fiber (g)
            </Label>
            <Input
              id="fiber"
              placeholder="0"
              type="tel"
              disabled={formState.isSubmitting}
              {...register("fiber", { valueAsNumber: true })}
            /> */}
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
