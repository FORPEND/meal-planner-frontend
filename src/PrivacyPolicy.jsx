import { ChevronLeft } from "lucide-react";

// Datum zadnje izmjene ovih pravila.
const LAST_UPDATED = "11. kolovoza 2026.";

export default function PrivacyPolicy({ onBack }) {
  return (
    <div className="pp-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&family=Work+Sans:wght@400;500;600;700&display=swap');

        .pp-root, .pp-root *, .pp-root *::before, .pp-root *::after {
          box-sizing: border-box;
        }
        .pp-root {
          --paper: #FAF6ED;
          --paper-2: #F1EADC;
          --ink: #2A2620;
          --ink-soft: #8C8273;
          --green: #2F5D43;
          --line: #E2D8C4;
          font-family: 'Work Sans', sans-serif;
          background: var(--paper);
          color: var(--ink);
          min-height: 100vh;
          padding: 24px 20px 64px;
        }
        .pp-wrap {
          max-width: 720px;
          margin: 0 auto;
        }
        .pp-back {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: none;
          border: none;
          color: var(--green);
          font-family: 'Work Sans', sans-serif;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          padding: 8px 0;
          margin-bottom: 8px;
        }
        .pp-back:hover { text-decoration: underline; }
        .pp-eyebrow {
          font-family: 'Oswald', sans-serif;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 13px;
          color: var(--ink-soft);
        }
        .pp-title {
          font-family: 'Oswald', sans-serif;
          font-weight: 700;
          font-size: 32px;
          margin: 4px 0 2px;
        }
        .pp-updated {
          font-size: 13px;
          color: var(--ink-soft);
          margin-bottom: 24px;
        }
        .pp-root h2 {
          font-family: 'Oswald', sans-serif;
          font-weight: 500;
          font-size: 20px;
          margin: 28px 0 8px;
          padding-top: 16px;
          border-top: 1px solid var(--line);
        }
        .pp-root p, .pp-root li {
          font-size: 15px;
          line-height: 1.65;
          color: var(--ink);
        }
        .pp-root ul { padding-left: 20px; margin: 8px 0; }
        .pp-root li { margin-bottom: 6px; }
        .pp-root a { color: var(--green); font-weight: 600; }
        .pp-card {
          background: var(--paper-2);
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 16px 18px;
          margin-top: 8px;
        }
        .pp-card p { margin: 4px 0; }
      `}</style>

      <div className="pp-wrap">
        {onBack && (
          <button className="pp-back" onClick={onBack}>
            <ChevronLeft size={18} /> Natrag na aplikaciju
          </button>
        )}

        <div className="pp-eyebrow">Kuhaj štedljivo</div>
        <h1 className="pp-title">Pravila privatnosti</h1>
        <div className="pp-updated">Zadnja izmjena: {LAST_UPDATED}</div>

        <p>
          Ova pravila privatnosti opisuju kako aplikacija <strong>Kuhaj štedljivo</strong>{" "}
          (dalje u tekstu: „Aplikacija") postupa s podacima svojih korisnika. Privatnost
          korisnika shvaćamo ozbiljno, a Aplikacija je osmišljena tako da radi bez
          prikupljanja osobnih podataka.
        </p>

        <h2>1. Voditelj obrade podataka</h2>
        <div className="pp-card">
          <p><strong>Čičak Bau d.o.o.</strong></p>
          <p>Samobor, Hrvatska</p>
          <p>E-pošta: <a href="mailto:kuhajstedljivo@gmail.com">kuhajstedljivo@gmail.com</a></p>
        </div>

        <h2>2. Koje podatke prikupljamo</h2>
        <p>
          Aplikacija <strong>ne prikuplja</strong> vaše osobne podatke. Ne postoji
          registracija niti korisnički računi, pa od vas ne tražimo ime, e-poštu,
          adresu ni bilo koje druge podatke kojima bi vas se moglo identificirati.
        </p>
        <p>
          Sve postavke koje odaberete u Aplikaciji (primjerice odabrani dućan, budžet
          ili prehrambeni filteri) pohranjuju se lokalno na vašem uređaju i ne
          prenose se nama niti trećim stranama.
        </p>

        <h2>3. Kolačići</h2>
        <p>
          Aplikacija koristi isključivo <strong>nužne (funkcionalne) kolačiće</strong> i
          lokalnu pohranu preglednika koji su potrebni za osnovni rad Aplikacije, kao
          što je pamćenje vaše privole za kolačiće i vaših postavki. Ne koristimo
          kolačiće za oglašavanje, praćenje ni analitiku, niti dijelimo podatke s
          trećim stranama u marketinške svrhe.
        </p>
        <p>
          Kolačiće možete u svakom trenutku obrisati ili blokirati putem postavki
          svog preglednika. Napominjemo da onemogućavanje nužnih kolačića može
          utjecati na ispravan rad Aplikacije.
        </p>

        <h2>4. Vaša prava prema GDPR-u</h2>
        <p>
          Aplikacija je usklađena s Općom uredbom o zaštiti podataka (GDPR). Budući da
          ne prikupljamo osobne podatke, u pravilu nemamo podatke koje bismo o vama
          obrađivali. Ipak, kao ispitanik imate sljedeća prava:
        </p>
        <ul>
          <li>pravo na pristup podacima,</li>
          <li>pravo na ispravak netočnih podataka,</li>
          <li>pravo na brisanje („pravo na zaborav"),</li>
          <li>pravo na ograničenje obrade,</li>
          <li>pravo na prigovor na obradu,</li>
          <li>pravo na prenosivost podataka.</li>
        </ul>
        <p>
          Za ostvarivanje bilo kojeg od navedenih prava možete nas kontaktirati na{" "}
          <a href="mailto:kuhajstedljivo@gmail.com">kuhajstedljivo@gmail.com</a>. Također
          imate pravo podnijeti pritužbu nadzornom tijelu — Agenciji za zaštitu osobnih
          podataka (AZOP) u Republici Hrvatskoj.
        </p>

        <h2>5. Poveznice i usluge trećih strana</h2>
        <p>
          Podaci o cijenama i akcijama koje Aplikacija prikazuje dohvaćaju se s vlastitog
          poslužitelja. Aplikacija ne dijeli vaše podatke s trećim stranama. Ako Aplikacija
          sadrži poveznice na vanjske stranice, ova pravila privatnosti ne odnose se na te
          stranice te vam preporučujemo da pročitate njihova pravila privatnosti.
        </p>

        <h2>6. Djeca</h2>
        <p>
          Aplikacija nije usmjerena na djecu te svjesno ne prikuplja podatke o djeci.
          Budući da ne prikupljamo osobne podatke, Aplikaciju mogu sigurno koristiti
          korisnici svih dobnih skupina.
        </p>

        <h2>7. Izmjene ovih pravila</h2>
        <p>
          Zadržavamo pravo povremeno ažurirati ova pravila privatnosti. Sve izmjene
          objavit ćemo na ovoj stranici uz ažuriran datum zadnje izmjene. Preporučujemo
          da povremeno provjerite ovu stranicu.
        </p>

        <h2>8. Kontakt</h2>
        <p>
          Za sva pitanja u vezi s ovim pravilima privatnosti ili obradom podataka
          obratite nam se na{" "}
          <a href="mailto:kuhajstedljivo@gmail.com">kuhajstedljivo@gmail.com</a>.
        </p>
      </div>
    </div>
  );
}
