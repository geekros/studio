// Copyright 2024 GEEKROS, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { createContext, useContext, useEffect, useState } from "react";

type Mode = "dark" | "light" | "system";

type Theme = "default" | "red" | "rose" | "orange" | "green" | "teal" | "blue" | "amber" | "yellow" | "violet" | "purple";

type Radius = "0" | "0.3" | "0.5" | "0.75" | "1.0";

type ThemeProps = {
    children: React.ReactNode;
    defaultTheme?: Theme;
    defaultMode?: Mode;
    defaultRadius?: Radius;
};

type ThemeType = {
    mode: Mode;
    theme?: Theme;
    radius?: Radius;
    setMode: (mode: Mode) => void;
    setTheme: (theme: Theme) => void;
    setRadius: (radius: Radius) => void;
};

const local_storage_mode_name = "mode";
const local_storage_theme_name = "theme";
const local_storage_radius_name = "radius";

const Context = createContext<ThemeType>({
    mode: "system",
    theme: "default",
    radius: "0.75",
    setMode: (_mode: Mode) => null,
    setTheme: (_theme: Theme) => null,
    setRadius: (_radius: Radius) => null,
});

export const useTheme = () => useContext<ThemeType>(Context);

export const ThemeContext = ({ children, defaultMode = "system", defaultTheme = "default", defaultRadius = "0.75", ...props }: ThemeProps) => {
    const [mode, setMode] = useState<Mode>(() => (localStorage.getItem(local_storage_mode_name) as Mode) || defaultMode);
    const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem(local_storage_theme_name) as Theme) || defaultTheme);
    const [radius, setRadius] = useState<Radius>(() => (localStorage.getItem(local_storage_radius_name) as Radius) || defaultRadius);

    function updateMode() {
        const root = window.document.documentElement;
        const body = document.body;

        root.classList.remove("light", "dark");

        root.classList.add("[&_*]:!transition-none");

        if (mode === "system") {
            const systemMode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            root.classList.add(systemMode);
            localStorage.setItem(local_storage_mode_name, systemMode);
            setMode(systemMode);
        }

        root.classList.add(mode);

        const vscodeTheme = body.dataset["vscodeThemeKind"];
        if (vscodeTheme) {
            const themeMode = vscodeTheme === "vscode-dark" ? "dark" : "light";
            root.classList.add(themeMode);
            localStorage.setItem(local_storage_mode_name, themeMode);
            setMode(themeMode);
        }

        setTimeout(() => {
            root.classList.remove("[&_*]:!transition-none");
        }, 50);
    }

    function updateTheme() {
        const root = window.document.documentElement;

        root.classList.remove("theme-default", "theme-red", "theme-rose", "theme-orange", "theme-teal", "theme-green", "theme-blue", "theme-amber", "theme-yellow", "theme-violet", "theme-purple");

        root.classList.add("[&_*]:!transition-none");

        root.classList.add("theme-" + theme);

        localStorage.setItem(local_storage_theme_name, theme);

        setTimeout(() => {
            root.classList.remove("[&_*]:!transition-none");
        }, 50);
    }

    function updateRadius() {
        const root = window.document.documentElement;

        root.classList.add("[&_*]:!transition-none");

        root.style.setProperty("--radius", `${radius}rem`);

        localStorage.setItem(local_storage_radius_name, radius);

        setTimeout(() => {
            root.classList.remove("[&_*]:!transition-none");
        }, 50);
    }

    const value = {
        mode,
        setMode: (mode: Mode) => {
            localStorage.setItem(local_storage_mode_name, mode);
            setMode(mode);
        },
        theme,
        setTheme: (theme: Theme) => {
            localStorage.setItem(local_storage_theme_name, theme);
            setTheme(theme);
        },
        radius,
        setRadius: (radius: Radius) => {
            localStorage.setItem(local_storage_radius_name, radius);
            setRadius(radius);
        },
    };

    useEffect(() => {
        updateMode();
        updateTheme();
        updateRadius();
    }, [mode, theme, radius]);

    return (
        <Context {...props} value={value}>
            {children}
        </Context>
    );
};
