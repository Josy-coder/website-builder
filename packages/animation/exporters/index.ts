import { Animation, AnimationTrack, KeyframePoint } from '../types';

export const generateCSSKeyframes = (animation: Animation): string => {
    const keyframesMap = new Map<string, Record<string, string>>();

    animation.tracks.forEach(track => {
        track.keyframes.forEach(keyframe => {
            const percent = Math.round((keyframe.time / animation.duration) * 100);

            if (!keyframesMap.has(`${percent}%`)) {
                keyframesMap.set(`${percent}%`, {});
            }

            const styles = keyframesMap.get(`${percent}%`)!;

            if (track.property.startsWith('transform.')) {
                const transformProp = track.property.split('.')[1];

                if (!styles['transform']) {
                    styles['transform'] = '';
                }

                if (transformProp === 'translateX' || transformProp === 'translateY') {
                    styles['transform'] += ` ${transformProp}(${keyframe.properties.value})`;
                } else if (transformProp === 'scale') {
                    styles['transform'] += ` scale(${keyframe.properties.value})`;
                } else if (transformProp === 'rotate') {
                    styles['transform'] += ` rotate(${keyframe.properties.value})`;
                }
            } else {
                styles[track.property] = keyframe.properties.value;
            }
        });
    });

    const animationName = animation.id.replace(/-/g, '_');
    let css = `@keyframes ${animationName} {\n`;

    const sortedPercentages = Array.from(keyframesMap.keys()).sort((a, b) => {
        return parseInt(a) - parseInt(b);
    });

    sortedPercentages.forEach(percent => {
        const styles = keyframesMap.get(percent)!;
        css += `  ${percent} {\n`;

        Object.entries(styles).forEach(([prop, value]) => {
            css += `    ${prop}: ${value};\n`;
        });

        css += `  }\n`;
    });

    css += `}\n`;

    return css;
};

export const generateCSSAnimationStyle = (animation: Animation): string => {
    const animationName = animation.id.replace(/-/g, '_');

    let easing = 'ease';
    if (animation.tracks.length > 0) {
        easing = animation.tracks[0].easing;
    }

    return `
animation-name: ${animationName};
animation-duration: ${animation.duration}ms;
animation-delay: ${animation.delay}ms;
animation-timing-function: ${easing};
animation-fill-mode: forwards;
`;
};

export const generateFramerMotionProps = (animation: Animation): Record<string, any> => {
    const variants: Record<string, any> = {
        initial: {},
        animate: {},
    };

    const transition = {
        duration: animation.duration / 1000,
        delay: animation.delay / 1000,
    };

    animation.tracks.forEach(track => {
        const initialKeyframe = track.keyframes.find(k => k.time === 0);
        const finalKeyframe = track.keyframes.find(k => k.time === animation.duration) ||
            track.keyframes[track.keyframes.length - 1];

        if (initialKeyframe && finalKeyframe) {
            if (track.property.startsWith('transform.')) {
                const transformProp = track.property.split('.')[1];

                if (transformProp === 'translateX') {
                    variants.initial.x = initialKeyframe.properties.value;
                    variants.animate.x = finalKeyframe.properties.value;
                } else if (transformProp === 'translateY') {
                    variants.initial.y = initialKeyframe.properties.value;
                    variants.animate.y = finalKeyframe.properties.value;
                } else if (transformProp === 'scale') {
                    variants.initial.scale = parseFloat(initialKeyframe.properties.value);
                    variants.animate.scale = parseFloat(finalKeyframe.properties.value);
                } else if (transformProp === 'rotate') {
                    variants.initial.rotate = initialKeyframe.properties.value;
                    variants.animate.rotate = finalKeyframe.properties.value;
                }
            } else {
                variants.initial[track.property] = initialKeyframe.properties.value;
                variants.animate[track.property] = finalKeyframe.properties.value;
            }
        }

        if (track.easing) {
            transition.ease = track.easing;
        }
    });

    return {
        variants,
        initial: "initial",
        animate: animation.type === 'entry' ? "animate" : "initial",
        whileHover: animation.type === 'hover' ? "animate" : undefined,
        whileTap: animation.type === 'click' ? "animate" : undefined,
        transition,
    };
};

