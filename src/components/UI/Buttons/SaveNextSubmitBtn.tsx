import React from 'react';

interface SaveButtonProps {
    onClick?: () => void;
    children?: React.ReactNode;
}

const SaveButton: React.FC<SaveButtonProps> = ({ onClick, children }) => {
    return (
        <button
            type="button"
            className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4
                        focus:outline-none focus:ring-green-300  shadow-lg shadow-green-500/50
                         font-medium rounded-lg text-sm px-5 py-2 text-center"
            onClick={onClick}
        >
            {children || 'Button'}
        </button>
    );
};

export default SaveButton;
