import * as React from "react";
import { useTheme } from "next-themes";

import { META_THEME_COLORS } from "@/config/site";

export function useDarkModeMetaColor() {
  const { resolvedTheme } = useTheme();

  const darkModeMetaColor = React.useMemo(() => {
    return resolvedTheme !== "dark"
      ? META_THEME_COLORS.light
      : META_THEME_COLORS.dark;
  }, [resolvedTheme]);

  const setDarkModeMetaColor = React.useCallback((color: string) => {
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", color);
  }, []);

  return {
    darkModeMetaColor,
    setDarkModeMetaColor,
  };
}