export const generateGSAPCode = (animation: Animation): string => {
    const gsapTracks: string[] = [];

    animation.tracks.forEach(track => {
        const keyframes: Record<string, any> = {};

        track.keyframes.forEach(keyframe => {
            // GSAP works with seconds
            const time = keyframe.time / 1000;

            if (track.property.startsWith('transform.')) {
                const transformProp = track.property.split('.')[1];

                if (transformProp === 'translateX') {
                    keyframes.x = keyframe.properties.value;
                } else if (transformProp === 'translateY') {
                    keyframes.y = keyframe.properties.value;
                } else if (transformProp === 'scale') {
                    keyframes.scale = parseFloat(keyframe.properties.value);
                } else if (transformProp === 'rotate') {
                    keyframes.rotation = keyframe.properties.value;
                }
            } else {
                keyframes[track.property] = keyframe.properties.value;
            }
        });

        const easing = track.easing.replace('cubic-bezier', 'power4');

        gsapTracks.push(`
  .to(element, {
    ${Object.entries(keyframes)
            .map(([prop, value]) => `${prop}: "${value}"`)
            .join(',\n    ')},
    duration: ${animation.duration / 1000},
    delay: ${animation.delay / 1000},
    ease: "${easing}"
  })
`);
    });

    return `
const timeline = gsap.timeline({
  paused: true${animation.type === 'hover' ? ',\n  repeat: 0' : ''}
})${gsapTracks.join('')};

${generateGSAPTrigger(animation)}
`;
};

const generateGSAPTrigger = (animation: Animation): string => {
    switch (animation.type) {
        case 'entry':
            return 'timeline.play();';
        case 'exit':
            return 'timeline.reverse();';
        case 'hover':
            return `
element.addEventListener('mouseenter', () => timeline.play());
element.addEventListener('mouseleave', () => timeline.reverse());`;
        case 'click':
            return `
element.addEventListener('click', () => timeline.play());`;
        case 'scroll':
            return `
const scrollTrigger = ScrollTrigger.create({
  trigger: element,
  start: "top 80%",
  onEnter: () => timeline.play(),
  onLeaveBack: () => timeline.reverse()
});`;
        default:
            return 'timeline.play();';
    }
};

export const codeGenerators = {
    css: (animation: Animation) => {
        const keyframes = generateCSSKeyframes(animation);
        const style = generateCSSAnimationStyle(animation);

        return {
            keyframes,
            style,
            implementation: `${keyframes}\n\n.element-${animation.elementId} {\n${style}\n}`,
        };
    },

    framerMotion: (animation: Animation) => {
        const props = generateFramerMotionProps(animation);

        return {
            props,
            implementation: `
import { motion } from 'framer-motion';

const ${animation.name.replace(/\s+/g, '')}Animation = {
  variants: ${JSON.stringify(props.variants, null, 2)},
  initial: "${props.initial}",
  animate: "${props.animate}",
  ${props.whileHover ? `whileHover: "${props.whileHover}",` : ''}
  ${props.whileTap ? `whileTap: "${props.whileTap}",` : ''}
  transition: ${JSON.stringify(props.transition, null, 2)}
};

// Usage:
// <motion.div {...${animation.name.replace(/\s+/g, '')}Animation}>Content</motion.div>
`,
        };
    },

    gsap: (animation: Animation) => {
        const code = generateGSAPCode(animation);

        return {
            code,
            implementation: `
import gsap from 'gsap';
${animation.type === 'scroll' ? "import ScrollTrigger from 'gsap/ScrollTrigger';\n" : ''}
${animation.type === 'scroll' ? "gsap.registerPlugin(ScrollTrigger);\n" : ''}

const element = document.querySelector('#element-${animation.elementId}');

${code}
`,
        };
    },
};

export const generateAnimationCode = (
    animation: Animation,
    library: 'css' | 'framerMotion' | 'gsap' = 'framerMotion'
) => {
    return codeGenerators[library](animation);
};