"use client";
import React, { useEffect, useState } from 'react'
import { FiSearch } from "react-icons/fi";
import { VscSend } from "react-icons/vsc";
import { RiCloseLargeLine } from "react-icons/ri";
import { useSearchParams, useRouter } from 'next/navigation'

import { useAppDispatch , useAppSelector} from '@/hooks/useAppDispatch';
import { setKeyword, triggerSearch, resetTrigger } from '@/features/search/searchSlice';
import nProgress from 'nprogress';
import path from 'path';

const style = {
    container: "hidden lg:block",
    input: "dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800  dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]",
    button: "absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-base -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400"
}

function AppHeaderSearch() {
    const [searchInput, setSearchInput] = useState<string>("");
    const [params, setParams] = useState<URLSearchParams | null>(null);
    const router = useRouter();
    const [currentPath, setCurrentPath] = useState<string>("");

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        
        const query = searchParams.get('q');
        if (query) {
            setSearchInput(query);
            dispatch(setKeyword(query));
            dispatch(triggerSearch());
        }

        setParams(searchParams);
        setCurrentPath(window.location.pathname);
    },[])

    const dispatch = useAppDispatch();
    const keyword = useAppSelector((state) => state.search.keyword);

    function handleKeyDown(event: React.KeyboardEvent) {
        if (event.key === 'Enter') {
            event.preventDefault();
            dispatch(setKeyword(searchInput));
            dispatch(triggerSearch());

            params?.set('q', searchInput);
            router.replace(`?${params?.toString()}`);
            nProgress.start();

            setTimeout(() => {
                nProgress.done();
            }, 300);
            if (keyword == "") {
                params?.delete('q');
                return;
            }

            // event.preventDefault();
            // dispatch(setKeyword(searchInput));
            // params?.set('q', searchInput);
            if (searchInput != "") {
                params?.delete('q');
                dispatch(setKeyword(""));
                setSearchInput("");
                dispatch(resetTrigger());
                router.replace(currentPath);
                nProgress.start();
                setTimeout(() => {
                    nProgress.done();
                }, 300);
                return;
            }
            dispatch(triggerSearch());
        }
    }
    function handleClick(event: React.MouseEvent) {
        event.preventDefault();
        dispatch(setKeyword(searchInput));
        params?.set('q', keyword);
        if (keyword != "") {
            params?.delete('q');
            dispatch(setKeyword(""));
            setSearchInput("");
            dispatch(resetTrigger());
            router.replace(currentPath);
            nProgress.start();
            setTimeout(() => {
                nProgress.done();
            }, 300);
            return;
        }
        dispatch(triggerSearch());
    }

    function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setSearchInput(value);
    }

    return (
        <div className={style.container}>
            <form>
            <div className="relative">
                <span className="absolute -translate-y-1/2 left-4 top-1/2 pointer-events-none"><FiSearch/></span>
                <input
                type="text"
                value={searchInput}
                onChange={handleOnChange}
                placeholder="Search..."
                className={style.input}
                onKeyDown={handleKeyDown}
                />

                <button className={style.button} 
                onClick={handleClick}>
                {keyword == "" ?  <span>⌘ K</span> :<RiCloseLargeLine/> }
                </button>
            </div>
            </form>
        </div>
    )
}

export default AppHeaderSearch