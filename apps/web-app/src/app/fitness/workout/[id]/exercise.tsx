'use client';

import { Input } from '~/components/ui/input';

export function Exercise() {
	return (
		<div className='flex items-center gap-4 overflow-x-auto'>
			<div className='flex-shrink-0'>
				<Input label='Exercise' />
			</div>
			<div className='flex-shrink-0'>
				<Input label='Set 1' />
			</div>
			<div className='flex-shrink-0'>
				<Input label='Set 2' />
			</div>
			<div className='flex-shrink-0'>
				<Input label='Set 3' />
			</div>
			<div className='flex-shrink-0'>
				<Input label='Set 4' />
			</div>
		</div>
	);
}
