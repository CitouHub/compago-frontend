import React, { createContext, useContext, useEffect, useState } from "react";
import { CacheContextType } from "./cache-context-type";
import { useLocation } from "react-router-dom";

const CacheContext = createContext<CacheContextType>(null!);

export default function CacheProvider({ children }: { children: React.ReactNode }) {
    const [keys, setKeys] = useState<Record<string, string | undefined>>({});
    const [currentSection, setCurrentSection] = useState<string>('');

    const location = useLocation();

    const update = (...items: { key: string, value?: string | undefined }[]) => {
        let updateKeys = { ...keys }
        let changes = false;

        items.forEach(_ => {
            if (updateKeys[_.key] !== _.value) {
                updateKeys[_.key] = _.value;
                changes = true;
            }
        });

        if (changes) {
            setKeys(updateKeys);
        }
    }

    const remove = (key: string) => {
        let updateKeys = { ...keys }
        let changes = false;
        
        if (updateKeys[key] !== undefined) {
            updateKeys[key] = undefined;
            changes = true;
        }

        if (changes) {
            setKeys(updateKeys);
        }
    }

    useEffect(() => {
        const sections = location.pathname.split("/").filter(_ => _.length > 0);
        const newSection = `${sections.length >= 1 ? sections[0] : ''}/${sections.length >= 2 ? sections[1] : ''}`;
        if (currentSection !== newSection) {
            setCurrentSection(newSection);

            let changes = false;
            let updateKeys = { ...keys }

            if (changes) {
                setKeys(updateKeys);
            }
        }
    }, [currentSection, keys, location.pathname])

    let value = { keys, update, remove };

    return <CacheContext.Provider value={value}>{children}</CacheContext.Provider>;
};

export function useCache() {
    return useContext(CacheContext);
}