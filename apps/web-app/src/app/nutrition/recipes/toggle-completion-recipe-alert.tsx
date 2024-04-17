'use client';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { FetchError } from 'ofetch';
import { toast } from 'sonner';
import useSWRMutation from 'swr/mutation';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '~/components/ui/alert-dialog';
import { buttonVariants } from '~/components/ui/button';
import { markCompleteRecipe } from '~/lib/data-fetching/recipes';

type ToggleCompletionRecipeAlertProps = {
	id: number;
	open: boolean;
	isComplete: boolean;
	setOpen(open: boolean): void;
};

export function ToggleCompletionRecipeAlert({
	id,
	open,
	isComplete,
	setOpen,
}: ToggleCompletionRecipeAlertProps) {
	const router = useRouter();
	const { trigger, isMutating } = useSWRMutation(
		['toggle-completion-recipe', id],
		async () => {
			await markCompleteRecipe(id);
			setOpen(false);
			router.refresh();
		},
		{
			onSuccess: () => {
				toast.success(
					`Recipe marked ${isComplete ? 'in progress' : 'completed'}.`,
				);
			},
			onError: (error: Error | FetchError) => {
				toast.error(error.message);
			},
		},
	);

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This will mark the recipe as{' '}
						{isComplete ? 'in progress' : 'completed'}.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isMutating}>Cancel</AlertDialogCancel>
					<AlertDialogAction
						className={buttonVariants()}
						onClick={() => {
							trigger();
						}}
						disabled={isMutating}
					>
						{isMutating ? (
							<Loader2 className='h-4 w-4 mr-2 animate-spin' />
						) : null}
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
