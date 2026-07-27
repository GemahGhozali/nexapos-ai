import { SupabaseClient } from "@supabase/supabase-js";

interface UploadFileParams {
  supabase: SupabaseClient;
  bucket: string;
  filePath: string;
  file: File;
  upsert?: boolean;
}

interface DeleteFilesParams {
  supabase: SupabaseClient;
  bucket: string;
  filePaths: string[];
}

export async function uploadFileToStorage({ supabase, bucket, filePath, file, upsert = true }: UploadFileParams) {
  const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, { upsert });

  if (error) {
    console.log("❌ Storage Upload Error");
    return null;
  }

  return data.path;
}

export async function deleteFilesFromStorage({ supabase, bucket, filePaths }: DeleteFilesParams) {
  const { error } = await supabase.storage.from(bucket).remove(filePaths);

  if (error) {
    console.error("❌ Storage Delete Error :", error);
    return false;
  }

  return true;
}
