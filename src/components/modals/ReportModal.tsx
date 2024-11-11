import React from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import  BaseModal  from './BaseModal';
import { cn } from "@/lib/utils";

interface ReportModalProps {
  isDarkMode: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

const reportReasons = [
  "Spam",
  "Nudity or sexual activity",
  "Hate speech or symbols",
  "Violence or dangerous organizations",
  "Sale of illegal or regulated goods",
  "Bullying or harassment",
  "Intellectual property violation",
  "False information",
  "Suicide or self-injury",
  "Other"
];

const ReportModal: React.FC<ReportModalProps> = ({
  isDarkMode,
  onClose,
  onSubmit
}) => (
  <BaseModal onClose={onClose}>
    <div className={cn(
      "rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto",
      isDarkMode ? "bg-gray-800" : "bg-white"
    )}>
      <div className={cn(
        "p-4 flex justify-between items-center border-b",
        isDarkMode ? "border-gray-700" : "border-gray-200"
      )}>
        <h2 className={cn(
          "text-lg font-semibold",
          isDarkMode ? "text-white" : "text-gray-800"
        )}>
          Report
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className={cn(
            "p-1 hover:bg-transparent",
            isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"
          )}
        >
          <X size={20} />
        </Button>
      </div>
      <div className="py-2">
        {reportReasons.map((reason) => (
          <button
            key={reason}
            onClick={() => onSubmit(reason)}
            className={cn(
              "w-full text-left px-4 py-3 transition duration-200",
              isDarkMode 
                ? "text-white hover:bg-gray-700" 
                : "text-gray-800 hover:bg-gray-100"
            )}
          >
            {reason}
          </button>
        ))}
      </div>
    </div>
  </BaseModal>
);

export default ReportModal;