import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

export function AskAssistant() {
  const { t } = useTranslation();
  return (
    <button className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-ink text-white text-sm font-semibold pl-3 pr-4 py-3 shadow-pop hover:bg-black transition-colors">
      <Sparkles size={16} className="text-accent-light" />
      {t("askAssistant.label")}
    </button>
  );
}
