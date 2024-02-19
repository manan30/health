type WorkoutInputs = {
  type?: string;
  date: Date;
  exercises: {
    name: string;
    sets: string[];
  }[];
};
