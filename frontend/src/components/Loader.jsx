export default function Loader({ label = 'Loading', className = '' }) {
  return (
    <div className={`flex items-center gap-3 text-sm font-medium text-muted ${className}`}>
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[rgba(78,34,15,0.16)] border-t-primary" />
      <span>{label}</span>
    </div>
  );
}