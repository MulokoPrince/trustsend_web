import { useTranslation } from "react-i18next";
import * as fr from "../data/content.fr";
import * as en from "../data/content.en";

export function useContent() {
  const { i18n } = useTranslation();
  return i18n.language.startsWith("en") ? en : fr;
}
