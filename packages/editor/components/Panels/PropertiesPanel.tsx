import React from 'react';
import { useEditorStore } from '../../store/editorStore';

export const PropertiesPanel: React.FC = () => {
    const {
        elements,
        selectedElementId,
        updateElement,
        updateElementStyles,
        removeElement
    } = useEditorStore();
    const selectedElement = selectedElementId
        ? elements.find(el => el.id === selectedElementId) ||
        elements.flatMap(el => el.children).find(el => el?.id === selectedElementId)
        : null;

    if (!selectedElement) {
        return (
            <div className="properties-panel h-full flex flex-col">
                <div className="panel-header">Properties</div>
                <div className="panel-content flex items-center justify-center h-full text-muted-foreground text-sm">
                    No element selected
                </div>
            </div>
        );
    }
    const handleStyleChange = (property: string, value: string) => {
        updateElementStyles(selectedElement.id, {
            [property]: value,
        });
    };
    const handlePropChange = (key: string, value: any) => {
        const updatedProps = {
            ...selectedElement.props,
            [key]: value,
        };

        updateElement(selectedElement.id, {
            props: updatedProps,
        });
    };
    const handleContentChange = (content: string) => {
        updateElement(selectedElement.id, { content });
    };
    const handleDeleteElement = () => {
        removeElement(selectedElement.id);
    };

    return (
        <div className="properties-panel h-full flex flex-col">
            <div className="panel-header flex justify-between items-center">
                <span>Properties: {selectedElement.type}</span>
                <button
                    className="text-sm text-destructive hover:text-destructive-foreground"
                    onClick={handleDeleteElement}
                >
                    Delete
                </button>
            </div>

            <div className="panel-content overflow-y-auto">
                <div className="property-group">
                    <div className="property-group-title">Element Info</div>
                    <div className="property-row">
                        <div className="property-label">Type</div>
                        <div className="property-value">{selectedElement.type}</div>
                    </div>
                    <div className="property-row">
                        <div className="property-label">ID</div>
                        <div className="property-value text-xs">{selectedElement.id.substring(0, 8)}...</div>
                    </div>
                </div>
                {selectedElement.type === 'text' || selectedElement.type === 'button' && (
                    <div className="property-group">
                        <div className="property-group-title">Content</div>
                        <div className="property-row">
                            <div className="property-label">Text</div>
                            <div className="property-value">
                                <input
                                    type="text"
                                    value={selectedElement.content || ''}
                                    onChange={(e) => handleContentChange(e.target.value)}
                                    className="w-full px-2 py-1 text-sm border border-input rounded"
                                />
                            </div>
                        </div>
                    </div>
                )}
                <div className="property-group">
                    <div className="property-group-title">Position & Size</div>
                    <div className="property-row">
                        <div className="property-label">Position</div>
                        <div className="property-value">
                            <select
                                value={selectedElement.styles.position || 'relative'}
                                onChange={(e) => handleStyleChange('position', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-input rounded"
                            >
                                <option value="relative">Relative</option>
                                <option value="absolute">Absolute</option>
                                <option value="fixed">Fixed</option>
                                <option value="static">Static</option>
                            </select>
                        </div>
                    </div>
                    {(selectedElement.styles.position === 'absolute' || selectedElement.styles.position === 'fixed') && (
                        <>
                            <div className="property-row">
                                <div className="property-label">Left</div>
                                <div className="property-value">
                                    <input
                                        type="text"
                                        value={selectedElement.styles.left || '0px'}
                                        onChange={(e) => handleStyleChange('left', e.target.value)}
                                        className="w-full px-2 py-1 text-sm border border-input rounded"
                                    />
                                </div>
                            </div>
                            <div className="property-row">
                                <div className="property-label">Top</div>
                                <div className="property-value">
                                    <input
                                        type="text"
                                        value={selectedElement.styles.top || '0px'}
                                        onChange={(e) => handleStyleChange('top', e.target.value)}
                                        className="w-full px-2 py-1 text-sm border border-input rounded"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div className="property-row">
                        <div className="property-label">Width</div>
                        <div className="property-value">
                            <input
                                type="text"
                                value={selectedElement.styles.width || 'auto'}
                                onChange={(e) => handleStyleChange('width', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-input rounded"
                            />
                        </div>
                    </div>
                    <div className="property-row">
                        <div className="property-label">Height</div>
                        <div className="property-value">
                            <input
                                type="text"
                                value={selectedElement.styles.height || 'auto'}
                                onChange={(e) => handleStyleChange('height', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-input rounded"
                            />
                        </div>
                    </div>
                </div>

                <div className="property-group">
                    <div className="property-group-title">Appearance</div>
                    <div className="property-row">
                        <div className="property-label">Background</div>
                        <div className="property-value flex items-center space-x-2">
                            <div
                                className="color-swatch"
                                style={{ backgroundColor: selectedElement.styles.backgroundColor || 'transparent' }}
                            />
                            <input
                                type="text"
                                value={selectedElement.styles.backgroundColor || ''}
                                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                                className="flex-1 px-2 py-1 text-sm border border-input rounded"
                                placeholder="transparent"
                            />
                        </div>
                    </div>

                    {(selectedElement.type === 'text' || selectedElement.type === 'button') && (
                        <>
                            <div className="property-row">
                                <div className="property-label">Color</div>
                                <div className="property-value flex items-center space-x-2">
                                    <div
                                        className="color-swatch"
                                        style={{ backgroundColor: selectedElement.styles.color || 'black' }}
                                    />
                                    <input
                                        type="text"
                                        value={selectedElement.styles.color || ''}
                                        onChange={(e) => handleStyleChange('color', e.target.value)}
                                        className="flex-1 px-2 py-1 text-sm border border-input rounded"
                                        placeholder="black"
                                    />
                                </div>
                            </div>
                            <div className="property-row">
                                <div className="property-label">Font Size</div>
                                <div className="property-value">
                                    <input
                                        type="text"
                                        value={selectedElement.styles.fontSize || '16px'}
                                        onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                                        className="w-full px-2 py-1 text-sm border border-input rounded"
                                    />
                                </div>
                            </div>
                            <div className="property-row">
                                <div className="property-label">Font Weight</div>
                                <div className="property-value">
                                    <select
                                        value={selectedElement.styles.fontWeight || 'normal'}
                                        onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                                        className="w-full px-2 py-1 text-sm border border-input rounded"
                                    >
                                        <option value="normal">Normal</option>
                                        <option value="bold">Bold</option>
                                        <option value="100">100</option>
                                        <option value="200">200</option>
                                        <option value="300">300</option>
                                        <option value="400">400</option>
                                        <option value="500">500</option>
                                        <option value="600">600</option>
                                        <option value="700">700</option>
                                        <option value="800">800</option>
                                        <option value="900">900</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="property-row">
                        <div className="property-label">Border</div>
                        <div className="property-value">
                            <input
                                type="text"
                                value={selectedElement.styles.border || 'none'}
                                onChange={(e) => handleStyleChange('border', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-input rounded"
                            />
                        </div>
                    </div>
                    <div className="property-row">
                        <div className="property-label">Border Radius</div>
                        <div className="property-value">
                            <input
                                type="text"
                                value={selectedElement.styles.borderRadius || '0px'}
                                onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-input rounded"
                            />
                        </div>
                    </div>
                </div>

                <div className="property-group">
                    <div className="property-group-title">Layout</div>
                    <div className="property-row">
                        <div className="property-label">Display</div>
                        <div className="property-value">
                            <select
                                value={selectedElement.styles.display || 'block'}
                                onChange={(e) => handleStyleChange('display', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-input rounded"
                            >
                                <option value="block">Block</option>
                                <option value="inline">Inline</option>
                                <option value="inline-block">Inline Block</option>
                                <option value="flex">Flex</option>
                                <option value="grid">Grid</option>
                                <option value="none">None</option>
                            </select>
                        </div>
                    </div>

                    {selectedElement.styles.display === 'flex' && (
                        <>
                            <div className="property-row">
                                <div className="property-label">Flex Direction</div>
                                <div className="property-value">
                                    <select
                                        value={selectedElement.styles.flexDirection || 'row'}
                                        onChange={(e) => handleStyleChange('flexDirection', e.target.value)}
                                        className="w-full px-2 py-1 text-sm border border-input rounded"
                                    >
                                        <option value="row">Row</option>
                                        <option value="column">Column</option>
                                        <option value="row-reverse">Row Reverse</option>
                                        <option value="column-reverse">Column Reverse</option>
                                    </select>
                                </div>
                            </div>
                            <div className="property-row">
                                <div className="property-label">Justify Content</div>
                                <div className="property-value">
                                    <select
                                        value={selectedElement.styles.justifyContent || 'flex-start'}
                                        onChange={(e) => handleStyleChange('justifyContent', e.target.value)}
                                        className="w-full px-2 py-1 text-sm border border-input rounded"
                                    >
                                        <option value="flex-start">Start</option>
                                        <option value="center">Center</option>
                                        <option value="flex-end">End</option>
                                        <option value="space-between">Space Between</option>
                                        <option value="space-around">Space Around</option>
                                        <option value="space-evenly">Space Evenly</option>
                                    </select>
                                </div>
                            </div>
                            <div className="property-row">
                                <div className="property-label">Align Items</div>
                                <div className="property-value">
                                    <select
                                        value={selectedElement.styles.alignItems || 'stretch'}
                                        onChange={(e) => handleStyleChange('alignItems', e.target.value)}
                                        className="w-full px-2 py-1 text-sm border border-input rounded"
                                    >
                                        <option value="stretch">Stretch</option>
                                        <option value="flex-start">Start</option>
                                        <option value="center">Center</option>
                                        <option value="flex-end">End</option>
                                        <option value="baseline">Baseline</option>
                                    </select>
                                </div>
                            </div>
                            <div className="property-row">
                                <div className="property-label">Gap</div>
                                <div className="property-value">
                                    <input
                                        type="text"
                                        value={selectedElement.styles.gap || '0px'}
                                        onChange={(e) => handleStyleChange('gap', e.target.value)}
                                        className="w-full px-2 py-1 text-sm border border-input rounded"
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <div className="property-group">
                    <div className="property-group-title">Spacing</div>
                    <div className="property-row">
                        <div className="property-label">Padding</div>
                        <div className="property-value">
                            <input
                                type="text"
                                value={selectedElement.styles.padding || '0px'}
                                onChange={(e) => handleStyleChange('padding', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-input rounded"
                            />
                        </div>
                    </div>
                    <div className="property-row">
                        <div className="property-label">Margin</div>
                        <div className="property-value">
                            <input
                                type="text"
                                value={selectedElement.styles.margin || '0px'}
                                onChange={(e) => handleStyleChange('margin', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-input rounded"
                            />
                        </div>
                    </div>
                </div>
                {selectedElement.type === 'input' && (
                    <div className="property-group">
                        <div className="property-group-title">Input Properties</div>
                        <div className="property-row">
                            <div className="property-label">Type</div>
                            <div className="property-value">
                                <select
                                    value={selectedElement.props?.type || 'text'}
                                    onChange={(e) => handlePropChange('type', e.target.value)}
                                    className="w-full px-2 py-1 text-sm border border-input rounded"
                                >
                                    <option value="text">Text</option>
                                    <option value="password">Password</option>
                                    <option value="email">Email</option>
                                    <option value="number">Number</option>
                                    <option value="date">Date</option>
                                    <option value="checkbox">Checkbox</option>
                                    <option value="radio">Radio</option>
                                </select>
                            </div>
                        </div>
                        <div className="property-row">
                            <div className="property-label">Placeholder</div>
                            <div className="property-value">
                                <input
                                    type="text"
                                    value={selectedElement.props?.placeholder || ''}
                                    onChange={(e) => handlePropChange('placeholder', e.target.value)}
                                    className="w-full px-2 py-1 text-sm border border-input rounded"
                                />
                            </div>
                        </div>
                        <div className="property-row">
                            <div className="property-label">Label</div>
                            <div className="property-value">
                                <input
                                    type="text"
                                    value={selectedElement.props?.label || ''}
                                    onChange={(e) => handlePropChange('label', e.target.value)}
                                    className="w-full px-2 py-1 text-sm border border-input rounded"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {selectedElement.type === 'image' && (
                    <div className="property-group">
                        <div className="property-group-title">Image Properties</div>
                        <div className="property-row">
                            <div className="property-label">Source</div>
                            <div className="property-value">
                                <input
                                    type="text"
                                    value={selectedElement.src || ''}
                                    onChange={(e) => updateElement(selectedElement.id, { src: e.target.value })}
                                    className="w-full px-2 py-1 text-sm border border-input rounded"
                                    placeholder="Enter image URL"
                                />
                            </div>
                        </div>
                        <div className="property-row">
                            <div className="property-label">Alt Text</div>
                            <div className="property-value">
                                <input
                                    type="text"
                                    value={selectedElement.alt || ''}
                                    onChange={(e) => updateElement(selectedElement.id, { alt: e.target.value })}
                                    className="w-full px-2 py-1 text-sm border border-input rounded"
                                    placeholder="Image description"
                                />
                            </div>
                        </div>
                        <div className="property-row">
                            <div className="property-label">Object Fit</div>
                            <div className="property-value">
                                <select
                                    value={selectedElement.styles.objectFit as string || 'cover'}
                                    onChange={(e) => handleStyleChange('objectFit', e.target.value)}
                                    className="w-full px-2 py-1 text-sm border border-input rounded"
                                >
                                    <option value="cover">Cover</option>
                                    <option value="contain">Contain</option>
                                    <option value="fill">Fill</option>
                                    <option value="none">None</option>
                                    <option value="scale-down">Scale Down</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};