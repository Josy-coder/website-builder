import React from 'react';
import { useEditorStore, ElementType } from '../../store/editorStore';

interface ComponentItem {
    type: ElementType;
    label: string;
    icon: string;
    defaultProps?: Record<string, any>;
    defaultStyles?: Record<string, any>;
}

export const ComponentPanel: React.FC = () => {
    const { addElement, setIsDragging } = useEditorStore();

    const components: ComponentItem[] = [
        {
            type: 'container',
            label: 'Container',
            icon: 'square',
            defaultStyles: {
                width: '200px',
                height: '200px',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
            },
        },
        {
            type: 'text',
            label: 'Text',
            icon: 'text',
            defaultProps: {
                content: 'Text Element',
            },
            defaultStyles: {
                fontSize: '16px',
                color: '#111827',
            },
        },
        {
            type: 'image',
            label: 'Image',
            icon: 'photo',
            defaultStyles: {
                width: '200px',
                height: '200px',
                objectFit: 'cover',
            },
        },
        {
            type: 'button',
            label: 'Button',
            icon: 'cursor-click',
            defaultProps: {
                content: 'Button',
            },
            defaultStyles: {
                padding: '8px 16px',
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500',
            },
        },
        {
            type: 'form',
            label: 'Form',
            icon: 'clipboard-list',
            defaultStyles: {
                width: '300px',
                padding: '16px',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
            },
        },
        {
            type: 'input',
            label: 'Input',
            icon: 'input',
            defaultProps: {
                type: 'text',
                placeholder: 'Enter text',
                label: 'Input Label',
            },
            defaultStyles: {
                width: '100%',
            },
        },
        {
            type: 'custom',
            label: 'Custom',
            icon: 'code',
            defaultProps: {
                content: 'Custom Component',
            },
            defaultStyles: {
                width: '200px',
                height: '100px',
                padding: '8px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
            },
        },
    ];

    const handleDragStart = (e: React.DragEvent, component: ComponentItem) => {
        e.dataTransfer.setData('application/json', JSON.stringify({
            type: component.type,
            props: component.defaultProps || {},
            styles: component.defaultStyles || {},
        }));
        setIsDragging(true);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    const handleComponentClick = (component: ComponentItem) => {
        addElement({
            type: component.type,
            content: component.defaultProps?.content,
            styles: component.defaultStyles || {},
            props: component.defaultProps || {},
            children: [],
            parentId: null,
        });
    };

    return (
        <div className="component-panel h-full flex flex-col">
            <div className="panel-header">Component Library</div>
            <div className="panel-content">
                <div className="component-list space-y-2">
                    {components.map((component) => (
                        <div
                            key={component.label}
                            className="component-item"
                            draggable
                            onDragStart={(e) => handleDragStart(e, component)}
                            onDragEnd={handleDragEnd}
                            onClick={() => handleComponentClick(component)}
                        >
                            <div className="component-item-icon">
                                {/* Icon can be replaced with actual icon component */}
                                {component.icon}
                            </div>
                            <div className="component-item-name">{component.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};