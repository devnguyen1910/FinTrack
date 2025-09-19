
import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`bg-white dark:bg-dark-secondary rounded-xl shadow-md p-6 ${className}`}>
      {title && <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{title}</h3>}
      {children}
    </div>
  );
};
