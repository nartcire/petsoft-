"use client";

import { useSearchContext } from "@/lib/hooks";

export default function SearchForm() {
  const { searchText, handleChangeSearchText } = useSearchContext();

  return (
    <form className="w-full h-full">
      <input
        className="w-full h-full bg-white/20 rounded-md px-5 outline-none transition focus:bg-white/50 hover:bg-white/30 placeholder:text-white/50"
        placeholder="Search pets"
        type="search"
        value={searchText}
        onChange={(e) => handleChangeSearchText(e.target.value)}
      />
    </form>
  );
}
