export default function Skeleton({ className = '', rounded = 'rounded-xl' }) {
  return <div className={`animate-pulse bg-[rgba(176,186,153,0.26)] ${rounded} ${className}`} />;
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton key={index} className={index === lines - 1 ? 'w-4/5' : 'w-full'} rounded="rounded-lg" />
      ))}
    </div>
  );
}