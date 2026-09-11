import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AlertCircle, ArrowLeft, CreditCard } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useWallets } from "../../hooks/useWallets";
import { useCreateCard, cardErrorMessage } from "../../hooks/useCards";
import { PinModal } from "../../components/dashboard/PinModal";
import { formatMinorUnits } from "../../lib/format";

const inputClasses =
  "w-full rounded-md border border-surface-2 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-shadow duration-150 placeholder:text-muted-2 focus:border-ink focus:ring-4 focus:ring-ink/[0.08] disabled:cursor-not-allowed disabled:bg-surface disabled:opacity-60";

function newIdempotencyKey() {
  return crypto.randomUUID();
}

export function CreateCardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const wallets = useWallets();
  const create = useCreateCard();

  // Cards are USD-only (see card_service.ts createCard()).
  const usdWallets = (wallets.data ?? []).filter(
    (w) => w.currency_code === "USD" && w.status === "active",
  );

  const [walletId, setWalletId] = useState("");
  const [brand, setBrand] = useState<"VISA" | "MASTERCARD">("VISA");
  const [amount, setAmount] = useState("");
  const [idempotencyKey, setIdempotencyKey] = useState(newIdempotencyKey);
  const [pinModalOpen, setPinModalOpen] = useState(false);

  const selectedWallet = usdWallets.find((w) => String(w.id) === walletId);
  const minorAmount = amount ? Math.round(Number(amount) * 100) : null;
  const insufficientBalance =
    !!selectedWallet && minorAmount !== null && minorAmount > Number(selectedWallet.balance);
  const canSubmit = !!walletId && minorAmount !== null && minorAmount > 0 && !insufficientBalance;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setPinModalOpen(true);
  };

  const confirmWithPin = (pin: string) => {
    if (minorAmount === null) return;
    create.mutate(
      {
        wallet_id: Number(walletId),
        brand,
        amount: String(minorAmount),
        pin,
        idempotency_key: idempotencyKey,
      },
      {
        onSuccess: (card) => {
          setPinModalOpen(false);
          navigate(`/dashboard/cards/${card.id}`);
        },
      },
    );
  };

  const closePinModal = () => {
    setPinModalOpen(false);
    if (create.isError) {
      create.reset();
      setIdempotencyKey(newIdempotencyKey());
    }
  };

  return (
    <div className="max-w-xl">
      <Link
        to="/dashboard/cards"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-2 transition-colors hover:text-ink"
      >
        <ArrowLeft size={15} />
        {t("dashboard.createCard.back")}
      </Link>

      <h1 className="mt-3 font-display text-2xl font-bold text-ink">{t("dashboard.createCard.title")}</h1>
      <p className="mt-1 text-muted">{t("dashboard.createCard.subtitle")}</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-2xl border border-surface-2 bg-white p-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-ink" htmlFor="wallet">
            {t("dashboard.createCard.wallet")}
          </label>
          {usdWallets.length === 0 ? (
            <p className="flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-sm text-amber-800">
              <AlertCircle size={15} className="shrink-0" />
              {t("dashboard.createCard.noUsdWallet")}
            </p>
          ) : (
            <select
              id="wallet"
              required
              value={walletId}
              onChange={(e) => setWalletId(e.target.value)}
              className={inputClasses}
            >
              <option value="">{t("dashboard.createCard.walletPlaceholder")}</option>
              {usdWallets.map((w) => (
                <option key={w.id} value={w.id}>
                  USD · {formatMinorUnits(w.balance, w.currency_code)}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-ink" htmlFor="brand">
            {t("dashboard.createCard.brand")}
          </label>
          <select
            id="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value as "VISA" | "MASTERCARD")}
            className={inputClasses}
          >
            <option value="VISA">VISA</option>
            <option value="MASTERCARD">MASTERCARD</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-ink" htmlFor="amount">
            {t("dashboard.createCard.amount")}
          </label>
          <input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            required
            value={amount}
            onInput={(e) => setAmount(e.currentTarget.value)}
            placeholder="100"
            className={inputClasses}
          />
          {selectedWallet && (
            <p className={`mt-1 text-xs ${insufficientBalance ? "text-red-600" : "text-muted"}`}>
              {t("dashboard.createCard.availableBalance", {
                balance: formatMinorUnits(selectedWallet.balance, selectedWallet.currency_code),
              })}
            </p>
          )}
        </div>

        {create.isError && !pinModalOpen && (
          <p className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
            <AlertCircle size={15} />
            {cardErrorMessage(create.error, t)}
          </p>
        )}

        <button
          type="submit"
          disabled={!canSubmit || create.isPending}
          className="flex w-full items-center justify-center gap-2 rounded bg-brand px-6 py-3.5 font-semibold text-white shadow-soft transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          <CreditCard size={16} />
          {create.isPending ? t("dashboard.createCard.submitting") : t("dashboard.createCard.submit")}
        </button>
      </form>

      <PinModal
        open={pinModalOpen}
        onClose={closePinModal}
        onConfirm={confirmWithPin}
        loading={create.isPending}
        error={create.isError ? cardErrorMessage(create.error, t) : null}
      />
    </div>
  );
}
