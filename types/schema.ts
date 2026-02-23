
export interface Module {
    id: string;
    title: string;
    description: string | null;
    icon: string | null;
    color: string | null;
    order_index: number;
    created_at?: string;
    updated_at?: string;
}

export interface Lesson {
    id: string;
    module_id: string;
    title: string;
    duration: number | null;
    order_index: number;
    created_at?: string;
    updated_at?: string;
}

export type CardType = 'hook' | 'concept' | 'explanation' | 'example' | 'interaction' | 'advice' | 'quiz' | 'reward';

export interface Card {
    id: string;
    lesson_id: string;
    type: CardType;
    content: string;
    metadata: any; // Using any for generic JSONB as requested
    order_index: number;
    created_at?: string;
    updated_at?: string;
}
