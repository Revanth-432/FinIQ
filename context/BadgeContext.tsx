import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Badge {
    id: string;
    name: string;
    desc: string;
    iconColor?: string;
    unlockRequirement: string;
}

interface BadgeContextType {
    unlockedBadgesQueue: Badge[];
    queueBadgeUnlock: (badge: Badge) => void;
    shiftBadgeQueue: () => void;
}

const BadgeContext = createContext<BadgeContextType | undefined>(undefined);

export function BadgeProvider({ children }: { children: ReactNode }) {
    const [unlockedBadgesQueue, setUnlockedBadgesQueue] = useState<Badge[]>([]);

    const queueBadgeUnlock = (badge: Badge) => {
        setUnlockedBadgesQueue((prev) => [...prev, badge]);
    };

    const shiftBadgeQueue = () => {
        setUnlockedBadgesQueue((prev) => prev.slice(1));
    };

    return (
        <BadgeContext.Provider value={{ unlockedBadgesQueue, queueBadgeUnlock, shiftBadgeQueue }}>
            {children}
        </BadgeContext.Provider>
    );
}

export const useBadgeContext = () => {
    const context = useContext(BadgeContext);
    if (context === undefined) {
        throw new Error('useBadgeContext must be used within a BadgeProvider');
    }
    return context;
};
