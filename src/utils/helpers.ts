export function toDateInputValue(d?: string | null) {
  if (!d) return "";
  const dt = new Date(d);
  const iso = new Date(
    dt.getTime() - dt.getTimezoneOffset() * 60000
  ).toISOString();
  return iso.split("T")[0];
}

export function formatInr(n: number | undefined | null) {
  if (n == null) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function parseToDate(input: unknown): Date | null {
  if (input == null) return null;
  // Accept number (seconds or ms) or string
  if (typeof input === "number") {
    const ms = input < 1_000_000_000_000 ? input * 1000 : input;
    return new Date(ms);
  }
  if (typeof input === "string") {
    const num = Number(input);
    if (!Number.isNaN(num)) {
      const ms = num < 1_000_000_000_000 ? num * 1000 : num;
      return new Date(ms);
    }
    const d = new Date(input);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  try {
    const d = new Date(String(input));
    return Number.isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
}

export function formatDate(input: unknown): string {
  const d = parseToDate(input);
  if (!d) return "-";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
