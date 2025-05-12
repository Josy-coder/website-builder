import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export type ElementType = 'container' | 'text' | 'image' | 'button' | 'form' | 'input' | 'custom';

export interface ElementStyles {
    position?: 'absolute' | 'relative' | 'static' | 'fixed';
    left?: string;
    top?: string;
    width?: string;
    height?: string;
    backgroundColor?: string;
    color?: string;
    fontSize?: string;
    fontWeight?: string;
    padding?: string;
    margin?: string;
    border?: string;
    borderRadius?: string;
    display?: string;
    flexDirection?: string;
    justifyContent?: string;
    alignItems?: string;
    gap?: string;
    zIndex?: number;
    [key: string]: any;
}

export interface Element {
    id: string;
    type: ElementType;
    content?: string;
    src?: string;
    alt?: string;
    styles: ElementStyles;
    children: Element[];
    parentId: string | null;
    props?: Record<string, any>;
}

export interface EditorState {
    elements: Element[];
    selectedElementId: string | null;
    canvas: {
        width: number;
        height: number;
        scale: number;
        position: { x: number; y: number };
    };
    history: {
        past: Element[][];
        future: Element[][];
    };
    activeBreakpoint: 'desktop' | 'tablet' | 'mobile';
    activeTool: 'select' | 'move' | 'resize' | 'text' | 'image' | 'container' | 'custom';
    isDragging: boolean;
}

export interface EditorActions {
    addElement: (element: Omit<Element, 'id'>) => void;
    updateElement: (id: string, updates: Partial<Element>) => void;
    removeElement: (id: string) => void;
    moveElement: (id: string, parentId: string | null, index?: number) => void;
    selectElement: (id: string | null) => void;
    updateElementStyles: (id: string, styles: Partial<ElementStyles>) => void;

    setCanvasSize: (width: number, height: number) => void;
    setCanvasScale: (scale: number) => void;
    setCanvasPosition: (x: number, y: number) => void;
    resetCanvas: () => void;

    undo: () => void;
    redo: () => void;

    setActiveTool: (tool: EditorState['activeTool']) => void;
    setActiveBreakpoint: (breakpoint: EditorState['activeBreakpoint']) => void;
    setIsDragging: (isDragging: boolean) => void;
}

const initialState: EditorState = {
    elements: [],
    selectedElementId: null,
    canvas: {
        width: 1280,
        height: 800,
        scale: 1,
        position: { x: 0, y: 0 },
    },
    history: {
        past: [],
        future: [],
    },
    activeBreakpoint: 'desktop',
    activeTool: 'select',
    isDragging: false,
};

const removeElementAndChildren = (elements: Element[], id: string): Element[] => {
    return elements.filter(element => {
        if (element.id === id) {
            return false;
        }
        if (element.children.length > 0) {
            element.children = removeElementAndChildren(element.children, id);
        }
        return true;
    });
};

const findElementById = (elements: Element[], id: string): Element | null => {
    for (const element of elements) {
        if (element.id === id) {
            return element;
        }
        if (element.children.length > 0) {
            const found = findElementById(element.children, id);
            if (found) {
                return found;
            }
        }
    }
    return null;
};

