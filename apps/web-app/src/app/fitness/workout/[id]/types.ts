type WorkoutInputs = {
	name?: string;
	date: Date;
	exercises: {
		name: string;
		sets: string[];
	}[];
};
