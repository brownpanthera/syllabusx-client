'use client';

import { Tab, server } from '@/config';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError, AxiosResponse } from 'axios';
import _ from 'lodash';
import { Loader2, RefreshCcw } from 'lucide-react';
import { useParams } from 'next/navigation';
import { FC } from 'react';
import { Badge } from './ui/badge';
import { Button, buttonVariants } from './ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from './ui/tooltip';

interface StudyMaterialProps {
    tab: Tab;
    note?: string;
    pyq?: string;
    book?: string;
    practical?: string;
    setEmbed: React.Dispatch<React.SetStateAction<Embed>>;
    setTab: React.Dispatch<React.SetStateAction<Tab>>;
}

const StudyMaterial: FC<StudyMaterialProps> = ({
    tab,
    setEmbed,
    setTab,
    book,
    note,
    practical,
    pyq,
}) => {
    const params = useParams();

    const { semester, branch, subject } = params;

    const { data, isLoading, error, refetch, isFetching } = useQuery({
        queryKey: [tab, semester, branch, subject],
        queryFn: async () => {
            if (tab === Tab.NOTES) {
                const response = (await axios.get(
                    `${server}drive/notes/${note}`
                )) as AxiosResponse;
                return response.data as Drive[];
            } else if (tab === Tab.PYQ) {
                const response = (await axios.get(
                    `${server}drive/pyq/${pyq}`
                )) as AxiosResponse;
                return response.data as Drive[];
            } else if (tab === Tab.BOOKS) {
                const response = (await axios.get(
                    `${server}drive/books/${book}`
                )) as AxiosResponse;
                return response.data as Drive[];
            } else if (tab === Tab.PRACTICAL) {
                const response = (await axios.get(
                    `${server}drive/practicalfile/${practical}`
                )) as AxiosResponse;
                return response.data as Drive[];
            }

            return null;
        },
        staleTime: 1000 * 60 * 60 * 2,
    });

    if (error instanceof AxiosError)
        return (
            <div className="p-4 bg-neutral-900 rounded-lg grid place-content-center text-center">
                <h1 className="text-3xl">404 Not Found</h1>
                <p>{error.message}</p>
            </div>
        );

    return (
        <div className="relative grid bg-neutral-800/80 lg:mt-5 rounded-lg p-2">
            <h3 className="mb-4 text-lg lg:text-xl">{_.capitalize(tab)}</h3>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger className="absolute right-2 top-2">
                        <Button
                            onClick={() => refetch()}
                            disabled={isLoading}
                            className="p-2 h-auto"
                        >
                            {isFetching ? (
                                <RefreshCcw className="h-4 w-4 animate-reverse-spin" />
                            ) : (
                                <RefreshCcw className="h-4 w-4" />
                            )}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Refresh</TooltipContent>
                </Tooltip>
            </TooltipProvider>
            {isLoading && (
                <Loader2 className="h-24 w-24 animate-spin mt-5 mx-auto sm:col-span-2 md:col-span-3 lg:col-span-4" />
            )}
            {data && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {data.map((d) => (
                        <div
                            key={d.id}
                            className={cn(
                                buttonVariants({
                                    variant: 'default',
                                    className:
                                        'relative whitespace-normal text-center h-full self-center cursor-pointer group',
                                })
                            )}
                            onClick={() => {
                                setTab(Tab.PDF);
                                setEmbed({
                                    embedLink:
                                        d.webViewLink.slice(0, -17) + 'preview',
                                    name: d.name.slice(0, -4),
                                });
                            }}
                        >
                            {!(
                                new Date(Date.parse(d.createdTime)).getTime() <
                                new Date(
                                    Date.now() - 2 * 24 * 60 * 60 * 1000
                                ).getTime()
                            ) && (
                                <Badge variant={'secondary'} className="absolute -top-2 -left-2 hover:bg-teal-600 group-hover:animate-pulse rounded-sm bg-teal-600">
                                    {/* <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-900 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-slate-900"></span> */}New
                                </Badge>
                            )}
                            {d.name.slice(0, -4)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudyMaterial;
