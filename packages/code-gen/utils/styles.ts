
const cssToTailwindMap: Record<string, (value: string) => string | null> = {

    display: (value) => {
        const displayMap: Record<string, string> = {
            'block': 'block',
            'inline': 'inline',
            'inline-block': 'inline-block',
            'flex': 'flex',
            'inline-flex': 'inline-flex',
            'grid': 'grid',
            'inline-grid': 'inline-grid',
            'none': 'hidden',
        };
        return displayMap[value] || null;
    },

    position: (value) => {
        const positionMap: Record<string, string> = {
            'static': 'static',
            'relative': 'relative',
            'absolute': 'absolute',
            'fixed': 'fixed',
            'sticky': 'sticky',
        };
        return positionMap[value] || null;
    },

    width: (value) => {
        if (value === 'auto') return 'w-auto';
        if (value === '100%') return 'w-full';
        if (value.endsWith('px')) {
            const size = parseInt(value);
            if (size === 0) return 'w-0';
            if (size <= 4) return 'w-px';
            if (size <= 8) return 'w-2';
            if (size <= 12) return 'w-3';
            if (size <= 16) return 'w-4';
            if (size <= 20) return 'w-5';
            if (size <= 24) return 'w-6';
            if (size <= 32) return 'w-8';
            if (size <= 40) return 'w-10';
            if (size <= 48) return 'w-12';
            if (size <= 64) return 'w-16';
            if (size <= 80) return 'w-20';
            if (size <= 96) return 'w-24';
            if (size <= 128) return 'w-32';
            if (size <= 160) return 'w-40';
            if (size <= 192) return 'w-48';
            if (size <= 256) return 'w-64';
            if (size <= 320) return 'w-80';
            if (size <= 384) return 'w-96';
            return null; // Custom width
        }
        return null;
    },

    height: (value) => {
        if (value === 'auto') return 'h-auto';
        if (value === '100%') return 'h-full';
        if (value.endsWith('px')) {
            const size = parseInt(value);
            if (size === 0) return 'h-0';
            if (size <= 4) return 'h-px';
            if (size <= 8) return 'h-2';
            if (size <= 12) return 'h-3';
            if (size <= 16) return 'h-4';
            if (size <= 20) return 'h-5';
            if (size <= 24) return 'h-6';
            if (size <= 32) return 'h-8';
            if (size <= 40) return 'h-10';
            if (size <= 48) return 'h-12';
            if (size <= 64) return 'h-16';
            if (size <= 80) return 'h-20';
            if (size <= 96) return 'h-24';
            if (size <= 128) return 'h-32';
            if (size <= 160) return 'h-40';
            if (size <= 192) return 'h-48';
            if (size <= 256) return 'h-64';
            if (size <= 320) return 'h-80';
            if (size <= 384) return 'h-96';
            return null; // Custom height
        }
        return null;
    },

    margin: (value) => {
        if (value === '0px' || value === '0') return 'm-0';
        if (value === 'auto') return 'm-auto';
        if (value.endsWith('px')) {
            const size = parseInt(value);
            if (size <= 1) return 'm-px';
            if (size <= 2) return 'm-0.5';
            if (size <= 4) return 'm-1';
            if (size <= 6) return 'm-1.5';
            if (size <= 8) return 'm-2';
            if (size <= 10) return 'm-2.5';
            if (size <= 12) return 'm-3';
            if (size <= 14) return 'm-3.5';
            if (size <= 16) return 'm-4';
            if (size <= 20) return 'm-5';
            if (size <= 24) return 'm-6';
            if (size <= 28) return 'm-7';
            if (size <= 32) return 'm-8';
            if (size <= 36) return 'm-9';
            if (size <= 40) return 'm-10';
            if (size <= 44) return 'm-11';
            if (size <= 48) return 'm-12';
            if (size <= 56) return 'm-14';
            if (size <= 64) return 'm-16';
            if (size <= 80) return 'm-20';
            if (size <= 96) return 'm-24';
            if (size <= 112) return 'm-28';
            if (size <= 128) return 'm-32';
            if (size <= 144) return 'm-36';
            if (size <= 160) return 'm-40';
            if (size <= 176) return 'm-44';
            if (size <= 192) return 'm-48';
            if (size <= 208) return 'm-52';
            if (size <= 224) return 'm-56';
            if (size <= 240) return 'm-60';
            if (size <= 256) return 'm-64';
            if (size <= 288) return 'm-72';
            if (size <= 320) return 'm-80';
            if (size <= 384) return 'm-96';
            return null; // Custom margin
        }
        return null;
    },

    padding: (value) => {
        if (value === '0px' || value === '0') return 'p-0';
        if (value.endsWith('px')) {
            const size = parseInt(value);
            if (size <= 1) return 'p-px';
            if (size <= 2) return 'p-0.5';
            if (size <= 4) return 'p-1';
            if (size <= 6) return 'p-1.5';
            if (size <= 8) return 'p-2';
            if (size <= 10) return 'p-2.5';
            if (size <= 12) return 'p-3';
            if (size <= 14) return 'p-3.5';
            if (size <= 16) return 'p-4';
            if (size <= 20) return 'p-5';
            if (size <= 24) return 'p-6';
            if (size <= 28) return 'p-7';
            if (size <= 32) return 'p-8';
            if (size <= 36) return 'p-9';
            if (size <= 40) return 'p-10';
            if (size <= 44) return 'p-11';
            if (size <= 48) return 'p-12';
            if (size <= 56) return 'p-14';
            if (size <= 64) return 'p-16';
            if (size <= 80) return 'p-20';
            if (size <= 96) return 'p-24';
            if (size <= 112) return 'p-28';
            if (size <= 128) return 'p-32';
            if (size <= 144) return 'p-36';
            if (size <= 160) return 'p-40';
            if (size <= 176) return 'p-44';
            if (size <= 192) return 'p-48';
            if (size <= 208) return 'p-52';
            if (size <= 224) return 'p-56';
            if (size <= 240) return 'p-60';
            if (size <= 256) return 'p-64';
            if (size <= 288) return 'p-72';
            if (size <= 320) return 'p-80';
            if (size <= 384) return 'p-96';
            return null; // Custom padding
        }
        return null;
    },

    color: (value) => {
        const colorMap: Record<string, string> = {
            'black': 'text-black',
            'white': 'text-white',
            'transparent': 'text-transparent',
            'red': 'text-red-500',
            'blue': 'text-blue-500',
            'green': 'text-green-500',
            'yellow': 'text-yellow-500',
            'purple': 'text-purple-500',
            'pink': 'text-pink-500',
            'gray': 'text-gray-500',
            '#000': 'text-black',
            '#000000': 'text-black',
            '#fff': 'text-white',
            '#ffffff': 'text-white',
        };

        if (colorMap[value]) return colorMap[value];

        if (value.startsWith('#')) {
            const hex = value.toLowerCase();

            if (hex === '#f00') return 'text-red-500';
            if (hex === '#0f0') return 'text-green-500';
            if (hex === '#00f') return 'text-blue-500';

            return null; // another color mapping
        }

        if (value.startsWith('rgb')) {
            return null; // another color mapping
        }

        return null;
    },

    backgroundColor: (value) => {
        const colorMap: Record<string, string> = {
            'black': 'bg-black',
            'white': 'bg-white',
            'transparent': 'bg-transparent',
            'red': 'bg-red-500',
            'blue': 'bg-blue-500',
            'green': 'bg-green-500',
            'yellow': 'bg-yellow-500',
            'purple': 'bg-purple-500',
            'pink': 'bg-pink-500',
            'gray': 'bg-gray-500',
            '#000': 'bg-black',
            '#000000': 'bg-black',
            '#fff': 'bg-white',
            '#ffffff': 'bg-white',
        };

        if (colorMap[value]) return colorMap[value];

        if (value.startsWith('#')) {
            const hex = value.toLowerCase();

            if (hex === '#f00') return 'bg-red-500';
            if (hex === '#0f0') return 'bg-green-500';
            if (hex === '#00f') return 'bg-blue-500';

            return null; // another color mapping
        }

        if (value.startsWith('rgb')) {
            return null; // another color mapping
        }

        return null;
    },

    fontSize: (value) => {
        const fontSizeMap: Record<string, string> = {
            '12px': 'text-xs',
            '14px': 'text-sm',
            '16px': 'text-base',
            '18px': 'text-lg',
            '20px': 'text-xl',
            '24px': 'text-2xl',
            '30px': 'text-3xl',
            '36px': 'text-4xl',
            '48px': 'text-5xl',
            '60px': 'text-6xl',
            '72px': 'text-7xl',
            '96px': 'text-8xl',
            '128px': 'text-9xl',
        };

        return fontSizeMap[value] || null;
    },

    fontWeight: (value) => {
        const fontWeightMap: Record<string, string> = {
            '100': 'font-thin',
            '200': 'font-extralight',
            '300': 'font-light',
            '400': 'font-normal',
            '500': 'font-medium',
            '600': 'font-semibold',
            '700': 'font-bold',
            '800': 'font-extrabold',
            '900': 'font-black',
            'thin': 'font-thin',
            'extralight': 'font-extralight',
            'light': 'font-light',
            'normal': 'font-normal',
            'medium': 'font-medium',
            'semibold': 'font-semibold',
            'bold': 'font-bold',
            'extrabold': 'font-extrabold',
            'black': 'font-black',
        };

        return fontWeightMap[value] || null;
    },

    // Borders
    border: (value) => {
        if (value === 'none') return 'border-0';
        if (value === '1px solid black') return 'border border-black';
        if (value === '1px solid') return 'border';
        if (value === '2px solid') return 'border-2';
        if (value === '4px solid') return 'border-4';
        if (value === '8px solid') return 'border-8';

        return null; // More complex borders
    },

    borderRadius: (value) => {
        if (value === '0px' || value === '0') return 'rounded-none';
        if (value === '2px') return 'rounded-sm';
        if (value === '4px') return 'rounded';
        if (value === '6px') return 'rounded-md';
        if (value === '8px') return 'rounded-lg';
        if (value === '12px') return 'rounded-xl';
        if (value === '16px') return 'rounded-2xl';
        if (value === '24px') return 'rounded-3xl';
        if (value === '9999px' || value === '50%') return 'rounded-full';

        return null; // Custom border radius
    },

    flexDirection: (value) => {
        const flexDirectionMap: Record<string, string> = {
            'row': 'flex-row',
            'column': 'flex-col',
            'row-reverse': 'flex-row-reverse',
            'column-reverse': 'flex-col-reverse',
        };

        return flexDirectionMap[value] || null;
    },

    justifyContent: (value) => {
        const justifyContentMap: Record<string, string> = {
            'flex-start': 'justify-start',
            'flex-end': 'justify-end',
            'center': 'justify-center',
            'space-between': 'justify-between',
            'space-around': 'justify-around',
            'space-evenly': 'justify-evenly',
        };

        return justifyContentMap[value] || null;
    },

    alignItems: (value) => {
        const alignItemsMap: Record<string, string> = {
            'flex-start': 'items-start',
            'flex-end': 'items-end',
            'center': 'items-center',
            'baseline': 'items-baseline',
            'stretch': 'items-stretch',
        };

        return alignItemsMap[value] || null;
    },

    gap: (value) => {
        if (value === '0px' || value === '0') return 'gap-0';
        if (value.endsWith('px')) {
            const size = parseInt(value);
            if (size <= 1) return 'gap-px';
            if (size <= 2) return 'gap-0.5';
            if (size <= 4) return 'gap-1';
            if (size <= 6) return 'gap-1.5';
            if (size <= 8) return 'gap-2';
            if (size <= 10) return 'gap-2.5';
            if (size <= 12) return 'gap-3';
            if (size <= 14) return 'gap-3.5';
            if (size <= 16) return 'gap-4';
            if (size <= 20) return 'gap-5';
            if (size <= 24) return 'gap-6';
            if (size <= 28) return 'gap-7';
            if (size <= 32) return 'gap-8';
            if (size <= 36) return 'gap-9';
            if (size <= 40) return 'gap-10';
            if (size <= 44) return 'gap-11';
            if (size <= 48) return 'gap-12';
            if (size <= 56) return 'gap-14';
            if (size <= 64) return 'gap-16';
            if (size <= 80) return 'gap-20';
            if (size <= 96) return 'gap-24';
            return null; // Larger gaps
        }
        return null;
    },

    cursor: (value) => {
        const cursorMap: Record<string, string> = {
            'pointer': 'cursor-pointer',
            'default': 'cursor-default',
            'text': 'cursor-text',
            'move': 'cursor-move',
            'not-allowed': 'cursor-not-allowed',
            'grab': 'cursor-grab',
            'grabbing': 'cursor-grabbing',
            'wait': 'cursor-wait',
            'help': 'cursor-help',
        };

        return cursorMap[value] || null;
    },

    opacity: (value) => {
        const opacityValue = parseFloat(value);
        if (opacityValue === 0) return 'opacity-0';
        if (opacityValue <= 0.05) return 'opacity-5';
        if (opacityValue <= 0.1) return 'opacity-10';
        if (opacityValue <= 0.2) return 'opacity-20';
        if (opacityValue <= 0.25) return 'opacity-25';
        if (opacityValue <= 0.3) return 'opacity-30';
        if (opacityValue <= 0.4) return 'opacity-40';
        if (opacityValue <= 0.5) return 'opacity-50';
        if (opacityValue <= 0.6) return 'opacity-60';
        if (opacityValue <= 0.7) return 'opacity-70';
        if (opacityValue <= 0.75) return 'opacity-75';
        if (opacityValue <= 0.8) return 'opacity-80';
        if (opacityValue <= 0.9) return 'opacity-90';
        if (opacityValue <= 0.95) return 'opacity-95';
        return 'opacity-100';
    },

    textAlign: (value) => {
        const textAlignMap: Record<string, string> = {
            'left': 'text-left',
            'center': 'text-center',
            'right': 'text-right',
            'justify': 'text-justify',
        };

        return textAlignMap[value] || null;
    },

    zIndex: (value) => {
        const zIndexValue = parseInt(value);
        if (zIndexValue === 0) return 'z-0';
        if (zIndexValue === 10) return 'z-10';
        if (zIndexValue === 20) return 'z-20';
        if (zIndexValue === 30) return 'z-30';
        if (zIndexValue === 40) return 'z-40';
        if (zIndexValue === 50) return 'z-50';
        if (zIndexValue === -10) return 'z-[-10]';
        if (zIndexValue === -20) return 'z-[-20]';
        return null; // Custom z-index
    },
};

