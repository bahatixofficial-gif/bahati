"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { heroes, type Hero } from "../data/heroes";

const services = [{ name: "Lordboost", price: 12 }] as const;

export default function OrderForm() {
  const searchParams = useSearchParams();
  const initialHeroParam = searchParams.get("hero")?.toUpperCase() ?? "";
  const initialServiceParam = searchParams.get("service") ?? "";

  return (
    <OrderFormContent
      key={searchParams.toString()}
      initialHeroParam={initialHeroParam}
      initialServiceParam={initialServiceParam}
    />
  );
}

function OrderFormContent({
  initialHeroParam,
  initialServiceParam,
}: {
  initialHeroParam: string;
  initialServiceParam: string;
}) {
  const initialService =
    services.find((item) => item.name === initialServiceParam)?.name ??
    services[0].name;

  const sortedHeroes = useMemo(
    () => [...heroes].sort((a, b) => a.name.localeCompare(b.name)),
    [],
  );

  const [service, setService] =
    useState<(typeof services)[number]["name"]>(initialService);
  const [currentLevel, setCurrentLevel] = useState<number | "">(1);
  const [desiredLevel, setDesiredLevel] = useState<number | "">(55);
  const [hero, setHero] = useState(
    sortedHeroes.some((h) => h.name === initialHeroParam)
      ? initialHeroParam
      : "",
  );
  const [heroDropdownOpen, setHeroDropdownOpen] = useState(false);
  const [heroSearch, setHeroSearch] = useState("");
  const [heroError, setHeroError] = useState(false);
  const [discord, setDiscord] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const safeCur = Math.max(1, Math.min(55, Number(currentLevel) || 1));
  const safeDes = Math.max(safeCur, Math.min(55, Number(desiredLevel) || 55));

  const total = useMemo(() => {
    let base = 0;
    for (let level = safeCur; level <= safeDes; level++) {
      if (level <= 20) {
        base += 2;
      } else if (level <= 50) {
        base += 4;
      } else {
        base += 8;
      }
    }

    return Math.round(base);
  }, [safeCur, safeDes]);

  const formattedService = `${service} — ${safeCur} to ${safeDes}`;

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

  const handleLevelChange = (
    value: string,
    setter: (value: number | "") => void,
  ) => {
    if (value === "") {
      setter("");
      return;
    }

    const numberValue = Number.parseInt(value, 10);
    if (!Number.isNaN(numberValue)) setter(numberValue);
  };

  const validateCurrent = () => {
    let value = typeof currentLevel === "number" ? currentLevel : 1;
    value = Math.max(1, Math.min(55, value));
    const targetDesired = Math.max(
      1,
      Math.min(55, typeof desiredLevel === "number" ? desiredLevel : 55),
    );
    if (value > targetDesired) value = targetDesired;
    setCurrentLevel(value);
  };

  const validateDesired = () => {
    let value = typeof desiredLevel === "number" ? desiredLevel : 55;
    value = Math.max(1, Math.min(55, value));
    const targetCurrent = Math.max(
      1,
      Math.min(55, typeof currentLevel === "number" ? currentLevel : 1),
    );
    if (value < targetCurrent) value = targetCurrent;
    setDesiredLevel(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!hero) {
      setHeroError(true);
      setHeroDropdownOpen(true);
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "order",
          data: {
            service: formattedService,
            hero,
            price: `$${total}`,
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

  const startPercent = ((safeCur - 1) / 54) * 100;
  const widthPercent = Math.max(2, ((safeDes - safeCur) / 54) * 100);
  const softStepBtn =
    "w-11 h-11 !p-0 flex items-center justify-center !bg-[#18181b] !text-white/85 font-semibold text-xl leading-none border border-white/15 hover:!bg-white/15 hover:!text-white hover:border-white/40 active:scale-95 transition-all duration-150 cursor-pointer select-none [clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)]";
  const softInputBox =
    "w-20 h-11 text-2xl font-normal tracking-wider text-white bg-[#09090b] border border-white/20 focus:border-white/60 focus:bg-black text-center outline-none transition-colors [clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

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
          <strong className="text-[#22c55e]">${total}</strong>) and get started.
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

        {/* Service and live pricing controls */}
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-2">
            <span className={labelClass}>
              <span className="w-1.5 h-1.5 bg-white shrink-0" />
              <span>Service</span>
            </span>
            <select
              value={service}
              onChange={(event) =>
                setService(
                  event.target.value as (typeof services)[number]["name"],
                )
              }
              className="h-12 bg-[#141418] border-2 border-white/30 focus:border-white/60 px-4 uppercase tracking-wider font-bold text-base text-white outline-none transition-colors"
            >
              {services.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <span className={labelClass}>Current Level</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Decrease current level"
                  className={softStepBtn}
                  onClick={() => setCurrentLevel(Math.max(1, safeCur - 1))}
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  max={55}
                  value={currentLevel}
                  onChange={(event) =>
                    handleLevelChange(event.target.value, setCurrentLevel)
                  }
                  onBlur={validateCurrent}
                  style={comicDisplayFont}
                  className={softInputBox}
                />
                <button
                  type="button"
                  aria-label="Increase current level"
                  className={softStepBtn}
                  onClick={() => setCurrentLevel(Math.min(safeDes, safeCur + 1))}
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className={labelClass}>Desired Level</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Decrease desired level"
                  className={softStepBtn}
                  onClick={() =>
                    setDesiredLevel(Math.max(safeCur, safeDes - 1))
                  }
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  max={55}
                  value={desiredLevel}
                  onChange={(event) =>
                    handleLevelChange(event.target.value, setDesiredLevel)
                  }
                  onBlur={validateDesired}
                  style={comicDisplayFont}
                  className={softInputBox}
                />
                <button
                  type="button"
                  aria-label="Increase desired level"
                  className={softStepBtn}
                  onClick={() => setDesiredLevel(Math.min(55, safeDes + 1))}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">
              <span>LVL {safeCur}</span>
              <span className="flex items-center gap-2 text-white/70">
                <span>
                  +{safeDes - safeCur}{" "}
                  {safeDes - safeCur === 1 ? "Level" : "Levels"}
                </span>
                <span
                  aria-live="polite"
                  className="whitespace-nowrap text-[#facc15]"
                >
                  Est. ${total}
                </span>
              </span>
              <span>LVL {safeDes}</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 overflow-hidden [clip-path:polygon(3px_0,100%_0,100%_calc(100%-3px),calc(100%-3px)_100%,0_100%,0_3px)]">
              <div
                style={{
                  marginLeft: `${startPercent}%`,
                  width: `${widthPercent}%`,
                }}
                className="h-full bg-[#facc15] transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 px-4 py-3">
            <span className="bg-white/10 text-white/80 border border-white/15 text-[10px] font-bold uppercase tracking-[0.18em] px-2 py-0.5 shrink-0">
              NOTE
            </span>
            <p className="text-xs font-medium tracking-wide text-white/65">
              These are not the final prices and may vary or be negotiated
              depending on the hero tier.
            </p>
          </div>
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

          <div className="space-y-4 border-y-2 border-white/15 py-5">
            {selectedHeroData ? (
              <div className="flex items-center gap-4">
                <img
                  src={selectedHeroData.image}
                  alt={selectedHeroData.name}
                  className="h-20 w-20 object-cover object-top border-2 border-white/30 bg-black"
                />
                <div>
                  <strong className="block text-white">
                    {selectedHeroData.name}
                  </strong>
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/60">
                    {selectedHeroData.role}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-white/60">
                Select a hero to preview your order.
              </p>
            )}
            <div className="flex items-start justify-between gap-4">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/60">
                Package
              </span>
              <strong className="text-right text-white">
                {formattedService}
              </strong>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-white/60">Total</span>
            <strong aria-live="polite" className="text-3xl text-[#22c55e]">
              ${total}
            </strong>
          </div>
        </div>
      </aside>
    </div>
  );
}