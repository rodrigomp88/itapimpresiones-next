"use client";

import { SessionProvider } from "next-auth/react";
import { Provider as ReduxProvider } from "react-redux";
import React from "react";
import store from "../redux/store";
import PreloadResources from "../components/PreloadResources";
import { ThemeProvider } from "../components/ThemeProvider";

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SessionProvider>
      <ReduxProvider store={store}>
        <ThemeProvider defaultTheme="light" storageKey="itap-theme">
          <PreloadResources />
          {children}
        </ThemeProvider>
      </ReduxProvider>
    </SessionProvider>
  );
};

export default Providers;
