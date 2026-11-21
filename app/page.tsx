import Link from "next/link";
import SiteHeader from "./components/SiteHeader";

export default function Home() {
  return (
    <main className="site-shell">
      <SiteHeader />

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-stripes" aria-hidden="true" />
        <div className="hero-content">
          <div className="marvel-tag">MARVEL RIVALS LORDBOOSTING</div>
          <h1 id="hero-title">
            HERO PROFICIENCY
          </h1>
          <p className="hero-kicker">THE MARVEL RIVALS BOOSTING SERVICE</p>
          <p className="hero-description">ALL HEROES ARE READY</p>
          <div className="hero-actions" id="order">
            <Link className="primary-button" href="/heroes">
              Heroes
              <span aria-hidden="true">↗</span>
            </Link>
            <Link className="package-button" href="/calculator">
              Build your package
              <span aria-hidden="true">↗</span>
            </Link>
            <Link className="contact-button" href="/contacts">
              Contact
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>

      <footer id="contact">
        <a href="mailto:bahatixofficial@gmail.com">bahatixofficial@gmail.com</a>
      </footer>
    </main>
  );
}
