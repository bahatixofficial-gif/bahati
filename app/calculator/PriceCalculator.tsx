"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const services = [
  { name: "Hero Proficiency", price: 12 },
  { name: "Rank Progression", price: 18 },
  { name: "Coaching", price: 20 },
  { name: "Custom Package", price: 25 },
] as const;

export default function PriceCalculator() {
  const [service, setService] = useState<(typeof services)[number]["name"]>(
    services[0].name,
  );
  const [currentLevel, setCurrentLevel] = useState<number | "">(1);
  const [desiredLevel, setDesiredLevel] = useState<number | "">(55);
  const [rush, setRush] = useState(false);

  const total = useMemo(() => {
    let base = 0;
    const cur = Number(currentLevel) || 1;
    const des = Number(desiredLevel) || 1;

    for (let level = cur; level <= des; level++) {
      if (level <= 20) {
        base += 2;
      } else if (level <= 35) {
        base += 4;
      } else {
        base += 7.5;
      }
    }

    return rush ? Math.round(base * 1.25) : Math.round(base);
  }, [currentLevel, desiredLevel, rush]);

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
    `${service} — ${currentLevel || 1} ${(currentLevel || 1) === 1 ? "level" : "levels"}${rush ? " — Priority" : ""}`,
  );

  return (
    <div className="calculator-layout">
      <div className="calculator-panel">
        <label>
          Service
          <select
            value={service}
            onChange={(event) =>
              setService(
                event.target.value as (typeof services)[number]["name"],
              )
            }
          >
            {services.map((item) => (
              <option key={item.name}>{item.name}</option>
            ))}
          </select>
        </label>

        <div className="flex flex-col gap-6 my-4">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.2em] opacity-70">
              Current Level
            </span>
            <div className="flex items-center gap-3 w-fit">
              <button
                type="button"
                className="w-12 h-12 flex items-center justify-center text-2xl font-bold text-[#D4AF37] bg-black/40 backdrop-blur-md border border-[#D4AF37]/30 rounded-xl hover:bg-[#D4AF37]/20 hover:border-[#D4AF37] transition-all duration-200 active:scale-95"
                onClick={() => {
                  const cur = typeof currentLevel === "number" ? currentLevel : 1;
                  setCurrentLevel(Math.max(1, cur - 1));
                }}
              >
                -
              </button>

              <input
                type="number"
                value={currentLevel}
                onChange={(e) => handleLevelChange(e.target.value, setCurrentLevel)}
                onBlur={validateCurrent}
                className="w-24 h-14 text-4xl font-bold text-[#D4AF37] bg-black/60 backdrop-blur-xl border border-[#D4AF37]/40 rounded-xl text-center outline-none focus:border-[#D4AF37] focus:ring-0 transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.15)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />

              <button
                type="button"
                className="w-12 h-12 flex items-center justify-center text-2xl font-bold text-[#D4AF37] bg-black/40 backdrop-blur-md border border-[#D4AF37]/30 rounded-xl hover:bg-[#D4AF37]/20 hover:border-[#D4AF37] transition-all duration-200 active:scale-95"
                onClick={() => {
                  const cur = typeof currentLevel === "number" ? currentLevel : 1;
                  const des = typeof desiredLevel === "number" ? desiredLevel : 55;
                  setCurrentLevel(Math.min(des, cur + 1));
                }}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.2em] opacity-70">
              Desired Level
            </span>
            <div className="flex items-center gap-3 w-fit">
              <button
                type="button"
                className="w-12 h-12 flex items-center justify-center text-2xl font-bold text-[#D4AF37] bg-black/40 backdrop-blur-md border border-[#D4AF37]/30 rounded-xl hover:bg-[#D4AF37]/20 hover:border-[#D4AF37] transition-all duration-200 active:scale-95"
                onClick={() => {
                  const des = typeof desiredLevel === "number" ? desiredLevel : 55;
                  const cur = typeof currentLevel === "number" ? currentLevel : 1;
                  setDesiredLevel(Math.max(cur, des - 1));
                }}
              >
                -
              </button>

              <input
                type="number"
                value={desiredLevel}
                onChange={(e) => handleLevelChange(e.target.value, setDesiredLevel)}
                onBlur={validateDesired}
                className="w-24 h-14 text-4xl font-bold text-[#D4AF37] bg-black/60 backdrop-blur-xl border border-[#D4AF37]/40 rounded-xl text-center outline-none focus:border-[#D4AF37] focus:ring-0 transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.15)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />

              <button
                type="button"
                className="w-12 h-12 flex items-center justify-center text-2xl font-bold text-[#D4AF37] bg-black/40 backdrop-blur-md border border-[#D4AF37]/30 rounded-xl hover:bg-[#D4AF37]/20 hover:border-[#D4AF37] transition-all duration-200 active:scale-95"
                onClick={() => {
                  const des = typeof desiredLevel === "number" ? desiredLevel : 55;
                  setDesiredLevel(Math.min(55, des + 1));
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>

        <label className="rush-option">
          <input
            type="checkbox"
            checked={rush}
            onChange={(event) => setRush(event.target.checked)}
          />
          <span>
            Priority completion
            <small>25% priority fee</small>
          </span>
        </label>
      </div>

      <aside className="price-summary" aria-live="polite">
        <span className="contact-label">Estimated total</span>
        <strong className="price-total">${total}</strong>
        <dl>
          <div>
            <dt>Service</dt>
            <dd>{service}</dd>
          </div>
          <div>
            <dt>Current Level</dt>
            <dd>{currentLevel || 1}</dd>

            <dt>Desired Level</dt>
            <dd>{desiredLevel || 1}</dd>
          </div>
          <div>
            <dt>Priority</dt>
            <dd>{rush ? "Yes" : "No"}</dd>
          </div>
        </dl>
        <Link
          className="primary-button calculator-order"
          href={`/order?service=${estimate}`}
        >
          Continue to order
          <span aria-hidden="true">↗</span>
        </Link>
      </aside>
    </div>
  );
}

