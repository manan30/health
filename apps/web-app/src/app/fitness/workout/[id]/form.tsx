"use client";

import React from "react";
import useSWRMutation from "swr/mutation";
import { useForm } from "react-hook-form";
// import { DevTool } from "@hookform/devtools";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Exercise } from "./exercise";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { Calendar } from "~/components/ui/calendar";
import { Label } from "~/components/ui/label";
import { useRouter, usePathname } from "next/navigation";
import { createWorkout } from "~/lib/data-fetching-old";

type WorkoutFormProps = {
  workout?: WorkoutInputs;
};

const defaultWorkoutState: WorkoutInputs = {
  date: new Date(),
  exercises: [
    {
      name: "",
      sets: ["", "", "", ""],
    },
  ],
};

export function WorkoutForm({ workout }: WorkoutFormProps) {
  const { register, handleSubmit, watch, control, setValue } =
    useForm<WorkoutInputs>({ defaultValues: workout ?? defaultWorkoutState });
  const router = useRouter();
  const pathname = usePathname();

  const { trigger: createNewWorkout } = useSWRMutation(
    ["new", "workout"],
    async (_key, { arg }: { arg: WorkoutInputs }) => {
      const data = await createWorkout(arg);
      const path = pathname.split("/").slice(0, -1).join("/");
      router.push(`${path}/${data.workoutId}`);
    }
  );

  const { exercises, date } = {
    exercises: watch("exercises"),
    date: watch("date"),
  };

  return (
    <>
      <form
        className="mt-4 flex flex-col space-y-4"
        onSubmit={handleSubmit((data) => {
          createNewWorkout(data);
        })}
      >
        <div className="flex items-center gap-4">
          <Input label="Name" {...register("name")} />
          <Popover>
            <PopoverTrigger className="w-full" asChild>
              <div className="flex flex-col space-y-2 w-full">
                <Label>Date</Label>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                  type="button"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => {
                  if (date) setValue("date", date);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <h2 className="text-xl font-medium">Exercises</h2>
        <div className="flex flex-col space-y-4">
          {exercises.map((exercise) => (
            <Exercise />
          ))}
          <div className="flex justify-end w-full">
            <Button
              className="min-w-16"
              onClick={() => {
                setValue(
                  "exercises",
                  exercises.concat(defaultWorkoutState.exercises[0])
                );
              }}
              type="button"
            >
              Add
            </Button>
          </div>
        </div>
        <Button className="min-w-16">Save</Button>
      </form>
      {/* <DevTool control={control} /> */}
    </>
  );
}
