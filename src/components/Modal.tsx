import type { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  title: string;
  onClose: () => void;
}

const Modal = ({ title, onClose, children }: Props) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-950/90 p-6 shadow-2xl shadow-cyan-500/10">
        <button
          className="absolute right-4 top-4 rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-cyan-400 hover:text-white"
          onClick={onClose}
          type="button"
        >
          Close
        </button>
        <h3 className="mb-4 text-xl font-bold text-white">{title}</h3>
        <div className="max-h-[65vh] overflow-y-auto pr-1">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
