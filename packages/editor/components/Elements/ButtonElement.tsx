import React, { useState } from 'react';
import { Element } from '../../types';
import { useEditorStore } from '../../store/editorStore';
import { ResizeHandle } from '../Controls/ResizeHandle';

interface ButtonElementProps {
    element: Element;
    style: React.CSSProperties;
    isSelected: boolean;
    onClick: (e: React.MouseEvent) => void;
}

export const ButtonElement: React.FC<ButtonElementProps> = ({
                                                                element,
                                                                style,
                                                                isSelected,
                                                                onClick,
                                                            }) => {
    const { updateElement } = useEditorStore();
    const [isEditing, setIsEditing] = useState(false);

    // Handle double click to start editing
    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
    };

    // Handle text content change
    const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
        const content = e.currentTarget.innerText;
        updateElement(element.id, { content });
    };

    // Handle blur to exit editing mode
    const handleBlur = () => {
        setIsEditing(false);
    };

    // Handle key press to save on Enter or exit on Escape
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            setIsEditing(false);
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setIsEditing(false);
        }
    };

    // Default button styling
    const buttonStyle: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: element.styles.backgroundColor || '#3b82f6',
        color: element.styles.color || 'white',
        padding: element.styles.padding || '8px 16px',
        borderRadius: element.styles.borderRadius || '4px',
        border: element.styles.border || 'none',
        cursor: 'pointer',
        fontWeight: element.styles.fontWeight || '500',
        fontSize: element.styles.fontSize || '14px',
        lineHeight: '1',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        width: '100%',
        height: '100%',
        ...style,
    };

    return (
        <div
            style={style}
            onClick={onClick}
            data-element-id={element.id}
            data-element-type="button"
            className={`element-button ${isSelected ? 'component-selected' : ''}`}
        >
            <div
                style={buttonStyle}
                onDoubleClick={handleDoubleClick}
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
                        pointerEvents: isEditing ? 'auto' : 'none',
                    }}
                >
                    {element.content || 'Button'}
                </div>
            </div>

            {/* Render resize handles if selected */}
            {isSelected && !isEditing && (
                <ResizeHandle elementId={element.id} />
            )}
        </div>
    );
};