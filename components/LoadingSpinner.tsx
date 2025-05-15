interface LoadingSpinnerProps {
  className?: string;
}

export default function LoadingSpinner({ className = 'h-12 w-12' }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center">
      <div className={`animate-spin rounded-full border-b-2 border-current ${className}`}></div>
    </div>
  );
}
