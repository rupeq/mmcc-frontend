import { format as dateFnsFormat } from "date-fns";
import { enUS, ru } from "date-fns/locale";

import i18n from "./index";

const locales = {
  en: enUS,
  ru: ru,
};

export const format = (date: Date | number, formatStr: string): string => {
  const currentLocale = locales[i18n.language as keyof typeof locales] || enUS;
  return dateFnsFormat(date, formatStr, { locale: currentLocale });
};
