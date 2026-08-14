import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Plus, Check, Tag, ShoppingCart } from "lucide-react";
import PrivacyPolicy from "./PrivacyPolicy";

const COOKIE_CONSENT_KEY = "ks_cookie_consent";

// Ključ pod kojim se sve korisničke postavke spremaju u localStorage.
const SETTINGS_KEY = "ks_settings";

// Učitaj spremljene postavke (jednom, pri pokretanju). Vrati prazan objekt
// ako pohrana nije dostupna ili je sadržaj neispravan.
function loadSettings() {
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (e) {
    return {};
  }
}

const API = "https://meal-planner-api-cq4j.onrender.com";

async function fetchRecipes(store, exclude, servings, meal, budget) {
  const params = new URLSearchParams({
    store,
    servings,
    exclude: exclude.join(","),
  });
  if (meal) params.set("meal", meal);
  if (budget != null) params.set("budget", budget);
  const res = await fetch(`${API}/api/recipes?${params}`);
  return res.json();
}

const STORES = [
  { key: "konzum", name: "Konzum" },
  { key: "lidl", name: "Lidl" },
  { key: "studenac", name: "Studenac" },
  { key: "kaufland", name: "Kaufland" },
  { key: "eurospin", name: "Eurospin" },
  { key: "plodine", name: "Plodine" },
  { key: "interspar", name: "Interspar" },
];

const MEAL_MODES = [
  { key: "rucak", label: "Ručak" },
  { key: "vecera", label: "Večera" },
  { key: "oboje", label: "Oboje" },
];

const DIET_FILTERS = [
  { id: "meso", label: "Bez mesa" },
  { id: "riba", label: "Bez ribe" },
  { id: "mlijecno", label: "Bez mliječnih proizvoda" },
  { id: "jaja", label: "Bez jaja" },
  { id: "gluten", label: "Bez glutena" },
  { id: "orasasti", label: "Bez orašastih plodova" },
];

const DISCOUNTS = {
  konzum: [
    { id: "piletina-konzum", name: "Pileća prsa", unit: "500 g", old: 5.99, new: 3.99, category: "piletina" },
    { id: "mljeveno-konzum", name: "Mljevena junetina", unit: "500 g", old: 5.49, new: 4.49, category: "mljeveno" },
    { id: "rajcice-konzum", name: "Rajčice", unit: "500 g", old: 1.29, new: 0.89, category: "rajcice" },
    { id: "tjestenina-konzum", name: "Tjestenina penne", unit: "500 g", old: 1.09, new: 0.79, category: "tjestenina" },
    { id: "sir-konzum", name: "Mozzarella", unit: "125 g", old: 1.39, new: 0.99, category: "sir" },
    { id: "krumpir-konzum", name: "Krumpir", unit: "1 kg", old: 1.39, new: 0.99, category: "krumpir" },
    { id: "luk-konzum", name: "Crveni luk", unit: "1 kg", old: 0.99, new: 0.69, category: "luk" },
    { id: "vrhnje-konzum", name: "Vrhnje za kuhanje", unit: "200 ml", old: 1.19, new: 0.89, category: "vrhnje" },
    { id: "jaja-konzum", name: "Jaja", unit: "10 kom", old: 2.49, new: 1.99, category: "jaja" },
    { id: "riza-konzum", name: "Riža", unit: "500 g", old: 1.19, new: 0.85, category: "riza" },
  ],
  lidl: [
    { id: "piletina-lidl", name: "Pileći zabatak", unit: "500 g", old: 2.49, new: 1.79, category: "piletina" },
    { id: "mljeveno-lidl", name: "Mljeveno meso (mix)", unit: "500 g", old: 3.99, new: 2.99, category: "mljeveno" },
    { id: "brokula-lidl", name: "Brokula", unit: "500 g", old: 1.49, new: 0.99, category: "brokula" },
    { id: "tjestenina-lidl", name: "Špageti", unit: "500 g", old: 0.99, new: 0.65, category: "tjestenina" },
    { id: "sir-lidl", name: "Sir za posipanje", unit: "200 g", old: 1.99, new: 1.49, category: "sir" },
    { id: "mrkva-lidl", name: "Mrkva", unit: "1 kg", old: 1.19, new: 0.79, category: "mrkva" },
    { id: "krumpir-lidl", name: "Krumpir", unit: "2.5 kg", old: 2.29, new: 1.79, category: "krumpir" },
    { id: "vrhnje-lidl", name: "Vrhnje za kuhanje", unit: "200 ml", old: 1.15, new: 0.85, category: "vrhnje" },
    { id: "jaja-lidl", name: "Jaja", unit: "10 kom", old: 2.39, new: 1.89, category: "jaja" },
    { id: "tuna-lidl", name: "Tuna komadi", unit: "160 g", old: 1.39, new: 0.99, category: "tuna" },
  ],
  studenac: [
    { id: "piletina-studenac", name: "Pileći file", unit: "400 g", old: 4.49, new: 3.29, category: "piletina" },
    { id: "tjestenina-studenac", name: "Tjestenina", unit: "500 g", old: 0.99, new: 0.75, category: "tjestenina" },
    { id: "rajcice-studenac", name: "Rajčice", unit: "500 g", old: 1.39, new: 0.99, category: "rajcice" },
    { id: "luk-studenac", name: "Crveni luk", unit: "1 kg", old: 1.09, new: 0.79, category: "luk" },
    { id: "jaja-studenac", name: "Jaja", unit: "10 kom", old: 2.59, new: 2.09, category: "jaja" },
    { id: "sir-studenac", name: "Sir za posipanje", unit: "150 g", old: 1.79, new: 1.39, category: "sir" },
    { id: "krumpir-studenac", name: "Krumpir", unit: "1 kg", old: 1.29, new: 0.99, category: "krumpir" },
  ],
  kaufland: [
    { id: "piletina-kaufland", name: "Pileći file", unit: "500 g", old: 5.49, new: 3.79, category: "piletina" },
    { id: "mljeveno-kaufland", name: "Mljeveno meso", unit: "500 g", old: 4.29, new: 3.29, category: "mljeveno" },
    { id: "tjestenina-kaufland", name: "Tjestenina", unit: "500 g", old: 0.95, new: 0.69, category: "tjestenina" },
    { id: "rajcice-kaufland", name: "Rajčice čeri", unit: "500 g", old: 1.99, new: 1.39, category: "rajcice" },
    { id: "riza-kaufland", name: "Riža", unit: "1 kg", old: 1.69, new: 1.19, category: "riza" },
    { id: "sir-kaufland", name: "Mozzarella", unit: "125 g", old: 1.29, new: 0.89, category: "sir" },
    { id: "vrhnje-kaufland", name: "Vrhnje za kuhanje", unit: "200 ml", old: 1.09, new: 0.79, category: "vrhnje" },
    { id: "mrkva-kaufland", name: "Mrkva", unit: "1 kg", old: 0.99, new: 0.69, category: "mrkva" },
    { id: "jaja-kaufland", name: "Jaja", unit: "10 kom", old: 2.99, new: 2.39, category: "jaja" },
    { id: "brokula-kaufland", name: "Brokula", unit: "500 g", old: 1.39, new: 0.95, category: "brokula" },
  ],
  eurospin: [
    { id: "tjestenina-eurospin", name: "Tjestenina", unit: "500 g", old: 0.79, new: 0.55, category: "tjestenina" },
    { id: "rajcice-eurospin", name: "Pelat rajčica", unit: "500 g", old: 1.19, new: 0.79, category: "rajcice" },
    { id: "sir-eurospin", name: "Sir za posipanje", unit: "200 g", old: 2.49, new: 1.79, category: "sir" },
    { id: "mljeveno-eurospin", name: "Mljeveno meso", unit: "500 g", old: 3.79, new: 2.89, category: "mljeveno" },
    { id: "luk-eurospin", name: "Crveni luk", unit: "1 kg", old: 0.89, new: 0.59, category: "luk" },
    { id: "jaja-eurospin", name: "Jaja", unit: "10 kom", old: 2.29, new: 1.85, category: "jaja" },
    { id: "orasi-eurospin", name: "Mix orašastih plodova", unit: "200 g", old: 2.99, new: 2.19, category: "orasi" },
    { id: "vrhnje-eurospin", name: "Vrhnje za kuhanje", unit: "200 ml", old: 1.05, new: 0.79, category: "vrhnje" },
  ],
  plodine: [
    { id: "piletina-plodine", name: "Pileća prsa", unit: "500 g", old: 5.79, new: 4.19, category: "piletina" },
    { id: "rajcice-plodine", name: "Rajčice", unit: "1 kg", old: 2.49, new: 1.69, category: "rajcice" },
    { id: "mrkva-plodine", name: "Mrkva", unit: "1 kg", old: 0.99, new: 0.65, category: "mrkva" },
    { id: "krumpir-plodine", name: "Krumpir", unit: "2 kg", old: 2.19, new: 1.59, category: "krumpir" },
    { id: "brokula-plodine", name: "Brokula", unit: "500 g", old: 1.59, new: 1.09, category: "brokula" },
    { id: "luk-plodine", name: "Crveni luk", unit: "1 kg", old: 0.95, new: 0.65, category: "luk" },
    { id: "riza-plodine", name: "Riža", unit: "1 kg", old: 1.79, new: 1.29, category: "riza" },
    { id: "jaja-plodine", name: "Jaja", unit: "10 kom", old: 2.99, new: 2.49, category: "jaja" },
    { id: "tuna-plodine", name: "Tuna komadi", unit: "160 g", old: 1.49, new: 1.09, category: "tuna" },
  ],
  interspar: [
    { id: "piletina-interspar", name: "Pileći file", unit: "500 g", old: 5.99, new: 4.29, category: "piletina" },
    { id: "mljeveno-interspar", name: "Mljevena junetina", unit: "500 g", old: 5.29, new: 3.99, category: "mljeveno" },
    { id: "tjestenina-interspar", name: "Tjestenina", unit: "500 g", old: 1.05, new: 0.75, category: "tjestenina" },
    { id: "rajcice-interspar", name: "Rajčice", unit: "500 g", old: 1.35, new: 0.95, category: "rajcice" },
    { id: "sir-interspar", name: "Sir za posipanje", unit: "200 g", old: 1.89, new: 1.39, category: "sir" },
    { id: "vrhnje-interspar", name: "Vrhnje za kuhanje", unit: "200 ml", old: 1.19, new: 0.85, category: "vrhnje" },
    { id: "krumpir-interspar", name: "Krumpir", unit: "2 kg", old: 2.39, new: 1.69, category: "krumpir" },
    { id: "jaja-interspar", name: "Jaja", unit: "10 kom", old: 2.79, new: 2.19, category: "jaja" },
    { id: "riza-interspar", name: "Riža", unit: "1 kg", old: 1.69, new: 1.19, category: "riza" },
    { id: "tuna-interspar", name: "Tuna komadi", unit: "160 g", old: 1.59, new: 1.09, category: "tuna" },
  ],
};

