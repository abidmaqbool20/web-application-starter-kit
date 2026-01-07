"use client";

import { ThemeProvider } from "next-themes";
import { Provider } from "react-redux";
import { store } from "@/store";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "next-themes";
import { setTheme as setReduxTheme } from "@/slices/preferencesSlice";

function ThemeSync({ children }) {
  const dispatch = useDispatch();
  const { theme: reduxTheme } = useSelector((state) => state.preferences);
  const { theme, setTheme } = useTheme();

  // Sync Redux theme with next-themes on mount
  useEffect(() => {
    if (theme && theme !== reduxTheme) {
      dispatch(setReduxTheme(theme));
    }
  }, [theme, reduxTheme, dispatch]);

  return <>{children}</>;
}

export default function LayoutTheme({ children, defaultTheme = "system" }) {
  return (
    <Provider store={store}>
      <ThemeProvider
        attribute="class"
        defaultTheme={defaultTheme}
        enableSystem
        storageKey="theme"
        enableColorScheme
      >
        <ThemeSync>
          {children}
          <Toaster richColors position="top-right" />
        </ThemeSync>
      </ThemeProvider>
    </Provider>
  );
}
