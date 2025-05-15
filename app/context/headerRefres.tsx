"use client";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

const HeaderRefreshContext = createContext({
  refreshKey: 0,
  bump: () => {},
});

export function HeaderRefreshProvider({ children }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const bump = () => setRefreshKey((prev) => prev + 1);

  return (
    <HeaderRefreshContext.Provider value={{ refreshKey, bump }}>
      {children}
    </HeaderRefreshContext.Provider>
  );
}

export const useHeaderRefresh = () => useContext(HeaderRefreshContext);