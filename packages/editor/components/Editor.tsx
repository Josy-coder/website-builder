import React from 'react';
import { Canvas } from './Canvas/Canvas';
import { Toolbar } from './Toolbar/Toolbar';
import { ComponentPanel } from './Panels/ComponentPanel';
import { PropertiesPanel } from './Panels/PropertiesPanel';
import { useEditorStore } from '../store/editorStore';

interface EditorProps {
    projectId: string;
    pageId: string;
}

export const Editor: React.FC<EditorProps> = ({ projectId, pageId }) => {
    const { activeBreakpoint } = useEditorStore();

    return (
        <div className="editor-container flex h-screen overflow-hidden">
            <div className="sidebar border-r border-border">
                <ComponentPanel />
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                <Toolbar projectId={projectId} pageId={pageId} />
                <div className="flex-1 overflow-hidden bg-gray-100 dark:bg-gray-900">
                    <Canvas className="w-full h-full" />
                </div>
            </div>

            <div className="sidebar border-l border-border">
                <PropertiesPanel />
            </div>
        </div>
    );
};