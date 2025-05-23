export default function SkeletonLoader({ lines = 3 }) {
  return (
    <div className="skeleton"
    aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton-line" />
      ))}
    </div>
  );
}
