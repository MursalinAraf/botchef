import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggle = () => {
    i18n.changeLanguage(i18n.language === "en" ? "bn" : "en");
  };

  return (
    <button
      onClick={toggle}
      className="text-sm font-medium px-3 py-1.5 rounded-lg border border-gray-200 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
    >
      {i18n.language === "en" ? "বাংলা" : "English"}
    </button>
  );
}
