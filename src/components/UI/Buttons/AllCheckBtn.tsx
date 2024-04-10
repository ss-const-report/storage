import React from 'react';

interface AllCheckButtonProps {
    onClick?: () => void;
    children?: React.ReactNode;
}

const AllCheckBtn: React.FC<AllCheckButtonProps> = ({ onClick, children }) => {
    return (
        <button type="button"
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300
                font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
            onClick={onClick}
        >
            {children || 'Button'}
        </button>
    );
};

export default AllCheckBtn;
