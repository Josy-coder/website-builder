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

// Basic element structure
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

export type LayoutType = 'flex' | 'grid' | 'absolute';

export interface Breakpoint {
    name: string;
    width: number;
    height: number;
    label: string;
}

export const breakpoints: Record<string, Breakpoint> = {
    desktop: {
        name: 'desktop',
        width: 1280,
        height: 800,
        label: 'Desktop',
    },
    tablet: {
        name: 'tablet',
        width: 768,
        height: 1024,
        label: 'Tablet',
    },
    mobile: {
        name: 'mobile',
        width: 375,
        height: 667,
        label: 'Mobile',
    },
};

export interface Animation {
    id: string;
    elementId: string;
    type: 'entry' | 'exit' | 'hover' | 'click' | 'scroll';
    properties: Record<string, any>;
    duration: number;
    delay: number;
    easing: string;
    keyframes?: Record<string, any>[];
}

// Project settings
export interface ProjectSettings {
    name: string;
    slug: string;
    description?: string;
    renderStrategy: 'static' | 'server' | 'incremental' | 'client';
    basePath: string;
    outputDir: string;
    buildCommand?: string;
    devCommand?: string;
    authEnabled: boolean;
    authProvider?: 'nextauth' | 'clerk' | 'auth0' | 'custom';
    authConfig?: Record<string, any>;
    customDependencies?: Record<string, string>;
    environmentVars?: Record<string, string>;
}