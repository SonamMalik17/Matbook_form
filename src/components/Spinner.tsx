const Spinner = () => (
  <div className="flex items-center justify-center gap-2 text-slate-300">
    <span className="h-3 w-3 animate-ping rounded-full bg-cyan-400" />
    <span className="h-3 w-3 animate-ping rounded-full bg-cyan-300 delay-150" />
    <span className="h-3 w-3 animate-ping rounded-full bg-cyan-200 delay-300" />
    <p className="text-sm">Loading...</p>
  </div>
);

export default Spinner;
