"use client";

import * as React from "react";
import { Combobox, Transition } from "@headlessui/react";
import { Input } from "../ui/input";

type BaseComboboxProps<T> = {
  value: T | null;
  disabled?: boolean;
  children: React.ReactNode;
  setValue: (value: T | null) => void;
  setSearchTerm: (query: string) => void;
  setDisplayValue: (value: T) => string;
  comboboxInputProps?: {
    placeholder?: string;
    className?: string;
  };
};

export function BaseCombobox<T>({
  disabled,
  setSearchTerm,
  setDisplayValue,
  children,
  value,
  setValue,
  comboboxInputProps,
}: BaseComboboxProps<T>) {
  return (
    <Combobox nullable value={value} onChange={setValue} disabled={disabled}>
      <div className="relative mt-1">
        <Combobox.Input
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search for an ingredient"
          as={Input}
          displayValue={setDisplayValue}
          {...comboboxInputProps}
        />
        <Transition
          as={React.Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setSearchTerm("")}
        >
          <Combobox.Options className="absolute mt-2 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-[100] max-h-32">
            {children}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
}
