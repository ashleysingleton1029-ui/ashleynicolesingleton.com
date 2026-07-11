import { about } from '@/lib/content';
import RevealHeading from './RevealHeading';
import Reveal from './Reveal';
import Parallax from './Parallax';
import Plate from './Plate';

export default function About() {
  return (
    <section className="section about" id="about">
      <div className="container about__grid">
        <div className="about__media">
          <Parallax className="about__plate">
            <Plate index="A" tone="ink" label="Studio" ratio="4 / 5.4" parallax />
          </Parallax>
          <Reveal className="about__stats" stagger={0.12}>
            {about.stats.map((s) => (
              <div className="stat" key={s.label}>
                <span className="stat__value">{s.value}</span>
                <span className="stat__label eyebrow">{s.label}</span>
              </div>
            ))}
          </Reveal>
        </div>

        <div className="about__text">
          <span className="eyebrow eyebrow--accent">{about.eyebrow}</span>
          <RevealHeading
            as="h2"
            className="about__heading h-display"
            lines={about.headingLines}
          />
          <Reveal>
            <p className="about__lead" data-dropcap>{about.lead}</p>
          </Reveal>
          <Reveal className="about__body" stagger={0.15}>
            {about.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </Reveal>
          <Reveal>
            <a href="#contact" className="btn btn--ghost about__cta">
              Request media kit
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
