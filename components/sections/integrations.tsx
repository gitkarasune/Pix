"use client"

import type React from "react"

import { SiOpenai, SiUnsplash, SiNextdotjs, SiTailwindcss, SiVercel, SiClerk } from "react-icons/si"
import { FaArrowCircleRight } from "react-icons/fa"

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function IntegrationsSection() {
    return (
        <section className="py-8 md:py-16" id="integrations">
            <div className="bg-muted dark:bg-background py-10 md:py-16">
                <div className="mx-auto max-w-5xl px-6">
                    <div className="relative mx-auto flex max-w-sm items-center justify-between">
                        <div className="space-y-6">
                            <IntegrationCard position="left-top">
                                <SiOpenai className="text-green-600" />
                            </IntegrationCard>
                            <IntegrationCard position="left-middle">
                                <SiClerk className="text-purple-600" />
                            </IntegrationCard>
                            <IntegrationCard position="left-bottom">
                                <SiUnsplash className="text-black dark:text-white" />
                            </IntegrationCard>
                        </div>
                        <div className="mx-auto my-2 flex w-fit justify-center gap-2">
                            <div className="bg-muted relative z-20 rounded-2xl border p-1">
                                <IntegrationCard
                                    className="shadow-black-950/10 dark:bg-background size-16 border-black/25 shadow-xl dark:border-white/25 dark:shadow-white/10"
                                    isCenter={true}>
                                    <SiNextdotjs />
                                </IntegrationCard>
                            </div>
                        </div>
                        <div
                            role="presentation"
                            className="absolute inset-1/3 bg-[radial-gradient(var(--dots-color)_1px,transparent_1px)] opacity-50 [--dots-color:black] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:[--dots-color:white]"></div>

                        <div className="space-y-6">
                            <IntegrationCard position="right-top">
                                <SiTailwindcss className="text-cyan-500" />
                            </IntegrationCard>
                            <IntegrationCard position="right-middle">
                                <SiVercel className="text-black dark:text-white" />
                            </IntegrationCard>
                            <IntegrationCard position="right-bottom">
                                <svg className="size-6" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                </svg>
                            </IntegrationCard>
                        </div>
                    </div>
                    <div className="mx-auto mt-12 max-w-lg space-y-6 text-center">
                        <h2 className="text-balance text-3xl font-semibold md:text-4xl">Built with modern technologies</h2>
                        <p className="text-muted-foreground text-lg">Powered by industry-leading tools and services for the best user experience and performance.</p>

                        <Button size={"lg"}

                            className="rounded-2xl py-7"
                        >
                            <Link href="/dashboard" className="flex items-center gap-3 disabled:opacity-70 rounded-2xl py-7 font-semibold text-lg">
                                Explore Now
                                <span className="ml-2 -mr-8 bg-white dark:bg-black text-black dark:text-white rounded-2xl w-14 py-5 flex justify-center items-center">
                                    <FaArrowCircleRight className='h-10 w-10 flex justify-center items-center' />
                                </span>
                            </Link>

                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}

const IntegrationCard = ({ children, className, position, isCenter = false }: { children: React.ReactNode; className?: string; position?: 'left-top' | 'left-middle' | 'left-bottom' | 'right-top' | 'right-middle' | 'right-bottom'; isCenter?: boolean }) => {
    return (
        <div className={cn('bg-background relative flex size-12 rounded-xl border dark:bg-transparent', className)}>
            <div className={cn('relative z-20 m-auto size-fit *:size-6', isCenter && '*:size-8')}>{children}</div>
            {position && !isCenter && (
                <div
                    className={cn(
                        'bg-linear-to-r to-muted-foreground/25 absolute z-10 h-px',
                        position === 'left-top' && 'left-full top-1/2 w-[130px] origin-left rotate-[25deg]',
                        position === 'left-middle' && 'left-full top-1/2 w-[120px] origin-left',
                        position === 'left-bottom' && 'left-full top-1/2 w-[130px] origin-left rotate-[-25deg]',
                        position === 'right-top' && 'bg-linear-to-l right-full top-1/2 w-[130px] origin-right rotate-[-25deg]',
                        position === 'right-middle' && 'bg-linear-to-l right-full top-1/2 w-[120px] origin-right',
                        position === 'right-bottom' && 'bg-linear-to-l right-full top-1/2 w-[130px] origin-right rotate-[25deg]'
                    )}
                />
            )}
        </div>
    )
}