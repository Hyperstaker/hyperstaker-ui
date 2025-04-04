interface StepLabelProps {
  children: React.ReactNode;
}

export function StepLabel({ children }: StepLabelProps) {
  return (
    <div className="flex items-center">
      {/* <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mr-2"></div> */}
      <span className="text-sm font-medium">{children}</span>
    </div>
  );
}
