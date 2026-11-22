"use client";

import { useRef, useState } from "react";
import type { Vouch } from "../lib/vouches";

export default function VouchesBoard({
  initialVouches,
  isAdmin,
}: {
  initialVouches: Vouch[];
  isAdmin: boolean;
}) {
  const [vouches, setVouches] = useState<Vouch[]>(initialVouches);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [lightboxImage, setLightboxImage] = useState<Vouch | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayFont = {
    fontFamily: "var(--font-comic-display), sans-serif",
  };

  const bodyFont = {
    fontFamily: "var(--font-comic-body), sans-serif",
  };

  const handleFileChange = (selected: File | null) => {
    setFile(selected);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(selected ? URL.createObjectURL(selected) : null);
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !file) {
      setError("Please add both a title and a screenshot.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("image", file);

      const res = await fetch("/api/vouches", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Upload failed");
      }

      setVouches((prev) => [result.vouch, ...prev]);
      setTitle("");
      setDescription("");
      handleFileChange(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not upload vouch.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/vouches?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setVouches((prev) => prev.filter((v) => v.id !== id));
    }
  };

  const inputClass =
    "w-full bg-[#09090b] border border-white/25 focus:border-white px-4 py-2.5 text-white font-semibold text-sm tracking-wide outline-none transition-colors [clip-path:polygon(8px_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%,0_8px)] placeholder:text-white/35 placeholder:font-normal";

  return (
    <div style={bodyFont} className="flex flex-col gap-10">
      {/* ADMIN-ONLY UPLOAD PANEL */}
      {isAdmin && (
        <form
          onSubmit={handleUpload}
          className="bg-[#0e0e11] border border-white/20 border-t-2 border-t-[#facc15] p-6 sm:p-7 flex flex-col gap-5 max-w-3xl [clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]"
        >
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5">
              <span
                style={displayFont}
                className="bg-[#facc15] text-black text-xs font-bold uppercase tracking-[0.16em] px-2.5 py-0.5 [clip-path:polygon(4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%,0_4px)]"
              >
                ADMIN ONLY
              </span>
              <h2
                style={displayFont}
                className="text-xl font-bold uppercase tracking-wider text-white"
              >
                Post Completed Order Proof
              </h2>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-white/45">
              {vouches.length} {vouches.length === 1 ? "Vouch" : "Vouches"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/65">
                  Order Title
                </span>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Magik — Level 1 to 55 (Lord)"
                  className={inputClass}
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/65">
                  Description
                </span>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Completion time, customer feedback, or match highlights..."
                  className={`${inputClass} resize-none`}
                />
              </label>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/65">
                Proof Screenshot
              </span>
              <label className="flex-1 min-h-[150px] bg-[#09090b] border border-dashed border-white/30 hover:border-white/70 p-3 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors overflow-hidden [clip-path:polygon(8px_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%,0_8px)]">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-40 w-full object-contain"
                  />
                ) : (
                  <>
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-white/70">
                      Click to choose screenshot
                    </span>
                    <span className="text-[11px] text-white/40">
                      PNG, JPG, WEBP, or GIF
                    </span>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={(e) =>
                    handleFileChange(e.target.files?.item(0) ?? null)
                  }
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {error && (
            <p className="text-xs font-bold uppercase tracking-wider text-red-400">
              {error}
            </p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={uploading}
              style={{ ...displayFont, color: "#000000" }}
              className="px-6 py-2.5 !bg-[#22c55e] !text-black hover:!bg-[#4ade80] disabled:opacity-50 font-bold uppercase tracking-[0.16em] text-base transition-colors cursor-pointer [clip-path:polygon(8px_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%,0_8px)]"
            >
              {uploading ? "Uploading..." : "Publish Vouch ↗"}
            </button>
          </div>
        </form>
      )}

      {/* PUBLIC VOUCHES GALLERY */}
      {vouches.length === 0 ? (
        <div className="bg-[#0e0e11] border border-white/12 p-10 text-center flex flex-col items-center gap-2 [clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-white/55">
            No vouches posted yet
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vouches.map((vouch) => (
            <article
              key={vouch.id}
              className="group bg-[#0e0e11] border border-white/15 hover:border-white/40 transition-all flex flex-col overflow-hidden [clip-path:polygon(12px_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%,0_12px)]"
            >
              <button
                type="button"
                onClick={() => setLightboxImage(vouch)}
                className="relative aspect-video w-full bg-black overflow-hidden cursor-zoom-in border-b border-white/10"
              >
                <img
                  src={vouch.imageUrl}
                  alt={vouch.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute top-2.5 left-2.5 bg-black/80 text-[#22c55e] border border-[#22c55e]/40 text-[10px] font-bold uppercase tracking-[0.16em] px-2 py-0.5 [clip-path:polygon(4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%,0_4px)]">
                  VERIFIED ORDER
                </span>
              </button>

              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                  <h3
                    style={displayFont}
                    className="text-xl font-bold uppercase tracking-wide text-white"
                  >
                    {vouch.title}
                  </h3>
                  {vouch.description && (
                    <p className="text-sm text-white/70 leading-relaxed">
                      {vouch.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[11px] text-white/45">
                  <span className="font-bold uppercase tracking-[0.14em]">
                    Completed order
                  </span>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleDelete(vouch.id)}
                      className="font-bold uppercase tracking-[0.14em] text-red-400 hover:text-red-300 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {lightboxImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightboxImage.title}
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/90 p-4 sm:p-8 flex items-center justify-center cursor-zoom-out"
        >
          <button
            type="button"
            onClick={() => setLightboxImage(null)}
            aria-label="Close image preview"
            className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl"
          >
            ×
          </button>
          <img
            src={lightboxImage.imageUrl}
            alt={lightboxImage.title}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
}
