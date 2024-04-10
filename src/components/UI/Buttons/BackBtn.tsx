import React from 'react';

interface SaveButtonProps {
    onClick?: () => void;
    children?: React.ReactNode;
}

const BackBtn: React.FC<SaveButtonProps> = ({ onClick, children }) => {
    return (
        <button type="button"
            className="flex items-center justify-center w-[98px] h-[38px] px-5 py-2 text-sm text-gray-700 transition-colors duration-200
            bg-white border rounded-lg gap-x-2 sm:w-auto  hover:bg-gray-100"
            onClick={onClick}
        >
            <svg className="w-5 h-5 rtl:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
            </svg>

            {children || 'Button'}
        </button>
    );
};

export default BackBtn;
