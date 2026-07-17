import { createContext, useContext, useState } from "react";

export const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [searchOption, setSearchOption] = useState("movies");

  return (
    <SearchContext.Provider value={{ searchOption, setSearchOption }}>
      {children}
    </SearchContext.Provider>
  );
}