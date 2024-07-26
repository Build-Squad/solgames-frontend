"use client";

import React, { createContext, useState, useContext } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Backdrop } from "@mui/material";

const LoaderContext = createContext(null);

export const LoaderProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const showLoader = () => setIsLoading(true);
  const hideLoader = () => setIsLoading(false);

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {children}
      {isLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: 1500 }}
          open={true}
          onClick={null}
        >
          <CircularProgress size={48} thickness={4} />
        </Backdrop>
      )}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);
