import { CheckCircle2 } from "lucide-react";

interface CheckoutProgressProps {
  currentStep: number;
  steps: Array<{
    id: number;
    label: string;
    description: string;
  }>;
}

const CheckoutProgress = ({ currentStep, steps }: CheckoutProgressProps) => {
  return (
    <section className="rounded-[24px] border border-primary/10 bg-card/95 p-4 shadow-[0_18px_40px_rgba(32,24,17,0.06)] sm:p-5">
      <div className="overflow-x-auto">
        <div className="flex min-w-max items-center gap-2 sm:gap-3">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isComplete = currentStep > step.id;

          return (
            <div key={step.id} className="flex items-center gap-2 sm:gap-3">
              <div
                className={`flex items-center gap-3 rounded-full border px-3 py-2 transition-colors sm:px-4 ${
                  isActive
                    ? "border-primary/30 bg-primary/5"
                    : isComplete
                      ? "border-primary/15 bg-secondary/10"
                      : "border-border bg-background"
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-body font-semibold ${
                    isComplete
                      ? "border-primary bg-primary text-primary-foreground"
                      : isActive
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground"
                  }`}
                >
                  {isComplete ? <CheckCircle2 className="h-4 w-4" /> : step.id}
                </div>

                <span
                  className={`whitespace-nowrap text-sm font-body font-semibold ${
                    isActive || isComplete ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`h-px w-8 shrink-0 sm:w-10 ${
                    isComplete ? "bg-primary/70" : "bg-border"
                  }`}
                />
              )}
            </div>
          );
        })}
        </div>
      </div>
    </section>
  );
};

export default CheckoutProgress;
