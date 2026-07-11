import { work } from '@/lib/content';
import RevealHeading from './RevealHeading';
import Reveal from './Reveal';
import Parallax from './Parallax';
import Plate from './Plate';

export default function Work() {
  return (
    <section className="section work" id="work">
      <div className="container">
        <div className="work__head">
          <div>
            <span className="eyebrow eyebrow--accent">{work.eyebrow}</span>
            <RevealHeading as="h2" className="work__title h-display" lines={work.headingLines} />
          </div>
          <Reveal className="work__intro">
            <p>{work.intro}</p>
          </Reveal>
        </div>

        <div className="work__grid">
          {work.items.map((item) => (
            <Reveal
              key={item.index}
              as="article"
              className={`work-card work-card--${item.span}`}
              y={60}
            >
              <a href="#contact" className="work-card__link" data-cursor>
                <Parallax className="work-card__media">
                  <Plate index={item.index} tone={item.tone} label={item.category} parallax />
                </Parallax>
                <div className="work-card__meta">
                  <span className="work-card__cat eyebrow">{item.category}</span>
                  <h3 className="work-card__title">{item.title}</h3>
                  <span className="work-card__year eyebrow">{item.year}</span>
                </div>
                <span className="work-card__view">View case ↗</span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
