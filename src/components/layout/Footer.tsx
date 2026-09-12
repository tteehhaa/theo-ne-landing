import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer>
      <div className="wrap">
        <p className="cols">
          <span className="wordmark">THÉONÉ</span>
          <span>
            {t('footer.legalName')} · {t('footer.ceo')} · {t('footer.regNo')}
          </span>
          <span>{t('footer.address')}</span>
        </p>
        <p className="legal">
          <span>{t('footer.disclaimer')}</span>
          <span>{t('footer.copyright')}</span>
        </p>
      </div>
    </footer>
  );
}
