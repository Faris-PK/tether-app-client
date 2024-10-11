import React, { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  anchorElement: HTMLElement | null;
  onLogout: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, anchorElement, onLogout }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose(); // Close modal if clicked outside
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose(); // Close modal if escape key is pressed
      }
    };

    // Only add event listeners when modal is open
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscapeKey);
    }

    // Cleanup event listeners on unmount or modal close
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !anchorElement) return null;

  const rect = anchorElement.getBoundingClientRect();
  const modalStyle = {
    position: 'absolute' as 'absolute',
    top: rect.bottom + window.scrollY,
    left: rect.left,
    width: `${rect.width}px`,
  };

  return (
    <div ref={modalRef} style={modalStyle} className="bg-[#010F18] rounded-lg border border-[#908888] p-4 z-10">
      <h2 className="text-xl font-bold text-white text-center mb-4">Settings</h2>
      <ul className="space-y-2">
        <li>
          <button className="w-full text-left text-white hover:bg-[#3a4c56] rounded-md p-2">Premium</button>
        </li>
        <li>
          <button onClick={onLogout} className="w-full text-left text-white hover:bg-[#3a4c56] rounded-md p-2">Logout</button>
        </li>
        <li>
          <button className="w-full text-left text-white hover:bg-[#3a4c56] rounded-md p-2">Change Password</button>
        </li>
        <li>
          <button className="w-full text-left text-white hover:bg-[#3a4c56] rounded-md p-2">Blocked Users</button>
        </li>
        <li>
          <button className="w-full text-left text-white hover:bg-[#3a4c56] rounded-md p-2">Edit Profile</button>
        </li>
      </ul>
    </div>
  );
};

export default Modal;
