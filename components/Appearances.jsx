import { appearances } from '@/lib/content';
import RevealHeading from './RevealHeading';
import Reveal from './Reveal';

export default function Appearances() {
  return (
    <section className="section appearances" id="appearances">
      <div className="container">
        <div className="appearances__head">
          <span className="eyebrow eyebrow--accent">{appearances.eyebrow}</span>
          <RevealHeading as="h2" className="appearances__title h-display" lines={appearances.headingLines} />
        </div>

        <div className="appearances__list">
          {appearances.events.map((ev) => (
            <Reveal as="div" key={`${ev.date}-${ev.city}`} y={30}>
              <a href="#contact" className="event" data-cursor>
                <span className="event__date">{ev.date}</span>
                <span className="event__city">{ev.city}</span>
                <span className="event__venue">{ev.venue}</span>
                <span className={`event__status event__status--${ev.status.replace(/\s/g, '').toLowerCase()}`}>
                  {ev.status}
                </span>
                <span className="event__arrow" aria-hidden="true">↗</span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
