import { nav } from '@/lib/content';

export default function Footer() {
  const year = 2026;
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer__mark">
          <span className="footer__giant h-display">Singleton</span>
        </div>
        <div className="footer__grid">
          <div className="footer__col">
            <span className="eyebrow">Navigate</span>
            <ul>
              {nav.map((n) => (
                <li key={n.href}><a href={n.href} className="link-underline">{n.label}</a></li>
              ))}
            </ul>
          </div>
          <div className="footer__col">
            <span className="eyebrow">Bookings</span>
            <ul>
              <li><a href="mailto:bookings@ashleynicolesingleton.com" className="link-underline">bookings@ashleynicolesingleton.com</a></li>
              <li>Las Vegas, Nevada</li>
              <li>Available worldwide</li>
            </ul>
          </div>
          <div className="footer__col">
            <span className="eyebrow">Follow</span>
            <ul>
              <li><a href="https://instagram.com" target="_blank" rel="noreferrer noopener" className="link-underline">Instagram</a></li>
              <li><a href="https://tiktok.com" target="_blank" rel="noreferrer noopener" className="link-underline">TikTok</a></li>
              <li><a href="https://imdb.com" target="_blank" rel="noreferrer noopener" className="link-underline">IMDb</a></li>
            </ul>
          </div>
        </div>
        <div className="footer__base">
          <span className="eyebrow">© {year} Ashley Nicole Singleton</span>
          <a href="#top" className="footer__totop eyebrow link-underline">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
