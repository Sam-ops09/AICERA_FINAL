
"use client";

import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "motion/react";
import { cn } from "@/utils/cn";

export function TextGenerateEffectExample() {
    return (
        <div>
            {/* Example with text prop */}
            <TextGenerateEffect text="This is a text generation effect." duration={0.3} />

            {/* Example with children */}
            <TextGenerateEffect duration={0.3}>
                This is a wrapped text with the same effect.
            </TextGenerateEffect>

            {/* Example wrapping a div */}
            <TextGenerateEffect duration={0.3}>
                <div className="p-4 bg-gray-100 rounded-md">
                    This entire div is wrapped with the text generation effect.
                </div>
            </TextGenerateEffect>
        </div>
    );
}

type TextGenerateEffectProps = {
    text?: string;
    children?: ReactNode;
    duration?: number;
} & Omit<HTMLMotionProps<"div">, "children">;

export function TextGenerateEffect({
    text,
    children,
    duration = 0.01,
    className,
    ...motionProps
    }: TextGenerateEffectProps) {
    // If text prop is provided, apply the effect to each character
    if (text) {
        return (
            <motion.div className={className} {...motionProps}>
                {text.split("").map((char, index) => (
                    <motion.span
                        key={`text-${index}`}
                        className={className}
                        initial={{ opacity: 0, filter: "blur(4px)", rotateX: 90, y: 5 }}
                        whileInView={{
                            opacity: 1,
                            filter: "blur(0px)",
                            rotateX: 0,
                            y: 0,
                        }}
                        transition={{
                            ease: "easeOut",
                            duration: duration,
                            delay: index * 0.015,
                        }}
                        viewport={{ once: true }}
                    >
                        {char}
                    </motion.span>
                ))}
            </motion.div>
        );
    }

    // If children are provided and they're a string, apply the effect to each character
    if (children && typeof children === "string") {
        return (
            <motion.div className={className} {...motionProps}>
                {children.split("").map((char, index) => (
                    <motion.span
                        key={`child-text-${index}`}
                        className={className}
                        initial={{ opacity: 0, filter: "blur(4px)", rotateX: 90, y: 5 }}
                        whileInView={{
                            opacity: 1,
                            filter: "blur(0px)",
                            rotateX: 0,
                            y: 0,
                        }}
                        transition={{
                            ease: "easeOut",
                            duration: duration,
                            delay: index * 0.015,
                        }}
                        viewport={{ once: true }}
                    >
                        {char}
                    </motion.span>
                ))}
            </motion.div>
        );
    }

    // If children are provided and they're not a string (like JSX elements),
    // wrap the entire children in the animation effect
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, filter: "blur(4px)", y: 5 }}
            whileInView={{
                opacity: 1,
                filter: "blur(0px)",
                y: 0,
            }}
            transition={{
                ease: "easeOut",
                duration: duration,
            }}
            viewport={{ once: true }}
            {...motionProps}
        >
            {children}
        </motion.div>
    );
}
