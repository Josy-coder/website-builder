import React from 'react';
import { Element } from '../../types';
import { useEditorStore } from '../../store/editorStore';
import { ResizeHandle } from '../Controls/ResizeHandle';

interface CustomElementProps {
    element: Element;
    style: React.CSSProperties;
    isSelected: boolean;
    onClick: (e: React.MouseEvent) => void;
}

export const CustomElement: React.FC<CustomElementProps> = ({
                                                                element,
                                                                style,
                                                                isSelected,
                                                                onClick,
                                                            }) => {
    const customContent = element.content || element.props?.component;

    return (
        <div
            style={style}
            onClick={onClick}
            data-element-id={element.id}
            data-element-type="custom"
            className={`element-custom ${isSelected ? 'component-selected' : ''}`}
        >
            {customContent ? (
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '8px',
                        color: '#475569',
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        overflow: 'hidden',
                    }}
                >
                    Custom Component: {typeof customContent === 'string' ? customContent : 'React Component'}
                </div>
            ) : (
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#f1f5f9',
                        border: '1px dashed #cbd5e1',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#64748b',
                        fontSize: '14px',
                    }}
                >
                    Custom Element
                </div>
            )}

            {isSelected && (
                <ResizeHandle elementId={element.id} />
            )}
        </div>
    );
};