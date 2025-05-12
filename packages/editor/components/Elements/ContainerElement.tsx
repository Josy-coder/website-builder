import React from 'react';
import { Element } from '../../types';
import { ElementRenderer } from './ElementRenderer';
import { ResizeHandle } from '../Controls/ResizeHandle';
import { useEditorStore } from '../../store/editorStore';

interface ContainerElementProps {
    element: Element;
    style: React.CSSProperties;
    isSelected: boolean;
    onClick: (e: React.MouseEvent) => void;
}

export const ContainerElement: React.FC<ContainerElementProps> = ({
                                                                      element,
                                                                      style,
                                                                      isSelected,
                                                                      onClick,
                                                                  }) => {
    const { selectedElementId, activeTool } = useEditorStore();

    const isDropTarget = activeTool === 'move' && selectedElementId !== element.id;

    return (
        <div
            style={style}
            onClick={onClick}
            data-element-id={element.id}
            data-element-type="container"
            className={`element-container ${isSelected ? 'component-selected' : ''}`}
        >

            {element.children.map((child) => (
                <ElementRenderer
                    key={child.id}
                    element={child}
                    isSelected={child.id === selectedElementId}
                />
            ))}

            {isSelected && (
                <ResizeHandle elementId={element.id} />
            )}
        </div>
    );
};