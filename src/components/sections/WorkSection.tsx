import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LINKS } from "@site";
import { useReveal } from "@/hooks/use-reveal";

interface FaqItem {
  q: string;
  a: string;
}

/**
 * The two axes of the business as a pair of cards — soft for the work done
 * by hand, dark for the software — and the line that runs from one to the
 * other.
 *
 * The entrance is React state rather than a class toggled straight onto the
 * node, so a re-render can never drop it. Without JS (every AI crawler) the
 * CSS is not gated on `.js` and the cards render in their resting state.
 */
export default function WorkSection() {
  const { t } = useTranslation();
  const { ref: stageRef, go } = useReveal<HTMLDivElement>(0.2);

  const support = t('work.support.items', { returnObjects: true }) as string[];
  const software = t('work.software.items', { returnObjects: true }) as string[];
  const faq = t('faq.items', { returnObjects: true }) as FaqItem[];

  // A cobalt glow inside the dark card follows the pointer — the brand colour
  // used as light, not as paint. Pointer-only; touch devices never see it.
  useEffect(() => {
    const card = stageRef.current?.querySelector<HTMLElement>('.axis-r');
    if (!card) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const onMove = (e: PointerEvent) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', e.clientX - r.left + 'px');
      card.style.setProperty('--my', e.clientY - r.top + 'px');
    };
    card.addEventListener('pointermove', onMove);
    return () => card.removeEventListener('pointermove', onMove);
  }, [stageRef]);

  return (
    <section id="work" className="work" aria-labelledby="work-h">
      <div className="section-head">
        <h2 id="work-h" className="t-display">{t('work.heading')}</h2>
        {/* "Who uses it" is the third FAQ answer, verbatim. */}
        <p className="section-lede t-subtitle">{faq[2].a}</p>
      </div>
      <div className={go ? 'stage go' : 'stage'} ref={stageRef}>
        <div className="axes">
          <div className="axis axis-l">
            <div className="axis-head">
              <p className="axis-name t-title">{t('work.support.name')}</p>
            </div>
            <ul className="items">
              {support.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="axis-act">
              <a className="btn btn-primary" href="#contact">{t('work.support.cta')}</a>
            </p>
          </div>
          <div className="axis axis-r on-dark">
            <div className="axis-head">
              <p className="axis-name t-title">{t('work.software.name')}</p>
              <a className="mini-plate" href={LINKS.teheranroai} title="Teheranro AI Studio">
                <span>
                  <b>테헤란로 AI 스튜디오</b>
                  <i>Teheranro AI Studio</i>
                </span>
              </a>
            </div>
            <ul className="items">
              {software.map((item) =>
                item === 'TROPS' ? (
                  <li key={item} id="row-trops">
                    <a className="row-link" href={LINKS.trops}>{item}</a>
                    <span className="badge badge-live">{t('work.stage.live')}</span>
                  </li>
                ) : (
                  <li key={item}>
                    <span>{item}</span>
                    <span className="badge badge-building">{t('work.stage.building')}</span>
                  </li>
                )
              )}
            </ul>
            <p className="axis-act">
              <a className="btn btn-secondary" href={LINKS.teheranroai}>{t('work.software.cta')}</a>
            </p>
          </div>
        </div>
        <div className="bridge">
          <span className="tag">{t('work.bridgeTag')}</span>
          <span className="line" aria-hidden="true" />
          <p className="bridge-label">{t('work.bridgeLabel')}</p>
        </div>
      </div>
    </section>
  );
}
