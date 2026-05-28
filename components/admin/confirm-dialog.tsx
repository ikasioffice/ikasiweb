"use client";
import type { ReactNode } from "react";

type Props = {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  loading?: boolean;
  confirmDisabled?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children?: ReactNode;
};

export function ConfirmDialog({
  open, title, message, confirmLabel = "Konfirmasi",
  loading = false, confirmDisabled = false, onConfirm, onCancel, children,
}: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onCancel}>
      <div className="glass-card rounded-2xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-white mb-2">{title}</h2>
        {message && <p className="text-sm text-slate-300 mb-4">{message}</p>}
        {children && <div className="mb-4">{children}</div>}
        <div className="flex justify-end gap-3 mt-2">
          <button onClick={onCancel} disabled={loading}
            className="px-4 py-2 rounded-lg text-sm text-slate-300 hover:text-white disabled:opacity-50">
            Batal
          </button>
          <button onClick={onConfirm} disabled={loading || confirmDisabled}
            className="px-4 py-2 rounded-lg text-sm bg-red-600/80 hover:bg-red-600 text-white disabled:opacity-50">
            {loading ? "Memproses…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
