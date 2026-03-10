import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Search, Plus, Bell } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function AdminLayout() {
    const [theme, setTheme] = useState<"light" | "dark" | "gray">("dark");

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark", "gray");
        root.classList.add(theme);
    }, [theme]);

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[280px_1fr]">
                <Sidebar theme={theme} setTheme={setTheme} />

                <main className="bg-background px-5 py-5 md:px-8 lg:px-10 transition-colors duration-300 flex flex-col">
                    <header className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div className="relative w-full xl:w-96">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                className="rounded-2xl pl-10 h-11"
                                placeholder="Buscar en el portal..."
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <Button size="icon" variant="outline" className="rounded-2xl h-11 w-11">
                                <Bell className="h-4 w-4" />
                            </Button>
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                M
                            </div>
                        </div>
                    </header>

                    <div className="flex-1">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
