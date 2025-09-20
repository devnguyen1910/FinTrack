import React, { ReactNode } from 'react';
import { Modal } from './Modal';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: ReactNode;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        <div className="text-gray-600 dark:text-gray-300">{children}</div>
        <div className="flex justify-end space-x-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 font-semibold"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="bg-danger text-white px-4 py-2 rounded-md hover:bg-red-600 font-semibold"
          >
            Xác nhận Xóa
          </button>
        </div>
      </div>
    </Modal>
  );
};
