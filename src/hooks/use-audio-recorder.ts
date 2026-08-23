import { useState, useRef, useCallback } from "react";

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("Browser tidak mendukung fitur perekaman suara! Coba gunakan browser lain.");
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4";

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      if (error instanceof DOMException) {
        if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
          throw new Error("Harap beri izin mikrofon di pengaturan browser Anda!");
        }
        if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
          throw new Error("Mikrofon tidak ditemukan! Pastikan perangkat mikrofon sudah terhubung.");
        }
        if (error.name === "NotReadableError" || error.name === "TrackStartError") {
          throw new Error("Mikrofon sedang digunakan oleh aplikasi lain! Tutup aplikasi tersebut dan coba lagi.");
        }
      }

      throw new Error("Gagal memulai perekaman audio! Terjadi kesalahan pada aplikasi.");
    }
  }, []);

  const stopRecording = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current;

      if (!mediaRecorder || mediaRecorder.state === "inactive") {
        resolve(null);
        return;
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || "audio/webm",
        });

        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          mediaStreamRef.current = null;
        }

        mediaRecorderRef.current = null;
        audioChunksRef.current = [];
        setIsRecording(false);

        resolve(audioBlob);
      };

      mediaRecorder.stop();
    });
  }, []);

  return { isRecording, startRecording, stopRecording };
}
