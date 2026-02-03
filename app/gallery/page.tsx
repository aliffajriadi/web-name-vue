"use client";

import { useQuery } from "@tanstack/react-query";
import { getGallery, GalleryItem } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import { Loader2, MapPin, Calendar, Camera, Maximize2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function GalleryPage() {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const { data: gallery, isLoading } = useQuery<GalleryItem[]>({
    queryKey: ["gallery"],
    queryFn: getGallery,
  });

  return (
    <div className="py-24 animate-in fade-in duration-700">
      <div className="container-custom">
        <header className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-6 group">
            <Camera
              size={16}
              className="text-primary group-hover:rotate-12 transition-transform"
            />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">
              Visual Archive
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-4 tracking-tighter uppercase leading-none">
            {t("Life Matrix", "Matriks Kehidupan")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
            {t(
              "A collection of moments, travels, and visual documentation from my journey through engineering and life.",
              "Koleksi momen, perjalanan, dan dokumentasi visual dari perjalanan saya melalui teknik dan kehidupan.",
            )}
          </p>
        </header>

        {isLoading ? (
          <div className="py-24 flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-primary" size={48} />
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Decoding Visual Data...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {gallery?.length === 0 && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-[3rem]">
                <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">
                  No visual records captured yet.
                </p>
              </div>
            )}
            {gallery?.map((item: GalleryItem) => (
              <div
                key={item.id}
                className="group relative aspect-square bg-muted rounded-4xl overflow-hidden border border-border cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 active:scale-95"
                onClick={() => setSelectedImage(item)}
              >
                <Image
                  src={item.imageUrl}
                  alt={
                    t(item.caption_en || "", item.caption_id || "") ||
                    "Gallery Image"
                  }
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                  <div className="flex items-center gap-2 text-white/90 text-[10px] font-black uppercase tracking-widest mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <Calendar size={12} className="text-primary" />{" "}
                    {new Date(item.date || new Date()).toLocaleDateString(
                      undefined,
                      {
                        month: "short",
                        year: "numeric",
                      },
                    )}
                  </div>
                  <p className="text-white text-xs font-bold line-clamp-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                    {t(item.caption_en || "", item.caption_id || "")}
                  </p>
                  {item.location && (
                    <div className="flex items-center gap-1.5 text-white/70 text-[10px] font-medium mt-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-150">
                      <MapPin size={10} className="text-primary" />{" "}
                      {item.location}
                    </div>
                  )}
                  <div className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 size={14} className="text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-background/95 backdrop-blur-3xl p-4 md:p-8 animate-in fade-in duration-300">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 md:top-10 md:right-10 p-4 bg-muted hover:bg-primary hover:text-white rounded-3xl transition-all z-20"
          >
            <Maximize2 size={24} className="rotate-45" />
          </button>

          <div className="w-full max-w-6xl max-h-[90vh] flex flex-col lg:flex-row bg-card border border-border rounded-[3.5rem] overflow-hidden shadow-3xl animate-in zoom-in-95 duration-500">
            <div className="relative aspect-square lg:aspect-auto lg:grow bg-black flex items-center justify-center">
              <Image
                src={selectedImage.imageUrl}
                alt="Gallery Detail"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="w-full lg:w-96 p-10 flex flex-col bg-card border-l border-border">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-xl font-black shadow-xl">
                  A
                </div>
                <div>
                  <h3 className="font-black text-foreground uppercase tracking-tight">
                    ALIF
                  </h3>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">
                    {t("Field Documentation", "Dokumentasi Lapangan")}
                  </p>
                </div>
              </div>

              <div className="grow space-y-6">
                <p className="text-lg text-foreground font-medium italic leading-relaxed">
                  &quot;
                  {t(
                    selectedImage.caption_en || "",
                    selectedImage.caption_id || "",
                  )}
                  &quot;
                </p>

                <div className="space-y-4 pt-6 border-t border-border">
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    <Calendar size={14} className="text-primary" />{" "}
                    {new Date(
                      selectedImage.date || new Date(),
                    ).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  {selectedImage.location && (
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                      <MapPin size={14} className="text-primary" />{" "}
                      {selectedImage.location}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-10">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="w-full py-4 bg-muted hover:bg-border text-foreground font-black uppercase tracking-widest rounded-2xl transition-all text-xs"
                >
                  Close View
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
