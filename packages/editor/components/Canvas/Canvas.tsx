import React, { useRef, useEffect, useState } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { Element } from '../../types';
import { ElementRenderer } from '../Elements/ElementRenderer';

interface CanvasProps {
    className?: string;
}

export const Canvas: React.FC<CanvasProps> = ({ className = '' }) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const {
        elements,
        canvas,
        selectedElementId,
        setCanvasPosition,
        selectElement,
        activeTool,
        setIsDragging,
    } = useEditorStore();

    const [isPanning, setIsPanning] = useState(false);
    const [startPanPosition, setStartPanPosition] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button === 1 || (e.button === 0 && e.altKey)) {
            setIsPanning(true);
            setStartPanPosition({
                x: e.clientX - canvas.position.x,
                y: e.clientY - canvas.position.y,
            });
            e.preventDefault();
        } else if (e.target === canvasRef.current) {
            selectElement(null);
        }
    };
    const handleMouseMove = (e: React.MouseEvent) => {
        if (isPanning) {
            setCanvasPosition(
                e.clientX - startPanPosition.x,
                e.clientY - startPanPosition.y
            );
            e.preventDefault();
        }
    };

    const handleMouseUp = () => {
        if (isPanning) {
            setIsPanning(false);
        }
    };

    useEffect(() => {
        const handleGlobalMouseUp = () => {
            if (isPanning) {
                setIsPanning(false);
            }
            setIsDragging(false);
        };

        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => {
            window.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [isPanning, setIsDragging]);

    const getCursor = () => {
        if (isPanning) return 'grabbing';
        if (activeTool === 'move') return 'move';
        if (activeTool === 'resize') return 'nwse-resize';
        return 'default';
    };

    return (
        <div
            className={`editor-canvas canvas-grid relative overflow-hidden ${className}`}
            style={{
                cursor: getCursor(),
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            ref={canvasRef}
        >
            <div
                className="canvas-content absolute"
                style={{
                    transform: `scale(${canvas.scale}) translate(${canvas.position.x}px, ${canvas.position.y}px)`,
                    transformOrigin: '0 0',
                    width: canvas.width,
                    height: canvas.height,
                    background: 'white',
                    boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
            >
                {elements.map((element) => (
                    <ElementRenderer
                        key={element.id}
                        element={element}
                        isSelected={element.id === selectedElementId}
                    />
                ))}
            </div>
        </div>
    );
};