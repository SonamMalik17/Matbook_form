interface Props {
  tone: 'success' | 'error' | 'info';
  message: string;
}

const toneClasses: Record<Props['tone'], string> = {
  success: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-100',
  error: 'border-rose-500/50 bg-rose-500/10 text-rose-100',
  info: 'border-cyan-400/50 bg-cyan-400/10 text-cyan-100'
};

const StatusBanner = ({ tone, message }: Props) => (
  <div className={`rounded-xl border px-4 py-3 text-sm font-semibold ${toneClasses[tone]}`}>
    {message}
  </div>
);

export default StatusBanner;
