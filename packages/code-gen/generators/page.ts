import { ElementAnimation, PageConfig, RenderMode } from '../types';
import { generateElementJSX } from './element';
import { formatCode } from '../utils/prettier';
import { codeGenerators } from 'animations/exporters';

export const generateNextJSPage = async (
    page: PageConfig,
    options: {
        animations?: ElementAnimation[];
        useFramerMotion?: boolean;
    } = {}
): Promise<string> => {
    const { animations = [], useFramerMotion = false } = options;

    const hasClientSideFeatures =
        animations.length > 0 ||
        hasInteractiveElements(page.layout) ||
        page.renderMode === 'CLIENT';

    const clientDirective = hasClientSideFeatures ? '"use client";\n\n' : '';

    const imports = collectImports(page, { animations, useFramerMotion });

    const animationMap = processAnimations(animations, { useFramerMotion });

    const pageContent = generatePageComponent(page, { animationMap, useFramerMotion });

    const metadata = generatePageMetadata(page);

    const fullCode = `${clientDirective}${imports}\n\n${metadata}\n\n${pageContent}`;

    return formatCode(fullCode, 'tsx');
};

const hasInteractiveElements = (elements: any[]): boolean => {
    return elements.some(element => {
        if (['button', 'form', 'input'].includes(element.type)) {
            return true;
        }

        if (element.children && element.children.length > 0) {
            return hasInteractiveElements(element.children);
        }

        return false;
    });
};

const collectImports = (
    page: PageConfig,
    options: {
        animations?: ElementAnimation[];
        useFramerMotion?: boolean;
    }
): string => {
    const { animations = [], useFramerMotion = false } = options;

    const imports: string[] = [];

    imports.push('import { Metadata } from "next";');

    if (hasElementOfType(page.layout, 'image')) {
        imports.push('import Image from "next/image";');
    }

    if (animations.length > 0) {
        if (useFramerMotion) {
            imports.push('import { motion } from "framer-motion";');
        } else {
            // we use CSS animations by default
        }
    }

    return imports.join('\n');
};

const hasElementOfType = (elements: any[], type: string): boolean => {
    return elements.some(element => {
        if (element.type === type) {
            return true;
        }

        if (element.children && element.children.length > 0) {
            return hasElementOfType(element.children, type);
        }

        return false;
    });
};

const processAnimations = (
    animations: ElementAnimation[],
    options: {
        useFramerMotion?: boolean;
    }
): Record<string, string> => {
    const { useFramerMotion = false } = options;

    const animationMap: Record<string, string> = {};

    animations.forEach(animation => {
        let code: string;

        if (useFramerMotion && animation.library === 'framerMotion') {
            const framerProps = codeGenerators.framerMotion({
                id: animation.animationId,
                elementId: animation.elementId,
                name: `${animation.type}Animation`,
                type: animation.type,
                tracks: [],
                duration: 1000,
                delay: 0,
            }).props;

            code = Object.entries(framerProps)
                .map(([key, value]) => `${key}={${JSON.stringify(value)}}`)
                .join(' ');

            animationMap[animation.elementId] = code;
        } else {
            animationMap[animation.elementId] = `className="animate-${animation.animationId}"`;
        }
    });

    return animationMap;
};

const generatePageComponent = (
    page: PageConfig,
    options: {
        animationMap: Record<string, string>;
        useFramerMotion?: boolean;
    }
): string => {
    const { animationMap, useFramerMotion = false } = options;

    const elementsJSX = page.layout.map(element =>
        generateElementJSX(element, { useFramerMotion, animations: animationMap })
    ).join('\n');

    const componentName = getComponentName(page.name);

    let pageComponent = '';

    switch (page.renderMode) {
        case 'SERVER':
            pageComponent = `
export default async function ${componentName}() {
  // TODO: Server-side data fetching will be added here
  
  return (
    <main>
      ${elementsJSX}
    </main>
  );
}`;
            break;

        case 'STATIC':
            pageComponent = `
export default function ${componentName}() {
  return (
    <main>
      ${elementsJSX}
    </main>
  );
}`;
            break;

        case 'INCREMENTAL':
            pageComponent = `
export default function ${componentName}({ data }) {
  return (
    <main>
      ${elementsJSX}
    </main>
  );
}

export async function getStaticProps() {
  return {
    props: {
      data: {},
    },
    revalidate: 3600,
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}`;
            break;

        case 'CLIENT':
            pageComponent = `
'use client';

import { useState, useEffect } from 'react';

export default function ${componentName}() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // TODO: add client-side data fetching here
    setIsLoading(false);
  }, []);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return (
    <main>
      ${elementsJSX}
    </main>
  );
}`;
            break;

        default:
            pageComponent = `
export default function ${componentName}() {
  return (
    <main>
      ${elementsJSX}
    </main>
  );
}`;
    }

    return pageComponent;
};

const generatePageMetadata = (page: PageConfig): string => {
    if (!page.meta) {
        return `export const metadata: Metadata = {
  title: '${page.name}',
};`;
    }

    const metaEntries = Object.entries(page.meta)
        .map(([key, value]) => {
            if (Array.isArray(value)) {
                return `  ${key}: ${JSON.stringify(value)},`;
            }
            return `  ${key}: '${value}',`;
        })
        .join('\n');

    return `export const metadata: Metadata = {
${metaEntries}
};`;
};

const getComponentName = (name: string): string => {
    return name
        .replace(/[^a-zA-Z0-9]/g, ' ')
        .split(' ')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
};

export const generateRouteConfig = (page: PageConfig): string => {
    if (page.renderMode === 'STATIC') {
        return '';
    }

    if (page.renderMode === 'SERVER') {
        return `export const dynamic = 'force-dynamic';`;
    }

    if (page.renderMode === 'INCREMENTAL') {
        return `export const revalidate = 3600; // Revalidate at most once every hour`;
    }

    return '';
};

export const generatePageLayout = async (
    page: PageConfig,
    options: {
        hasAuth?: boolean;
    } = {}
): Promise<string | null> => {
    const { hasAuth = false } = options;

    if (!hasAuth) {
        return null;
    }

    const layoutCode = `
export default function ${getComponentName(page.name)}Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="page-layout">
      {/* Auth check could be added here */}
      {children}
    </div>
  );
}
`;

    return formatCode(layoutCode, 'tsx');
};