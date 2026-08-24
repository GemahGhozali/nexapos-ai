"use server";

import { groq } from "@/libs/groq";

export async function transcribeAudio(formData: FormData) {
  try {
    const file = formData.get("file") as File;

    if (!file) {
      return { success: false, message: "Gagal memproses perintah suara!" };
    }

    const transcription = await groq.audio.transcriptions.create({
      file: file,
      model: "whisper-large-v3-turbo",
      language: "id",
      response_format: "json",
    });

    return { success: true, message: "Berhasil memproses perintah suara!", data: transcription.text };
  } catch (error) {
    console.log("❌ Transcribe Audio Error :", error);
    return { success: false, message: "Gagal memproses perintah suara!" };
  }
}
