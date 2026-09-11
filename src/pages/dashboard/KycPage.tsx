import { useState, type FormEvent, type ReactNode } from "react";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock3,
  FileText,
  Home,
  IdCard,
  Loader2,
  ScanFace,
  ShieldCheck,
  UploadCloud,
  X,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useKycStatus, useSubmitKyc } from "../../hooks/useKyc";
import { ApiError } from "../../lib/api";
import { formatDateTime } from "../../lib/format";
import type { KycDocumentField, KycVerificationType } from "../../types/dashboard";
import "../../styles/geist.css";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png"];

const inputClasses =
  "w-full rounded-md border border-surface-2 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-shadow duration-150 placeholder:text-muted-2 hover:border-ink/20 focus:border-ink focus:ring-4 focus:ring-ink/[0.08]";

const VERIFICATION_TYPES: KycVerificationType[] = [
  "document",
  "identity",
  "address",
  "liveness",
  "pep_screening",
];

const IDENTITY_METHODS = ["passport", "id_card", "driver_license", "representative_id"] as const;
type IdentityMethod = (typeof IDENTITY_METHODS)[number];

const IDENTITY_METHOD_FIELDS: Record<IdentityMethod, KycDocumentField[]> = {
  passport: ["passport"],
  id_card: ["id_card_front", "id_card_back"],
  driver_license: ["driver_license_front", "driver_license_back"],
  representative_id: ["representative_id_front", "representative_id_back"],
};

const DOCUMENT_METHODS = ["business_registration_certificate", "tax_identification_certificate"] as const;
type DocumentMethod = (typeof DOCUMENT_METHODS)[number];

const STATUS_VISUAL: Record<string, { icon: LucideIcon; className: string }> = {
  pending: { icon: Clock3, className: "text-amber-600" },
  approved: { icon: CheckCircle2, className: "text-accent" },
  rejected: { icon: XCircle, className: "text-red-600" },
};

// Icône représentative par type de document, plutôt qu'un pictogramme
// générique répété pour chaque pièce.
function documentIcon(doc: string) {
  if (doc === "selfie") return ScanFace;
  if (doc === "proof_of_address") return Home;
  if (doc === "business_registration_certificate" || doc === "tax_identification_certificate") return Building2;
  if (
    doc.startsWith("id_card") ||
    doc === "passport" ||
    doc.startsWith("driver_license") ||
    doc.startsWith("representative_id")
  ) {
    return IdCard;
  }
  return FileText;
}

type FormState = {
  verification_type: KycVerificationType;
  provider: string;
  identityMethod: IdentityMethod;
  documentMethod: DocumentMethod;
  files: Partial<Record<KycDocumentField, File>>;
};

function requiredFields(form: FormState): KycDocumentField[] {
  switch (form.verification_type) {
    case "identity":
      return IDENTITY_METHOD_FIELDS[form.identityMethod];
    case "address":
      return ["proof_of_address"];
    case "liveness":
      return ["selfie"];
    case "document":
      return [form.documentMethod];
    case "pep_screening":
      return [];
  }
}

function validateFile(file: File): string | null {
  const ext = `.${file.name.split(".").pop()?.toLowerCase()}`;
  if (!ACCEPTED_EXTENSIONS.includes(ext)) return "invalidType";
  if (file.size > MAX_FILE_SIZE) return "tooLarge";
  return null;
}

function FileField({
  id,
  label,
  file,
  error,
  onChange,
}: {
  id: string;
  label: string;
  file: File | null;
  error: string | null;
  onChange: (file: File | null) => void;
}) {
  const { t } = useTranslation();
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-ink">
        {label}
      </label>
      <label
        htmlFor={id}
        className={`flex cursor-pointer items-center gap-3 rounded-md border border-dashed px-3.5 py-3 text-sm transition-colors ${
          error
            ? "border-red-300 bg-red-50 text-red-700"
            : file
              ? "border-brand/30 bg-brand-light/40 text-ink"
              : "border-surface-2 text-muted hover:border-ink/20"
        }`}
      >
        <UploadCloud size={16} className={error ? "text-red-500" : file ? "text-brand" : "text-muted-2"} />
        <span className="min-w-0 flex-1 truncate">
          {file ? file.name : t("dashboard.kyc.chooseFile")}
        </span>
        {file && !error && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onChange(null);
            }}
            aria-label={t("dashboard.kyc.removeFile")}
            className="shrink-0 rounded p-0.5 text-muted-2 transition-colors hover:bg-white hover:text-ink"
          >
            <X size={14} />
          </button>
        )}
      </label>
      <input
        id={id}
        type="file"
        accept={ACCEPTED_EXTENSIONS.join(",")}
        className="sr-only"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
      {error && <p className="mt-1 text-xs text-red-600">{t(`dashboard.kyc.fileError.${error}`)}</p>}
    </div>
  );
}

