import { useTranslation } from "react-i18next";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { supportedLanguages } from "@/lib/i18n/configuration";

const languageNames: Record<string, string> = {
  en: "English",
  ru: "Русский",
};

const languageFlags: Record<string, string> = {
  en: "🇬🇧",
  ru: "🇷🇺",
};

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (newLanguage: string) => {
    i18n.changeLanguage(newLanguage);
  };

  return (
    <Select value={i18n.language} onValueChange={handleLanguageChange}>
      <SelectTrigger size="sm" className="w-full cursor-pointer">
        <SelectValue>
          <span className="flex items-center gap-2">
            <span>{languageFlags[i18n.language]}</span>
            <span>{languageNames[i18n.language]}</span>
          </span>
        </SelectValue>
      </SelectTrigger>

      <SelectContent>
        {supportedLanguages.map((lang) => (
          <SelectItem key={lang} value={lang} className="cursor-pointer">
            <span className="flex items-center gap-2">
              <span>{languageFlags[lang]}</span>
              <span>{languageNames[lang]}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
