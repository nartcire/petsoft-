"use client";

import React, { createContext, useState } from "react";

type SearchContext = {
  searchText: string;
  handleChangeSearchText: (text: string) => void;
};

export const SearchContext = createContext<SearchContext | null>(null);

export default function SearchContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchText, setSearchText] = useState("");

  const handleChangeSearchText = (text: string) => setSearchText(text);

  return (
    <SearchContext.Provider value={{ searchText, handleChangeSearchText }}>
      {children}
    </SearchContext.Provider>
  );
}
