import React from 'react';
import { useEditorStore } from '../../store/editorStore';
import { breakpoints } from '../../types';

interface ToolbarProps {
    projectId: string;
    pageId: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({ projectId, pageId }) => {
    const {
        activeTool,
        setActiveTool,
        activeBreakpoint,
        setActiveBreakpoint,
        undo,
        redo,
        canvas,
        setCanvasScale
    } = useEditorStore();

    const tools = [
        { id: 'select', name: 'Select', icon: 'cursor-click' },
        { id: 'move', name: 'Move', icon: 'arrows-expand' },
        { id: 'text', name: 'Text', icon: 'text' },
        { id: 'container', name: 'Container', icon: 'template' },
        { id: 'image', name: 'Image', icon: 'photograph' },
        { id: 'button', name: 'Button', icon: 'cursor-click' },
        { id: 'form', name: 'Form', icon: 'clipboard-list' },
        { id: 'input', name: 'Input', icon: 'input' },
        { id: 'custom', name: 'Custom', icon: 'code' },
    ] as const;
    const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const scale = parseFloat(e.target.value) / 100;
        setCanvasScale(scale);
    };

    return (
        <div className="toolbar flex items-center justify-between p-2 border-b border-border">
            <div className="flex items-center space-x-4">
                <span className="font-medium text-sm">Page:</span>
                <span className="text-sm">{pageId}</span>
            </div>
            <div className="flex items-center space-x-2">
                {tools.map((tool) => (
                    <button
                        key={tool.id}
                        className={`p-2 rounded text-sm ${
                            activeTool === tool.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-transparent hover:bg-secondary'
                        }`}
                        onClick={() => setActiveTool(tool.id as any)}
                        title={tool.name}
                    >
                        <span>{tool.name}</span>
                    </button>
                ))}
                <div className="h-6 border-r border-border mx-2" />
                <button
                    className="p-2 rounded hover:bg-secondary"
                    onClick={undo}
                    title="Undo"
                >
                    Undo
                </button>
                <button
                    className="p-2 rounded hover:bg-secondary"
                    onClick={redo}
                    title="Redo"
                >
                    Redo
                </button>
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    {Object.values(breakpoints).map((breakpoint) => (
                        <button
                            key={breakpoint.name}
                            className={`p-2 rounded text-sm ${
                                activeBreakpoint === breakpoint.name
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-transparent hover:bg-secondary'
                            }`}
                            onClick={() => setActiveBreakpoint(breakpoint.name as any)}
                            title={breakpoint.label}
                        >
                            {breakpoint.label}
                        </button>
                    ))}
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-sm">{Math.round(canvas.scale * 100)}%</span>
                    <input
                        type="range"
                        min="25"
                        max="200"
                        step="5"
                        value={canvas.scale * 100}
                        onChange={handleZoomChange}
                        className="w-24"
                    />
                </div>
            </div>
        </div>
    );
};