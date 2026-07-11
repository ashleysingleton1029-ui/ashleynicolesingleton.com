import { press } from '@/lib/content';
import RevealHeading from './RevealHeading';
import Reveal from './Reveal';

export default function Press() {
  return (
    <section className="section press" id="press">
      <div className="container">
        <div className="press__head">
          <span className="eyebrow eyebrow--accent">{press.eyebrow}</span>
          <RevealHeading as="h2" className="press__title h-display" lines={press.headingLines} />
        </div>

        <Reveal className="press__outlets" stagger={0.06}>
          {press.outlets.map((o) => (
            <span className="press__outlet" key={o}>{o}</span>
          ))}
        </Reveal>

        <div className="press__quotes">
          {press.quotes.map((q, i) => (
            <Reveal as="figure" className="press__quote" key={i} y={50}>
              <span className="press__mark" aria-hidden="true">“</span>
              <blockquote>{q.quote}</blockquote>
              <figcaption className="eyebrow">— {q.source}</figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
