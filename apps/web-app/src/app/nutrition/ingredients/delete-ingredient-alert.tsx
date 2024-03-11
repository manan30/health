"use client";

import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import useSWRMutation from "swr/mutation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { buttonVariants } from "~/components/ui/button";
import { deleteIngredient } from "~/lib/data-fetching/ingredients";

type DeleteIngredientAlertProps = {
  id: number;
  open: boolean;
  setOpen(open: boolean): void;
};

export function DeleteIngredientAlert({
  id,
  open,
  setOpen,
}: DeleteIngredientAlertProps) {
  const router = useRouter();
  const { trigger, isMutating } = useSWRMutation(
    "delete-ingredient",
    async () => {
      await deleteIngredient(id);
      setOpen(false);
      router.refresh();
    }
  );

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            ingredient.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isMutating}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={() => {
              trigger();
            }}
            disabled={isMutating}
          >
            {isMutating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
