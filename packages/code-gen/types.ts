// Rendering strategies
export type RenderMode = 'STATIC' | 'SERVER' | 'INCREMENTAL' | 'CLIENT';

// Basic project structure
export interface ProjectConfig {
    name: string;
    slug: string;
    basePath?: string;
    outputDir?: string;
    renderMode?: RenderMode;
    authEnabled?: boolean;
    authProvider?: 'NEXTAUTH' | 'CLERK' | 'AUTH0' | 'CUSTOM';
    authConfig?: Record<string, any>;
    customDependencies?: Record<string, string>;
    environmentVars?: Record<string, string>;
    customCode?: Record<string, string>;
}

// Page configuration
export interface PageConfig {
    id: string;
    name: string;
    slug: string;
    renderMode: RenderMode;
    meta?: {
        title?: string;
        description?: string;
        ogImage?: string;
        canonical?: string;
        keywords?: string[];
        robots?: string;
        [key: string]: any;
    };
    layout: Element[];
    styles?: Record<string, any>;
    isPublished?: boolean;
}

// Element types
export type ElementType = 'container' | 'text' | 'image' | 'button' | 'form' | 'input' | 'custom';

// Element properties
export interface Element {
    id: string;
    type: ElementType;
    content?: string;
    src?: string;
    alt?: string;
    styles: Record<string, any>;
    props?: Record<string, any>;
    children: Element[];
    parentId: string | null;
}

// Animation references
export interface ElementAnimation {
    elementId: string;
    animationId: string;
    type: 'entry' | 'exit' | 'hover' | 'click' | 'scroll';
    library: 'css' | 'framerMotion' | 'gsap';
}

// Component configuration
export interface ComponentConfig {
    id: string;
    name: string;
    type: string; // Built-in or custom
    structure: Element;
    props?: Record<string, any>;
    styles?: Record<string, any>;
    isShared?: boolean;
}

// Complete Next.js project generation config
export interface NextJSProjectConfig {
    project: ProjectConfig;
    pages: PageConfig[];
    components: ComponentConfig[];
    animations: ElementAnimation[];
    content?: {
        types: ContentTypeConfig[];
        entries: ContentEntryConfig[];
    };
}

// Content model types
export interface ContentTypeConfig {
    id: string;
    name: string;
    fields: ContentFieldConfig[];
}

export interface ContentFieldConfig {
    id: string;
    name: string;
    type: string;
    required: boolean;
    defaultValue?: any;
    settings?: Record<string, any>;
}

export interface ContentEntryConfig {
    id: string;
    contentTypeId: string;
    data: Record<string, any>;
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

// Code generation result
export interface GeneratedCode {
    filename: string;
    content: string;
    path: string[];
}

// Generated project result
export interface GeneratedProject {
    files: GeneratedCode[];
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
}