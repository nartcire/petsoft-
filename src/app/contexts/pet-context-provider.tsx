"use client";

import React, { createContext, useState } from "react";

import { Pet } from "@/lib/types";
import { addPet } from "../actions/actions";

type PetContext = {
  pets: Pet[];
  selectedPetId: string | null;
  handleChangeSelectedPetId: (petId: string) => void;
  handleAddPet: (newPet: Omit<Pet, "id">) => void;
  handleEditPet: (id: string, newPetData: Omit<Pet, "id">) => void;
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
  data: pets,
}: PetContextProviderProps) {
  // state;
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  // derived state
  const selectedPet = pets.find((pet) => pet.id === selectedPetId);
  const numberOfPets = pets.length;

  // event handlers / actions
  const handleAddPet = async (newPet: Omit<Pet, "id">) => {
    // setPets((prev) => [...prev, { ...newPet, id: Date.now().toString() }]);

    await addPet(newPet);
  };

  const handleEditPet = (id: string, newPetData: Omit<Pet, "id">) => {};

  const handleCheckoutPet = (petId: string) => {};
  const handleChangeSelectedPetId = (petId: string) => setSelectedPetId(petId);

  return (
    <PetContext.Provider
      value={{
        pets,
        selectedPetId,
        handleChangeSelectedPetId,
        handleCheckoutPet,
        handleEditPet,
        handleAddPet,
        selectedPet,
        numberOfPets,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}
