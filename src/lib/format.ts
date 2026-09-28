const peso = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" });
export const money = (v: unknown) => peso.format(Number(v ?? 0));
export const num = (v: unknown) => new Intl.NumberFormat("en-PH").format(Number(v ?? 0));
