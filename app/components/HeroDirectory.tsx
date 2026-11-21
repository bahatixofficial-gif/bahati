"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { heroes } from "../data/heroes";

const roleClassNames = {
  VANGUARD: "role-vanguard",
  DUELIST: "role-duelist",
  STRATEGIST: "role-strategist",
} as const;

const heroTiers: Record<string, "S" | "A" | "B" | "C" | "D" | "E" | "F"> = {
  "SPIDER-MAN": "S",
  "BLACK WIDOW": "S",
  "IRON FIST": "S",
  "DEADPOOL": "S",
  "WINTER SOLDIER": "A",
  "SCARLET WITCH": "A",
  "PSYLOCKE": "A",
  "BLACK PANTHER": "A",
  "DAREDEVIL": "A",
  "BLACK CAT": "A",
  "INVISIBLE WOMAN": "A",
  "LOKI": "A",
  "JEFF THE LAND SHARK": "A",
  "MOON KNIGHT": "B",
  "MAGIK": "B",
  "WOLVERINE": "B",
  "STORM": "B",
  "STAR-LORD": "B",
  "HUMAN TORCH": "B",
  "IRON MAN": "B",
  "HULK": "B",
  "ANGELA": "B",
  "GAMBIT": "B",
  "NAMOR": "C",
  "GORR THE GOD BUTCHER": "C",
  "PENI PARKER": "C",
  "CAPTAIN AMERICA": "C",
  "ROGUE": "C",
  "THOR": "C",
  "ROCKET RACCOON": "C",
  "CLOAK & DAGGER": "C",
  "BLADE": "D",
  "HAWKEYE": "D",
  "THE PUNISHER": "D",
  "SQUIRREL GIRL": "D",
  "MISTER FANTASTIC": "D",
  "DOCTOR STRANGE": "D",
  "MAGNETO": "D",
  "THE HOOD": "D",
  "JUBILEE": "D",
  "HELA": "E",
  "PHOENIX": "E",
  "ELSA BLOODSTONE": "E",
  "CYCLOPS": "E",
  "EMMA FROST": "E",
  "THE THING": "E",
  "VENOM": "E",
  "GROOT": "E",
  "DEVIL DINOSAUR": "E",
  "LUNA SNOW": "E",
  "NIGHTCRAWLER": "E",
  "MANTIS": "F",
  "ADAM WARLOCK": "F",
  "ULTRON": "F",
  "WHITE FOX": "F",
};

const bladeProficiency = [
  { tier: "Agent", points: 20, minutes: 15, damage: 5000, finalHits: 5 },
  { tier: "Knight", points: 20, minutes: 15, damage: 10000, finalHits: 10 },
  { tier: "Captain", points: 20, minutes: 15, damage: 15000, finalHits: 15 },
  { tier: "Centurion", points: 26, minutes: 15, damage: 20000, finalHits: 20 },
  { tier: "Lord", points: 80, minutes: 60, damage: 30000, finalHits: 30 },
] as const;

const adamWarlockProficiency = [
  {
    tier: "Agent",
    lines: [
      "20 Hero usage time reaches 15 minutes",
      "7 Reach 5400 Healing",
      "7 Achieve a total of 13 KOs and Assists",
    ],
  },
  {
    tier: "Knight",
    lines: [
      "20 Hero usage time reaches 15 minutes",
      "13 Reach 11,000 Healing",
      "13 Achieve a total of 26 KOs and Assists",
    ],
  },
  {
    tier: "Captain",
    lines: [
      "20 Hero usage time reaches 15 minutes",
      "20 Reach 16,000 Healing",
      "20 Achieve a total of 38 KOs and Assists",
    ],
  },
  {
    tier: "Centurion",
    lines: [
      "20 Hero usage time reaches 15 minutes",
      "26 Reach 21,000 Healing",
      "26 Achieve a total of 51 KOs and Assists",
    ],
  },
  {
    tier: "Lord",
    lines: [
      "60 Hero usage time reaches 15 minutes",
      "80 Reach 21,000 Healing",
      "80 Achieve a total of 51 KOs and Assists",
    ],
  },
] as const;

