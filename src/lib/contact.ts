export type ContactInput = { name: string; email: string; company: string; service: string; budget: string; message: string };
export type Errors = Partial<Record<keyof ContactInput, string>>;

export function validate(v: ContactInput): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Нэрээ оруулна уу.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "Зөв имэйл хаяг оруулна уу.";
  if (!v.service) e.service = "Үйлчилгээгээ сонгоно уу.";
  if (!v.budget) e.budget = "Төсвийн хүрээгээ сонгоно уу.";
  if (v.message.trim().length < 20) e.message = "Төслөө дор хаяж 20 тэмдэгтээр тайлбарлана уу.";
  if (v.message.length > 4000) e.message = "Тайлбараа 4000 тэмдэгтээс бага байлгана уу.";
  return e;
}