export const convertStylesToTailwind = (styles: Record<string, any>): string => {
    const tailwindClasses: string[] = [];

    for (const [property, value] of Object.entries(styles)) {
        if (value === undefined || value === null) continue;

        if (typeof value === 'number' && !['opacity', 'zIndex'].includes(property)) {
            continue;
        }

        const strValue = typeof value === 'string' ? value : String(value);

        if (cssToTailwindMap[property]) {
            const tailwindClass = cssToTailwindMap[property](strValue);
            if (tailwindClass) {
                tailwindClasses.push(tailwindClass);
            }
        }
    }

    handleDirectionalProperties(styles, tailwindClasses, 'margin', 'm');
    handleDirectionalProperties(styles, tailwindClasses, 'padding', 'p');

    return tailwindClasses.join(' ');
};

// Handle directional properties like margin and padding
const handleDirectionalProperties = (
    styles: Record<string, any>,
    tailwindClasses: string[],
    baseProperty: string,
    prefix: string
) => {
    const top = styles[`${baseProperty}Top`];
    const right = styles[`${baseProperty}Right`];
    const bottom = styles[`${baseProperty}Bottom`];
    const left = styles[`${baseProperty}Left`];

    if (top || right || bottom || left) {
        const pxToSize = (px: string): string | null => {
            if (!px) return null;
            if (px === '0px' || px === '0') return '0';
            if (px === 'auto') return 'auto';

            if (px.endsWith('px')) {
                const size = parseInt(px);
                if (size <= 1) return 'px';
                if (size <= 2) return '0.5';
                if (size <= 4) return '1';
                if (size <= 6) return '1.5';
                if (size <= 8) return '2';
                if (size <= 10) return '2.5';
                if (size <= 12) return '3';
                if (size <= 14) return '3.5';
                if (size <= 16) return '4';
                if (size <= 20) return '5';
                if (size <= 24) return '6';
                return null; // Custom size
            }

            return null;
        };

        const topSize = pxToSize(top);
        const rightSize = pxToSize(right);
        const bottomSize = pxToSize(bottom);
        const leftSize = pxToSize(left);

        if (topSize) tailwindClasses.push(`${prefix}t-${topSize}`);
        if (rightSize) tailwindClasses.push(`${prefix}r-${rightSize}`);
        if (bottomSize) tailwindClasses.push(`${prefix}b-${bottomSize}`);
        if (leftSize) tailwindClasses.push(`${prefix}l-${leftSize}`);
    }
};