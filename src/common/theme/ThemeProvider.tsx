import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ConfigProvider, theme } from "antd";

type ThemeContextType = {
  darkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider = ({
  children,
}: ThemeProviderProps) => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem(
      "competition-manager-theme"
    );

    if (savedTheme) {
      return savedTheme === "dark";
    }

    return true;
  });

  useEffect(() => {
    localStorage.setItem(
      "competition-manager-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((previous) => !previous);
  };

  const themeConfig = useMemo(
    () => ({
      algorithm: darkMode
        ? theme.darkAlgorithm
        : theme.defaultAlgorithm,

      token: {
        colorPrimary: "#1677ff",
        borderRadius: 10,
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      },

      components: {
        Layout: {
          headerBg: darkMode ? "#0b0d11" : "#ffffff",
          siderBg: darkMode ? "#0b0d11" : "#ffffff",
          bodyBg: darkMode ? "#08090c" : "#f5f7fa",
        },

        Menu: darkMode
          ? {
              darkItemBg: "#0b0d11",
              darkItemColor: "#98a2b3",
              darkItemSelectedColor: "#ffffff",
              darkItemSelectedBg:
                "rgba(22,119,255,0.14)",
              darkItemHoverColor: "#ffffff",
              darkItemHoverBg:
                "rgba(255,255,255,0.04)",
              itemBorderRadius: 10,
            }
          : {
              itemColor: "#475467",
              itemSelectedColor: "#1677ff",
              itemSelectedBg: "#eaf2ff",
              itemHoverColor: "#1677ff",
              itemHoverBg: "#f5f8ff",
              itemBorderRadius: 10,
            },

        Button: {
          borderRadius: 10,
        },

        Card: {
          borderRadiusLG: 18,
        },
      },
    }),
    [darkMode]
  );

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        toggleTheme,
      }}
    >
      <ConfigProvider theme={themeConfig}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useAppTheme must be used inside ThemeProvider"
    );
  }

  return context;
};