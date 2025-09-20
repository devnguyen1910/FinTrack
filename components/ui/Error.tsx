import React from 'react';

interface ErrorProps {
    message: string;
    onRetry?: () => void;
}

export const Error: React.FC<ErrorProps> = ({ message, onRetry }) => {
    return (
        <div className="bg-danger/10 border-l-4 border-danger text-danger p-4 rounded-md" role="alert">
            <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                    <p className="font-bold">Đã xảy ra lỗi</p>
                    <p>{message}</p>
                </div>
            </div>
            {onRetry && (
                <div className="mt-3 text-right">
                    <button
                        onClick={onRetry}
                        className="bg-danger text-white font-semibold py-1 px-3 rounded-md hover:bg-red-700 transition-colors"
                    >
                        Thử lại
                    </button>
                </div>
            )}
        </div>
    );
};