import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const STORAGE_KEY = "cookie-consent";

export function CookieConsent() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  function respond(value: "accepted" | "rejected") {
    localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white shadow-xl border border-black/5 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="text-sm text-neutral-600 flex-1">
          {t("cookieConsent.message")}
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => respond("rejected")}
            className="px-5 py-2.5 rounded-full text-sm font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            {t("cookieConsent.reject")}
          </button>
          <button
            onClick={() => respond("accepted")}
            className="px-5 py-2.5 rounded-full text-sm font-semibold bg-brand text-white hover:bg-brand/90 transition-colors"
          >
            {t("cookieConsent.accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
