import { Element, ElementType } from '../types';
import { convertStylesToTailwind } from '../utils/styles';

export const generateElementJSX = (
    element: Element,
    options: {
        useFramerMotion?: boolean;
        animations?: Record<string, string>;
    } = {}
): string => {
    const { useFramerMotion = false, animations = {} } = options;
    const hasAnimation = animations[element.id];

    const tag = getElementTag(element.type, { useFramerMotion, hasAnimation });

    const attributes = generateElementAttributes(element, { useFramerMotion, animations });

    let children = '';

    if (element.type === 'text') {
        children = element.content || '';
    } else if (element.type === 'image') {
        children = '';
    } else if (element.children && element.children.length > 0) {
        children = element.children
            .map((child) => generateElementJSX(child, options))
            .join('\n');
    } else if (element.type === 'button') {
        children = element.content || 'Button';
    } else if (element.type === 'custom' && element.props?.component) {
        children = element.props.component;
    }
    if (element.type === 'image' || element.type === 'input') {
        return `<${tag}${attributes} />`;
    }
    return `<${tag}${attributes}>${children}</${tag.split(' ')[0]}>`;
};

const getElementTag = (
    type: ElementType,
    options: { useFramerMotion?: boolean; hasAnimation?: boolean }
): string => {
    const { useFramerMotion, hasAnimation } = options;

    switch (type) {
        case 'container':
            return useFramerMotion && hasAnimation ? 'motion.div' : 'div';
        case 'text':
            if (useFramerMotion && hasAnimation) {
                return 'motion.p';
            }
            // Check if it's a heading based on styles or content would go here
            return 'p';
        case 'image':
            return 'Image';
        case 'button':
            return useFramerMotion && hasAnimation ? 'motion.button' : 'button';
        case 'form':
            return 'form';
        case 'input':
            return 'input';
        case 'custom':
            // If it's a custom component, you might want to use its name
            return 'div';
        default:
            return 'div';
    }
};

const generateElementAttributes = (
    element: Element,
    options: { useFramerMotion?: boolean; animations?: Record<string, string> }
): string => {
    const { useFramerMotion, animations = {} } = options;
    const attributes: string[] = [];

    const tailwindClasses = convertStylesToTailwind(element.styles);
    if (tailwindClasses) {
        attributes.push(`className="${tailwindClasses}"`);
    }

    attributes.push(`data-element-id="${element.id}"`);

    switch (element.type) {
        case 'image':
            if (element.src) {
                attributes.push(`src="${element.src}"`);
            }
            if (element.alt) {
                attributes.push(`alt="${element.alt || ''}"`);
            }
            // Add width and height for Next.js Image
            attributes.push('width={500}');
            attributes.push('height={300}');
            break;

        case 'input':
            if (element.props?.type) {
                attributes.push(`type="${element.props.type}"`);
            } else {
                attributes.push('type="text"');
            }
            if (element.props?.placeholder) {
                attributes.push(`placeholder="${element.props.placeholder}"`);
            }
            break;

        case 'button':
            if (element.props?.type) {
                attributes.push(`type="${element.props.type}"`);
            } else {
                attributes.push('type="button"');
            }
            break;

        case 'form':
            attributes.push('onSubmit={(e) => e.preventDefault()}');
            break;
    }

    if (useFramerMotion && animations[element.id]) {
        attributes.push(animations[element.id]);
    }

    return attributes.length > 0 ? ` ${attributes.join(' ')}` : '';
};