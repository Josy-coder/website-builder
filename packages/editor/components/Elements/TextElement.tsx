import React, { useState } from 'react';
import { Element } from '../../types';
import { useEditorStore } from '../../store/editorStore';
import { ResizeHandle } from '../Controls/ResizeHandle';

interface TextElementProps {
    element: Element;
    style: React.CSSProperties;
    isSelected: boolean;
    onClick: (e: React.MouseEvent) => void;
}

export const TextElement: React.FC<TextElementProps> = ({
                                                            element,
                                                            style,
                                                            isSelected,
                                                            onClick,
                                                        }) => {
    const { updateElement } = useEditorStore();
    const [isEditing, setIsEditing] = useState(false);

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
    };

    const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
        const content = e.currentTarget.innerText;
        updateElement(element.id, { content });
    };

    const handleBlur = () => {
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            setIsEditing(false);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setIsEditing(false);
        }
    };

    return (
        <div
            style={{
                ...style,
                cursor: isEditing ? 'text' : 'default',
            }}
            onClick={onClick}
            onDoubleClick={handleDoubleClick}
            data-element-id={element.id}
            data-element-type="text"
            className={`element-text ${isSelected ? 'component-selected' : ''}`}
        >
            <div
                contentEditable={isEditing}
                suppressContentEditableWarning
                onInput={handleContentChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                style={{
                    outline: 'none',
                    userSelect: isEditing ? 'text' : 'none',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                }}
            >
                {element.content || 'Text Element'}
            </div>

            {isSelected && !isEditing && (
                <ResizeHandle elementId={element.id} />
            )}
        </div>
    );
};