import { Combobox } from '@headlessui/react';
import { CheckIcon } from 'lucide-react';
import React from 'react';
import useSWR from 'swr';
import { searchIngredients } from '~/lib/data-fetching/ingredients';
import { searchRecipes } from '~/lib/data-fetching/recipes';
import { cn } from '~/lib/utils';
import { BaseCombobox } from './base';

type RecipesComboboxProps = {
	val: number | null;
	onSelect: (recipe: number | null) => void;
	disabled?: boolean;
	styles?: {
		optionClassNames?: string;
		inputClassNames?: string;
	};
};

function formatDate(date: string) {
	return Intl.DateTimeFormat('en-US', {
		dateStyle: 'medium',
	}).format(new Date(date));
}

export function RecipesCombobox({
	onSelect,
	val,
	disabled,
	styles,
}: RecipesComboboxProps) {
	const [searchTerm, setSearchTerm] = React.useState('');
	const [value, setValue] = React.useState<number | null>(null);

	const { data, isLoading, isValidating } = useSWR(
		['recipes', 'search'],
		async () => await searchRecipes(),
		{
			keepPreviousData: true,
			revalidateOnFocus: false,
		},
	);

	const filteredValues =
		searchTerm === ''
			? data ?? []
			: data?.filter((recipe) => {
					return recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
				}) ?? [];

	React.useEffect(() => {
		setValue(val);
	}, [val]);

	React.useEffect(() => {
		onSelect(value);
	}, [value, onSelect]);

	return (
		<BaseCombobox
			value={value}
			setValue={setValue}
			disabled={isLoading || isValidating || disabled}
			setDisplayValue={(value) => {
				const recipe = data?.find((recipe) => recipe.id === value);
				if (!recipe) return '';
				return `${recipe.name} - ${formatDate(recipe.createdAt)}`;
			}}
			setSearchTerm={setSearchTerm}
			comboboxInputProps={{
				placeholder: 'Search for a recipe',
				className: styles?.inputClassNames,
			}}
		>
			{filteredValues.length === 0 && searchTerm !== '' ? (
				<div className='relative cursor-default select-none px-4 py-2 text-gray-700'>
					Nothing found.
				</div>
			) : (
				filteredValues.map((value) => (
					<Combobox.Option
						key={value.id}
						value={value.id}
						className={({ active, selected }) =>
							cn(
								'relative cursor-default select-none py-2 pl-10 pr-4 text-muted-foreground',
								active && 'bg-primary-foreground text-primary',
								selected && 'bg-primary-foreground text-primary',
								styles?.optionClassNames,
							)
						}
					>
						{({ selected }) => (
							<div className='flex items-center'>
								{selected ? (
									<span className='absolute inset-y-0 left-0 flex items-center pl-3 text-current'>
										<CheckIcon className='h-5 w-5' aria-hidden='true' />
									</span>
								) : null}
								{`${value.name} - ${formatDate(value.createdAt)}`}
							</div>
						)}
					</Combobox.Option>
				))
			)}
		</BaseCombobox>
	);
}
