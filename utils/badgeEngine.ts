import { Badge } from '../context/BadgeContext';

export const BADGE_DEFINITIONS: Record<string, Badge> = {
    'rookie': {
        id: 'rookie',
        name: 'The Rookie',
        desc: 'You completed your very first financial lesson. Welcome to the journey!',
        unlockRequirement: 'Complete your very first lesson.',
        iconColor: '#F59E0B'
    },
    'survivor': {
        id: 'survivor',
        name: '7-Day Survivor',
        desc: 'You have proven your dedication to financial literacy.',
        unlockRequirement: 'Maintain a 7-day learning streak.',
        iconColor: '#EF4444'
    },
    'offer-hacker': {
        id: 'offer-hacker',
        name: 'Offer Hacker',
        desc: 'You proved you know the difference between CTC and In-Hand Salary.',
        unlockRequirement: 'Master the "CTC Scam" lesson.',
        iconColor: '#3B82F6'
    },
    'tax-ninja': {
        id: 'tax-ninja',
        name: 'Tax Ninja',
        desc: 'You are now aware of all the basic tax implications.',
        unlockRequirement: 'Complete the entire "First Salary Blueprint" module.',
        iconColor: '#10B981'
    },
    'scam-shield': {
        id: 'scam-shield',
        name: 'Scam Shield',
        desc: 'You know exactly how to avoid modern financial traps.',
        unlockRequirement: 'Pass the "Avoiding Financial Scams" module.',
        iconColor: '#8B5CF6'
    },
    'diamond-hands': {
        id: 'diamond-hands',
        name: 'Diamond Hands',
        desc: 'You have solid fundamentals for long-term wealth building.',
        unlockRequirement: 'Unlock and complete Phase 3 (Wealth Builder).',
        iconColor: '#06B6D4'
    }
};

export interface UserEvaluationData {
    completedLessonsCount: number;
    streakCount: number;
    completedLessonIds: number[];
    completedModuleIds: number[];
}

export function evaluateBadges(
    actionType: 'LESSON_COMPLETE' | 'DAILY_LOGIN' | 'MODULE_COMPLETE',
    userData: UserEvaluationData,
    queueBadgeUnlock: (badge: Badge) => void,
    previouslyEarnedBadgeIds: string[]
) {
    // 1. Rookie Badge
    if (actionType === 'LESSON_COMPLETE') {
        if (userData.completedLessonsCount === 1 && !previouslyEarnedBadgeIds.includes('rookie')) {
            queueBadgeUnlock(BADGE_DEFINITIONS['rookie']);
        }

        // Example: Master "CTC Scam" lesson (suppose lesson ID is 4)
        if (userData.completedLessonIds.includes(4) && !previouslyEarnedBadgeIds.includes('offer-hacker')) {
            queueBadgeUnlock(BADGE_DEFINITIONS['offer-hacker']);
        }
    }

    // 2. Survivor Badge
    if (actionType === 'LESSON_COMPLETE' || actionType === 'DAILY_LOGIN') {
        if (userData.streakCount >= 7 && !previouslyEarnedBadgeIds.includes('survivor')) {
            queueBadgeUnlock(BADGE_DEFINITIONS['survivor']);
        }
    }

    // 3. Tax Ninja Badge (Suppose First Salary Blueprint is module ID 2)
    if (actionType === 'MODULE_COMPLETE') {
        if (userData.completedModuleIds.includes(2) && !previouslyEarnedBadgeIds.includes('tax-ninja')) {
            queueBadgeUnlock(BADGE_DEFINITIONS['tax-ninja']);
        }
    }

    // 4. Scam Shield Badge (Suppose Avoiding Financial Scams is module ID 3)
    if (actionType === 'MODULE_COMPLETE') {
        if (userData.completedModuleIds.includes(3) && !previouslyEarnedBadgeIds.includes('scam-shield')) {
            queueBadgeUnlock(BADGE_DEFINITIONS['scam-shield']);
        }
    }

    // 5. Diamond Hands Badge (Suppose Phase 3 Wealth Builder is module ID 4, 5, 6)
    if (actionType === 'MODULE_COMPLETE') {
        const wealthBuilderModules = [4, 5, 6];
        const hasAllWealthBuilder = wealthBuilderModules.every(id => userData.completedModuleIds.includes(id));
        if (hasAllWealthBuilder && !previouslyEarnedBadgeIds.includes('diamond-hands')) {
            queueBadgeUnlock(BADGE_DEFINITIONS['diamond-hands']);
        }
    }
}
