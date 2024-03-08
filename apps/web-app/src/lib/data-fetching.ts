import { ofetch as fetch } from "ofetch";
import { Workout } from "~/types";

const fetchInstance = fetch.create({
  baseURL: "http://localhost:8787",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function createWorkout(data: WorkoutInputs) {
  return fetchInstance<{ workoutId: number }>("/workouts/new", {
    body: data,
    method: "POST",
  });
}

export async function getWorkoutById(id: string) {
  return fetchInstance<Workout>(`/workouts/${id}`);
}

export async function getIngredients() {
  return fetchInstance<string[]>("/ingredients");
}
