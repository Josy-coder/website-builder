import React from 'react';
import { Element } from '../../types';
import { useEditorStore } from '../../store/editorStore';
import { ContainerElement } from './ContainerElement';
import { TextElement } from './TextElement';
import { ImageElement } from './ImageElement';
import { ButtonElement } from './ButtonElement';
import { FormElement } from './FormElement';
import { InputElement } from './InputElement';
import { CustomElement } from './CustomElement';

interface ElementRendererProps {
    element: Element;
    isSelected: boolean;
}

export const ElementRenderer: React.FC<ElementRendererProps> = ({ element, isSelected }) => {
    const { selectElement, updateElement, activeTool } = useEditorStore();

    const handleSelectElement = (e: React.MouseEvent) => {
        e.stopPropagation();
        selectElement(element.id);
    };

    const baseStyle: React.CSSProperties = {
        ...(element.styles as React.CSSProperties),
        position: element.styles.position || 'relative',
    };

    const style: React.CSSProperties = {
        ...baseStyle,
        outline: isSelected ? '2px solid #3b82f6' : 'none',
    };

    const renderElement = () => {
        switch (element.type) {
            case 'container':
                return (
                    <ContainerElement
                        element={element}
                        style={style}
                        isSelected={isSelected}
                        onClick={handleSelectElement}
                    />
                );
            case 'text':
                return (
                    <TextElement
                        element={element}
                        style={style}
                        isSelected={isSelected}
                        onClick={handleSelectElement}
                    />
                );
            case 'image':
                return (
                    <ImageElement
                        element={element}
                        style={style}
                        isSelected={isSelected}
                        onClick={handleSelectElement}
                    />
                );
            case 'button':
                return (
                    <ButtonElement
                        element={element}
                        style={style}
                        isSelected={isSelected}
                        onClick={handleSelectElement}
                    />
                );
            case 'form':
                return (
                    <FormElement
                        element={element}
                        style={style}
                        isSelected={isSelected}
                        onClick={handleSelectElement}
                    />
                );
            case 'input':
                return (
                    <InputElement
                        element={element}
                        style={style}
                        isSelected={isSelected}
                        onClick={handleSelectElement}
                    />
                );
            case 'custom':
                return (
                    <CustomElement
                        element={element}
                        style={style}
                        isSelected={isSelected}
                        onClick={handleSelectElement}
                    />
                );
            default:
                return <div>Unknown element type</div>;
        }
    };

    return renderElement();
};