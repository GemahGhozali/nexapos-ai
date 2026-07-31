"use client";

import React from "react";
import ImageFilePreview from "./image-file-preview";
import { Button } from "@/components/ui/button";
import { FieldDescription, FieldLabel } from "./ui/field";

interface ImageUploaderProps {
  value: File | string | null;
  onChange: (value: File | null) => void;
  onBlur: () => void;
  disabled?: boolean;
}

export function ImageUploader({ disabled, value, onChange, onBlur }: ImageUploaderProps) {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onBlur();
    onChange(file);
  };

  const handleRemove = () => {
    onChange(null);
    onBlur();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex items-center gap-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        onBlur={onBlur}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        disabled={disabled}
      />
      <ImageFilePreview url={value} />
      <div className="flex flex-col gap-3 justify-center">
        <FieldLabel>Profile Image (Optional)</FieldLabel>
        <FieldDescription>JPEG, JPG, PNG and WEBP, Max 1 MB</FieldDescription>

        <div className="flex items-center gap-2">
          {!value ? (
            <Button size="sm" type="button" disabled={disabled} onClick={() => fileInputRef.current?.click()}>
              Upload
            </Button>
          ) : (
            <>
              <Button size="sm" type="button" disabled={disabled} onClick={() => fileInputRef.current?.click()}>
                Change
              </Button>
              <Button size="sm" type="button" disabled={disabled} variant="outline" onClick={handleRemove}>
                Remove
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
