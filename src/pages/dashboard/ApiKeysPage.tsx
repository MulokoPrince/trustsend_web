import { useState } from "react";
import { AlertCircle, Copy, KeyRound, Plus, Trash2 } from "lucide-react";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useTranslation } from "react-i18next";
import { useApiKeys, useCreateApiKey, useRevokeApiKey } from "../../hooks/useApiKeys";
import { formatDateTime } from "../../lib/format";
import { SANDBOX_API_BASE_URL, isSandbox } from "../../lib/domains";

export function ApiKeysPage() {
  const { t } = useTranslation();
  const keys = useApiKeys();
  const create = useCreateApiKey();
  const revoke = useRevokeApiKey();
  const [copied, setCopied] = useState(false);

  const copyKey = () => {
    if (!create.data) return;
    navigator.clipboard.writeText(create.data.api_key).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">{t("dashboard.apiKeys.title")}</h1>
          <p className="mt-1 text-muted">
            {t("dashboard.apiKeys.subtitle")}
          </p>
        </div>
        <button
          onClick={() => create.mutate()}
          disabled={create.isPending}
          className="inline-flex items-center gap-2 rounded bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
        >
          <Plus size={16} />
          {create.isPending ? t("dashboard.apiKeys.generating") : t("dashboard.apiKeys.generate")}
        </button>
      </div>

      {isSandbox && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm">
          <p className="font-semibold text-amber-800">{t("dashboard.apiKeys.sandboxTitle")}</p>
          <p className="mt-1 text-amber-800/80">{t("dashboard.apiKeys.sandboxDesc")}</p>
          <code className="mt-3 block truncate rounded border border-amber-200 bg-white px-3.5 py-2.5 text-ink">
            {SANDBOX_API_BASE_URL}
          </code>
        </div>
      )}

      {create.isSuccess && create.data && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm font-semibold text-amber-800">
            {t("dashboard.apiKeys.copyNotice")}
          </p>
          <div className="mt-3 flex items-center gap-2 rounded border border-amber-200 bg-white px-3.5 py-2.5">
            <code className="flex-1 truncate text-sm text-ink">{create.data.api_key}</code>
            <button
              onClick={copyKey}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              <Copy size={13} />
              {copied ? t("dashboard.apiKeys.copied") : t("dashboard.apiKeys.copy")}
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-surface-2 bg-white">
        {keys.isLoading ? (
          <LoadingSpinner label={t("dashboard.apiKeys.loading")} />
        ) : keys.isError ? (
          <p className="flex items-center gap-1.5 px-5 py-8 text-sm text-red-600">
            <AlertCircle size={15} /> {t("dashboard.apiKeys.error")}
          </p>
        ) : keys.data && keys.data.length > 0 ? (
          <ul className="divide-y divide-surface-2">
            {keys.data.map((k) => (
              <li key={k.id} className="flex items-center gap-4 px-5 py-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-light text-brand">
                  <KeyRound size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-sm font-semibold text-ink">
                    {k.key_prefix}…
                  </p>
                  <p className="text-xs text-muted">
                    {t("dashboard.apiKeys.createdOn", { date: formatDateTime(k.created_at) })}
                    {k.last_used_at &&
                      t("dashboard.apiKeys.usedOn", { date: formatDateTime(k.last_used_at) })}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    k.status === "active"
                      ? "bg-accent-light text-accent"
                      : "bg-surface text-muted-2"
                  }`}
                >
                  {k.status}
                </span>
                {k.status === "active" && (
                  <button
                    onClick={() => revoke.mutate(k.id)}
                    disabled={revoke.isPending}
                    aria-label={t("dashboard.apiKeys.revoke")}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-muted-2 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-5 py-8 text-sm text-muted">{t("dashboard.apiKeys.none")}</p>
        )}
      </div>
    </div>
  );
}
