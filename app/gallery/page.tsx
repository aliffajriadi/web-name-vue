"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getGallery,
  GalleryItem,
  getProfile,
  Profile,
  toggleGalleryLike,
} from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Grid,
  Clapperboard,
  UserSquare2,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function GalleryPage() {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"posts" | "reels" | "tagged">(
    "posts",
  );

  const { data: gallery, isLoading: isGalleryLoading } = useQuery<GalleryItem[]>(
    {
      queryKey: ["gallery"],
      queryFn: getGallery,
    },
  );

  const { data: profile } = useQuery<Profile>({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const { mutate: toggleLike } = useMutation({
    mutationFn: toggleGalleryLike,
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["gallery"] });

      // Snapshot the previous value
      const previousGallery = queryClient.getQueryData<GalleryItem[]>([
        "gallery",
      ]);

      // Optimistically update to the new value
      if (previousGallery) {
        queryClient.setQueryData<GalleryItem[]>(
          ["gallery"],
          previousGallery.map((item) => {
            if (item.id === id) {
              const wasLiked = item.isLiked;
              return {
                ...item,
                isLiked: !wasLiked,
                likesCount: (item.likesCount || 0) + (wasLiked ? -1 : 1),
              };
            }
            return item;
          }),
        );
      }

      return { previousGallery };
    },
    onError: (err, newTodo, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousGallery) {
        queryClient.setQueryData(["gallery"], context.previousGallery);
      }
    },
    onSettled: () => {
      // Always refetch after error or success:
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
  });

  const postCount = gallery?.length || 0;

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 pt-5 animate-in fade-in duration-700">
      <div className="container-custom max-w-4xl mx-auto pt-8 md:pt-12">
        {/* Profile Header */}
        <header className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 mb-12 px-4">
          <div className="relative group shrink-0">
            <div className="w-24 h-24 md:w-40 md:h-40 rounded-full p-[2px] bg-linear-to-tr from-yellow-400 via-red-500 to-purple-600">
              <div className="w-full h-full rounded-full border-4 border-background overflow-hidden relative bg-muted">
                <Image
                  src={profile?.imageUrl || "/profile.png"}
                  alt="Profile"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center md:items-start space-y-4 md:space-y-5">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <h1 className="text-xl md:text-2xl font-semibold">
                {profile?.name || "User"}
              </h1>
              <div className="flex gap-2">
                <button className="px-4 py-1.5 bg-muted hover:bg-muted/80 font-semibold text-sm rounded-lg transition-colors">
                  {t("Follow", "Ikuti")}
                </button>
                <button className="px-4 py-1.5 bg-muted hover:bg-muted/80 font-semibold text-sm rounded-lg transition-colors">
                  {t("Message", "Pesan")}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-8 md:gap-12 text-sm md:text-base">
              <div className="flex flex-col md:flex-row items-center md:gap-1">
                <span className="font-bold text-foreground">{postCount}</span>
                <span className="text-muted-foreground">
                  {t("posts", "postingan")}
                </span>
              </div>
              <div className="flex flex-col md:flex-row items-center md:gap-1">
                <span className="font-bold text-foreground">1.2M</span>
                <span className="text-muted-foreground">
                  {t("followers", "pengikut")}
                </span>
              </div>
              <div className="flex flex-col md:flex-row items-center md:gap-1">
                <span className="font-bold text-foreground">487</span>
                <span className="text-muted-foreground">
                  {t("following", "mengikuti")}
                </span>
              </div>
            </div>

            <div className="space-y-1 text-center md:text-left text-sm">
              <p className="font-bold text-base">
                {t(profile?.role_en || "", profile?.role_id || "")}
              </p>
              <p className="text-muted-foreground whitespace-pre-line">
                {t(
                  profile?.bio_en || "Welcome to my gallery",
                  profile?.bio_id || "Selamat datang di galeri saya",
                )}
              </p>
              <a
                href="#"
                className="text-[#00376b] dark:text-[#e0f1ff] font-semibold hover:underline"
              >
                aliffajriadi.my.id
              </a>
            </div>
          </div>
        </header>

        {/* Highlights (Mock) */}
        <div className="flex gap-4 md:gap-8 overflow-x-auto pb-8 mb-4 px-4 scrollbar-hide">
          {[
            { id: 1, label: "Code", color: "bg-blue-100" },
            { id: 2, label: "Travel", color: "bg-green-100" },
            { id: 3, label: "Life", color: "bg-yellow-100" },
            { id: 4, label: "Setup", color: "bg-purple-100" },
          ].map((highlight) => (
            <div
              key={highlight.id}
              className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group"
            >
              <div className="w-16 h-16 rounded-full p-[2px] border border-border bg-background group-hover:scale-105 transition-transform duration-300">
                <div
                  className={cn(
                    "w-full h-full rounded-full flex items-center justify-center border-2 border-background",
                    highlight.color,
                  )}
                >
                  <span className="text-xs font-bold opacity-50 dark:text-black">
                    ✦
                  </span>
                </div>
              </div>
              <span className="text-xs font-medium">{highlight.label}</span>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="border-t border-border mb-8">
          <div className="flex justify-center gap-12">
            <button
              onClick={() => setActiveTab("posts")}
              className={cn(
                "flex items-center gap-2 py-4 border-t-2 transition-all uppercase text-xs font-bold tracking-widest",
                activeTab === "posts"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <Grid size={12} />
              <span className="hidden md:inline">Posts</span>
            </button>
            <button
              onClick={() => setActiveTab("reels")}
              className={cn(
                "flex items-center gap-2 py-4 border-t-2 transition-all uppercase text-xs font-bold tracking-widest",
                activeTab === "reels"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <Clapperboard size={12} />
              <span className="hidden md:inline">Reels</span>
            </button>
            <button
              onClick={() => setActiveTab("tagged")}
              className={cn(
                "flex items-center gap-2 py-4 border-t-2 transition-all uppercase text-xs font-bold tracking-widest",
                activeTab === "tagged"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <UserSquare2 size={12} />
              <span className="hidden md:inline">Tagged</span>
            </button>
          </div>
        </div>

        {/* Content Feed */}
        {isGalleryLoading ? (
          <div className="py-24 flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : (
          <div className="max-w-[470px] mx-auto space-y-6 md:space-y-10">
            {gallery?.length === 0 && (
              <div className="text-center py-20">
                <div className="w-16 h-16 border-2 border-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                  <Grid size={32} />
                </div>
                <h3 className="font-bold text-lg mb-2">
                  {t("No Posts Yet", "Belum Ada Postingan")}
                </h3>
              </div>
            )}

            {gallery?.map((item: GalleryItem) => (
              <article
                key={item.id}
                className="bg-card border-b md:border border-border md:rounded-lg overflow-hidden pb-4"
              >
                {/* Post Header */}
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 relative rounded-full overflow-hidden border border-border">
                      <Image
                        src={profile?.imageUrl || "/profile.png"}
                        fill
                        className="object-cover"
                        alt="Avatar"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-semibold hover:opacity-70 cursor-pointer">
                          {profile?.name || "User"}
                        </p>
                        <span className="text-[10px] text-muted-foreground">
                          •
                        </span>
                        <span className="text-xs text-blue-500 font-semibold cursor-pointer hover:text-blue-600 transition-colors">
                          Follow
                        </span>
                      </div>
                      {item.location && (
                        <p className="text-xs text-muted-foreground">
                          {item.location}
                        </p>
                      )}
                    </div>
                  </div>
                  <button className="text-foreground hover:opacity-60 transition-opacity">
                    <MoreHorizontal size={20} />
                  </button>
                </div>

                {/* Post Image */}
                <div className="relative aspect-square bg-muted border-y border-border md:border-none">
                  <Image
                    src={item.imageUrl}
                    alt="Post content"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Actions */}
                <div className="px-3 pt-3 pb-2">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4 text-foreground">
                      <button
                        onClick={() => item.id && toggleLike(item.id)}
                        className="hover:opacity-60 transition-opacity transform active:scale-90 duration-200"
                      >
                        <Heart
                          size={24}
                          className={cn(
                            item.isLiked ? "fill-red-500 text-red-500" : "",
                          )}
                        />
                      </button>
                      <button className="hover:opacity-60 transition-opacity transform active:scale-90 duration-200">
                        <MessageCircle size={24} className="-rotate-90" />
                      </button>
                      <button className="hover:opacity-60 transition-opacity transform active:scale-90 duration-200">
                        <Send size={24} className="rotate-12" />
                      </button>
                    </div>
                    <button className="hover:opacity-60 transition-opacity transform active:scale-90 duration-200">
                      <Bookmark size={24} />
                    </button>
                  </div>

                  {/* Likes */}
                  <div className="text-sm font-semibold mb-2">
                    {item.likesCount || 0} {t("likes", "suka")}
                  </div>

                  {/* Caption */}
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="font-semibold mr-2">
                        {profile?.name || "User"}
                      </span>
                      <span className="text-foreground/90">
                        {t(item.caption_en || "", item.caption_id || "")}
                      </span>
                    </div>
                    {/* View all comments - Mock */}
                    <button className="text-muted-foreground text-sm mt-1">
                      {t("View all comments", "Lihat semua komentar")}
                    </button>
                  </div>

                  {/* Date */}
                  <div className="mt-3 text-[10px] uppercase text-muted-foreground tracking-wide">
                    {new Date(item.date || new Date()).toLocaleDateString(
                      "en-US",
                      { month: "long", day: "numeric" },
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
