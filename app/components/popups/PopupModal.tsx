import type { ReactNode } from "react";

type PopupModalProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export default function PopupModal({ title, onClose, children }: PopupModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="relative max-h-[90dvh] w-full max-w-5xl overflow-auto bg-white"
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
      >
        <button
          type="button"
          className="absolute right-3 top-3 z-10 border bg-white px-3 py-1 text-xl"
          aria-label={`Fechar ${title}`}
          onClick={onClose}
        >
          ×
        </button>
        <div id="popup-title">{children}</div>
      </div>
    </div>
  );
}