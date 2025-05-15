interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({ className = 'h-12 w-12', size = 'md' }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center">
      <div className={`animate-spin rounded-full border-b-2 border-current ${className}`}></div>
    </div>
  );
}
