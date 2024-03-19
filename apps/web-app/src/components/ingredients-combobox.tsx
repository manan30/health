"use client";

import * as React from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon } from "lucide-react";
import useSWR from "swr";
import { searchIngredients } from "~/lib/data-fetching/ingredients";
import { Input } from "./ui/input";
import { cn } from "~/lib/utils";

type IngredientsComboboxProps = {
  onSelect: (ingredient: number | null) => void;
};

export function IngredientsCombobox({ onSelect }: IngredientsComboboxProps) {
  const { data, isLoading, isValidating } = useSWR(
    ["ingredients", "search"],
    async () => await searchIngredients(),
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    }
  );

  const [ingredient, setIngredient] = React.useState<number | null>(null);
  const [query, setQuery] = React.useState("");

  const loading = isLoading || isValidating;

  const filteredIngredients =
    query === ""
      ? data ?? []
      : data?.filter((ing) => {
          const ingredient = `${ing.name}${ing.store && ing.store.length > 0 ? `-${ing.store}` : ""}${ing.brand && ing.brand.length > 0 ? `-${ing.brand}` : ""}`;
          return ingredient.toLowerCase().includes(query.toLowerCase());
        }) ?? [];

  React.useEffect(() => {
    onSelect(ingredient);
  }, [ingredient]);

  return (
    <Combobox
      nullable
      value={ingredient}
      onChange={setIngredient}
      disabled={loading}
    >
      <div className="relative mt-1">
        <Combobox.Input
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search for an ingredient"
          as={Input}
          displayValue={(value) => {
            const ing = data?.find((ing) => ing.id === value);
            if (!ing) return "";
            return `${ing.name}${ing.store && ing.store.length > 0 ? `-${ing.store}` : ""}${ing.brand && ing.brand.length > 0 ? `-${ing.brand}` : ""}`;
          }}
        />
        <Transition
          as={React.Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options className="absolute mt-2 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-[100] max-h-32">
            {filteredIngredients.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                Nothing found.
              </div>
            ) : (
              filteredIngredients.map((ing) => (
                <Combobox.Option
                  key={ing.id}
                  value={ing.id}
                  className={({ active, selected }) =>
                    cn(
                      "relative cursor-default select-none py-2 pl-10 pr-4 text-muted-foreground",
                      active && "bg-primary-foreground text-primary",
                      selected && "bg-primary-foreground text-primary"
                    )
                  }
                >
                  {({ selected, active }) => (
                    <div className="flex items-center">
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-current">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                      {`${ing.name}${ing.store && ing.store.length > 0 ? `-${ing.store}` : ""}${ing.brand && ing.brand.length > 0 ? `-${ing.brand}` : ""}`}
                    </div>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
}
