import Link from 'next/link';
import type React from 'react';
import { buttonVariants } from '~/components/ui/button';
import { getAllRecipes } from '~/lib/data-fetching/recipes';
import { columns } from './columns';
import { DataTable } from './table';

export default async function RecipesLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const recipes = await getAllRecipes();
	return (
		<div className='flex flex-col overflow-hidden h-screen'>
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 gap-4'>
				<div className='flex flex-col space-y-1.5'>
					<h1 className='text-2xl font-semibold whitespace-nowrap leading-none tracking-tight'>
						Recipes
					</h1>
					<p className='text-sm text-muted-foreground'>Manage your recipes</p>
				</div>
				<Link className={buttonVariants()} href='/nutrition/recipes/new'>
					Add New Recipe
				</Link>
			</div>
			<div className='px-6 pb-6 overflow-y-auto h-[calc(100%-6rem)]'>
				<DataTable columns={columns} data={recipes} />
				{children}
			</div>
		</div>
	);
}

export const dynamic = 'force-dynamic';