function MethodPicker<T extends string>({
  options,
  value,
  onChange,
  labelFor,
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  labelFor: (option: T) => string;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
            value === option
              ? "border-brand bg-brand-light text-brand"
              : "border-surface-2 text-muted hover:border-ink/20"
          }`}
        >
          {labelFor(option)}
        </button>
      ))}
    </div>
  );
}

export function KycPage() {
  const { t } = useTranslation();
  const kyc = useKycStatus();
  const submitKyc = useSubmitKyc();
  const [form, setForm] = useState<FormState>({
    verification_type: "document",
    provider: "",
    identityMethod: "id_card",
    documentMethod: "business_registration_certificate",
    files: {},
  });
  const [fileErrors, setFileErrors] = useState<Partial<Record<KycDocumentField, string>>>({});

  const setFile = (field: KycDocumentField, file: File | null) => {
    if (file) {
      const error = validateFile(file);
      setFileErrors((e) => ({ ...e, [field]: error ?? undefined }));
      if (error) return;
    } else {
      setFileErrors((e) => ({ ...e, [field]: undefined }));
    }
    setForm((f) => {
      const files = { ...f.files };
      if (file) files[field] = file;
      else delete files[field];
      return { ...f, files };
    });
  };

  const changeVerificationType = (verification_type: KycVerificationType) => {
    setForm((f) => ({ ...f, verification_type, files: {} }));
    setFileErrors({});
  };

  const changeIdentityMethod = (identityMethod: IdentityMethod) => {
    setForm((f) => ({ ...f, identityMethod, files: {} }));
    setFileErrors({});
  };

  const changeDocumentMethod = (documentMethod: DocumentMethod) => {
    setForm((f) => ({ ...f, documentMethod, files: {} }));
    setFileErrors({});
  };

  const fields = requiredFields(form);
  const hasFileErrors = Object.values(fileErrors).some(Boolean);
  const canSubmit = fields.every((field) => form.files[field]) && !hasFileErrors;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    const documents: Partial<Record<KycDocumentField, File>> = {};
    for (const field of fields) {
      if (form.files[field]) documents[field] = form.files[field]!;
    }
    submitKyc.mutate({
      verification_type: form.verification_type,
      provider: form.provider || undefined,
      documents,
    });
  };

  if (kyc.isLoading) {
    return (
      <p className="flex items-center gap-2 text-sm text-muted">
        <Loader2 size={16} className="animate-spin" /> {t("dashboard.loading")}
      </p>
    );
  }

  if (kyc.isError || !kyc.data) {
    return (
      <p className="flex items-center gap-1.5 text-sm text-red-600">
        <AlertCircle size={15} /> {t("dashboard.kyc.error")}
      </p>
    );
  }

  const record = kyc.data.status !== "not_started" ? kyc.data : null;
  const canSubmitNew = kyc.data.status === "not_started" || kyc.data.status === "rejected";

  let fileSection: ReactNode = null;
  if (form.verification_type === "identity") {
    const activeFields = IDENTITY_METHOD_FIELDS[form.identityMethod];
    fileSection = (
      <div className="space-y-3">
        <p className="text-sm font-medium text-ink">{t("dashboard.kyc.identityMethodLabel")}</p>
        <MethodPicker
          options={IDENTITY_METHODS}
          value={form.identityMethod}
          onChange={changeIdentityMethod}
          labelFor={(m) => t(`dashboard.kyc.identityMethod.${m}`)}
        />
        <div className={activeFields.length > 1 ? "grid gap-3 sm:grid-cols-2" : ""}>
          {activeFields.map((field) => (
            <FileField
              key={field}
              id={field}
              label={t(`dashboard.kyc.document.${field}`)}
              file={form.files[field] ?? null}
              error={fileErrors[field] ?? null}
              onChange={(file) => setFile(field, file)}
            />
          ))}
        </div>
      </div>
    );
  } else if (form.verification_type === "address") {
    fileSection = (
      <FileField
        id="proof_of_address"
        label={t("dashboard.kyc.document.proof_of_address")}
        file={form.files.proof_of_address ?? null}
        error={fileErrors.proof_of_address ?? null}
        onChange={(file) => setFile("proof_of_address", file)}
      />
    );
  } else if (form.verification_type === "liveness") {
    fileSection = (
      <FileField
        id="selfie"
        label={t("dashboard.kyc.document.selfie")}
        file={form.files.selfie ?? null}
        error={fileErrors.selfie ?? null}
        onChange={(file) => setFile("selfie", file)}
      />
    );
  } else if (form.verification_type === "document") {
    fileSection = (
      <div className="space-y-3">
        <p className="text-sm font-medium text-ink">{t("dashboard.kyc.documentMethodLabel")}</p>
        <MethodPicker
          options={DOCUMENT_METHODS}
          value={form.documentMethod}
          onChange={changeDocumentMethod}
          labelFor={(m) => t(`dashboard.kyc.document.${m}`)}
        />
        <FileField
          id={form.documentMethod}
          label={t(`dashboard.kyc.document.${form.documentMethod}`)}
          file={form.files[form.documentMethod] ?? null}
          error={fileErrors[form.documentMethod] ?? null}
          onChange={(file) => setFile(form.documentMethod, file)}
        />
      </div>
    );
  } else {
    fileSection = <p className="text-sm text-muted">{t("dashboard.kyc.pepScreeningHint")}</p>;
  }

  return (
    <div className="font-geist max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-ink">{t("dashboard.kyc.title")}</h1>
      <p className="mt-1 text-muted">{t("dashboard.kyc.subtitle")}</p>

      {record && (
        <section className="mt-6 rounded-2xl border border-surface-2 bg-white p-6 lg:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              {(() => {
                const Icon = STATUS_VISUAL[record.status]?.icon ?? ShieldCheck;
                return (
                  <Icon
                    size={19}
                    className={`mt-0.5 shrink-0 ${STATUS_VISUAL[record.status]?.className ?? "text-muted-2"}`}
                  />
                );
              })()}
              <div>
                <h2 className="font-display text-base font-bold text-ink">
                  {t(`dashboard.kyc.status.${record.status}`)}
                </h2>
                <p className="mt-0.5 text-sm text-muted">
                  {t(`dashboard.kyc.verificationType.${record.verification_type}`, {
                    defaultValue: record.verification_type,
                  })}
                  {record.provider ? ` · ${record.provider}` : ""}
                </p>
              </div>
            </div>
            <span className="text-xs text-muted-2">
              {t("dashboard.kyc.submittedOn", { date: formatDateTime(record.submitted_at) })}
            </span>
          </div>

          {record.documents.length > 0 && (
            <ul className="mt-5 space-y-2.5 border-t border-surface-2 pt-5">
              {record.documents.map((doc) => {
                const DocIcon = documentIcon(doc);
                return (
                  <li key={doc} className="flex items-center gap-2.5 text-sm text-ink">
                    <DocIcon size={16} className="shrink-0 text-muted-2" />
                    {t(`dashboard.kyc.document.${doc}`, { defaultValue: doc })}
                  </li>
                );
              })}
            </ul>
          )}

          {record.status === "rejected" && record.decision_reason && (
            <p className="mt-5 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              {record.decision_reason}
            </p>
          )}

          {record.status === "pending" && (
            <p className="mt-5 text-sm text-muted">{t("dashboard.kyc.pendingHint")}</p>
          )}

          {record.status === "approved" && record.decided_at && (
            <p className="mt-5 text-sm text-muted">
              {t("dashboard.kyc.approvedOn", { date: formatDateTime(record.decided_at) })}
            </p>
          )}
        </section>
      )}

      {canSubmitNew && (
        <section className="mt-6 rounded-2xl border border-surface-2 bg-white p-6 lg:p-7">
          <div className="flex items-start gap-3">
            <FileText size={19} className="mt-0.5 shrink-0 text-brand" />
            <div>
              <h2 className="font-display text-base font-bold text-ink">
                {record ? t("dashboard.kyc.resubmitTitle") : t("dashboard.kyc.submitTitle")}
              </h2>
              <p className="mt-0.5 text-sm text-muted">{t("dashboard.kyc.submitDesc")}</p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="verification_type"
                className="mb-2 block text-sm font-medium text-ink"
              >
                {t("dashboard.kyc.verificationTypeLabel")}
              </label>
              <select
                id="verification_type"
                value={form.verification_type}
                onChange={(e) => changeVerificationType(e.target.value as KycVerificationType)}
                className={inputClasses}
              >
                {VERIFICATION_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {t(`dashboard.kyc.verificationType.${type}`)}
                  </option>
                ))}
              </select>
            </div>

            {fileSection}

            <div>
              <label htmlFor="provider" className="mb-2 block text-sm font-medium text-ink">
                {t("dashboard.kyc.providerLabel")}{" "}
                <span className="font-normal text-muted">{t("dashboard.kyc.providerOptional")}</span>
              </label>
              <input
                id="provider"
                type="text"
                value={form.provider}
                onChange={(e) => setForm((f) => ({ ...f, provider: e.target.value }))}
                placeholder={t("dashboard.kyc.providerPlaceholder")}
                className={inputClasses}
              />
            </div>

            {submitKyc.isError && (
              <p className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
                <AlertCircle size={15} className="shrink-0" />
                {submitKyc.error instanceof ApiError
                  ? submitKyc.error.message
                  : t("dashboard.kyc.submitError")}
              </p>
            )}

            <button
              type="submit"
              disabled={submitKyc.isPending || !canSubmit}
              className="inline-flex items-center gap-2 rounded bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitKyc.isPending && <Loader2 size={14} className="animate-spin" />}
              {submitKyc.isPending ? t("dashboard.kyc.submitting") : t("dashboard.kyc.submit")}
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
