import React from 'react';

interface LoadingProps {
    text?: string;
}

export const Loading: React.FC<LoadingProps> = ({ text }) => {
    return (
        <div className="flex flex-col justify-center items-center p-8 space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            {text && <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">{text}</p>}
        </div>
    );
};