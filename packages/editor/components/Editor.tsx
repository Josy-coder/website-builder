import React, { useState } from 'react';
import { Canvas } from './Canvas/Canvas';
import { Toolbar } from './Toolbar/Toolbar';
import { ComponentPanel } from './Panels/ComponentPanel';
import { PropertiesPanel } from './Panels/PropertiesPanel';
import { AnimationPanel } from 'animations/components/AnimationPanel';
import { useEditorStore } from '../store/editorStore';

interface EditorProps {
    projectId: string;
    pageId: string;
}

export const Editor: React.FC<EditorProps> = ({ projectId, pageId }) => {
    const { activeBreakpoint, selectedElementId } = useEditorStore();
    const [activeTab, setActiveTab] = useState<'properties' | 'animations'>('properties');

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

            <div className="sidebar border-l border-border flex flex-col">
                <div className="flex border-b border-border">
                    <button
                        className={`flex-1 py-2 text-sm font-medium ${
                            activeTab === 'properties'
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                        onClick={() => setActiveTab('properties')}
                    >
                        Properties
                    </button>
                    <button
                        className={`flex-1 py-2 text-sm font-medium ${
                            activeTab === 'animations'
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                        onClick={() => setActiveTab('animations')}
                    >
                        Animations
                    </button>
                </div>

                <div className="flex-1 overflow-hidden">
                    {activeTab === 'properties' ? (
                        <PropertiesPanel />
                    ) : (
                        <AnimationPanel elementId={selectedElementId} />
                    )}
                </div>
            </div>
        </div>
    );
};