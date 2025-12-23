interface Square {
  id: number;
  text: string;
  checked: boolean;
}

// Seeded RNG for reproducible cards
function mulberry32(seed: number) {
  return function () {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateCard(tropes: string[], seed?: number): Square[] {
  const rng = seed ? mulberry32(seed) : Math.random;

  const shuffled = [...tropes].sort(() => rng() - 0.5);
  const selected = shuffled.slice(0, 24);
  selected.splice(12, 0, "FREE SPACE");

  return selected.map((text, index) => ({
    id: index,
    text,
    checked: text === "FREE SPACE"
  }));
}
