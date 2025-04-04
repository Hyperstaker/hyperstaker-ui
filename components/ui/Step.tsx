interface StepProps {
  children: React.ReactNode;
}

export function Step({ children }: StepProps) {
  return <div className="flex items-center">{children}</div>;
}
