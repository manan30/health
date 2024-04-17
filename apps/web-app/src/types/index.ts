export type Workout = {
	date: string;
	id: number;
	name: string | null;
	description: string | null;
	createdAt: string;
	exercises: Exercise[] | null;
};

export type Exercise = {
	date: string;
	id: number;
	name: string;
	description: string | null;
	createdAt: string;
	sets: string[] | null;
	workoutId: number;
	exerciseTypeId: number;
};
