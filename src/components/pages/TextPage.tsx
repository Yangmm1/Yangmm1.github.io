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
        <div className={`flex w-full justify-between items-baseline ${compact ? "gap-2" : "gap-4"} ${className}`}>
            <span className={`min-w-0 flex-1 ${compact ? "pr-2" : "pr-4"}`}>{left}</span>
            <span className={`text-right shrink-0 ${compact ? "text-[10px] whitespace-normal" : "whitespace-nowrap"}`}>{right}</span>
        </div>
    );
}

function CvRowParagraph({ children, compact = false }: { children?: React.ReactNode; compact?: boolean }) {
    const split = splitCvRow(children);
    if (!split) {
        return <p className={compact ? "mb-1 last:mb-0" : "mb-4 last:mb-0"}>{children}</p>;
    }
    return <CvRowLayout left={split.left} right={split.right} className="mb-0.5" compact={compact} />;
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
            className={embedded ? "" : isCompact ? "mx-auto" : "max-w-3xl mx-auto"}
        >
            {!isCompact && (
                <h1 className={`${embedded ? "text-2xl" : "text-4xl"} font-serif font-bold text-primary mb-4`}>{config.title}</h1>
            )}
            {config.description && !isCompact && (
                <p className={`${embedded ? "text-base" : "text-lg"} text-neutral-600 dark:text-neutral-500 mb-8 max-w-2xl`}>
                    {config.description}
                </p>
            )}
            <div className={`text-neutral-700 dark:text-neutral-600 ${isCompact ? "text-[11px] leading-snug" : "leading-relaxed"}`}>
                <ReactMarkdown
                    components={{
                        h1: ({ children }) => (
                            <h1 className={`font-serif font-bold text-primary ${isCompact ? "text-sm mt-3 mb-1" : "text-3xl mt-8 mb-4"}`}>{children}</h1>
                        ),
                        h2: ({ children }) => (
                            <h2 className={`font-serif font-bold text-primary border-b border-neutral-200 dark:border-neutral-800 ${isCompact ? "text-xs mt-2.5 mb-1 pb-0.5" : "text-2xl mt-8 mb-4 pb-2"}`}>{children}</h2>
                        ),
                        h3: ({ children }) => (
                            <h3 className={`font-semibold text-primary ${isCompact ? "text-[11px] mt-1.5 mb-0.5" : "text-xl mt-6 mb-3"}`}>{children}</h3>
                        ),
                        p: ({ children }) => <CvRowParagraph compact={isCompact}>{children}</CvRowParagraph>,
                        ul: ({ children }) => (
                            <ul className={`list-disc list-outside ml-4 pl-0.5 ${isCompact ? "mb-1 space-y-0" : "mb-4 space-y-1 ml-5 pl-1"}`}>{children}</ul>
                        ),
                        ol: ({ children }) => (
                            <ol className={`list-decimal list-outside ml-4 pl-0.5 ${isCompact ? "mb-1 space-y-0" : "mb-4 space-y-1 ml-5 pl-1"}`}>{children}</ol>
                        ),
                        li: ({ children }) => (
                            <li className={isCompact ? "mb-0" : "mb-1"}>
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
