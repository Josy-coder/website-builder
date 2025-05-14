import React from 'react';
import { useAnimationStore } from '../store/animationStore';
import { AnimationTimeline } from './AnimationTimeline';
import { ANIMATION_PRESETS, EASING_FUNCTIONS, AnimationType } from '../types';

interface AnimationPanelProps {
    className?: string;
    elementId?: string | null;
}

export const AnimationPanel: React.FC<AnimationPanelProps> = ({
                                                                  className = '',
                                                                  elementId = null
                                                              }) => {
    const {
        animations,
        selectedAnimationId,
        selectedTrackId,
        selectedKeyframeId,
        addAnimation,
        updateAnimation,
        removeAnimation,
        selectAnimation,
        addTrack,
        updateTrack,
        removeTrack,
        updateKeyframe,
        removeKeyframe,
        togglePreviewMode,
    } = useAnimationStore();

    const elementAnimations = elementId
        ? animations.filter(a => a.elementId === elementId)
        : [];

    const selectedAnimation = selectedAnimationId
        ? animations.find(a => a.id === selectedAnimationId)
        : null;

    const selectedTrack = selectedTrackId && selectedAnimation
        ? selectedAnimation.tracks.find(t => t.id === selectedTrackId)
        : null;

    const selectedKeyframe = selectedKeyframeId && selectedTrack
        ? selectedTrack.keyframes.find(k => k.id === selectedKeyframeId)
        : null;

    const animationTypes: AnimationType[] = ['entry', 'exit', 'hover', 'click', 'scroll'];
    const cssProperties = [
        'opacity',
        'transform.translateX',
        'transform.translateY',
        'transform.scale',
        'transform.rotate',
        'backgroundColor',
        'color',
        'width',
        'height',
    ];

    const handleAddAnimation = () => {
        if (!elementId) return;
        addAnimation(elementId, 'entry');
    };

    const handleAddPresetAnimation = (presetId: string) => {
        if (!elementId) return;
        // Find the animation type from the preset
        const preset = ANIMATION_PRESETS.find(p => p.id === presetId);
        const type: AnimationType = preset?.id.includes('out') ? 'exit' : 'entry';

        addAnimation(elementId, type, presetId);
    };

    const handleAnimationTypeChange = (type: AnimationType) => {
        if (!selectedAnimationId) return;
        updateAnimation(selectedAnimationId, { type });
    };

    const handleAnimationDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!selectedAnimationId) return;
        const duration = parseInt(e.target.value);
        updateAnimation(selectedAnimationId, { duration });
    };

    const handleAnimationDelayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!selectedAnimationId) return;
        const delay = parseInt(e.target.value);
        updateAnimation(selectedAnimationId, { delay });
    };

    const handleAnimationNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!selectedAnimationId) return;
        const name = e.target.value;
        updateAnimation(selectedAnimationId, { name });
    };

    const handleAddTrack = (property: string) => {
        if (!selectedAnimationId) return;
        addTrack(selectedAnimationId, property);
    };

    const handleTrackEasingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!selectedTrackId) return;
        const easing = e.target.value;
        updateTrack(selectedTrackId, { easing });
    };

    const handleKeyframeValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!selectedKeyframeId || !selectedTrackId) return;
        const value = e.target.value;
        updateKeyframe(selectedKeyframeId, selectedTrackId, {
            properties: { value }
        });
    };

    return (
        <div className={`animation-panel flex flex-col h-full ${className}`}>
            <div className="panel-header flex justify-between items-center">
                <span>Animations</span>
                {elementId && (
                    <button
                        className="text-sm text-primary hover:text-primary/90 px-2 py-1 rounded-md"
                        onClick={() => togglePreviewMode()}
                    >
                        Preview
                    </button>
                )}
            </div>

            <div className="panel-content flex-1 overflow-y-auto">
                {elementId ? (
                    <>
                        <div className="mb-4">
                            <div className="text-sm font-medium mb-2">Element Animations</div>

                            {elementAnimations.length > 0 ? (
                                <div className="space-y-2">
                                    {elementAnimations.map(animation => (
                                        <div
                                            key={animation.id}
                                            className={`p-2 border rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                                                selectedAnimationId === animation.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'
                                            }`}
                                            onClick={() => selectAnimation(animation.id)}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <div className="font-medium">{animation.name}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        Type: {animation.type}, Duration: {animation.duration}ms
                                                    </div>
                                                </div>
                                                <button
                                                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeAnimation(animation.id);
                                                    }}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-gray-500 dark:text-gray-400 mb-4">
                                    No animations added to this element.
                                </div>
                            )}

                            <div className="mt-4">
                                <button
                                    className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm"
                                    onClick={handleAddAnimation}
                                >
                                    Add Animation
                                </button>
                            </div>

                            <div className="mt-4">
                                <div className="text-sm font-medium mb-2">Quick Add Presets</div>
                                <div className="grid grid-cols-2 gap-2">
                                    {ANIMATION_PRESETS.map(preset => (
                                        <button
                                            key={preset.id}
                                            className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                                            onClick={() => handleAddPresetAnimation(preset.id)}
                                        >
                                            {preset.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {selectedAnimation && (
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                                <div className="text-sm font-medium mb-2">Animation Settings</div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            value={selectedAnimation.name}
                                            onChange={handleAnimationNameChange}
                                            className="w-full px-2 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-md"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                            Type
                                        </label>
                                        <select
                                            value={selectedAnimation.type}
                                            onChange={(e) => handleAnimationTypeChange(e.target.value as AnimationType)}
                                            className="w-full px-2 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-md"
                                        >
                                            {animationTypes.map(type => (
                                                <option key={type} value={type}>
                                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                            Duration (ms)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="100"
                                            value={selectedAnimation.duration}
                                            onChange={handleAnimationDurationChange}
                                            className="w-full px-2 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-md"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                            Delay (ms)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="100"
                                            value={selectedAnimation.delay}
                                            onChange={handleAnimationDelayChange}
                                            className="w-full px-2 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-md"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="text-sm font-medium">Tracks</div>
                                        <div className="relative">
                                            <select
                                                className="px-2 py-1 text-xs border border-gray-200 dark:border-gray-700 rounded-md appearance-none"
                                                onChange={(e) => {
                                                    if (e.target.value) {
                                                        handleAddTrack(e.target.value);
                                                        e.target.value = '';
                                                    }
                                                }}
                                                defaultValue=""
                                            >
                                                <option value="" disabled>Add Property</option>
                                                {cssProperties.map(prop => (
                                                    <option key={prop} value={prop}>{prop}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {selectedAnimation.tracks.length > 0 ? (
                                        <div className="space-y-2">
                                            {selectedAnimation.tracks.map(track => (
                                                <div
                                                    key={track.id}
                                                    className={`p-2 border rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                                                        selectedTrackId === track.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'
                                                    }`}
                                                    onClick={() => selectTrack(track.id)}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div className="font-medium text-sm">{track.property}</div>
                                                        <button
                                                            className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1 text-xs"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeTrack(track.id);
                                                            }}
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>

                                                    {selectedTrackId === track.id && (
                                                        <div className="mt-2">
                                                            <div className="mb-2">
                                                                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                                    Easing
                                                                </label>
                                                                <select
                                                                    value={track.easing}
                                                                    onChange={handleTrackEasingChange}
                                                                    className="w-full px-2 py-1 text-xs border border-gray-200 dark:border-gray-700 rounded-md"
                                                                >
                                                                    {Object.entries(EASING_FUNCTIONS).map(([name, value]) => (
                                                                        <option key={name} value={value}>{name}</option>
                                                                    ))}
                                                                </select>
                                                            </div>

                                                            <div>
                                                                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                                    Keyframes
                                                                </div>
                                                                <div className="space-y-1">
                                                                    {track.keyframes.map(keyframe => (
                                                                        <div
                                                                            key={keyframe.id}
                                                                            className={`flex items-center p-1 rounded-md text-xs ${
                                                                                selectedKeyframeId === keyframe.id ? 'bg-blue-100 dark:bg-blue-900/30' : ''
                                                                            }`}
                                                                            onClick={() => selectKeyframe(keyframe.id)}
                                                                        >
                                                                            <div className="w-12">{keyframe.time}ms:</div>
                                                                            <input
                                                                                type="text"
                                                                                value={keyframe.properties.value}
                                                                                onChange={handleKeyframeValueChange}
                                                                                className="flex-1 px-1 py-0.5 text-xs border border-gray-200 dark:border-gray-700 rounded-md"
                                                                                onClick={(e) => e.stopPropagation()}
                                                                            />
                                                                            <button
                                                                                className="ml-1 text-red-500 hover:text-red-700 dark:hover:text-red-400 p-0.5"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    removeKeyframe(keyframe.id, track.id);
                                                                                }}
                                                                            >
                                                                                X
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-gray-500 dark:text-gray-400 text-sm">
                                            No animation tracks added. Add a property to animate.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                            <AnimationTimeline className="h-64" />
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                        Select an element to edit animations
                    </div>
                )}
            </div>
        </div>
    );
};