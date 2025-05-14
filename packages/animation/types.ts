export interface KeyframePoint {
    id: string;
    time: number; // Time in milliseconds
    properties: Record<string, any>;
}

export interface AnimationTrack {
    id: string;
    elementId: string;
    property: string;
    keyframes: KeyframePoint[];
    easing: string;
}

export type AnimationType = 'entry' | 'exit' | 'hover' | 'click' | 'scroll';

export interface Animation {
    id: string;
    elementId: string;
    name: string;
    type: AnimationType;
    tracks: AnimationTrack[];
    duration: number; // Total time in milliseconds
    delay: number;
}

export interface AnimationTimeline {
    animations: Animation[];
    currentTime: number;
    isPlaying: boolean;
    selectedAnimationId: string | null;
    selectedTrackId: string | null;
    selectedKeyframeId: string | null;
}

export interface AnimationPreset {
    id: string;
    name: string;
    category: string;
    tracks: Omit<AnimationTrack, 'id' | 'elementId'>[];
    duration: number;
}

export const EASING_FUNCTIONS = {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.42, 0, 1.0, 1.0)',
    easeOut: 'cubic-bezier(0, 0, 0.58, 1.0)',
    easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1.0)',
    easeInBack: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
    easeOutBack: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    easeInOutBack: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
};

export const ANIMATION_PRESETS: AnimationPreset[] = [
    {
        id: 'fade-in',
        name: 'Fade In',
        category: 'Fade',
        tracks: [
            {
                property: 'opacity',
                keyframes: [
                    { id: '1', time: 0, properties: { value: 0 } },
                    { id: '2', time: 1000, properties: { value: 1 } },
                ],
                easing: EASING_FUNCTIONS.easeInOut,
            },
        ],
        duration: 1000,
    },
    {
        id: 'fade-out',
        name: 'Fade Out',
        category: 'Fade',
        tracks: [
            {
                property: 'opacity',
                keyframes: [
                    { id: '1', time: 0, properties: { value: 1 } },
                    { id: '2', time: 1000, properties: { value: 0 } },
                ],
                easing: EASING_FUNCTIONS.easeInOut,
            },
        ],
        duration: 1000,
    },
    {
        id: 'slide-in-right',
        name: 'Slide In Right',
        category: 'Slide',
        tracks: [
            {
                property: 'transform.translateX',
                keyframes: [
                    { id: '1', time: 0, properties: { value: '100%' } },
                    { id: '2', time: 1000, properties: { value: '0%' } },
                ],
                easing: EASING_FUNCTIONS.easeOut,
            },
            {
                property: 'opacity',
                keyframes: [
                    { id: '1', time: 0, properties: { value: 0 } },
                    { id: '2', time: 750, properties: { value: 1 } },
                ],
                easing: EASING_FUNCTIONS.easeInOut,
            },
        ],
        duration: 1000,
    },
    {
        id: 'bounce-in',
        name: 'Bounce In',
        category: 'Bounce',
        tracks: [
            {
                property: 'transform.scale',
                keyframes: [
                    { id: '1', time: 0, properties: { value: 0.3 } },
                    { id: '2', time: 500, properties: { value: 1.1 } },
                    { id: '3', time: 750, properties: { value: 0.9 } },
                    { id: '4', time: 1000, properties: { value: 1 } },
                ],
                easing: EASING_FUNCTIONS.easeOutBack,
            },
            {
                property: 'opacity',
                keyframes: [
                    { id: '1', time: 0, properties: { value: 0 } },
                    { id: '2', time: 500, properties: { value: 1 } },
                ],
                easing: EASING_FUNCTIONS.easeInOut,
            },
        ],
        duration: 1000,
    },
];