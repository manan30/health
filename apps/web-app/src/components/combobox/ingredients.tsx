import { Combobox } from '@headlessui/react';
import { CheckIcon } from 'lucide-react';
import React from 'react';
import useSWR from 'swr';
import { searchIngredients } from '~/lib/data-fetching/ingredients';
import { cn } from '~/lib/utils';
import { BaseCombobox } from './base';

type IngredientsComboboxProps = {
	val: number | null;
	onSelect: (ingredient: number | null) => void;
	disabled?: boolean;
	styles?: {
		optionClassNames?: string;
		inputClassNames?: string;
	};
};

export function IngredientsCombobox({
	onSelect,
	val,
	disabled,
	styles,
}: IngredientsComboboxProps) {
	const [searchTerm, setSearchTerm] = React.useState('');
	const [value, setValue] = React.useState<number | null>(null);

	const { data, isLoading, isValidating } = useSWR(
		['ingredients', 'search'],
		async () => await searchIngredients(),
		{
			keepPreviousData: true,
			revalidateOnFocus: false,
		},
	);

	const filteredValues =
		searchTerm === ''
			? data ?? []
			: data?.filter((ing) => {
					const ingredient = `${ing.name}${
						ing.store && ing.store.length > 0 ? `-${ing.store}` : ''
					}${ing.brand && ing.brand.length > 0 ? `-${ing.brand}` : ''}`;
					return ingredient.toLowerCase().includes(searchTerm.toLowerCase());
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
				const ing = data?.find((ing) => ing.id === value);
				if (!ing) return '';
				return `${ing.name}${
					ing.store && ing.store.length > 0 ? `-${ing.store}` : ''
				}${ing.brand && ing.brand.length > 0 ? `-${ing.brand}` : ''}`;
			}}
			setSearchTerm={setSearchTerm}
			comboboxInputProps={{ className: styles?.inputClassNames }}
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
								{`${value.name}${
									value.store && value.store.length > 0 ? `-${value.store}` : ''
								}${
									value.brand && value.brand.length > 0 ? `-${value.brand}` : ''
								}`}
							</div>
						)}
					</Combobox.Option>
				))
			)}
		</BaseCombobox>
	);
}
