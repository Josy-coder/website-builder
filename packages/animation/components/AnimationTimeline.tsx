import React, { useState, useEffect, useRef } from 'react';
import { useAnimationStore } from '../store/animationStore';
import { AnimationTrack, KeyframePoint } from '../types';

interface AnimationTimelineProps {
    className?: string;
}

export const AnimationTimeline: React.FC<AnimationTimelineProps> = ({ className = '' }) => {
    const timelineRef = useRef<HTMLDivElement>(null);
    const [timeScale, setTimeScale] = useState(1); // pixels per millisecond
    const [draggingTimeline, setDraggingTimeline] = useState(false);
    const [draggingKeyframe, setDraggingKeyframe] = useState<KeyframePoint | null>(null);
    const [dragStartX, setDragStartX] = useState(0);
    const [dragStartTime, setDragStartTime] = useState(0);

    const {
        animations,
        currentTime,
        isPlaying,
        selectedAnimationId,
        selectedTrackId,
        selectedKeyframeId,
        setCurrentTime,
        togglePlayback,
        stopPlayback,
        updateKeyframe,
        selectKeyframe,
        selectTrack,
    } = useAnimationStore();

    const selectedAnimation = animations.find(a => a.id === selectedAnimationId);

    const maxDuration = animations.reduce((max, anim) => {
        const trackDurations = anim.tracks.reduce((tMax, track) => {
            const lastKeyframe = track.keyframes.length > 0
                ? track.keyframes.reduce((latest, kf) => latest.time > kf.time ? latest : kf).time
                : 0;
            return Math.max(tMax, lastKeyframe);
        }, 0);
        return Math.max(max, anim.duration, trackDurations);
    }, 3000);

    const timelineWidth = maxDuration * timeScale;

    useEffect(() => {
        if (!isPlaying) return;

        let animationFrame: number;
        let lastTime = Date.now();

        const animate = () => {
            const now = Date.now();
            const delta = now - lastTime;
            lastTime = now;

            setCurrentTime(prevTime => {
                const newTime = prevTime + delta;
                if (newTime >= maxDuration) {
                    stopPlayback();
                    return 0;
                }
                return newTime;
            });

            animationFrame = requestAnimationFrame(animate);
        };

        animationFrame = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrame);
        };
    }, [isPlaying, maxDuration, setCurrentTime, stopPlayback]);

    const handleTimelineClick = (e: React.MouseEvent) => {
        if (!timelineRef.current) return;

        const rect = timelineRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const newTime = Math.max(0, Math.min(maxDuration, x / timeScale));

        setCurrentTime(newTime);
    };

    const handleTimelineDragStart = (e: React.MouseEvent) => {
        if (!timelineRef.current) return;

        setDraggingTimeline(true);
        setDragStartX(e.clientX);
        setDragStartTime(currentTime);

        e.preventDefault();
    };

    const handleKeyframeDragStart = (e: React.MouseEvent, keyframe: KeyframePoint, trackId: string) => {
        selectKeyframe(keyframe.id);
        selectTrack(trackId);

        setDraggingKeyframe(keyframe);
        setDragStartX(e.clientX);
        setDragStartTime(keyframe.time);

        e.stopPropagation();
        e.preventDefault();
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (draggingTimeline) {
            if (!timelineRef.current) return;

            const deltaX = e.clientX - dragStartX;
            const timeDelta = deltaX / timeScale;
            const newTime = Math.max(0, Math.min(maxDuration, dragStartTime + timeDelta));

            setCurrentTime(newTime);
        } else if (draggingKeyframe && selectedTrackId) {
            const deltaX = e.clientX - dragStartX;
            const timeDelta = deltaX / timeScale;
            const newTime = Math.max(0, Math.min(maxDuration, dragStartTime + timeDelta));

            updateKeyframe(draggingKeyframe.id, selectedTrackId, { time: newTime });
        }
    };

    const handleMouseUp = () => {
        setDraggingTimeline(false);
        setDraggingKeyframe(null);
    };

    useEffect(() => {
        // Handle mouse up outside the component
        const handleGlobalMouseUp = () => {
            setDraggingTimeline(false);
            setDraggingKeyframe(null);
        };

        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => {
            window.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, []);

    const handleZoomIn = () => {
        setTimeScale(prev => Math.min(prev * 1.5, 0.1));
    };

    const handleZoomOut = () => {
        setTimeScale(prev => Math.max(prev / 1.5, 0.01));
    };

    const timeMarkers = [];
    const markerSpacing = 1000;
    const numMarkers = Math.ceil(maxDuration / markerSpacing);

    for (let i = 0; i <= numMarkers; i++) {
        const time = i * markerSpacing;
        const position = time * timeScale;

        timeMarkers.push(
            <div
                key={i}
                className="absolute top-0 h-full border-l border-gray-300 dark:border-gray-600"
                style={{ left: `${position}px` }}
            >
                <div className="text-xs text-gray-500 dark:text-gray-400 pl-1">
                    {(time / 1000).toFixed(1)}s
                </div>
            </div>
        );
    }

    return (
        <div
            className={`animation-timeline flex flex-col ${className}`}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <div className="timeline-controls flex items-center p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <button
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 mr-2"
                    onClick={togglePlayback}
                    title={isPlaying ? 'Pause' : 'Play'}
                >
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 mr-2"
                    onClick={stopPlayback}
                    title="Stop"
                >
                    Stop
                </button>
                <div className="flex-1" />
                <button
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 mr-2"
                    onClick={handleZoomOut}
                    title="Zoom Out"
                >
                    Zoom -
                </button>
                <button
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={handleZoomIn}
                    title="Zoom In"
                >
                    Zoom +
                </button>
            </div>

            <div className="timeline-header relative h-8 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 overflow-hidden">
                <div
                    className="timeline-markers relative h-full"
                    style={{ width: `${timelineWidth}px` }}
                >
                    {timeMarkers}
                </div>
            </div>

            <div className="timeline-content flex-1 overflow-y-auto relative">
                <div
                    className="timeline-tracks relative"
                    style={{ minWidth: `${timelineWidth}px` }}
                >
                    {selectedAnimation ? (
                        <div className="animation-tracks">
                            {selectedAnimation.tracks.map((track) => (
                                <div
                                    key={track.id}
                                    className={`timeline-track p-2 border-b border-gray-200 dark:border-gray-700 flex items-center ${
                                        selectedTrackId === track.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                    }`}
                                    onClick={() => selectTrack(track.id)}
                                >
                                    <div className="track-info w-40 pr-2">
                                        <div className="text-sm font-medium truncate">{track.property}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{track.easing}</div>
                                    </div>

                                    <div
                                        className="keyframe-container relative flex-1 h-10"
                                        ref={timelineRef}
                                        onClick={handleTimelineClick}
                                        onMouseDown={handleTimelineDragStart}
                                    >
                                        {track.keyframes.map((keyframe) => (
                                            <div
                                                key={keyframe.id}
                                                className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full cursor-move border-2 border-white dark:border-gray-800 ${
                                                    selectedKeyframeId === keyframe.id ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800' : ''
                                                }`}
                                                style={{ left: `${keyframe.time * timeScale}px` }}
                                                onMouseDown={(e) => handleKeyframeDragStart(e, keyframe, track.id)}
                                                title={`${keyframe.time.toFixed(0)}ms: ${JSON.stringify(keyframe.properties)}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                            No animation selected. Select an element and add an animation to edit.
                        </div>
                    )}
                </div>
            </div>

            <div
                className="playhead absolute top-0 bottom-0 w-[1px] bg-red-500 pointer-events-none z-10"
                style={{ left: `${currentTime * timeScale}px` }}
            />
        </div>
    );
};