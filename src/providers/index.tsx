"use client";
import React from "react";
import { useStorageListenerLogout } from "@hooks/useStorageListenerLogout";
import { useConnection } from "@hooks/useConnection";
import CustomThemeProvider from "./ThemeProvider";
import ReduxProvider from "./ReduxProvider";
import ToastProvider from "./ToastProvider";
import GeneralLoading from "./GeneralLoading";
import { ClientErrorBoundary } from "./ClientErrorBoundary";
import { useGlobalErrorListener } from "@/providers/useGlobalErrorListener";

const BaseProvider = ({ children }: any) => {
  if (process.env.NODE_ENV === "production") {
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
  }
  useGlobalErrorListener();
  useStorageListenerLogout();
  useConnection();
  return (
    <ClientErrorBoundary>
      <ReduxProvider>
        <CustomThemeProvider>
          <ToastProvider>
            <GeneralLoading>{children}</GeneralLoading>
          </ToastProvider>
        </CustomThemeProvider>
      </ReduxProvider>
    </ClientErrorBoundary>
  );
};

export default BaseProvider;
