import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import {
    Animation,
    AnimationTimeline,
    AnimationTrack,
    KeyframePoint,
    ANIMATION_PRESETS,
} from '../types';

interface AnimationState extends AnimationTimeline {
    pageId: string | null;
    previewMode: boolean;
}

interface AnimationActions {
    setCurrentTime: (time: number) => void;
    togglePlayback: () => void;
    stopPlayback: () => void;

    addAnimation: (elementId: string, type: Animation['type'], presetId?: string) => void;
    updateAnimation: (id: string, updates: Partial<Omit<Animation, 'id' | 'tracks'>>) => void;
    removeAnimation: (id: string) => void;
    selectAnimation: (id: string | null) => void;

    addTrack: (animationId: string, property: string) => void;
    updateTrack: (id: string, updates: Partial<Omit<AnimationTrack, 'id' | 'keyframes'>>) => void;
    removeTrack: (id: string) => void;
    selectTrack: (id: string | null) => void;

    addKeyframe: (trackId: string, time: number, properties: Record<string, any>) => void;
    updateKeyframe: (id: string, trackId: string, updates: Partial<Omit<KeyframePoint, 'id'>>) => void;
    removeKeyframe: (id: string, trackId: string) => void;
    selectKeyframe: (id: string | null) => void;

    setPageId: (pageId: string | null) => void;
    togglePreviewMode: () => void;

    clearAnimations: () => void;
    importAnimations: (animations: Animation[]) => void;
}

const initialState: AnimationState = {
    animations: [],
    currentTime: 0,
    isPlaying: false,
    selectedAnimationId: null,
    selectedTrackId: null,
    selectedKeyframeId: null,
    pageId: null,
    previewMode: false,
};

export const useAnimationStore = create<AnimationState & AnimationActions>()(
    devtools(
        immer((set, get) => ({
            ...initialState,

            setCurrentTime: (time) => {
                set((state) => {
                    state.currentTime = time;
                });
            },

            togglePlayback: () => {
                set((state) => {
                    state.isPlaying = !state.isPlaying;
                });
            },

            stopPlayback: () => {
                set((state) => {
                    state.isPlaying = false;
                    state.currentTime = 0;
                });
            },

            addAnimation: (elementId, type, presetId) => {
                set((state) => {
                    const id = crypto.randomUUID();
                    let tracks: AnimationTrack[] = [];
                    let duration = 1000;

                    if (presetId) {
                        const preset = ANIMATION_PRESETS.find((p) => p.id === presetId);
                        if (preset) {
                            tracks = preset.tracks.map((track) => ({
                                ...track,
                                id: crypto.randomUUID(),
                                elementId,
                            }));
                            duration = preset.duration;
                        }
                    }

                    const newAnimation: Animation = {
                        id,
                        elementId,
                        name: `${type} animation`,
                        type,
                        tracks,
                        duration,
                        delay: 0,
                    };

                    state.animations.push(newAnimation);
                    state.selectedAnimationId = id;
                });
            },

            updateAnimation: (id, updates) => {
                set((state) => {
                    const index = state.animations.findIndex((a) => a.id === id);
                    if (index !== -1) {
                        Object.assign(state.animations[index], updates);
                    }
                });
            },

            removeAnimation: (id) => {
                set((state) => {
                    state.animations = state.animations.filter((a) => a.id !== id);
                    if (state.selectedAnimationId === id) {
                        state.selectedAnimationId = null;
                    }
                });
            },

            selectAnimation: (id) => {
                set((state) => {
                    state.selectedAnimationId = id;
                    state.selectedTrackId = null;
                    state.selectedKeyframeId = null;
                });
            },

            addTrack: (animationId, property) => {
                set((state) => {
                    const animation = state.animations.find((a) => a.id === animationId);
                    if (!animation) return;

                    const id = crypto.randomUUID();
                    const newTrack: AnimationTrack = {
                        id,
                        elementId: animation.elementId,
                        property,
                        keyframes: [
                            {
                                id: crypto.randomUUID(),
                                time: 0,
                                properties: { value: property === 'opacity' ? 0 : '0px' },
                            },
                            {
                                id: crypto.randomUUID(),
                                time: animation.duration,
                                properties: { value: property === 'opacity' ? 1 : '100px' },
                            },
                        ],
                        easing: 'ease-in-out',
                    };

                    animation.tracks.push(newTrack);
                    state.selectedTrackId = id;
                });
            },

            updateTrack: (id, updates) => {
                set((state) => {
                    for (const animation of state.animations) {
                        const trackIndex = animation.tracks.findIndex((t) => t.id === id);
                        if (trackIndex !== -1) {
                            Object.assign(animation.tracks[trackIndex], updates);
                            break;
                        }
                    }
                });
            },

            removeTrack: (id) => {
                set((state) => {
                    for (const animation of state.animations) {
                        const trackIndex = animation.tracks.findIndex((t) => t.id === id);
                        if (trackIndex !== -1) {
                            animation.tracks.splice(trackIndex, 1);
                            if (state.selectedTrackId === id) {
                                state.selectedTrackId = null;
                                state.selectedKeyframeId = null;
                            }
                            break;
                        }
                    }
                });
            },

            selectTrack: (id) => {
                set((state) => {
                    state.selectedTrackId = id;
                    state.selectedKeyframeId = null;
                });
            },

            addKeyframe: (trackId, time, properties) => {
                set((state) => {
                    for (const animation of state.animations) {
                        const track = animation.tracks.find((t) => t.id === trackId);
                        if (track) {
                            const id = crypto.randomUUID();
                            track.keyframes.push({
                                id,
                                time,
                                properties,
                            });

                            track.keyframes.sort((a, b) => a.time - b.time);

                            state.selectedKeyframeId = id;
                            break;
                        }
                    }
                });
            },

            updateKeyframe: (id, trackId, updates) => {
                set((state) => {
                    for (const animation of state.animations) {
                        const track = animation.tracks.find((t) => t.id === trackId);
                        if (track) {
                            const keyframeIndex = track.keyframes.findIndex((k) => k.id === id);
                            if (keyframeIndex !== -1) {
                                Object.assign(track.keyframes[keyframeIndex], updates);

                                // Re-sort keyframes if time changed
                                if (updates.time !== undefined) {
                                    track.keyframes.sort((a, b) => a.time - b.time);
                                }

                                break;
                            }
                        }
                    }
                });
            },

            removeKeyframe: (id, trackId) => {
                set((state) => {
                    for (const animation of state.animations) {
                        const track = animation.tracks.find((t) => t.id === trackId);
                        if (track) {
                            track.keyframes = track.keyframes.filter((k) => k.id !== id);
                            if (state.selectedKeyframeId === id) {
                                state.selectedKeyframeId = null;
                            }
                            break;
                        }
                    }
                });
            },

            selectKeyframe: (id) => {
                set((state) => {
                    state.selectedKeyframeId = id;
                });
            },

            setPageId: (pageId) => {
                set((state) => {
                    state.pageId = pageId;
                });
            },

            togglePreviewMode: () => {
                set((state) => {
                    state.previewMode = !state.previewMode;
                    if (state.previewMode) {
                        state.currentTime = 0;
                        state.isPlaying = true;
                    } else {
                        state.isPlaying = false;
                    }
                });
            },

            clearAnimations: () => {
                set((state) => {
                    state.animations = [];
                    state.selectedAnimationId = null;
                    state.selectedTrackId = null;
                    state.selectedKeyframeId = null;
                });
            },

            importAnimations: (animations) => {
                set((state) => {
                    state.animations = animations;
                });
            },
        }))
    )
);