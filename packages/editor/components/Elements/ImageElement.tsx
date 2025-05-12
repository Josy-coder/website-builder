import React from 'react';
import { Element } from '../../types';
import { useEditorStore } from '../../store/editorStore';
import { ResizeHandle } from '../Controls/ResizeHandle';

interface ImageElementProps {
    element: Element;
    style: React.CSSProperties;
    isSelected: boolean;
    onClick: (e: React.MouseEvent) => void;
}

export const ImageElement: React.FC<ImageElementProps> = ({
                                                              element,
                                                              style,
                                                              isSelected,
                                                              onClick,
                                                          }) => {
    const imageStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        objectFit: element.styles.objectFit as any || 'cover',
        objectPosition: element.styles.objectPosition as string || 'center',
    };

    return (
        <div
            style={style}
            onClick={onClick}
            data-element-id={element.id}
            data-element-type="image"
            className={`element-image ${isSelected ? 'component-selected' : ''}`}
        >
            {element.src ? (
                <img
                    src={element.src}
                    alt={element.alt || 'Image'}
                    style={imageStyle}
                />
            ) : (
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#9ca3af',
                        fontWeight: 500,
                        fontSize: '14px',
                    }}
                >
                    No Image Source
                </div>
            )}

            {isSelected && (
                <ResizeHandle elementId={element.id} />
            )}
        </div>
    );
};