const gorrProficiency = [
  {
    tier: "Agent",
    lines: ["20 Hero usage time reaches 15 minutes", "7 Deal 4,400 Damage", "7 Land 6 Final Hits"],
  },
  {
    tier: "Knight",
    lines: ["20 Hero usage time reaches 15 minutes", "13 Deal 8,800 Damage", "13 Land 13 Final Hits"],
  },
  {
    tier: "Captain",
    lines: ["20 Hero usage time reaches 15 minutes", "20 Deal 13,200 Damage", "20 Land 17 Final Hits"],
  },
  {
    tier: "Centurion",
    lines: ["20 Hero usage time reaches 15 minutes", "26 Deal 18,000 Damage", "26 Land 23 Final Hits"],
  },
  {
    tier: "Lord",
    lines: ["80 Hero usage time reaches 15 minutes", "80 Deal 18,000 Damage", "80 Land 23 Final Hits"],
  },
] as const;

const theHoodProficiency = [
  {
    tier: "Agent",
    lines: [
      "20 Hero usage time reaches 15 minutes",
      "7 Block 9000 Damage",
      "7 Reach 7 KOs",
    ],
  },
  {
    tier: "Knight",
    lines: [
      "20 Hero usage time reaches 15 minutes",
      "13 Block 18,000 Damage",
      "13 Reach 15 KOs",
    ],
  },
  {
    tier: "Captain",
    lines: [
      "20 Hero usage time reaches 15 minutes",
      "20 Block 27,000 Damage",
      "20 Reach 22 KOs",
    ],
  },
  {
    tier: "Centurion",
    lines: [
      "20 Hero usage time reaches 15 minutes",
      "26 Block 36,000 Damage",
      "26 Reach 29 KOs",
    ],
  },
  {
    tier: "Lord",
    lines: [
      "60 Hero usage time reaches 15 minutes",
      "80 Block 43,000 Damage",
      "80 Reach 29 KOs",
    ],
  },
] as const;

const jubileeProficiency = [
  {
    tier: "Agent",
    lines: [
      "20 Hero usage time reaches 15 minutes",
      "7 Reach 6200 Healing",
      "7 Achieve a total of 17 KOs and Assists",
    ],
  },
  {
    tier: "Knight",
    lines: [
      "20 Hero usage time reaches 15 minutes",
      "13 Reach 12,000 Healing",
      "13 Achieve a total of 35 KOs and Assists",
    ],
  },
  {
    tier: "Captain",
    lines: [
      "20 Hero usage time reaches 15 minutes",
      "20 Reach 18,000 Healing",
      "20 Achieve a total of 52 KOs and Assists",
    ],
  },
  {
    tier: "Centurion",
    lines: [
      "20 Hero usage time reaches 15 minutes",
      "26 Reach 25,000 Healing",
      "26 Achieve a total of 70 KOs and Assists",
    ],
  },
  {
    tier: "Lord",
    lines: [
      "60 Hero usage time reaches 15 minutes",
      "80 Reach 25,000 Healing",
      "80 Achieve a total of 70 KOs and Assists",
    ],
  },
] as const;

const cyclopsProficiency = [
  {
    tier: "Agent",
    lines: [
      "20 Hero usage time reaches 15 minutes",
      "7 Deal 5700 Damage",
      "7 Land 6 Final Hits",
    ],
  },
  {
    tier: "Knight",
    lines: [
      "20 Hero usage time reaches 15 minutes",
      "13 Deal 11,000 Damage",
      "13 Land 11 Final Hits",
    ],
  },
  {
    tier: "Captain",
    lines: [
      "20 Hero usage time reaches 15 minutes",
      "20 Deal 17,000 Damage",
      "20 Land 17 Final Hits",
    ],
  },
  {
    tier: "Centurion",
    lines: [
      "20 Hero usage time reaches 15 minutes",
      "26 Deal 23,000 Damage",
      "26 Land 23 Final Hits",
    ],
  },
  {
    tier: "Lord",
    lines: [
      "60 Hero usage time reaches 15 minutes",
      "80 Deal 23,000 Damage",
      "80 Land 23 Final Hits",
    ],
  },
] as const;

