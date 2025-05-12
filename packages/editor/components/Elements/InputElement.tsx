import React from 'react';
import { Element } from '../../types';
import { useEditorStore } from '../../store/editorStore';
import { ResizeHandle } from '../Controls/ResizeHandle';

interface InputElementProps {
    element: Element;
    style: React.CSSProperties;
    isSelected: boolean;
    onClick: (e: React.MouseEvent) => void;
}

export const InputElement: React.FC<InputElementProps> = ({
                                                              element,
                                                              style,
                                                              isSelected,
                                                              onClick,
                                                          }) => {
    const inputType = element.props?.type || 'text';
    const placeholder = element.props?.placeholder || 'Input field';
    const label = element.props?.label || '';

    const inputStyle: React.CSSProperties = {
        display: 'block',
        width: '100%',
        padding: element.styles.padding || '8px 12px',
        fontSize: element.styles.fontSize || '14px',
        lineHeight: '1.5',
        color: element.styles.color || '#111827',
        backgroundColor: element.styles.backgroundColor || 'white',
        backgroundClip: 'padding-box',
        border: element.styles.border || '1px solid #d1d5db',
        borderRadius: element.styles.borderRadius || '4px',
        boxSizing: 'border-box',
    };

    return (
        <div
            style={style}
            onClick={onClick}
            data-element-id={element.id}
            data-element-type="input"
            className={`element-input ${isSelected ? 'component-selected' : ''}`}
        >
            {label && (
                <label
                    style={{
                        display: 'block',
                        marginBottom: '4px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                    }}
                >
                    {label}
                </label>
            )}

            <input
                type={inputType}
                placeholder={placeholder}
                style={inputStyle}
                disabled={true}
            />


            {isSelected && (
                <ResizeHandle elementId={element.id} />
            )}
        </div>
    );
};