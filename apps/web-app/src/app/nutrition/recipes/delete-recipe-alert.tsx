"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FetchError } from "ofetch";
import { toast } from "sonner";
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
import { deleteRecipe } from "~/lib/data-fetching/recipes";

type DeleteRecipeAlertProps = {
  id: number;
  open: boolean;
  setOpen(open: boolean): void;
};

export function DeleteRecipeAlert({
  id,
  open,
  setOpen,
}: DeleteRecipeAlertProps) {
  const router = useRouter();
  const { trigger, isMutating } = useSWRMutation(
    ["delete-recipe", id],
    async () => {
      await deleteRecipe(id);
      setOpen(false);
      router.refresh();
    },
    {
      onSuccess: () => {
        toast.success("Recipe deleted successfully");
      },
      onError: (error: Error | FetchError) => {
        toast.error(error.message);
      },
    }
  );

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            recipe.
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