const devilDinosaurProficiency = [
  {
    tier: "Agent",
    lines: [
      "20 Hero usage time reaches 15 minutes",
      "7 Block 14,000 Damage",
      "7 Reach 7 KOs",
    ],
  },
  {
    tier: "Knight",
    lines: [
      "20 Hero usage time reaches 15 minutes",
      "13 Block 27,000 Damage",
      "13 Reach 15 KOs",
    ],
  },
  {
    tier: "Captain",
    lines: [
      "20 Hero usage time reaches 15 minutes",
      "20 Block 41,000 Damage",
      "20 Reach 22 KOs",
    ],
  },
  {
    tier: "Centurion",
    lines: [
      "20 Hero usage time reaches 15 minutes",
      "26 Block 55,000 Damage",
      "26 Reach 29 KOs",
    ],
  },
  {
    tier: "Lord",
    lines: [
      "60 Hero usage time reaches 15 minutes",
      "80 Block 55,000 Damage",
      "80 Reach 29 KOs",
    ],
  },
] as const;

const blackCatProficiency = [
  {
    tier: "Agent",
    lines: [
      "20 Hero usage time reaches 15 minutes",
      "7 Deal 3700 Damage",
      "7 Land 6 Final Hits",
    ],
  },
  {
    tier: "Knight",
    lines: [
      "20 Hero usage time reaches 15 minutes",
      "13 Deal 7500 Damage",
      "13 Land 10 Final Hits",
    ],
  },
  {
    tier: "Captain",
    lines: [
      "20 Hero usage time reaches 15 minutes",
      "20 Deal 11,000 Damage",
      "20 Land 15 Final Hits",
    ],
  },
  {
    tier: "Centurion",
    lines: [
      "20 Hero usage time reaches 15 minutes",
      "26 Deal 15,000 Damage",
      "26 Land 20 Final Hits",
    ],
  },
  {
    tier: "Lord",
    lines: [
      "60 Hero usage time reaches 15 minutes",
      "80 Deal 15,000 Damage",
      "80 Land 20 Final Hits",
    ],
  },
] as const;

const whiteFoxProficiency = [
  {
    tier: "Agent",
    lines: [
      "20 Hero usage time reaches 15 minutes",
      "7 Reach 5400 Healing",
      "7 Achieve a total of 15 KOs and Assists",
    ],
  },
  {
    tier: "Knight",
    lines: [
      "20 Hero usage time reaches 15 minutes",
      "13 Reach 11,000 Healing",
      "13 Achieve a total of 30 KOs and Assists",
    ],
  },
  {
    tier: "Captain",
    lines: [
      "20 Hero usage time reaches 15 minutes",
      "20 Reach 16,000 Healing",
      "20 Achieve a total of 45 KOs and Assists",
    ],
  },
  {
    tier: "Centurion",
    lines: [
      "20 Hero usage time reaches 15 minutes",
      "26 Reach 21,000 Healing",
      "26 Achieve a total of 60 KOs and Assists",
    ],
  },
  {
    tier: "Lord",
    lines: [
      "60 Hero usage time reaches 15 minutes",
      "80 Reach 21,000 Healing",
      "80 Achieve a total of 60 KOs and Assists",
    ],
  },
] as const;