export const useEditorStore = create<EditorState & EditorActions>()(
    devtools(
        immer((set, get) => ({
            ...initialState,

            addElement: (elementData) => {
                set((state) => {
                    const id = crypto.randomUUID();
                    const newElement: Element = {
                        id,
                        ...elementData,
                    };

                    if (newElement.parentId === null) {
                        state.elements.push(newElement);
                    } else {
                        const findAndAddChild = (elements: Element[]): boolean => {
                            for (let i = 0; i < elements.length; i++) {
                                if (elements[i].id === newElement.parentId) {
                                    elements[i].children.push(newElement);
                                    return true;
                                }
                                if (elements[i].children.length > 0) {
                                    if (findAndAddChild(elements[i].children)) {
                                        return true;
                                    }
                                }
                            }
                            return false;
                        };

                        findAndAddChild(state.elements);
                    }

                    // Add to history
                    state.history.past.push([...state.elements]);
                    state.history.future = [];
                });
            },

            updateElement: (id, updates) => {
                set((state) => {
                    const updateElementRecursive = (elements: Element[]): boolean => {
                        for (let i = 0; i < elements.length; i++) {
                            if (elements[i].id === id) {
                                elements[i] = { ...elements[i], ...updates };
                                return true;
                            }
                            if (elements[i].children.length > 0) {
                                if (updateElementRecursive(elements[i].children)) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    };

                    if (updateElementRecursive(state.elements)) {
                        // Add to history
                        state.history.past.push([...state.elements]);
                        state.history.future = [];
                    }
                });
            },

            removeElement: (id) => {
                set((state) => {
                    state.elements = removeElementAndChildren(state.elements, id);
                    if (state.selectedElementId === id) {
                        state.selectedElementId = null;
                    }

                    state.history.past.push([...state.elements]);
                    state.history.future = [];
                });
            },

            moveElement: (id, parentId, index) => {
                set((state) => {
                    const element = findElementById(state.elements, id);
                    if (!element) return;

                    state.elements = removeElementAndChildren(state.elements, id);

                    if (parentId === null) {
                        if (index !== undefined) {
                            state.elements.splice(index, 0, element);
                        } else {
                            state.elements.push(element);
                        }
                    } else {
                        const findAndAddToParent = (elements: Element[]): boolean => {
                            for (let i = 0; i < elements.length; i++) {
                                if (elements[i].id === parentId) {
                                    if (index !== undefined) {
                                        elements[i].children.splice(index, 0, element);
                                    } else {
                                        elements[i].children.push(element);
                                    }
                                    return true;
                                }
                                if (elements[i].children.length > 0) {
                                    if (findAndAddToParent(elements[i].children)) {
                                        return true;
                                    }
                                }
                            }
                            return false;
                        };

                        findAndAddToParent(state.elements);
                    }

                    element.parentId = parentId;

                    state.history.past.push([...state.elements]);
                    state.history.future = [];
                });
            },

            selectElement: (id) => {
                set((state) => {
                    state.selectedElementId = id;
                });
            },

            updateElementStyles: (id, styles) => {
                set((state) => {
                    const updateStylesRecursive = (elements: Element[]): boolean => {
                        for (let i = 0; i < elements.length; i++) {
                            if (elements[i].id === id) {
                                elements[i].styles = { ...elements[i].styles, ...styles };
                                return true;
                            }
                            if (elements[i].children.length > 0) {
                                if (updateStylesRecursive(elements[i].children)) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    };

                    if (updateStylesRecursive(state.elements)) {
                        // Add to history
                        state.history.past.push([...state.elements]);
                        state.history.future = [];
                    }
                });
            },

            setCanvasSize: (width, height) => {
                set((state) => {
                    state.canvas.width = width;
                    state.canvas.height = height;
                });
            },

            setCanvasScale: (scale) => {
                set((state) => {
                    state.canvas.scale = scale;
                });
            },

            setCanvasPosition: (x, y) => {
                set((state) => {
                    state.canvas.position.x = x;
                    state.canvas.position.y = y;
                });
            },

            resetCanvas: () => {
                set((state) => {
                    state.canvas = initialState.canvas;
                });
            },

            undo: () => {
                set((state) => {
                    if (state.history.past.length === 0) return;

                    const previous = state.history.past.pop();
                    if (previous) {
                        state.history.future.unshift([...state.elements]);
                        state.elements = previous;
                    }
                });
            },

            redo: () => {
                set((state) => {
                    if (state.history.future.length === 0) return;

                    const next = state.history.future.shift();
                    if (next) {
                        state.history.past.push([...state.elements]);
                        state.elements = next;
                    }
                });
            },

            // Tools and state
            setActiveTool: (tool) => {
                set((state) => {
                    state.activeTool = tool;
                });
            },

            setActiveBreakpoint: (breakpoint) => {
                set((state) => {
                    state.activeBreakpoint = breakpoint;
                });
            },

            setIsDragging: (isDragging) => {
                set((state) => {
                    state.isDragging = isDragging;
                });
            },
        }))
    )
);