const RECIPES = [
  {
    id: "rizoto",
    name: "Pileći rižoto s povrćem",
    time: "35 min",
    servings: 4,
    ingredients: [
      { name: "Pileća prsa", amount: "500 g", regular: 5.99, category: "piletina", tags: ["meso"] },
      { name: "Riža", amount: "500 g", regular: 1.19, category: "riza", tags: [] },
      { name: "Mrkva", amount: "1 kg", regular: 1.19, category: "mrkva", tags: [] },
      { name: "Crveni luk", amount: "1 kg", regular: 0.99, category: "luk", tags: [] },
      { name: "Vrhnje za kuhanje", amount: "200 ml", regular: 1.19, category: "vrhnje", tags: ["mlijecno"] },
    ],
    steps: [
      "Sitno nasjeckajte luk i mrkvu te popržite na malo ulja 3-4 minute.",
      "Dodajte rižu i piletinu narezanu na kockice, kuhajte dok piletina ne porumeni.",
      "Postupno ulijevajte vodu ili temeljac, povremeno miješajte dok riža ne upije tekućinu.",
      "Na kraju umiješajte vrhnje, posolite i popaprite po želji.",
    ],
  },
  {
    id: "tjestenina-tuna",
    name: "Tjestenina s tunom i rajčicom",
    time: "20 min",
    servings: 4,
    ingredients: [
      { name: "Tjestenina", amount: "500 g", regular: 1.09, category: "tjestenina", tags: ["gluten"] },
      { name: "Tuna komadi", amount: "160 g", regular: 1.39, category: "tuna", tags: ["riba"] },
      { name: "Rajčice", amount: "500 g", regular: 1.29, category: "rajcice", tags: [] },
      { name: "Crveni luk", amount: "1 kg", regular: 0.99, category: "luk", tags: [] },
      { name: "Maslinovo ulje", amount: "1 kom", regular: 0.5, category: null, tags: [] },
    ],
    steps: [
      "Tjesteninu kuhajte u kipućoj vodi prema uputama na pakiranju.",
      "Na malo ulja popržite nasjeckani luk i rajčice 5-6 minuta.",
      "Dodajte ocijeđenu tunu, promiješajte i kratko zagrijte.",
      "Umiješajte kuhanu tjesteninu i poslužite.",
    ],
  },
  {
    id: "pecena-piletina",
    name: "Pečena piletina s krumpirom",
    time: "50 min",
    servings: 4,
    ingredients: [
      { name: "Pileća prsa", amount: "500 g", regular: 5.99, category: "piletina", tags: ["meso"] },
      { name: "Krumpir", amount: "1 kg", regular: 1.39, category: "krumpir", tags: [] },
      { name: "Crveni luk", amount: "1 kg", regular: 0.99, category: "luk", tags: [] },
      { name: "Začini", amount: "1 kom", regular: 0.7, category: null, tags: [] },
    ],
    steps: [
      "Krumpir oguliti i prerezati na veće komade, staviti u posudu za pečenje.",
      "Piletinu i krumpir posoliti, popapriti i premazati uljem sa začinima.",
      "Na vrh staviti kriške luka i peći na 200°C oko 40 minuta.",
    ],
  },
  {
    id: "bolognese",
    name: "Bolognese tjestenina",
    time: "40 min",
    servings: 4,
    ingredients: [
      { name: "Mljeveno meso", amount: "500 g", regular: 5.49, category: "mljeveno", tags: ["meso"] },
      { name: "Tjestenina", amount: "500 g", regular: 1.09, category: "tjestenina", tags: ["gluten"] },
      { name: "Rajčice", amount: "500 g", regular: 1.29, category: "rajcice", tags: [] },
      { name: "Crveni luk", amount: "1 kg", regular: 0.99, category: "luk", tags: [] },
      { name: "Sir za posipanje", amount: "200 g", regular: 1.99, category: "sir", tags: ["mlijecno"] },
    ],
    steps: [
      "Na ulju popržite nasjeckani luk, dodajte mljeveno meso i pirjajte dok ne porumeni.",
      "Dodajte rajčice, posolite, popaprite i pirjajte 15-20 minuta.",
      "Tjesteninu kuhajte prema uputama, ocijedite i prelijte umakom.",
      "Pospite sirom za posipanje i poslužite.",
    ],
  },
  {
    id: "pileca-juha",
    name: "Pileća juha s rezancima",
    time: "60 min",
    servings: 6,
    ingredients: [
      { name: "Pileća prsa", amount: "500 g", regular: 5.99, category: "piletina", tags: ["meso"] },
      { name: "Mrkva", amount: "1 kg", regular: 1.19, category: "mrkva", tags: [] },
      { name: "Crveni luk", amount: "1 kg", regular: 0.99, category: "luk", tags: [] },
      { name: "Tjestenina (rezanci)", amount: "500 g", regular: 1.09, category: "tjestenina", tags: ["gluten"] },
    ],
    steps: [
      "Piletinu, mrkvu i luk stavite u lonac, prelijte vodom i zakuhajte.",
      "Kuhajte na laganoj vatri oko 40 minuta, povremeno skidajući pjenu.",
      "Dodajte rezance i kuhajte još 8-10 minuta dok ne omekšaju.",
      "Posolite, popaprite i poslužite vruće.",
    ],
  },
  {
    id: "brokula-gratin",
    name: "Zapečena brokula sa sirom",
    time: "30 min",
    servings: 4,
    ingredients: [
      { name: "Brokula", amount: "500 g", regular: 1.49, category: "brokula", tags: [] },
      { name: "Vrhnje za kuhanje", amount: "200 ml", regular: 1.19, category: "vrhnje", tags: ["mlijecno"] },
      { name: "Sir za posipanje", amount: "200 g", regular: 1.99, category: "sir", tags: ["mlijecno"] },
      { name: "Krumpir", amount: "1 kg", regular: 1.39, category: "krumpir", tags: [] },
    ],
    steps: [
      "Brokulu prokuhajte 3-4 minute u slanoj vodi, ocijedite.",
      "Krumpir narežite na kriške, poslažite na dno posude i prelijte vrhnjem.",
      "Na vrh stavite brokulu i pospite sirom za posipanje.",
      "Pecite na 200°C oko 25 minuta dok sir ne porumeni.",
    ],
  },
  {
    id: "omlet",
    name: "Omlet sa sirom i rajčicom",
    time: "15 min",
    servings: 2,
    ingredients: [
      { name: "Jaja", amount: "10 kom", regular: 2.49, category: "jaja", tags: ["jaja"] },
      { name: "Sir za posipanje", amount: "200 g", regular: 1.99, category: "sir", tags: ["mlijecno"] },
      { name: "Rajčice", amount: "500 g", regular: 1.29, category: "rajcice", tags: [] },
      { name: "Crveni luk", amount: "1 kg", regular: 0.99, category: "luk", tags: [] },
    ],
    steps: [
      "Jaja umutite s malo soli i papra.",
      "Na tavi popržite nasjeckani luk i rajčice 3-4 minute.",
      "Prelijte umućenim jajima, pospite sirom i pecite dok omlet ne stegne.",
    ],
  },
  {
    id: "salata-orasi",
    name: "Salata s rajčicom, sirom i orašastim plodovima",
    time: "10 min",
    servings: 2,
    ingredients: [
      { name: "Rajčice", amount: "500 g", regular: 1.29, category: "rajcice", tags: [] },
      { name: "Sir za posipanje", amount: "200 g", regular: 1.99, category: "sir", tags: ["mlijecno"] },
      { name: "Mix orašastih plodova", amount: "200 g", regular: 2.99, category: "orasi", tags: ["orasasti"] },
      { name: "Crveni luk", amount: "1 kg", regular: 0.99, category: "luk", tags: [] },
    ],
    steps: [
      "Rajčice narežite na kockice, a luk na tanke listove.",
      "U zdjelu stavite rajčice, luk i kockice sira.",
      "Pospite mixom orašastih plodova i po želji prelijte maslinovim uljem.",
    ],
  },
];

