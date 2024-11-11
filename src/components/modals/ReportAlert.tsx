import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Check } from "lucide-react";
import { cn } from '@/lib/utils';

interface ReportAlertProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  isDarkMode: boolean;
}

const ReportAlert: React.FC<ReportAlertProps> = ({ isOpen, onClose, message, isDarkMode }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "sm:max-w-[425px] p-6",
        isDarkMode 
          ? "bg-gray-800 text-white border border-gray-700" 
          : "bg-white border border-gray-200",
      )}>
        <div className="flex flex-col items-center text-center">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center mb-4",
            isDarkMode ? "bg-gray-700" : "bg-gray-100"
          )}>
            <AlertCircle className={cn(
              "w-6 h-6",
              isDarkMode ? "text-gray-300" : "text-gray-600"
            )} />
          </div>
          
          <DialogHeader className="space-y-3">
            <DialogTitle className={cn(
              "text-xl font-semibold",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              Already Reported
            </DialogTitle>
            <DialogDescription className={cn(
              "text-base leading-relaxed",
              isDarkMode ? "text-gray-300" : "text-gray-600"
            )}>
              {message}
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center mt-6 gap-3 w-full">
            <Button 
              onClick={onClose}
              className={cn(
                "w-full py-2 px-4 rounded-lg transition-all duration-200",
                isDarkMode 
                  ? "bg-gray-700 hover:bg-gray-600 text-white" 
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
              )}
            >
              <Check className="w-4 h-4 mr-2" />
              Got it
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportAlert;