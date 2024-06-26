import React from 'react';
import { getWorkoutById } from '~/lib/data-fetching-old';
import type { Workout } from '~/types';
import { WorkoutForm } from './form';

const __NEW__ = 'new';

async function getWorkout(id: string) {
	return getWorkoutById(id);
}

export default async function NewWorkout({
	params,
}: {
	params: { id: string };
}) {
	let workout: Workout | undefined = undefined;

	if (params.id !== __NEW__) {
		workout = await getWorkout(params.id);
	}

	return (
		<div className='min-h-screen w-full px-6 md:max-w-screen-md flex flex-col mx-auto'>
			<h1 className='text-3xl font-semibold mt-8'>New Workout</h1>
			{/* <WorkoutForm workout={workout} /> */}
		</div>
	);
}