// ─── Shopping list helpers ────────────────────────────────────────────────────

const DEPT_MAP = {
  piletina: "Meso",
  mljeveno: "Meso",
  tuna: "Meso",
  sir: "Mliječni proizvodi",
  vrhnje: "Mliječni proizvodi",
  jaja: "Mliječni proizvodi",
  rajcice: "Povrće",
  mrkva: "Povrće",
  brokula: "Povrće",
  luk: "Povrće",
  krumpir: "Povrće",
  tjestenina: "Suho / Žitarice",
  riza: "Suho / Žitarice",
  orasi: "Suho / Žitarice",
};

const DEPT_ORDER = ["Meso", "Mliječni proizvodi", "Povrće", "Suho / Žitarice", "Ostalo"];

/** Parses "500 g", "1 kg", "200 ml", "10 kom" → { value, unit } in base units (g / ml / kom). */
function parseAmount(str) {
  if (!str) return null;
  const m = String(str).trim().match(/^([\d.]+)\s*(g|ml|kg|l|kom)$/i);
  if (!m) return null;
  const val = parseFloat(m[1]);
  const u = m[2].toLowerCase();
  if (u === "kg") return { value: val * 1000, unit: "g" };
  if (u === "l") return { value: val * 1000, unit: "ml" };
  return { value: val, unit: u };
}

// Formatira jednu količinu u zadanoj baznoj jedinici (g / ml / kom) u
// čitljiv oblik (npr. 1500 g → "1.5 kg", 400 g → "400 g").
function fmtOne(value, unit) {
  if (unit === "g") {
    if (value >= 1000) {
      const kg = value / 1000;
      return (Number.isInteger(kg) ? kg : parseFloat(kg.toFixed(1))) + " kg";
    }
    return Math.round(value) + " g";
  }
  if (unit === "ml") {
    if (value >= 1000) {
      const l = value / 1000;
      return (Number.isInteger(l) ? l : parseFloat(l.toFixed(1))) + " L";
    }
    return Math.round(value) + " ml";
  }
  return Math.round(value) + " kom";
}

// Pribraja količinu jednog sastojka u bazne jedinice (g / ml / kom).
// API odgovor ima quantity (u kg/L/kom) + unit; lokalni fallback ima amount
// string ("500 g"). Vraća true ako je uspio pribrojiti mjerljivu količinu.
function addQuantity(bucket, ing) {
  if (ing.quantity !== undefined && ing.unit) {
    if (ing.unit === "g") bucket.totalG += (ing.quantity || 0) * 1000;
    else if (ing.unit === "ml") bucket.totalMl += (ing.quantity || 0) * 1000;
    else bucket.totalKom += ing.quantity || 0;
    return true;
  }
  const parsed = parseAmount(ing.amount);
  if (parsed) {
    if (parsed.unit === "g") bucket.totalG += parsed.value;
    else if (parsed.unit === "ml") bucket.totalMl += parsed.value;
    else bucket.totalKom += parsed.value;
    return true;
  }
  return false;
}

/**
 * Gradi shopping listu grupiranu po odjelu. Za svaku namirnicu:
 *  1. zbraja potrebnu količinu kroz SVE odabrane obroke (ručak + večera),
 *  2. za namirnice s pokrivenošću u dućanu bira dostupno (akcijsko) pakiranje,
 *  3. zaokružuje broj pakiranja s Math.ceil da pokrije potrebnu količinu,
 *  4. računa koliko ostaje viška ("za sljedeći tjedan"),
 *  5. namirnice bez matcha u dućanu (sol, začini…) prikazuje kao procjenu bez pakiranja.
 *
 * Item: { key, dept, productName, neededStr, hasPackage, packageStr, packages,
 *         packagePrice, totalPrice, leftoverStr, hasAkcija }
 */