const elsaBloodstoneProficiency = [
  {
    tier: "Agent",
    lines: [
      "20 Hero usage time reaches 15 minutes",
      "7 Deal 5700 Damage",
      "7 Land 7 Final Hits",
    ],
  },
  {
    tier: "Knight",
    lines: [
      "20 Hero usage time reaches 15 minutes",
      "13 Deal 11,000 Damage",
      "13 Land 13 Final Hits",
    ],
  },
  {
    tier: "Captain",
    lines: [
      "20 Hero usage time reaches 15 minutes",
      "20 Deal 17,000 Damage",
      "20 Land 17 Final Hits",
    ],
  },
  {
    tier: "Centurion",
    lines: [
      "20 Hero usage time reaches 15 minutes",
      "26 Deal 23,000 Damage",
      "26 Land 25 Final Hits",
    ],
  },
  {
    tier: "Lord",
    lines: [
      "60 Hero usage time reaches 15 minutes",
      "80 Deal 23,000 Damage",
      "80 Land 25 Final Hits",
    ],
  },
] as const;

const proficiencyByHero: Record<
  string,
  readonly {
    tier: string;
    lines: readonly string[];
  }[]
> = {
  "ADAM WARLOCK": adamWarlockProficiency,
  "GORR THE GOD BUTCHER": gorrProficiency,
  "THE HOOD": theHoodProficiency,
  JUBILEE: jubileeProficiency,
  CYCLOPS: cyclopsProficiency,
  "DEVIL DINOSAUR": devilDinosaurProficiency,
  "BLACK CAT": blackCatProficiency,
  "WHITE FOX": whiteFoxProficiency,
  "ELSA BLOODSTONE": elsaBloodstoneProficiency,
};

const proficiencyByRole = {
  DUELIST: bladeProficiency,
  VANGUARD: bladeProficiency,
  STRATEGIST: bladeProficiency,
} as const;

export default function HeroDirectory() {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("ALL");
  const [sortByTier, setSortByTier] = useState(false);
  const [selectedHero, setSelectedHero] = useState<(typeof heroes)[number] | null>(null);

  const filteredHeroes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const matches = heroes.filter((hero) => {
      const matchesRole = role === "ALL" || hero.role === role;
      const matchesQuery =
        !normalizedQuery ||
        `${hero.name} ${hero.role}`.toLowerCase().includes(normalizedQuery);

      return matchesRole && matchesQuery;
    });

    if (!sortByTier) return matches;

    const tierOrder = ["S", "A", "B", "C", "D", "E", "F"];
    return [...matches].sort((first, second) => {
      const firstIndex = heroTiers[first.name]
        ? tierOrder.indexOf(heroTiers[first.name])
        : tierOrder.length;
      const secondIndex = heroTiers[second.name]
        ? tierOrder.indexOf(heroTiers[second.name])
        : tierOrder.length;
      return firstIndex - secondIndex || first.name.localeCompare(second.name);
    });
  }, [query, role, sortByTier]);

  const roles = ["ALL", "VANGUARD", "DUELIST", "STRATEGIST"];

  return (
    <section className="roster-section" aria-labelledby="roster-title">
      <div className="roster-heading">
        <div>
          <span className="page-eyebrow">All heroes</span>
          <h2 id="roster-title">Choose a hero</h2>
        </div>
        <label className="hero-search">
          <span className="sr-only">Search heroes</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search heroes..."
          />
        </label>
      </div>

      <div className="roster-controls">
        <div className="roster-filter-group">
          <div className="role-filters" aria-label="Filter heroes by role">
            {roles.map((filterRole) => (
              <button
                className={[
                  "role-filter",
                  filterRole !== "ALL" ? roleClassNames[filterRole as keyof typeof roleClassNames] : "",
                  role === filterRole ? "active" : "",
                ].filter(Boolean).join(" ")}
                type="button"
                key={filterRole}
                aria-pressed={role === filterRole}
                onClick={() => setRole(filterRole)}
              >
                {filterRole}
              </button>
            ))}
            <button
              className={sortByTier ? "role-filter active" : "role-filter"}
              type="button"
              aria-pressed={sortByTier}
              onClick={() => setSortByTier((enabled) => !enabled)}
            >
              Tiers
            </button>
          </div>
        </div>
        <p className="roster-count" aria-live="polite">
          {filteredHeroes.length} heroes
        </p>
      </div>

      <div className="hero-roster">
        {filteredHeroes.map((hero) => (
          <article
            className={`roster-card ${roleClassNames[hero.role]}`}
            key={hero.name}
          >
            <span className="comic-burst" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            {hero.name === "NIGHTCRAWLER" && (
              <span className="new-tag">NEW</span>
            )}
            {heroTiers[hero.name] && (
              <span className={`tier-badge tier-${heroTiers[hero.name].toLowerCase()}`}>
                {heroTiers[hero.name]}
              </span>
            )}
            {(hero.name === "ADAM WARLOCK" || hero.name === "MANTIS") && (
              <span className="unavailable-tag">Unavailable</span>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={hero.image} alt={`${hero.name} Marvel Rivals character card`} />
            <span className="roster-card-shade" />
            <span className="roster-card-info">
              <span className="roster-role">{hero.role}</span>
              <strong>{hero.name}</strong>
            </span>
            <div className="roster-card-actions">
              <Link
                className={[
                  "hero-card-button",
                  "order-button",
                  hero.name === "ADAM WARLOCK" || hero.name === "MANTIS"
                    ? "disabled"
                    : "",
                ].filter(Boolean).join(" ")}
                href={`/order?hero=${encodeURIComponent(hero.name)}`}
                aria-disabled={
                  hero.name === "ADAM WARLOCK" || hero.name === "MANTIS"
                }
              >
                Order
              </Link>
            </div>
          </article>
        ))}
      </div>

      {selectedHero && (
        <div
          className="hero-stats-backdrop"
          role="presentation"
          onClick={() => setSelectedHero(null)}
        >
          <section
            className={`hero-stats-modal ${roleClassNames[selectedHero.role]}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="hero-stats-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="hero-stats-close"
              type="button"
              aria-label="Close stats"
              onClick={() => setSelectedHero(null)}
            >
              ×
            </button>
            <span className="roster-role">{selectedHero.role}</span>
            <h2 id="hero-stats-title">{selectedHero.name}</h2>
            <div className="proficiency-list">
              {proficiencyByHero[selectedHero.name]
                ? proficiencyByHero[selectedHero.name].map((level) => (
                    <div className="proficiency-tier" key={level.tier}>
                      <strong>{level.tier}</strong>
                      <ul>
                        {level.lines.map((line) => (
                          <li key={line}>
                            <span className="proficiency-icon" aria-hidden="true">
                              <i />
                              <i />
                              <i />
                            </span>
                            <strong className="proficiency-points">
                              {line.match(/^(\\d+)/)?.[0]}
                            </strong>
                            <span className="proficiency-text">
                              {line.replace(/^\\d+\\s*/, "")}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                : proficiencyByRole[selectedHero.role].map((level) => (
                    <div className="proficiency-tier" key={level.tier}>
                      <strong>{level.tier}</strong>
                      <ul>
                        <li>
                          <span className="proficiency-icon" aria-hidden="true">
                            <i />
                            <i />
                            <i />
                          </span>
                          <strong className="proficiency-points">{level.points}</strong>
                          <span className="proficiency-text">
                            Hero usage time reaches {level.minutes} minutes
                          </span>
                        </li>
                        <li>
                          <span className="proficiency-icon" aria-hidden="true">
                            <i />
                            <i />
                            <i />
                          </span>
                          <strong className="proficiency-points">{level.points}</strong>
                          <span className="proficiency-text">
                            Deal {level.damage.toLocaleString()} damage
                          </span>
                        </li>
                        <li>
                          <span className="proficiency-icon" aria-hidden="true">
                            <i />
                            <i />
                            <i />
                          </span>
                          <strong className="proficiency-points">{level.points}</strong>
                          <span className="proficiency-text">
                            Land {level.finalHits} final hits
                          </span>
                        </li>
                      </ul>
                    </div>
                  ))}
            </div>
            <p className="proficiency-note">
              Points for Lord for Arcades offer slightly.
            </p>
            <div className="hero-stats-actions">
              <Link
                className="hero-card-button order-button"
                href={`/order?hero=${encodeURIComponent(selectedHero.name)}`}
              >
                Order
              </Link>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
