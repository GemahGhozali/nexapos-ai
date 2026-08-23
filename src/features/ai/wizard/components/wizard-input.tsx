import { Field } from "@/components/ui/field";
import { useTypewriter } from "@/hooks/use-typewriter";
import { WizardInput as WizardInputType } from "../schemas";
import { Controller, UseFormReturn, useWatch } from "react-hook-form";

interface WizardInputComponentProps {
  form: UseFormReturn<WizardInputType>;
  disabled: boolean;
  placeholders: string[];
}

export function WizardInput({ form, disabled, placeholders }: WizardInputComponentProps) {
  const prompt = useWatch({ control: form.control, name: "prompt" });

  const animatedPlaceholder = useTypewriter({
    words: placeholders,
    typingSpeed: 40,
    deletingSpeed: 25,
    pauseDuration: 1500,
    enabled: prompt.trim() === "",
  });

  return (
    <Controller
      name="prompt"
      control={form.control}
      render={({ field }) => (
        <Field>
          <input
            {...field}
            id="prompt"
            type="text"
            placeholder={animatedPlaceholder}
            autoComplete="off"
            className="focus:outline-none"
            disabled={disabled}
          />
        </Field>
      )}
    />
  );
}
