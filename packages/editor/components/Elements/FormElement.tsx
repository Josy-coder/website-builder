import React from 'react';
import { Element } from '../../types';
import { ElementRenderer } from './ElementRenderer';
import { ResizeHandle } from '../Controls/ResizeHandle';
import { useEditorStore } from '../../store/editorStore';

interface FormElementProps {
    element: Element;
    style: React.CSSProperties;
    isSelected: boolean;
    onClick: (e: React.MouseEvent) => void;
}

export const FormElement: React.FC<FormElementProps> = ({
                                                            element,
                                                            style,
                                                            isSelected,
                                                            onClick,
                                                        }) => {
    const { selectedElementId } = useEditorStore();

    return (
        <div
            style={style}
            onClick={onClick}
            data-element-id={element.id}
            data-element-type="form"
            className={`element-form ${isSelected ? 'component-selected' : ''}`}
        >
            {element.children.length === 0 && (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                        backgroundColor: '#f9fafb',
                        border: '1px dashed #d1d5db',
                        borderRadius: '4px',
                        width: '100%',
                        height: '100%',
                        minHeight: '200px',
                        color: '#6b7280',
                    }}
                >
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>Form Container</span>
                    <span style={{ fontSize: '12px', marginTop: '4px' }}>Drag form elements here</span>
                </div>
            )}

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