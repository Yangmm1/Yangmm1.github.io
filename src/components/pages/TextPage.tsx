'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { TextPageConfig } from '@/types/page';
import { useIsMobile } from '@/lib/hooks/useIsMobile';

const CV_ROW_SPLIT = ' ·|· ';

function splitCvRow(children?: React.ReactNode): {
    left: React.ReactNode;
    right: React.ReactNode;
} | null {
    const nodes = React.Children.toArray(children);
    const splitIndex = nodes.findIndex(
        (node) => typeof node === 'string' && node.includes(CV_ROW_SPLIT)
    );

    if (splitIndex === -1) return null;

    const leftNodes = nodes.slice(0, splitIndex);
    const splitNode = nodes[splitIndex] as string;
    const [leftFromSplit, ...rightFromSplit] = splitNode.split(CV_ROW_SPLIT);
    const left = leftFromSplit ? [...leftNodes, leftFromSplit] : leftNodes;
    const right = [...rightFromSplit, ...nodes.slice(splitIndex + 1)].filter(
        (node) => node !== '' && node != null
    );

    return { left, right };
}

function CvRowLayout({
    left,
    right,
    className = '',
    compact = false,
}: {
    left: React.ReactNode;
    right: React.ReactNode;
    className?: string;
    compact?: boolean;
}) {
    return (
        <div
            className={`flex w-full min-w-0 ${compact ? "flex-wrap justify-between items-baseline gap-x-2 gap-y-0.5" : "justify-between items-baseline gap-4"} ${className}`}
        >
            <span className={`min-w-0 ${compact ? "flex-1 basis-[60%]" : "flex-1 pr-4"}`}>{left}</span>
            <span className={`text-right ${compact ? "text-xs whitespace-normal shrink-0" : "shrink-0 whitespace-nowrap"}`}>{right}</span>
        </div>
    );
}

function CvRowParagraph({ children, compact = false }: { children?: React.ReactNode; compact?: boolean }) {
    const split = splitCvRow(children);
    if (!split) {
        return <p className={compact ? "mb-2 last:mb-0" : "mb-4 last:mb-0"}>{children}</p>;
    }
    return <CvRowLayout left={split.left} right={split.right} className="mb-1" compact={compact} />;
}

function CvRowListItem({ children, compact = false }: { children?: React.ReactNode; compact?: boolean }) {
    const split = splitCvRow(children);
    if (!split) {
        return <>{children}</>;
    }
    return <CvRowLayout left={split.left} right={split.right} compact={compact} />;
}

interface TextPageProps {
    config: TextPageConfig;
    content: string;
    embedded?: boolean;
    /** 仅在小屏 CV 页启用紧凑排版 */
    mobileAdapt?: boolean;
}

export default function TextPage({ config, content, embedded = false, mobileAdapt = false }: TextPageProps) {
    const isMobile = useIsMobile();
    const isCompact = mobileAdapt && isMobile && !embedded;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={embedded ? "" : isCompact ? "mx-auto w-full min-w-0 max-w-full" : "max-w-3xl mx-auto"}
        >
            {!isCompact && (
                <h1 className={`${embedded ? "text-2xl" : "text-4xl"} font-serif font-bold text-primary mb-4`}>{config.title}</h1>
            )}
            {config.description && !isCompact && (
                <p className={`${embedded ? "text-base" : "text-lg"} text-neutral-600 dark:text-neutral-500 mb-8 max-w-2xl`}>
                    {config.description}
                </p>
            )}
            <div className={`text-neutral-700 dark:text-neutral-600 ${isCompact ? "text-sm leading-relaxed break-words" : "leading-relaxed"}`}>
                <ReactMarkdown
                    components={{
                        h1: ({ children }) => (
                            <h1 className={`font-serif font-bold text-primary ${isCompact ? "text-base mt-4 mb-2" : "text-3xl mt-8 mb-4"}`}>{children}</h1>
                        ),
                        h2: ({ children }) => (
                            <h2 className={`font-serif font-bold text-primary border-b border-neutral-200 dark:border-neutral-800 ${isCompact ? "text-base mt-5 mb-2 pb-1" : "text-2xl mt-8 mb-4 pb-2"}`}>{children}</h2>
                        ),
                        h3: ({ children }) => (
                            <h3 className={`font-semibold text-primary ${isCompact ? "text-sm mt-3 mb-1" : "text-xl mt-6 mb-3"}`}>{children}</h3>
                        ),
                        p: ({ children }) => <CvRowParagraph compact={isCompact}>{children}</CvRowParagraph>,
                        ul: ({ children }) => (
                            <ul className={`list-disc list-outside ${isCompact ? "mb-2 space-y-0.5 ml-4 pl-0.5" : "mb-4 space-y-1 ml-5 pl-1"}`}>{children}</ul>
                        ),
                        ol: ({ children }) => (
                            <ol className={`list-decimal list-outside ${isCompact ? "mb-2 space-y-0.5 ml-4 pl-0.5" : "mb-4 space-y-1 ml-5 pl-1"}`}>{children}</ol>
                        ),
                        li: ({ children }) => (
                            <li className={isCompact ? "mb-0.5" : "mb-1"}>
                                <CvRowListItem compact={isCompact}>{children}</CvRowListItem>
                            </li>
                        ),
                        a: ({ ...props }) => (
                            <a
                                {...props}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
                            />
                        ),
                        blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-accent/50 pl-4 italic my-4 text-neutral-600 dark:text-neutral-500">
                                {children}
                            </blockquote>
                        ),
                        strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                        em: ({ children }) => <em className="italic text-neutral-600 dark:text-neutral-500">{children}</em>,
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </motion.div>
    );
}
