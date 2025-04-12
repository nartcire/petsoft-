"use client";

import React, { createContext, useState } from "react";

import { Pet } from "@/lib/types";

type PetContext = {
  pets: Pet[];
  selectedPetId: string | null;
  handleChangeSelectedPetId: (petId: string) => void;
  handleCheckoutPet: (petId: string) => void;
  selectedPet: Pet | undefined;
  numberOfPets: number;
};

export const PetContext = createContext<PetContext | null>(null);

type PetContextProviderProps = {
  children: React.ReactNode;
  data: Pet[];
};

export default function PetContextProvider({
  children,
  data,
}: PetContextProviderProps) {
  // state
  const [pets, setPets] = useState(data);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  // derived state
  const selectedPet = pets.find((pet) => pet.id === selectedPetId);
  const numberOfPets = pets.length;

  // event handlers / actions
  const handleCheckoutPet = (petId: string) => {
    setPets((prev) => prev.filter((pet) => pet.id !== petId));
    setSelectedPetId(null);
  };
  const handleChangeSelectedPetId = (petId: string) => setSelectedPetId(petId);

  return (
    <PetContext.Provider
      value={{
        pets,
        selectedPetId,
        handleChangeSelectedPetId,
        handleCheckoutPet,
        selectedPet,
        numberOfPets,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}
