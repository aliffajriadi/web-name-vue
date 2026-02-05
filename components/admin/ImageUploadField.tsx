"use client";

import React, { useRef, useState } from "react";
import { ImageKitProvider, IKUpload } from "imagekitio-next";
import { API_BASE_URL } from "@/lib/api";
import { Upload, X, Loader2, CheckCircle2 } from "lucide-react";
import Image from "next/image";

const publicKey = "public_eCQf3j533fEHqgIkNhMjXChRUf4=";
const urlEndpoint = "https://ik.imagekit.io/8zzj11dsp";

const authenticator = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/imagekit/auth`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`,
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    throw new Error(
      `Authentication request failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  name: string;
}

interface IKUploadResponse {
  url: string;
  fileId: string;
  // add other fields if necessary
}

export default function ImageUploadField({
  value,
  onChange,
  label,
  name,
}: ImageUploadFieldProps) {
  const ikUploadRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const onError = (err: { message: string }) => {
    console.error("Error", err);
    setUploading(false);
    alert("Upload failed: " + err.message);
  };

  const onSuccess = (res: IKUploadResponse) => {
    console.log("Success", res);
    setUploading(false);
    onChange(res.url);
  };

  const onUploadStart = () => {
    setUploading(true);
  };

  return (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex justify-between">
          <span>{label}</span>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-red-500 hover:text-red-600 flex items-center gap-1"
            >
              <X size={10} /> Clear
            </button>
          )}
        </label>

        <div className="relative group">
          <input
            name={name}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Image URL or Upload -->"
            className="admin-input-premium pr-12"
          />

          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {uploading ? (
              <Loader2 size={18} className="text-primary animate-spin" />
            ) : value ? (
              <CheckCircle2 size={18} className="text-green-500" />
            ) : (
              <button
                type="button"
                onClick={() => ikUploadRef.current?.click()}
                className="p-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-all"
                title="Upload to ImageKit"
              >
                <Upload size={16} />
              </button>
            )}
          </div>

          <IKUpload
            ref={ikUploadRef}
            className="hidden"
            onError={onError}
            onSuccess={onSuccess}
            onUploadStart={onUploadStart}
          />
        </div>

        {value && (
          <div className="mt-2 relative aspect-video w-full rounded-xl overflow-hidden border border-border bg-muted">
            <Image
              src={`${value}?tr=w-400,h-225,fo-auto`}
              alt="Preview"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <span className="text-white text-[10px] font-bold uppercase tracking-widest">
                Live Preview
              </span>
            </div>
          </div>
        )}
      </div>
    </ImageKitProvider>
  );
}
