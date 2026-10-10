import React from 'react';
import { AlertCircle, FileSpreadsheet, Check, X, ShieldAlert } from 'lucide-react';

interface GoogleWorkspaceConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  targetSheetName: string;
  spreadsheetId?: string;
  rowPreview?: { label: string; value: string }[];
  onConfirm: () => void;
  onCancel: () => void;
  isConfirming?: boolean;
}

export const GoogleWorkspaceConfirmModal: React.FC<GoogleWorkspaceConfirmModalProps> = ({
  isOpen,
  title,
  description,
  targetSheetName,
  spreadsheetId = '1-KKutYrmmc_SHTuaH5QYUUYdJXaSo4kJiibsskrBXzY',
  rowPreview = [],
  onConfirm,
  onCancel,
  isConfirming = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 text-left">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              HYNOVA OPS Google Spreadsheet: <span className="font-mono text-gray-700">{spreadsheetId.substring(0, 10)}...</span> (Worksheet: <span className="font-semibold text-emerald-700">{targetSheetName}</span>)
            </p>
          </div>
        </div>

        {/* Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-start gap-2 text-xs text-amber-800">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-600" />
          <div>
            <p className="font-semibold">Google Workspace Data Mutation Confirmation</p>
            <p className="mt-0.5 text-amber-700">{description}</p>
          </div>
        </div>

        {/* Preview of data being committed */}
        {rowPreview.length > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-5 max-h-48 overflow-y-auto">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">Record Preview to be Appended</p>
            <dl className="grid grid-cols-2 gap-2 text-xs">
              {rowPreview.map((item, idx) => (
                <div key={idx} className="border-b border-gray-100 pb-1">
                  <dt className="text-gray-500 text-[10px] uppercase font-semibold">{item.label}</dt>
                  <dd className="font-medium text-gray-900 truncate">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={isConfirming}
            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <X className="w-3.5 h-3.5" />
            Cancel Operation
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#C01E25] hover:bg-[#A0181E] rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            {isConfirming ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Writing to Spreadsheet...
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                Confirm & Write to Sheet
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
