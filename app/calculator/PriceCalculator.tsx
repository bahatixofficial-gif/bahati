"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

const services = [{ name: "Lordboost", price: 12 }] as const;

export default function PriceCalculator() {
  const searchParams = useSearchParams();
  const heroParam = searchParams.get("hero");

  const [service, setService] = useState<(typeof services)[number]["name"]>(
    services[0].name,
  );
  const [currentLevel, setCurrentLevel] = useState<number | "">(1);
  const [desiredLevel, setDesiredLevel] = useState<number | "">(55);

  const safeCur = Math.max(1, Math.min(55, Number(currentLevel) || 1));
  const safeDes = Math.max(safeCur, Math.min(55, Number(desiredLevel) || 55));

  const total = useMemo(() => {
    let base = 0;

    for (let level = safeCur; level <= safeDes; level++) {
      if (level <= 20) {
        base += 2; // 1 to 20 = $40
      } else if (level <= 50) {
        base += 4; // 21 to 50 = +$120 ($160 total)
      } else {
        base += 8; // 51 to 55 = +$40 ($200 total)
      }
    }

    return Math.round(base);
  }, [safeCur, safeDes]);

  const handleLevelChange = (
    value: string,
    setter: (val: number | "") => void,
  ) => {
    if (value === "") {
      setter("");
      return;
    }
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      setter(num);
    }
  };

  const validateCurrent = () => {
    let val = typeof currentLevel === "number" ? currentLevel : 1;
    val = Math.max(1, Math.min(55, val));
    const targetDes = typeof desiredLevel === "number" ? desiredLevel : 55;
    if (val > targetDes) val = targetDes;
    setCurrentLevel(val);
  };

  const validateDesired = () => {
    let val = typeof desiredLevel === "number" ? desiredLevel : 55;
    val = Math.max(1, Math.min(55, val));
    const targetCur = typeof currentLevel === "number" ? currentLevel : 1;
    if (val < targetCur) val = targetCur;
    setDesiredLevel(val);
  };

  const estimate = encodeURIComponent(
    `${service} — ${safeCur} to ${safeDes}`,
  );

  const orderHref = heroParam
    ? `/order?service=${estimate}&price=${total}&hero=${encodeURIComponent(heroParam)}`
    : `/order?service=${estimate}&price=${total}`;

  const comicBodyFont = {
    fontFamily: "var(--font-comic-body), sans-serif",
  };

  const comicDisplayFont = {
    fontFamily: "var(--font-comic-display), sans-serif",
  };

  // Soft, low-glare tactical stepper buttons
  const softStepBtn =
    "w-11 h-11 !p-0 flex items-center justify-center !bg-[#18181b] !text-white/85 font-semibold text-xl leading-none border border-white/15 hover:!bg-white/15 hover:!text-white hover:border-white/40 active:scale-95 transition-all duration-150 cursor-pointer select-none [clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)]";

  const softInputBox =
    "w-20 h-11 text-2xl font-normal tracking-wider text-white bg-[#09090b] border border-white/20 focus:border-white/60 focus:bg-black text-center outline-none transition-colors [clip-path:polygon(6px_0,100%_0,100%_calc(100%-6px),calc(100%-6px)_100%,0_100%,0_6px)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  // Progress bar percentage calculations (levels 1 to 55)
  const startPercent = ((safeCur - 1) / 54) * 100;
  const widthPercent = Math.max(2, ((safeDes - safeCur) / 54) * 100);

  return (
    <div style={comicBodyFont} className="calculator-layout items-start">
      <div className="calculator-panel bg-[#0e0e11] flex flex-col justify-between gap-7 border border-white/12 hover:border-white/25 transition-colors">
        {/* Service Selector */}
        <label className="flex flex-col gap-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/55">
            Service
          </span>
          <select
            value={service}
            onChange={(event) =>
              setService(
                event.target.value as (typeof services)[number]["name"],
              )
            }
            className="h-12 bg-[#141418] border border-white/15 focus:border-white/45 px-4 uppercase tracking-wider font-bold text-base text-white outline-none transition-colors [clip-path:polygon(8px_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%,0_8px)]"
          >
            {services.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </label>

        {/* Level Steppers + Visual Range Track */}
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Current Level */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold text-white/55 uppercase tracking-[0.2em]">
                Current Level
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Decrease current level"
                  className={softStepBtn}
                  onClick={() => {
                    const cur =
                      typeof currentLevel === "number" ? currentLevel : 1;
                    setCurrentLevel(Math.max(1, cur - 1));
                  }}
                >
                  −
                </button>

                <input
                  type="number"
                  value={currentLevel}
                  onChange={(e) =>
                    handleLevelChange(e.target.value, setCurrentLevel)
                  }
                  onBlur={validateCurrent}
                  style={comicDisplayFont}
                  className={softInputBox}
                />

                <button
                  type="button"
                  aria-label="Increase current level"
                  className={softStepBtn}
                  onClick={() => {
                    const cur =
                      typeof currentLevel === "number" ? currentLevel : 1;
                    const des =
                      typeof desiredLevel === "number" ? desiredLevel : 55;
                    setCurrentLevel(Math.min(des, cur + 1));
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Desired Level */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold text-white/55 uppercase tracking-[0.2em]">
                Desired Level
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Decrease desired level"
                  className={softStepBtn}
                  onClick={() => {
                    const des =
                      typeof desiredLevel === "number" ? desiredLevel : 55;
                    const cur =
                      typeof currentLevel === "number" ? currentLevel : 1;
                    setDesiredLevel(Math.max(cur, des - 1));
                  }}
                >
                  −
                </button>

                <input
                  type="number"
                  value={desiredLevel}
                  onChange={(e) =>
                    handleLevelChange(e.target.value, setDesiredLevel)
                  }
                  onBlur={validateDesired}
                  style={comicDisplayFont}
                  className={softInputBox}
                />

                <button
                  type="button"
                  aria-label="Increase desired level"
                  className={softStepBtn}
                  onClick={() => {
                    const des =
                      typeof desiredLevel === "number" ? desiredLevel : 55;
                    setDesiredLevel(Math.min(55, des + 1));
                  }}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Subtle Visual Boost Span Track */}
          <div className="flex flex-col gap-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">
              <span>LVL {safeCur}</span>
              <span className="text-white/70">
                +{safeDes - safeCur} {safeDes - safeCur === 1 ? "Level" : "Levels"}
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
        </div>

        {/* Soft, Low-Glare Note Callout */}
        <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 px-4 py-3 [clip-path:polygon(8px_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%,0_8px)]">
          <span className="bg-white/10 text-white/80 border border-white/15 text-[10px] font-bold uppercase tracking-[0.18em] px-2 py-0.5 shrink-0 [clip-path:polygon(4px_0,100%_0,100%_calc(100%-4px),calc(100%-4px)_100%,0_100%,0_4px)]">
            NOTE
          </span>
          <p className="text-xs font-medium tracking-wide text-white/65">
            These are not the final prices and may vary or be negotiated depending on the hero tier.
          </p>
        </div>
      </div>

      {/* Compact Summary Card: Only Estimated Total + Yellow Button */}
      <aside
        className="price-summary !bg-[#0e0e11] !border !border-white/12 !border-t-2 !border-t-[#facc15] !p-5 !gap-5 self-start overflow-hidden"
        aria-live="polite"
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/55">
          Estimated total
        </p>
        <p
          style={comicDisplayFont}
          className="text-4xl font-bold text-white"
        >
          ${total}
        </p>
        <Link
          href={orderHref}
          className="flex h-12 items-center justify-center bg-[#facc15] text-black font-bold uppercase tracking-[0.16em] hover:bg-[#fde047] transition-colors [clip-path:polygon(8px_0,100%_0,100%_calc(100%-8px),calc(100%-8px)_100%,0_100%,0_8px)]"
        >
          Continue
        </Link>
      </aside>
    </div>
  );
}