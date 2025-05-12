import * as React from 'react';
import { useEditorStore } from '../../store/editorStore';

interface ResizeHandleProps {
    elementId: string;
}

type ResizeDirection = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';

export const ResizeHandle: React.FC<ResizeHandleProps> = ({ elementId }) => {
    const {
        updateElementStyles,
        setIsDragging,
        elements
    } = useEditorStore();

    const [resizing, setResizing] = React.useState<ResizeDirection | null>(null);
    const [startPos, setStartPos] = React.useState({ x: 0, y: 0 });
    const [startSize, setStartSize] = React.useState({ width: 0, height: 0 });
    const [startCoords, setStartCoords] = React.useState({ left: 0, top: 0 });

    const element = elements.find(el => el.id === elementId);
    if (!element) return null;

    const getElementRect = () => {
        const node = document.querySelector(`[data-element-id="${elementId}"]`) as HTMLElement;
        if (!node) return { width: 0, height: 0, left: 0, top: 0 };

        const rect = node.getBoundingClientRect();
        return {
            width: rect.width,
            height: rect.height,
            left: parseInt(element.styles.left || '0', 10),
            top: parseInt(element.styles.top || '0', 10),
        };
    };

    const handleMouseDown = (direction: ResizeDirection) => (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        const { width, height, left, top } = getElementRect();

        setResizing(direction);
        setStartPos({ x: e.clientX, y: e.clientY });
        setStartSize({ width, height });
        setStartCoords({ left, top });
        setIsDragging(true);
    };

    React.useEffect(() => {
        if (!resizing) return;

        const handleMouseMove = (e: MouseEvent) => {
            e.preventDefault();

            const dx = e.clientX - startPos.x;
            const dy = e.clientY - startPos.y;

            const newStyles: Record<string, string> = {};

            if (resizing.includes('e')) {
                newStyles.width = `${startSize.width + dx}px`;
            } else if (resizing.includes('w')) {
                newStyles.width = `${startSize.width - dx}px`;
                newStyles.left = `${startCoords.left + dx}px`;
            }

            // Update height based on direction
            if (resizing.includes('s')) {
                newStyles.height = `${startSize.height + dy}px`;
            } else if (resizing.includes('n')) {
                newStyles.height = `${startSize.height - dy}px`;
                newStyles.top = `${startCoords.top + dy}px`;
            }

            updateElementStyles(elementId, newStyles);
        };

        const handleMouseUp = () => {
            setResizing(null);
            setIsDragging(false);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [resizing, startPos, startSize, startCoords, elementId, updateElementStyles, setIsDragging]);

    const handleStyle: React.CSSProperties = {
        position: 'absolute',
        width: '8px',
        height: '8px',
        backgroundColor: '#3b82f6',
        border: '1px solid white',
        zIndex: 100,
    };

    const cursorMap: Record<ResizeDirection, string> = {
        n: 'ns-resize',
        ne: 'nesw-resize',
        e: 'ew-resize',
        se: 'nwse-resize',
        s: 'ns-resize',
        sw: 'nesw-resize',
        w: 'ew-resize',
        nw: 'nwse-resize',
    };

    return (
        <>
            {/* North handle */}
            <div
                style={{
                    ...handleStyle,
                    top: '-4px',
                    left: 'calc(50% - 4px)',
                    cursor: cursorMap.n,
                }}
                onMouseDown={handleMouseDown('n')}
            />

            {/* Northeast handle */}
            <div
                style={{
                    ...handleStyle,
                    top: '-4px',
                    right: '-4px',
                    cursor: cursorMap.ne,
                }}
                onMouseDown={handleMouseDown('ne')}
            />

            {/* East handle */}
            <div
                style={{
                    ...handleStyle,
                    top: 'calc(50% - 4px)',
                    right: '-4px',
                    cursor: cursorMap.e,
                }}
                onMouseDown={handleMouseDown('e')}
            />

            {/* Southeast handle */}
            <div
                style={{
                    ...handleStyle,
                    bottom: '-4px',
                    right: '-4px',
                    cursor: cursorMap.se,
                }}
                onMouseDown={handleMouseDown('se')}
            />

            {/* South handle */}
            <div
                style={{
                    ...handleStyle,
                    bottom: '-4px',
                    left: 'calc(50% - 4px)',
                    cursor: cursorMap.s,
                }}
                onMouseDown={handleMouseDown('s')}
            />

            {/* Southwest handle */}
            <div
                style={{
                    ...handleStyle,
                    bottom: '-4px',
                    left: '-4px',
                    cursor: cursorMap.sw,
                }}
                onMouseDown={handleMouseDown('sw')}
            />

            {/* West handle */}
            <div
                style={{
                    ...handleStyle,
                    top: 'calc(50% - 4px)',
                    left: '-4px',
                    cursor: cursorMap.w,
                }}
                onMouseDown={handleMouseDown('w')}
            />

            <div
                style={{
                    ...handleStyle,
                    top: '-4px',
                    left: '-4px',
                    cursor: cursorMap.nw,
                }}
                onMouseDown={handleMouseDown('nw')}
            />
        </>
    );
};