function buildShoppingList(planRecipes, discounts) {
  const matched = {}; // category → { productName, totals…, storeProduct }
  const unmatched = {}; // key → { name, dept, totals…, count }

  planRecipes.forEach((recipe) => {
    recipe.ingredients.forEach((ing) => {
      const storeProduct = ing.category
        ? discounts.find((d) => d.category === ing.category) || null
        : null;

      // Bez kategorije ili bez pokrivenosti u dućanu → procjena bez pakiranja.
      if (!storeProduct) {
        const key = ing.category ? `cat-${ing.category}` : `nc-${ing.name}`;
        if (!unmatched[key]) {
          unmatched[key] = {
            name: ing.name,
            dept: DEPT_MAP[ing.category] || "Ostalo",
            totalG: 0,
            totalMl: 0,
            totalKom: 0,
            count: 0,
          };
        }
        if (!addQuantity(unmatched[key], ing)) unmatched[key].count += 1;
        return;
      }

      if (!matched[ing.category]) {
        matched[ing.category] = {
          productName: storeProduct.name,
          totalG: 0,
          totalMl: 0,
          totalKom: 0,
          storeProduct,
        };
      }
      addQuantity(matched[ing.category], ing);
    });
  });

  const items = [];

  Object.entries(matched).forEach(([cat, info]) => {
    const { productName, totalG, totalMl, totalKom, storeProduct } = info;
    const dominantUnit = totalG > 0 ? "g" : totalMl > 0 ? "ml" : "kom";
    const totalNeeded = totalG > 0 ? totalG : totalMl > 0 ? totalMl : totalKom;

    // Dostupno pakiranje u dućanu (akcijsko se preferira jer dolazi iz akcija).
    const pkg = parseAmount(storeProduct.unit);
    let packages = 1;
    let leftoverStr = null;
    if (pkg && pkg.unit === dominantUnit && pkg.value > 0) {
      packages = Math.max(1, Math.ceil(totalNeeded / pkg.value));
      const leftover = packages * pkg.value - totalNeeded;
      if (leftover > 0) leftoverStr = "~" + fmtOne(leftover, dominantUnit);
    }

    items.push({
      key: cat,
      dept: DEPT_MAP[cat] || "Ostalo",
      productName,
      neededStr: fmtOne(totalNeeded, dominantUnit),
      hasPackage: true,
      packageStr: storeProduct.unit.replace(/\s+/g, ""),
      packages,
      packagePrice: storeProduct.new,
      totalPrice: storeProduct.new * packages,
      leftoverStr,
      hasAkcija: true,
    });
  });

  // Namirnice bez matcha u dućanu → procijenjena količina, bez pakiranja/cijene.
  Object.entries(unmatched).forEach(([key, info]) => {
    const hasQty = info.totalG > 0 || info.totalMl > 0 || info.totalKom > 0;
    const dominantUnit = info.totalG > 0 ? "g" : info.totalMl > 0 ? "ml" : "kom";
    const totalNeeded =
      info.totalG > 0 ? info.totalG : info.totalMl > 0 ? info.totalMl : info.totalKom;
    const neededStr = hasQty
      ? "~" + fmtOne(totalNeeded, dominantUnit)
      : info.count > 1
      ? `${info.count}×`
      : "po potrebi";

    items.push({
      key,
      dept: info.dept,
      productName: info.name,
      neededStr,
      hasPackage: false,
      packageStr: "",
      packages: 1,
      packagePrice: null,
      totalPrice: null,
      leftoverStr: null,
      hasAkcija: false,
    });
  });

  // Group by department
  const byDept = {};
  DEPT_ORDER.forEach((d) => (byDept[d] = []));
  items.forEach((item) => {
    if (!byDept[item.dept]) byDept[item.dept] = [];
    byDept[item.dept].push(item);
  });

  return byDept;
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

const fmt = (n) => n.toFixed(2).replace(".", ",") + " €";
const servingWord = (n) => (n === 1 ? "porcija" : n >= 2 && n <= 4 ? "porcije" : "porcija");

function priceInfo(ingredient, discounts) {
  if (!ingredient.category) return { price: ingredient.regular, isAkcija: false };
  const match = discounts.find((d) => d.category === ingredient.category);
  if (match) return { price: match.new, isAkcija: true };
  return { price: ingredient.regular, isAkcija: false };
}

function computeRecipe(recipe, discounts) {
  let total = 0;
  let akcijaCount = 0;
  const ingredients = recipe.ingredients.map((ing) => {
    const info = priceInfo(ing, discounts);
    total += info.price;
    if (info.isAkcija) akcijaCount += 1;
    return { ...ing, ...info };
  });
  return { ...recipe, ingredients, total, akcijaCount };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MealPlanner() {
  // Spremljene postavke iz localStorage — pročitane jednom pri pokretanju.
  const [saved] = useState(loadSettings);

  const validStore = (v) => (STORES.some((s) => s.key === v) ? v : "konzum");
  const validMode = (v) => (MEAL_MODES.some((m) => m.key === v) ? v : "rucak");
  const validBudget = (v) => (Number.isFinite(v) && v > 0 ? v : 45);
  const validList = (v) => (Array.isArray(v) ? v : []);

  const [store, setStore] = useState(() => validStore(saved.store));
  const [mealMode, setMealMode] = useState(() => validMode(saved.mealMode));
  const [budgetRucak, setBudgetRucak] = useState(() => validBudget(saved.budgetRucak));
  const [budgetVecera, setBudgetVecera] = useState(() => validBudget(saved.budgetVecera));
  const [excluded, setExcluded] = useState(() => validList(saved.excluded));
  const [planRucak, setPlanRucak] = useState(() => validList(saved.planRucak));
  const [planVecera, setPlanVecera] = useState(() => validList(saved.planVecera));
  const [expandedRucak, setExpandedRucak] = useState(null);
  const [expandedVecera, setExpandedVecera] = useState(null);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [apiDataRucak, setApiDataRucak] = useState(null);
  const [apiDataVecera, setApiDataVecera] = useState(null);
  const [loadingRucak, setLoadingRucak] = useState(true);
  const [loadingVecera, setLoadingVecera] = useState(true);
  const [checkedItems, setCheckedItems] = useState({});
  const [showPrivacy, setShowPrivacy] = useState(false);
  // undefined dok ne pročitamo pohranu; null = još nema odluke (prikaži banner).
  const [cookieConsent, setCookieConsent] = useState(null);

  // Na prvom renderu pročitaj spremljenu privolu za kolačiće (ako postoji).
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(COOKIE_CONSENT_KEY);
      if (saved === "accepted" || saved === "declined") setCookieConsent(saved);
    } catch (e) {
      /* localStorage nedostupan — banner se svejedno može prikazati */
    }
  }, []);

  const handleCookieChoice = (choice) => {
    setCookieConsent(choice);
    try {
      window.localStorage.setItem(COOKIE_CONSENT_KEY, choice);
    } catch (e) {
      /* ignoriraj ako pohrana nije dostupna */
    }
  };

  useEffect(() => {
    if (mealMode === "rucak" || mealMode === "oboje") {
      setLoadingRucak(true);
      fetchRecipes(store, excluded, 4, "rucak", budgetRucak)
        .then((data) => setApiDataRucak(data))
        .catch(() => {})
        .finally(() => setLoadingRucak(false));
    }
    if (mealMode === "vecera" || mealMode === "oboje") {
      setLoadingVecera(true);
      fetchRecipes(store, excluded, 4, "vecera", budgetVecera)
        .then((data) => setApiDataVecera(data))
        .catch(() => {})
        .finally(() => setLoadingVecera(false));
    }
  }, [store, excluded, mealMode, budgetRucak, budgetVecera]);

  // Spremi sve korisničke postavke u localStorage svaki put kad se promijene.
  useEffect(() => {
    try {
      window.localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({
          store,
          mealMode,
          budgetRucak,
          budgetVecera,
          excluded,
          planRucak,
          planVecera,
        })
      );
    } catch (e) {
      /* pohrana nedostupna (npr. privatni način) — tiho ignoriraj */
    }
  }, [store, mealMode, budgetRucak, budgetVecera, excluded, planRucak, planVecera]);

  const discounts = apiDataRucak?.discounts ?? apiDataVecera?.discounts ?? DISCOUNTS[store];
  const storeName = STORES.find((s) => s.key === store).name;

  const allRecipesRucak = apiDataRucak?.recipes ?? RECIPES.map((r) => computeRecipe(r, discounts));
  const allRecipesVecera = apiDataVecera?.recipes ?? RECIPES.map((r) => computeRecipe(r, discounts));

  const filterAndSort = (recipes) =>
    recipes
      .filter((r) => !r.ingredients.some((ing) => ing.tags.some((t) => excluded.includes(t))))
      .sort((a, b) => b.akcijaCount - a.akcijaCount || a.total - b.total);

  const visibleRecipesRucak = filterAndSort(allRecipesRucak);
  const visibleRecipesVecera = filterAndSort(allRecipesVecera);

  const planRecipesRucak = allRecipesRucak.filter((r) => planRucak.includes(r.id));
  const planRecipesVecera = allRecipesVecera.filter((r) => planVecera.includes(r.id));
  const planTotalRucak = planRecipesRucak.reduce((sum, r) => sum + r.total, 0);
  const planTotalVecera = planRecipesVecera.reduce((sum, r) => sum + r.total, 0);

  const receiptTotal =
    mealMode === "rucak" ? planTotalRucak
    : mealMode === "vecera" ? planTotalVecera
    : planTotalRucak + planTotalVecera;
  const receiptBudget =
    mealMode === "rucak" ? budgetRucak
    : mealMode === "vecera" ? budgetVecera
    : budgetRucak + budgetVecera;
  const receiptCount =
    mealMode === "rucak" ? planRucak.length
    : mealMode === "vecera" ? planVecera.length
    : planRucak.length + planVecera.length;
  const overBudget = receiptTotal > receiptBudget;
  const progressPct = Math.min(100, (receiptTotal / receiptBudget) * 100);

  // Shopping list — all planned recipes for current mode
  const shoppingPlanRecipes =
    mealMode === "rucak" ? planRecipesRucak
    : mealMode === "vecera" ? planRecipesVecera
    : [...planRecipesRucak, ...planRecipesVecera];

  const shoppingList =
    shoppingPlanRecipes.length > 0
      ? buildShoppingList(shoppingPlanRecipes, discounts)
      : null;

  const shoppingTotal = shoppingList
    ? DEPT_ORDER.flatMap((d) => shoppingList[d] || [])
        .reduce((sum, item) => sum + (item.totalPrice || 0), 0)
    : 0;

  const toggleChecked = (key) =>
    setCheckedItems((c) => ({ ...c, [key]: !c[key] }));

  const togglePlanRucak = (id) =>
    setPlanRucak((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const togglePlanVecera = (id) =>
    setPlanVecera((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const toggleExpandRucak = (id) => setExpandedRucak((e) => (e === id ? null : id));
  const toggleExpandVecera = (id) => setExpandedVecera((e) => (e === id ? null : id));

  const toggleExcluded = (tag) =>
    setExcluded((ex) => (ex.includes(tag) ? ex.filter((x) => x !== tag) : [...ex, tag]));

  function renderRecipeList(visibleRecipes, plan, togglePlan, expanded, toggleExpand, loading) {
    if (loading) {
      return (
        <div className="mp-loading" role="status" aria-live="polite">
          <span className="mp-spinner" aria-hidden="true" />
          <span className="mp-loading-text">Učitavamo recepte...</span>
        </div>
      );
    }
    if (visibleRecipes.length === 0) {
      return (
        <div className="mp-empty">
          Nema jela koja odgovaraju odabranim filterima. Pokušaj ukloniti neki filter iznad.
        </div>
      );
    }
    return (
      <div className="mp-recipes">
        {visibleRecipes.map((r) => {
          const inPlan = plan.includes(r.id);
          const isExpanded = expanded === r.id;
          return (
            <article className={`mp-recipe ${inPlan ? "in-plan" : ""}`} key={r.id}>
              <button className="mp-recipe-head" onClick={() => toggleExpand(r.id)}>
                <div>
                  <h3>{r.name}</h3>
                  <div className="mp-recipe-meta">
                    {r.time} · {r.servings} {servingWord(r.servings)}
                  </div>
                </div>
                <div className="mp-recipe-right">
                  <div className="mp-recipe-total">
                    <span className="mp-price">{fmt(r.total)}</span>
                    {r.akcijaCount > 0 && (
                      <span className="mp-akcija-pill">
                        <Tag size={11} />
                        {r.akcijaCount}×
                      </span>
                    )}
                  </div>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>
              {isExpanded && (
                <div className="mp-recipe-body">
                  <ul className="mp-ingredients">
                    {r.ingredients.map((ing, i) => (
                      <li key={i} className={ing.isAkcija ? "akcija" : ""}>
                        <span className="mp-ing-name">
                          {ing.isAkcija && <Tag size={12} />}
                          {ing.unit === 'g' ? Math.round(ing.quantity * 1000) + 'g' : ing.unit === 'ml' ? Math.round(ing.quantity * 1000) + 'ml' : Math.round(ing.quantity) + ' kom'}{ing.matched && <span className="mp-ing-package"> · kupi: {ing.matched.name} ({ing.matched.unit})</span>}
                        </span>
                        <span className="mp-ing-price">
                          {ing.matched && ing.isAkcija && <s>{fmt(ing.matched.old)}</s>}
                          {ing.matched && fmt(ing.matched.new)}
                          {fmt(ing.price)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <ol className="mp-steps">
                    {r.steps.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                </div>
              )}
              <button className="mp-add-btn" onClick={() => togglePlan(r.id)}>
                {inPlan ? (
                  <><Check size={14} /> U planu</>
                ) : (
                  <><Plus size={14} /> Dodaj u plan</>
                )}
              </button>
            </article>
          );
        })}
      </div>
    );
  }

  if (showPrivacy) {
    return <PrivacyPolicy onBack={() => setShowPrivacy(false)} />;
  }

  return (
    <div className="mp-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&family=Work+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

        .mp-root, .mp-root *, .mp-root *::before, .mp-root *::after {
          box-sizing: border-box;
        }
        .mp-root {
          --paper: #FAF6ED;
          --paper-2: #F1EADC;
          --ink: #2A2620;
          --ink-soft: #8C8273;
          --green: #2F5D43;
          --green-soft: #E1EAE3;
          --amber: #F0A93B;
          --amber-soft: #FDF3DC;
          --red: #C0463A;
          --line: #E2D8C4;
          font-family: 'Work Sans', sans-serif;
          background: var(--paper);
          color: var(--ink);
          min-height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .mp-root button {
          font-family: inherit;
          cursor: pointer;
        }
        .mp-root h1, .mp-root h3, .mp-root p, .mp-root ul, .mp-root ol {
          margin: 0;
          padding: 0;
        }

        /* ── Header ── */
        .mp-header {
          width: 100%;
          max-width: 480px;
          padding: 20px 20px 16px;
          position: sticky;
          top: 0;
          background: var(--paper);
          z-index: 10;
          border-bottom: 1px solid var(--line);
        }
        .mp-eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink-soft);
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .mp-eyebrow::before {
          content: '';
          width: 8px;
          height: 8px;
          background: var(--amber);
          display: inline-block;
        }
        .mp-title {
          font-family: 'Oswald', sans-serif;
          font-weight: 700;
          font-size: 24px;
          line-height: 1.2;
          text-transform: uppercase;
          letter-spacing: 0.01em;
          margin-bottom: 14px;
        }
        .mp-meal-row {
          display: flex;
          gap: 8px;
          margin-bottom: 14px;
        }
        .mp-meal-row button {
          flex: 1;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          padding: 9px 12px;
          border: 2px solid var(--ink);
          border-radius: 6px;
          background: transparent;
          color: var(--ink);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .mp-meal-row button.active {
          background: var(--ink);
          color: var(--paper);
        }
        .mp-field {
          margin-bottom: 10px;
        }
        .mp-field:last-child {
          margin-bottom: 0;
        }
        .mp-field-label {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-soft);
          margin-bottom: 6px;
        }
        .mp-store-row {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding: 2px 2px 4px;
        }
        .mp-store-row button {
          flex: 0 0 auto;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          padding: 8px 14px;
          border: 2px solid var(--ink);
          border-radius: 999px;
          background: transparent;
          color: var(--ink);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          white-space: nowrap;
        }
        .mp-store-row button.active {
          background: var(--ink);
          color: var(--paper);
        }
        .mp-budget-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .mp-budget-row input[type=range] {
          flex: 1;
          -webkit-appearance: none;
          appearance: none;
          height: 4px;
          background: var(--line);
          border-radius: 2px;
          outline: none;
        }
        .mp-budget-row input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--amber);
          border: 2px solid var(--ink);
          cursor: pointer;
        }
        .mp-budget-row input[type=range]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--amber);
          border: 2px solid var(--ink);
          cursor: pointer;
        }
        .mp-budget-row input[type=range]::-moz-range-track {
          background: var(--line);
          height: 4px;
          border-radius: 2px;
        }
        .mp-budget-value {
          font-family: 'Space Mono', monospace;
          font-weight: 700;
          font-size: 16px;
          min-width: 52px;
          text-align: right;
          flex-shrink: 0;
        }

        /* ── Main layout ── */
        .mp-main {
          width: 100%;
          max-width: 480px;
          padding: 20px 20px 110px;
        }
        .mp-section {
          margin-bottom: 28px;
        }
        .mp-section-label {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink-soft);
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .mp-section-label .mp-dot {
          width: 8px;
          height: 8px;
          background: var(--green);
          display: inline-block;
          flex-shrink: 0;
        }

        /* ── Meal columns (oboje mode) ── */
        /* Dva stupca (Ručak | Večera) na širim ekranima, jedan ispod drugog
           na mobilnom (< 600px). */
        .mp-meal-cols {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
          align-items: start;
        }
        .mp-meal-col {
          min-width: 0;
        }
        @media (max-width: 599px) {
          .mp-meal-cols {
            grid-template-columns: 1fr;
            gap: 0;
          }
          /* Razmak između Ručka i Večere kad su jedan ispod drugog. */
          .mp-meal-col + .mp-meal-col {
            margin-top: 32px;
          }
        }

        /* ── Meal dividers (oboje mode) ── */
        .mp-meal-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        .mp-recipes + .mp-meal-divider,
        .mp-empty + .mp-meal-divider {
          margin-top: 32px;
        }
        .mp-meal-divider-title {
          font-family: 'Oswald', sans-serif;
          font-size: 16px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          white-space: nowrap;
        }
        .mp-meal-divider-line {
          flex: 1;
          height: 2px;
          background: var(--line);
        }

        /* ── Diet chips ── */
        .mp-diet-row {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding: 2px 2px 6px;
        }
        .mp-diet-chip {
          flex: 0 0 auto;
          border: 1.5px solid var(--ink);
          border-radius: 999px;
          padding: 8px 14px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          background: var(--paper-2);
          color: var(--ink);
          white-space: nowrap;
        }
        .mp-diet-chip.active {
          background: var(--red);
          color: var(--paper);
          border-color: var(--red);
        }

        /* ── Discount tags ── */
        .mp-tags-row {
          display: flex;
          gap: 14px;
          overflow-x: auto;
          padding: 4px 4px 18px;
          scroll-snap-type: x proximity;
        }
        .mp-tag {
          flex: 0 0 auto;
          scroll-snap-align: start;
          background: var(--amber);
          color: var(--ink);
          width: 128px;
          padding: 14px 12px 12px;
          position: relative;
          border: 2px solid var(--ink);
          border-radius: 4px 16px 4px 4px;
        }
        .mp-tag:nth-child(odd) { transform: rotate(-1.5deg); }
        .mp-tag:nth-child(even) { transform: rotate(1.5deg); }
        .mp-tag-hole {
          position: absolute;
          top: 8px;
          right: 10px;
          width: 11px;
          height: 11px;
          background: var(--paper);
          border: 2px solid var(--ink);
          border-radius: 50%;
        }
        .mp-tag-name {
          font-weight: 700;
          font-size: 13px;
          line-height: 1.25;
          margin-bottom: 2px;
          padding-right: 16px;
        }
        .mp-tag-unit {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          color: rgba(42, 38, 32, 0.6);
          margin-bottom: 10px;
        }
        .mp-tag-prices {
          display: flex;
          align-items: baseline;
          gap: 6px;
          border-top: 2px dashed var(--ink);
          padding-top: 6px;
        }
        .mp-tag-old {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          text-decoration: line-through;
          opacity: 0.6;
        }
        .mp-tag-new {
          font-family: 'Oswald', sans-serif;
          font-size: 19px;
          font-weight: 700;
        }
        .mp-tag-badge {
          position: absolute;
          bottom: -10px;
          left: 10px;
          background: var(--ink);
          color: var(--paper);
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 2px;
        }

        /* ── Recipe cards ── */
        .mp-empty {
          background: var(--paper-2);
          border: 1px dashed var(--line);
          border-radius: 10px;
          padding: 24px 18px;
          text-align: center;
          font-size: 14px;
          color: var(--ink-soft);
          line-height: 1.5;
        }
        .mp-recipes {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .mp-recipe {
          background: var(--paper-2);
          border: 1px solid var(--line);
          border-radius: 10px;
          overflow: hidden;
        }
        .mp-recipe.in-plan { border-color: var(--green); }
        .mp-recipe-head {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: none;
          border: none;
          text-align: left;
          color: inherit;
        }
        .mp-recipe-head h3 {
          font-family: 'Oswald', sans-serif;
          font-size: 17px;
          text-transform: uppercase;
          letter-spacing: 0.01em;
          margin-bottom: 4px;
        }
        .mp-recipe-meta {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: var(--ink-soft);
        }
        .mp-recipe-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
          color: var(--ink-soft);
        }
        .mp-recipe-total {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }
        .mp-price {
          font-family: 'Oswald', sans-serif;
          font-size: 19px;
          font-weight: 700;
          color: var(--ink);
        }
        .mp-akcija-pill {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          background: var(--amber);
          color: var(--ink);
          padding: 2px 6px;
          border-radius: 999px;
        }
        .mp-recipe-body {
          padding: 0 16px 16px;
          border-top: 1px dashed var(--line);
        }
        .mp-ingredients {
          list-style: none;
          margin: 12px 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .mp-ingredients li {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 12px;
          font-size: 14px;
          padding: 4px 0;
        }
        .mp-ingredients li.akcija { color: #8A5A12; font-weight: 600; }
        .mp-ing-name {
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }
        .mp-ing-price {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          display: flex;
          gap: 6px;
          flex-shrink: 0;
        }
        .mp-ing-price s { opacity: 0.5; }
        .mp-steps {
          margin: 12px 0 4px;
          padding-left: 20px;
          font-size: 14px;
          line-height: 1.5;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .mp-add-btn {
          width: 100%;
          border: none;
          border-top: 1px solid var(--line);
          padding: 12px;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          background: var(--green-soft);
          color: var(--green);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .mp-recipe.in-plan .mp-add-btn {
          background: var(--green);
          color: var(--paper);
        }

        /* ── Shopping list ── */
        .mp-shop-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .mp-shop-total {
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          font-weight: 700;
          color: var(--ink);
        }
        .mp-shop-dept {
          margin-bottom: 6px;
        }
        .mp-shop-dept-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 0 8px;
        }
        .mp-shop-dept-name {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink-soft);
          white-space: nowrap;
        }
        .mp-shop-dept-line {
          flex: 1;
          height: 1px;
          background: var(--line);
        }
        .mp-shop-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 9px 0;
          border-bottom: 1px dashed var(--line);
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          user-select: none;
          transition: opacity 0.15s ease;
        }
        .mp-shop-item:last-child { border-bottom: none; }
        .mp-shop-check {
          width: 20px;
          height: 20px;
          border: 2px solid var(--ink);
          border-radius: 4px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 1px;
          color: var(--paper);
          transition: background 0.15s ease, border-color 0.15s ease;
        }
        .mp-shop-item.checked .mp-shop-check {
          background: var(--green);
          border-color: var(--green);
        }
        .mp-shop-item.checked .mp-shop-name {
          text-decoration: line-through;
          opacity: 0.4;
        }
        .mp-shop-item.checked .mp-shop-detail,
        .mp-shop-item.checked .mp-shop-price {
          opacity: 0.35;
        }
        .mp-shop-info {
          flex: 1;
          min-width: 0;
        }
        .mp-shop-name {
          font-weight: 600;
          font-size: 14px;
          line-height: 1.3;
          margin-bottom: 2px;
        }
        .mp-shop-detail {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          color: var(--ink-soft);
          line-height: 1.5;
        }
        .mp-shop-pkg {
          display: inline-block;
          background: var(--amber-soft);
          border: 1px solid rgba(240,169,59,0.4);
          border-radius: 3px;
          padding: 1px 5px;
          font-size: 10px;
          font-weight: 700;
          color: #7A5520;
          margin-left: 4px;
          vertical-align: middle;
        }
        .mp-shop-left {
          color: var(--green);
          font-weight: 700;
        }
        .mp-shop-price {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          font-weight: 700;
          text-align: right;
          flex-shrink: 0;
          padding-top: 2px;
          min-width: 52px;
        }
        .mp-shop-price.akcija { color: #7A5520; }

        /* ── Misc ── */
        .mp-note {
          font-size: 12px;
          color: var(--ink-soft);
          line-height: 1.5;
          padding-top: 4px;
          border-top: 1px dashed var(--line);
        }

        /* ── Bottom receipt ── */
        .mp-receipt {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          z-index: 20;
        }
        .mp-receipt-inner {
          position: relative;
          width: 100%;
          max-width: 480px;
          background: var(--paper-2);
          border-top: 1px solid var(--line);
          box-shadow: 0 -6px 18px rgba(42, 38, 32, 0.08);
        }
        .mp-receipt-inner::before {
          content: '';
          position: absolute;
          top: -7px;
          left: 0;
          right: 0;
          height: 14px;
          background: var(--paper-2);
          mask-image: radial-gradient(circle at 7px 7px, transparent 7px, black 7.5px);
          -webkit-mask-image: radial-gradient(circle at 7px 7px, transparent 7px, black 7.5px);
          mask-size: 14px 14px;
          -webkit-mask-size: 14px 14px;
          mask-repeat: repeat-x;
          -webkit-mask-repeat: repeat-x;
        }
        .mp-receipt-summary {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 20px;
        }
        .mp-receipt-text { flex: 1; min-width: 0; }
        .mp-receipt-label {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-soft);
          margin-bottom: 2px;
        }
        .mp-receipt-total {
          font-family: 'Oswald', sans-serif;
          font-size: 19px;
          font-weight: 700;
        }
        .mp-receipt-budget {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          color: var(--ink-soft);
          font-weight: 400;
        }
        .mp-receipt-bar {
          width: 70px;
          height: 6px;
          background: var(--line);
          border-radius: 999px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .mp-receipt-bar-fill {
          height: 100%;
          transition: width 0.3s ease;
        }
        .mp-receipt-toggle {
          flex-shrink: 0;
          color: var(--ink-soft);
          background: none;
          border: none;
          padding: 4px;
          display: flex;
        }
        .mp-receipt-items {
          list-style: none;
          margin: 0;
          padding: 0 20px 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 180px;
          overflow-y: auto;
        }
        .mp-receipt-items li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          gap: 10px;
        }
        .mp-receipt-empty {
          color: var(--ink-soft);
          font-family: 'Work Sans', sans-serif;
          text-align: center;
          padding: 8px 0;
          justify-content: center;
        }
        .mp-receipt-sublabel {
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-soft);
          justify-content: flex-start;
          padding-top: 4px;
        }
        .mp-receipt-remove {
          background: none;
          border: none;
          color: var(--red);
          font-family: 'Space Mono', monospace;
          font-size: 14px;
          font-weight: 700;
          padding: 0;
          line-height: 1;
        }

        @media (prefers-reduced-motion: reduce) {
          .mp-receipt-bar-fill { transition: none; }
          .mp-shop-item { transition: none; }
          .mp-shop-check { transition: none; }
        }

        /* ── LOADING SPINNER ── */
        .mp-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 56px 20px;
          text-align: center;
        }
        .mp-spinner {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 4px solid var(--amber-soft);
          border-top-color: var(--amber);
          animation: mp-spin 0.8s linear infinite;
        }
        .mp-loading-text {
          font-family: 'Oswald', sans-serif;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          font-size: 16px;
          color: var(--ink);
        }
        @keyframes mp-spin {
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .mp-spinner { animation-duration: 1.6s; }
        }

        /* ── FOOTER ── */
        .mp-footer {
          margin-top: 40px;
          padding: 24px 16px calc(96px + env(safe-area-inset-bottom, 0px));
          border-top: 1px solid var(--line);
        }
        .mp-footer-inner {
          max-width: 720px;
          margin: 0 auto;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          font-size: 13px;
          color: var(--ink-soft);
        }
        .mp-footer-link {
          background: none;
          border: none;
          padding: 0;
          font: inherit;
          font-weight: 600;
          color: var(--green);
          cursor: pointer;
        }
        .mp-footer-link:hover { text-decoration: underline; }

        /* ── COOKIE BANNER ── */
        .mp-cookie {
          position: fixed;
          left: 50%;
          transform: translateX(-50%);
          bottom: calc(16px + env(safe-area-inset-bottom, 0px));
          width: calc(100% - 24px);
          max-width: 560px;
          background: var(--ink);
          color: var(--paper);
          border-radius: 14px;
          padding: 16px 18px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px 16px;
          z-index: 100;
        }
        .mp-cookie-text {
          margin: 0;
          flex: 1 1 240px;
          font-size: 13.5px;
          line-height: 1.5;
        }
        .mp-cookie-inline {
          background: none;
          border: none;
          padding: 0;
          font: inherit;
          font-weight: 600;
          color: var(--amber);
          cursor: pointer;
          text-decoration: underline;
        }
        .mp-cookie-actions {
          display: flex;
          gap: 8px;
          flex: 0 0 auto;
        }
        .mp-cookie-btn {
          font: inherit;
          font-weight: 700;
          font-size: 13.5px;
          border-radius: 9px;
          padding: 9px 16px;
          cursor: pointer;
          border: 1px solid transparent;
        }
        .mp-cookie-accept {
          background: var(--amber);
          color: var(--ink);
        }
        .mp-cookie-accept:hover { filter: brightness(1.05); }
        .mp-cookie-decline {
          background: transparent;
          color: var(--paper);
          border-color: rgba(250, 246, 237, 0.35);
        }
        .mp-cookie-decline:hover { border-color: var(--paper); }
      `}</style>

      {/* ── HEADER ── */}
      <header className="mp-header">
        <div className="mp-eyebrow">Tjedni planer obroka</div>
        <h1 className="mp-title">Kuhaj štedljivo</h1>

        <div className="mp-meal-row">
          {MEAL_MODES.map((m) => (
            <button
              key={m.key}
              className={mealMode === m.key ? "active" : ""}
              onClick={() => setMealMode(m.key)}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="mp-field">
          <div className="mp-field-label">Dućan</div>
          <div className="mp-store-row">
            {STORES.map((s) => (
              <button
                key={s.key}
                className={store === s.key ? "active" : ""}
                onClick={() => setStore(s.key)}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {mealMode === "oboje" ? (
          <>
            <div className="mp-field">
              <div className="mp-field-label">Budžet — Ručak</div>
              <div className="mp-budget-row">
                <input
                  type="range" min={10} max={80} step={5}
                  value={budgetRucak}
                  onChange={(e) => setBudgetRucak(Number(e.target.value))}
                  aria-label="Budžet za ručak u eurima"
                />
                <span className="mp-budget-value">{budgetRucak} €</span>
              </div>
            </div>
            <div className="mp-field">
              <div className="mp-field-label">Budžet — Večera</div>
              <div className="mp-budget-row">
                <input
                  type="range" min={10} max={80} step={5}
                  value={budgetVecera}
                  onChange={(e) => setBudgetVecera(Number(e.target.value))}
                  aria-label="Budžet za večeru u eurima"
                />
                <span className="mp-budget-value">{budgetVecera} €</span>
              </div>
            </div>
          </>
        ) : (
          <div className="mp-field">
            <div className="mp-field-label">Tjedni budžet</div>
            <div className="mp-budget-row">
              <input
                type="range" min={15} max={100} step={5}
                value={mealMode === "vecera" ? budgetVecera : budgetRucak}
                onChange={(e) =>
                  mealMode === "vecera"
                    ? setBudgetVecera(Number(e.target.value))
                    : setBudgetRucak(Number(e.target.value))
                }
                aria-label="Tjedni budžet u eurima"
              />
              <span className="mp-budget-value">
                {mealMode === "vecera" ? budgetVecera : budgetRucak} €
              </span>
            </div>
          </div>
        )}
      </header>

      {/* ── MAIN ── */}
      <main className="mp-main">

        {/* Diet filters */}
        <section className="mp-section">
          <div className="mp-section-label">
            <span className="mp-dot" />
            Što ne jedeš?
          </div>
          <div className="mp-diet-row">
            {DIET_FILTERS.map((f) => (
              <button
                key={f.id}
                className={`mp-diet-chip ${excluded.includes(f.id) ? "active" : ""}`}
                onClick={() => toggleExcluded(f.id)}
                aria-pressed={excluded.includes(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </section>

        {/* Discounts */}
        <section className="mp-section">
          <div className="mp-section-label">
            <span className="mp-dot" />
            Akcije ovog tjedna — {storeName}
          </div>
          <div className="mp-tags-row">
            {discounts.map((d) => (
              <div className="mp-tag" key={d.id}>
                <span className="mp-tag-hole" />
                <div className="mp-tag-name">{d.name}</div>
                <div className="mp-tag-unit">{d.unit}</div>
                <div className="mp-tag-prices">
                  <span className="mp-tag-old">{fmt(d.old)}</span>
                  <span className="mp-tag-new">{fmt(d.new)}</span>
                </div>
                <div className="mp-tag-badge">
                  −{Math.round((1 - d.new / d.old) * 100)}%
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recipe lists */}
        <section className="mp-section">
          {mealMode === "oboje" ? (
            <div className="mp-meal-cols">
              <div className="mp-meal-col">
                <div className="mp-meal-divider">
                  <span className="mp-meal-divider-title">Ručak</span>
                  <span className="mp-meal-divider-line" />
                </div>
                {renderRecipeList(visibleRecipesRucak, planRucak, togglePlanRucak, expandedRucak, toggleExpandRucak, loadingRucak)}
              </div>
              <div className="mp-meal-col">
                <div className="mp-meal-divider">
                  <span className="mp-meal-divider-title">Večera</span>
                  <span className="mp-meal-divider-line" />
                </div>
                {renderRecipeList(visibleRecipesVecera, planVecera, togglePlanVecera, expandedVecera, toggleExpandVecera, loadingVecera)}
              </div>
            </div>
          ) : (
            <>
              <div className="mp-section-label">
                <span className="mp-dot" />
                Prijedlozi jela
              </div>
              {mealMode === "vecera"
                ? renderRecipeList(visibleRecipesVecera, planVecera, togglePlanVecera, expandedVecera, toggleExpandVecera, loadingVecera)
                : renderRecipeList(visibleRecipesRucak, planRucak, togglePlanRucak, expandedRucak, toggleExpandRucak, loadingRucak)
              }
            </>
          )}
        </section>

        {/* Shopping list */}
        {shoppingList && (
          <section className="mp-section">
            <div className="mp-shop-header">
              <div className="mp-section-label" style={{ margin: 0 }}>
                <span className="mp-dot" style={{ background: "var(--amber)" }} />
                <ShoppingCart size={14} style={{ marginLeft: 2, marginRight: -2 }} />
                Shopping lista
              </div>
              {shoppingTotal > 0 && (
                <span className="mp-shop-total">{fmt(shoppingTotal)}</span>
              )}
            </div>

            {DEPT_ORDER.map((dept) => {
              const items = shoppingList[dept];
              if (!items || items.length === 0) return null;
              return (
                <div className="mp-shop-dept" key={dept}>
                  <div className="mp-shop-dept-header">
                    <span className="mp-shop-dept-name">{dept}</span>
                    <span className="mp-shop-dept-line" />
                  </div>
                  {items.map((item) => {
                    const checked = !!checkedItems[item.key];
                    return (
                      <div
                        key={item.key}
                        className={`mp-shop-item ${checked ? "checked" : ""}`}
                        onClick={() => toggleChecked(item.key)}
                        role="checkbox"
                        aria-checked={checked}
                      >
                        <div className="mp-shop-check">
                          {checked && <Check size={12} strokeWidth={3} />}
                        </div>
                        <div className="mp-shop-info">
                          <div className="mp-shop-name">{item.productName}</div>
                          <div className="mp-shop-detail">
                            Trebaš {item.neededStr}
                            {item.hasPackage && (
                              <>
                                {" · "}
                                <span className="mp-shop-pkg">
                                  Kupi {item.packages}× {item.packageStr} (
                                  {item.packages > 1 ? `${item.packages}× ` : ""}
                                  {fmt(item.packagePrice)})
                                </span>
                                {item.leftoverStr && (
                                  <span className="mp-shop-left">
                                    {" · "}Ostaje {item.leftoverStr}
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                        {item.totalPrice !== null && (
                          <div className={`mp-shop-price ${item.hasAkcija ? "akcija" : ""}`}>
                            {fmt(item.totalPrice)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </section>
        )}

        <p className="mp-note">
          Napomena: cijene, akcije i recepti su primjer podataka radi prikaza koncepta — ne
          dolaze iz stvarnih kataloga navedenih dućana.
        </p>
      </main>

      {/* ── BOTTOM RECEIPT ── */}
      <div className="mp-receipt">
        <div className="mp-receipt-inner">
          <div className="mp-receipt-summary">
            <div className="mp-receipt-text">
              <div className="mp-receipt-label">Tjedni plan · {receiptCount} jela</div>
              <div
                className="mp-receipt-total"
                style={{ color: overBudget ? "var(--red)" : "var(--ink)" }}
              >
                {fmt(receiptTotal)}{" "}
                <span className="mp-receipt-budget">/ {fmt(receiptBudget)}</span>
              </div>
            </div>
            <div className="mp-receipt-bar">
              <div
                className="mp-receipt-bar-fill"
                style={{
                  width: `${progressPct}%`,
                  background: overBudget ? "var(--red)" : "var(--green)",
                }}
              />
            </div>
            <button
              className="mp-receipt-toggle"
              onClick={() => setReceiptOpen((o) => !o)}
              aria-label={receiptOpen ? "Sakrij stavke plana" : "Prikaži stavke plana"}
            >
              {receiptOpen ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </button>
          </div>

          {receiptOpen && (
            <ul className="mp-receipt-items">
              {mealMode === "oboje" ? (
                <>
                  {planRecipesRucak.length === 0 && planRecipesVecera.length === 0 && (
                    <li className="mp-receipt-empty">Plan je prazan — dodaj jelo iznad.</li>
                  )}
                  {planRecipesRucak.length > 0 && (
                    <li className="mp-receipt-sublabel">Ručak</li>
                  )}
                  {planRecipesRucak.map((r) => (
                    <li key={`rucak-${r.id}`}>
                      <span>{r.name}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {fmt(r.total)}
                        <button
                          className="mp-receipt-remove"
                          onClick={() => togglePlanRucak(r.id)}
                          aria-label={`Ukloni ${r.name} iz plana ručka`}
                        >×</button>
                      </span>
                    </li>
                  ))}
                  {planRecipesVecera.length > 0 && (
                    <li className="mp-receipt-sublabel">Večera</li>
                  )}
                  {planRecipesVecera.map((r) => (
                    <li key={`vecera-${r.id}`}>
                      <span>{r.name}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {fmt(r.total)}
                        <button
                          className="mp-receipt-remove"
                          onClick={() => togglePlanVecera(r.id)}
                          aria-label={`Ukloni ${r.name} iz plana večere`}
                        >×</button>
                      </span>
                    </li>
                  ))}
                </>
              ) : (
                <>
                  {(mealMode === "rucak" ? planRecipesRucak : planRecipesVecera).length === 0 && (
                    <li className="mp-receipt-empty">Plan je prazan — dodaj jelo iznad.</li>
                  )}
                  {(mealMode === "rucak" ? planRecipesRucak : planRecipesVecera).map((r) => (
                    <li key={r.id}>
                      <span>{r.name}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {fmt(r.total)}
                        <button
                          className="mp-receipt-remove"
                          onClick={() =>
                            mealMode === "rucak" ? togglePlanRucak(r.id) : togglePlanVecera(r.id)
                          }
                          aria-label={`Ukloni ${r.name} iz plana`}
                        >×</button>
                      </span>
                    </li>
                  ))}
                </>
              )}
            </ul>
          )}
        </div>
      </div>

      <footer className="mp-footer">
        <div className="mp-footer-inner">
          <span>© {new Date().getFullYear()} Kuhaj štedljivo · Čičak Bau d.o.o.</span>
          <button
            type="button"
            className="mp-footer-link"
            onClick={() => setShowPrivacy(true)}
          >
            Pravila privatnosti
          </button>
        </div>
      </footer>

      {cookieConsent === null && (
        <div className="mp-cookie" role="dialog" aria-label="Obavijest o kolačićima">
          <p className="mp-cookie-text">
            Koristimo samo nužne kolačiće za ispravan rad aplikacije. Više u{" "}
            <button
              type="button"
              className="mp-cookie-inline"
              onClick={() => setShowPrivacy(true)}
            >
              Pravilima privatnosti
            </button>
            .
          </p>
          <div className="mp-cookie-actions">
            <button
              type="button"
              className="mp-cookie-btn mp-cookie-decline"
              onClick={() => handleCookieChoice("declined")}
            >
              Odbijam
            </button>
            <button
              type="button"
              className="mp-cookie-btn mp-cookie-accept"
              onClick={() => handleCookieChoice("accepted")}
            >
              Prihvaćam
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
