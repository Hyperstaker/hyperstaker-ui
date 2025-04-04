import React from "react";

interface StepperProps {
  activeStep: number;
  children: React.ReactNode;
}

export function Stepper({ activeStep, children }: StepperProps) {
  const steps = React.Children.toArray(children);

  return (
    <div className="flex items-center justify-between w-full mb-8">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`flex items-center ${
            index === activeStep ? "text-blue-500" : ""
          }`}
        >
          {step}
        </div>
      ))}
    </div>
  );
}
