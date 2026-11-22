"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { heroes, type Hero } from "../data/heroes";

export default function OrderForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialService = searchParams.get("service") || "";
  const initialPrice = searchParams.get("price") || "";
  const initialHeroParam = searchParams.get("hero")?.toUpperCase() || "";

  const sortedHeroes = useMemo(
    () => [...heroes].sort((a, b) => a.name.localeCompare(b.name)),
    [],
  );

  const [service, setService] = useState(initialService);
  const [hero, setHero] = useState(
    sortedHeroes.some((h) => h.name === initialHeroParam)
      ? initialHeroParam
      : "",
  );
  const [heroDropdownOpen, setHeroDropdownOpen] = useState(false);
  const [heroSearch, setHeroSearch] = useState("");
  const [heroError, setHeroError] = useState(false);
  const [packageError, setPackageError] = useState(false);
  const [price, setPrice] = useState(initialPrice);
  const [discord, setDiscord] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const hasPackageSelected = Boolean(
    service.trim() && price.trim() && Number(price) > 0,
  );

  useEffect(() => {
    const paramService = searchParams.get("service");
    const paramPrice = searchParams.get("price");
    const paramHero = searchParams.get("hero")?.toUpperCase();

    if (paramService !== null) setService(paramService);
    if (paramPrice !== null) setPrice(paramPrice);
    if (paramHero && sortedHeroes.some((h) => h.name === paramHero)) {
      setHero(paramHero);
    }
    if (paramService && paramPrice && Number(paramPrice) > 0) {
      setPackageError(false);
    }
  }, [searchParams, sortedHeroes]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setHeroDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedHeroData = useMemo(
    () => sortedHeroes.find((h) => h.name === hero),
    [hero, sortedHeroes],
  );

  const filteredHeroes = useMemo(() => {
    const query = heroSearch.trim().toLowerCase();
    if (!query) return sortedHeroes;
    return sortedHeroes.filter(
      (h) =>
        h.name.toLowerCase().includes(query) ||
        h.role.toLowerCase().includes(query),
    );
  }, [heroSearch, sortedHeroes]);

  const handleSelectHero = (selected: Hero) => {
    setHero(selected.name);
    setHeroError(false);
    setHeroDropdownOpen(false);
    setHeroSearch("");
  };

  const handleResetPackage = () => {
    setService("");
    setPrice("0");
    setPackageError(false);
    router.replace(hero ? `/order?hero=${encodeURIComponent(hero)}` : "/order", {
      scroll: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let blocked = false;

    if (!hasPackageSelected) {
      setPackageError(true);
      blocked = true;
    }

    if (!hero) {
      setHeroError(true);
      if (!blocked) setHeroDropdownOpen(true);
      blocked = true;
    }

    if (blocked) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "order",
          data: {
            service,
            hero,
            price: price.startsWith("$") ? price : `$${price}`,
            discord,
            email: email.trim() || "Not provided",
            notes: notes.trim() || "-",
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit order.");
      }

      setSubmitted(true);
    } catch {
      setSubmitError("Could not send your order right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const comicBodyFont = {
    fontFamily: "var(--font-comic-body), 'Comic Sans MS', cursive, sans-serif",
  };

  const comicDisplayFont = {
    fontFamily: "var(--font-comic-display), sans-serif",
  };

  const inputClass =
    "w-full bg-[#09090b] border-2 border-white/30 focus:border-white focus:bg-black px-4 py-3 text-white font-bold text-base tracking-wide outline-none transition-all [clip-path:polygon(10px_0,100%_0,100%_calc(100%-10px),calc(100%-10px)_100%,0_100%,0_10px)] placeholder:text-white/35 placeholder:font-normal";

  const labelClass =
    "!flex !flex-row items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-white/80";

  const halftoneStyle = {
    backgroundImage:
      "radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
    backgroundSize: "10px 10px",
  };

  const comicHalftoneButtonStyle = {
    backgroundColor: "#ffffff",
    backgroundImage:
      "radial-gradient(rgba(0, 0, 0, 0.14) 1.5px, transparent 1.5px), linear-gradient(135deg, #ffffff 0%, #e4e4e7 100%)",
    backgroundSize: "8px 8px, 100% 100%",
    color: "#000000",
  };

  const calculatorHref = hero
    ? `/calculator?hero=${encodeURIComponent(hero)}`
    : "/calculator";

  if (submitted) {
    return (
      <div
        style={{ ...halftoneStyle, ...comicBodyFont }}
        className="order-form bg-[#0c0c0e] border-2 border-white shadow-[8px_8px_0px_#22c55e] p-8 flex flex-col gap-6 max-w-2xl [clip-path:polygon(14px_0,100%_0,100%_calc(100%-14px),calc(100%-14px)_100%,0_100%,0_14px)]"
      >
        <div className="flex items-center gap-3">
          <span
            style={comicDisplayFont}
            className="bg-[#22c55e] text-black text-sm tracking-[0.16em] px-3 py-1 [clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)]"
          >
            MISSION LOCKED IN!
          </span>
        </div>

        <div className="flex items-center gap-4">
          {selectedHeroData && (
            <img
              src={selectedHeroData.image}
              alt={selectedHeroData.name}
              className="w-20 h-20 object-cover object-top bg-black border-2 border-white [clip-path:polygon(8px_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%,0_8px)]"
            />
          )}
          <div>
            <h2
              style={comicDisplayFont}
              className="text-3xl sm:text-4xl font-normal tracking-wider text-white"
            >
              Order Request Sent!
            </h2>
            {selectedHeroData && (
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#22c55e]">
                {selectedHeroData.name} • {selectedHeroData.role}
              </span>
            )}
          </div>
        </div>

        <p className="text-base text-white/85 leading-relaxed">
          Keep an eye on your Discord DMs (
          <strong className="text-white">{discord}</strong>) to confirm your{" "}
          <strong className="text-white">{hero}</strong> boost (
          <strong className="text-[#22c55e]">${price}</strong>) and get started.
        </p>

        <button
          type="button"
          onClick={() => setSubmitted(false)}
          style={{ color: "#000000" }}
          className="w-fit px-5 py-2.5 !bg-white !text-black border-2 !border-black text-sm font-bold uppercase tracking-[0.14em] hover:!bg-[#18181b] hover:!text-white hover:!border-white transition-colors cursor-pointer [clip-path:polygon(8px_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%,0_8px)]"
        >
          Submit another order
        </button>
      </div>
    );
  }

  return (
    <div
      style={comicBodyFont}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
    >
      {/* LEFT COLUMN: Comic Order Form */}
      <form
        onSubmit={handleSubmit}
        className="order-form lg:col-span-7 bg-[#0c0c0e] border-2 border-white/25 hover:border-white/50 shadow-[8px_8px_0px_rgba(255,255,255,0.12)] transition-all p-6 sm:p-8 flex flex-col gap-6 [clip-path:polygon(14px_0,100%_0,100%_calc(100%-14px),calc(100%-14px)_100%,0_100%,0_14px)]"
      >
        <div className="flex items-center justify-between border-b-2 border-white/15 pb-4">
          <div className="flex items-center gap-3">
            <span
              style={comicDisplayFont}
              className="bg-white text-black text-sm tracking-[0.16em] px-3 py-0.5 [clip-path:polygon(5px_0,100%_0,100%_calc(100%-5px),calc(100%-5px)_100%,0_100%,0_5px)]"
            >
              start
            </span>
            <span
              style={comicDisplayFont}
              className="text-xl sm:text-2xl font-normal tracking-wider text-white"
            >
              DETAILS
            </span>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/60 border border-white/20 px-2.5 py-1 [clip-path:polygon(4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%,0_4px)]">
            Fast Discord Setup
          </span>
        </div>

        {/* Locked Service & Price Section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className={labelClass}>
              <span className="w-1.5 h-1.5 bg-white shrink-0" />
              <span>Service, Level Range &amp; Price</span>
            </span>

            {hasPackageSelected ? (
              <button
                type="button"
                onClick={handleResetPackage}                className="text-xs font-bold uppercase tracking-[0.12em] text-white/60 hover:text-white transition-colors"
              >
                Change
              </button>
            ) : null}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/calculator"
              className="flex items-center justify-between gap-3 bg-[#09090b] border-2 border-white/30 px-4 py-3 text-white hover:border-white transition-colors [clip-path:polygon(10px_0,100%_0,100%_calc(100%-10px),calc(100%-10px)_100%,0_100%,0_10px)]"
            >
              <span className="text-sm font-bold">
                {service || "Choose a boost package"}
              </span>
              <span className="text-[#22c55e] font-bold">
                {hasPackageSelected ? `$${price}` : ""}
              </span>
            </Link>
          </div>

          {packageError && (
            <p className="text-sm font-bold text-red-400">
              Click to choose the hero levels.
            </p>
          )}
        </div>

        {/* Hero Selection */}
        <div className="flex flex-col gap-3" ref={dropdownRef}>
          <span className={labelClass}>
            <span className="w-1.5 h-1.5 bg-white shrink-0" />
            <span>Hero</span>
          </span>

          <button
            type="button"
            onClick={() => setHeroDropdownOpen((open) => !open)}
            className={`${inputClass} flex items-center justify-between text-left`}
            aria-expanded={heroDropdownOpen}
          >
            <span>{selectedHeroData?.name || "Select a hero"}</span>
            <span className="text-white/50">▾</span>
          </button>

          {heroDropdownOpen && (
            <div className="relative z-20">
              <input
                type="search"
                value={heroSearch}
                onChange={(event) => setHeroSearch(event.target.value)}
                placeholder="Search heroes"
                className={inputClass}
              />
              <div className="absolute left-0 right-0 mt-2 max-h-64 overflow-y-auto bg-[#09090b] border-2 border-white/30">
                {filteredHeroes.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => handleSelectHero(item)}
                    className="w-full px-4 py-3 text-left text-white hover:bg-white hover:text-black transition-colors"
                  >
                    {item.name} <span className="text-xs opacity-60">• {item.role}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {heroError && (
            <p className="text-sm font-bold text-red-400">
              Please select a hero.
            </p>
          )}
        </div>

        {/* Contact Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex flex-col gap-2">
            <span className={labelClass}>
              <span className="w-1.5 h-1.5 bg-white shrink-0" />
              <span>Discord</span>
            </span>
            <input
              type="text"
              value={discord}
              onChange={(event) => setDiscord(event.target.value)}
              placeholder="username"
              className={inputClass}
              required
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className={labelClass}>
              <span className="w-1.5 h-1.5 bg-white shrink-0" />
              <span>Email (optional)</span>
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className={inputClass}
            />
          </label>
        </div>

        <label className="flex flex-col gap-2">
          <span className={labelClass}>
            <span className="w-1.5 h-1.5 bg-white shrink-0" />
            <span>Notes (optional)</span>
          </span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Add account or scheduling details"
            className={`${inputClass} min-h-28 resize-y`}
          />
        </label>

        {submitError && (
          <p className="text-sm font-bold text-red-400">{submitError}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          style={comicHalftoneButtonStyle}
          className="w-full px-5 py-3 border-2 border-black text-sm font-bold uppercase tracking-[0.14em] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer [clip-path:polygon(10px_0,100%_0,100%_calc(100%-10px),calc(100%-10px)_100%,0_100%,0_10px)]"
        >
          {submitting ? "Sending..." : "Submit order"}
        </button>
      </form>

      {/* RIGHT COLUMN: Order Summary */}
      <aside className="lg:col-span-5 lg:sticky lg:top-8 bg-[#0c0c0e] border-2 border-white/25 p-6 sm:p-8 [clip-path:polygon(14px_0,100%_0,100%_calc(100%-14px),calc(100%-14px)_100%,0_100%,0_14px)]">
        <div className="flex flex-col gap-5">
          <span
            style={comicDisplayFont}
            className="w-fit bg-white text-black text-sm tracking-[0.16em] px-3 py-1 [clip-path:polygon(5px_0,100%_0,100%_calc(100%-5px),calc(100%-5px)_100%,0_100%,0_5px)]"
          >
            ORDER SUMMARY
          </span>

          <div className="space-y-3 border-y-2 border-white/15 py-5">
            <div className="flex items-start justify-between gap-4">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/60">Hero</span>
              <strong className="text-right text-white">{hero || "Not selected"}</strong>
            </div>
            <div className="flex items-start justify-between gap-4">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/60">Package</span>
              <strong className="text-right text-white">{service || "Not selected"}</strong>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-white/60">Total</span>
            <strong className="text-3xl text-[#22c55e]">
              {hasPackageSelected ? `$${price}` : "—"}
            </strong>
          </div>
        </div>
      </aside>
    </div>
  );
}