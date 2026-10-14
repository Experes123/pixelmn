export type Demo = { slug: string; name: string; desc: string; tags: string[]; from: string; to: string; ink: string; font: string };
export const demos: Demo[] = [
  { slug: "code", name: "Code Example", desc: "Код жишээний сан: хайлт, хэлний шүүлтүүр, хуулах товч.", tags: ["Вэб сайт", "Админ"], from: "#0d1117", to: "#14532d", ink: "#4ade80", font: "ui-monospace, monospace" },
  { slug: "barber", name: "Barber & Co.", desc: "Үсчний цаг захиалгын систем: үйлчилгээ, мастер, цаг сонгох.", tags: ["Цаг захиалга", "Админ"], from: "#1a1410", to: "#8a6d3b", ink: "#e8c987", font: "Georgia, serif" },
  { slug: "company", name: "Northwind Group", desc: "Компанийн танилцуулга вэб: үйлчилгээ, баг, хүсэлт авах форм.", tags: ["Компанийн вэб", "Админ"], from: "#0b2545", to: "#13579a", ink: "#ffffff", font: "system-ui, sans-serif" },
  { slug: "restaurant", name: "Халуун Ширээ", desc: "Хоолны хүргэлтийн систем: цэс, сагс, хаяг, захиалгын төлөв.", tags: ["Хүргэлт", "Админ"], from: "#7f1d1d", to: "#ea580c", ink: "#fff7ed", font: "Georgia, serif" },
  { slug: "shop", name: "Мини Шоп", desc: "Онлайн дэлгүүр: бүтээгдэхүүн, сагс, төлбөр хийх алхам.", tags: ["Онлайн дэлгүүр", "Админ"], from: "#d9f99d", to: "#fef08a", ink: "#1a2e05", font: "system-ui, sans-serif" },
  { slug: "pccafe", name: "NEON ARENA", desc: "PC интернэт кафе: компьютер сонгож цаг захиалах систем.", tags: ["PC захиалга", "Админ"], from: "#1e1b4b", to: "#7e22ce", ink: "#22d3ee", font: "ui-monospace, monospace" },
  { slug: "stream", name: "分钟 · 1 Minute TV", desc: "Хятад 1 минутын богино видео стриминг платформ.", tags: ["Стриминг", "Админ"], from: "#450a0a", to: "#b91c1c", ink: "#fcd34d", font: "serif" },
];
export const PLACEHOLDERS = 5; // "Лого орлуулагч N" cards: Тун удахгүй
export const FEATURED_SLOTS = 12; // 3 x 4 grid
