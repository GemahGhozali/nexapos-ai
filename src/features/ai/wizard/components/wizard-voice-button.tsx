import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { WizardInput } from "../schemas";
import { HugeiconsIcon } from "@hugeicons/react";
import { transcribeAudio } from "../../actions";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";
import { Mic02Icon, SquareIcon } from "@hugeicons/core-free-icons";

interface WizardVoiceButtonProps {
  disabled: boolean;
  mutate: (data: WizardInput) => void;
}

export function WizardVoiceButton({ disabled, mutate }: WizardVoiceButtonProps) {
  const { isRecording, startRecording, stopRecording } = useAudioRecorder();

  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);

  const handleMicClick = async () => {
    if (!isRecording) {
      try {
        await startRecording();
      } catch (error) {
        if (error instanceof Error) {
          toast.add({ type: "error", description: error.message });
        }
      }

      return;
    }

    const audioBlob = await stopRecording();

    if (!audioBlob) return;

    setIsTranscribing(true);

    const formData = new FormData();
    formData.append("file", audioBlob, "voice-command.webm");

    const response = await transcribeAudio(formData);

    if (!response.success || !response.data) {
      return toast.add({ type: "error", description: response.message });
    }

    mutate({ prompt: response.data });

    setIsTranscribing(false);
  };

  const isBusy = disabled || isTranscribing;

  return (
    <Button
      type="button"
      size="icon-lg"
      variant={isRecording ? "destructive" : "secondary"}
      onClick={handleMicClick}
      disabled={isBusy}
      className={isRecording ? "animate-pulse" : ""}
    >
      {isTranscribing ? (
        <Spinner />
      ) : isRecording ? (
        <HugeiconsIcon icon={SquareIcon} size={16} color="currentColor" strokeWidth={1.5} />
      ) : (
        <HugeiconsIcon icon={Mic02Icon} size={16} color="currentColor" strokeWidth={1.5} />
      )}
    </Button>
  );
}
