import Link from 'next/link';
import React, { useContext, useState } from 'react';
import PdfContext from '@/contexts/PdfContext';


const NavBar = () => {
    const { pdfName } = useContext(PdfContext);


    return (
        <nav className="bg-gray-800">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        {/* <div className="flex flex-shrink-0 items-center">
                            <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500" alt="Smart Solar" />
                        </div> */}
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                <Link className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                                    href="/home">ホーム</Link>
                                <Link className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                                    href={'/register/regbasicinfo'}
                                >①基本情報</Link>
                                <Link className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                                    href="/register/regenergystorage/1"
                                >②蓄電池・PCS情報</Link>
                                <Link className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                                    href="/register/regenergystorage/2"
                                >③切替盤・スマートAI</Link>
                                <Link className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                                    href="/register/regdccheck"
                                >④回路・単線結線図</Link>
                                <Link className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                                    href="/register/regsetparameter"
                                >⑤設定・パラメータ</Link>
                                <Link className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                                    href="/register/regtestresult"
                                >⑥竣工チェックリスト</Link>
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        {/* <button type="button" className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                <span className="absolute -inset-1.5"></span>
                                <span className="sr-only">View notifications</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                </svg>
                            </button> */}
                        <Link className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                            href={`/samplepdf/${pdfName}`} target="_blank"
                        >記入例はこちら</Link>
                        {/* 
                            <div className="relative ml-3">
                                <div>
                                    <button type="button" className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                                        <span className="absolute -inset-1.5"></span>
                                        <span className="sr-only">Open user menu</span>
                                        <img className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                                    </button>
                                </div>
                                <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" >
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem"  id="user-menu-item-0">Your Profile</a>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" id="user-menu-item-1">Settings</a>
                                    <a href="#" className="block px-4 py-2 text-sm text-gray-700" role="menuitem" id="user-menu-item-2">Sign out</a>
                                </div>
                            </div> */}
                    </div>
                </div>
            </div>

            <div className="sm:hidden" id="mobile-menu">
                <div className="space-y-1 px-2 pb-3 pt-2">
                    <Link className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-base block font-medium"
                        href="/home"
                    >ホーム</Link>
                    <Link className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-base block font-medium"
                        href={'/register/regbasicinfo'}
                    >①基本情報</Link>
                    <Link className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-base block font-medium"
                        href="/register/regenergystorage/1"
                    >②蓄電池・PCS情報</Link>
                    <Link className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-base block font-medium"
                        href="/register/regenergystorage/2"
                    >③切替盤・スマートAI</Link>
                    <Link className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-base block font-medium"
                        href="/register/regdccheck"
                    >④回路・単線結線図</Link>
                    <Link className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-base block font-medium"
                        href="/register/regsetparameter"
                    >⑤設定・パラメータ</Link>
                    <Link className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-base block font-medium"
                        href="/register/regtestresult"
                    >⑥竣工チェックリスト</Link>

                </div>
            </div>
        </nav>

    );
};

export default NavBar;
