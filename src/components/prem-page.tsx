import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowUpRight,
  Clock3,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Star,
  Watch,
  X,
} from "lucide-react";

const PHONE_DISPLAY = "+91 98260 56474";
const PHONE_TEL = "+919826056474";
const MAP_QUERY = "Prem Watch, 7/8 Bakliwal Complex, Mandsaur, Madhya Pradesh 458001";
const DIRECTIONS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`;
const MAP_EMBED = `https://maps.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&z=16&output=embed`;

const NAV = [
  { href: "#timepieces", label: "Timepieces" },
  { href: "#phones", label: "Phones" },
  { href: "#sunglasses", label: "Sunglasses" },
  { href: "#repair", label: "Repair" },
  { href: "#visit", label: "Visit" },
];

const BRANDS = [
  "Casio",
  "Titan",
  "Fastrack",
  "Sonata",
  "Wall clocks",
  "Smartphones",
  "Accessories",
  "Sunglasses",
  "Watch repair",
];

const HOURS: { key: string; label: string; hours: string }[] = [
  { key: "Mon", label: "Monday", hours: "10 am – 9 pm" },
  { key: "Tue", label: "Tuesday", hours: "10 am – 9 pm" },
  { key: "Wed", label: "Wednesday", hours: "10 am – 9 pm" },
  { key: "Thu", label: "Thursday", hours: "10 am – 9 pm" },
  { key: "Fri", label: "Friday", hours: "10 am – 9 pm" },
  { key: "Sat", label: "Saturday", hours: "10 am – 9 pm" },
  { key: "Sun", label: "Sunday", hours: "Closed" },
];

const INTENTS = [
  {
    id: "watch",
    label: "A wristwatch",
    note: "Ask for Casio, Titan, Fastrack, or Sonata — analog, digital, dress, or sport. We’ll pull a few that fit the wrist and the day.",
    ask: "a wristwatch",
  },
  {
    id: "clock",
    label: "A wall clock",
    note: "Wall clocks for the house or the shop sit with the timepieces, not in a separate aisle.",
    ask: "a wall clock",
  },
  {
    id: "phone",
    label: "A phone",
    note: "Smartphones and mobile accessories, with help at the counter instead of a sealed box and a shrug.",
    ask: "a phone or mobile accessory",
  },
  {
    id: "sun",
    label: "Sunglasses",
    note: "Frames for everyday sun, kept with the lifestyle pieces so a watch and a pair can leave together.",
    ask: "sunglasses",
  },
  {
    id: "fix",
    label: "A repair",
    note: "Bring the watch. We open it and diagnose before talking about a fix — and say so plainly if a part isn’t on the shelf.",
    ask: "a watch repair",
  },
] as const;

type ShopStatus = {
  weekday: string | null;
  open: boolean | null;
  label: string;
};

function readShopStatus(date = new Date()): ShopStatus {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const weekday = parts.find((part) => part.type === "weekday")?.value ?? "Mon";
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? "0");
  const mins = hour * 60 + minute;
  const isSunday = weekday === "Sun";
  const open = !isSunday && mins >= 10 * 60 && mins < 21 * 60;

  let label = "Opens at 10 am";
  if (open) label = "Open now · until 9 pm";
  else if (isSunday) label = "Closed Sunday · opens Monday 10 am";
  else if (mins >= 21 * 60) {
    label = weekday === "Sat" ? "Closed · opens Monday 10 am" : "Closed · opens 10 am tomorrow";
  }

  return { weekday, open, label };
}

function Stars() {
  return (
    <span className="inline-flex gap-0.5 text-brass" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className="size-4"
          strokeWidth={1.6}
          fill={index < 4 ? "currentColor" : "none"}
        />
      ))}
    </span>
  );
}

function CallLink({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <a href={`tel:${PHONE_TEL}`} className={className}>
      {children}
    </a>
  );
}

export function PremPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [intentId, setIntentId] = useState<(typeof INTENTS)[number]["id"]>("watch");
  const [status, setStatus] = useState<ShopStatus>({
    weekday: null,
    open: null,
    label: "Mon–Sat · 10 am – 9 pm",
  });

  useEffect(() => {
    const tick = () => setStatus(readShopStatus());
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const intent = INTENTS.find((item) => item.id === intentId) ?? INTENTS[0];
  const whatsapp = `https://wa.me/919826056474?text=${encodeURIComponent(
    `Hello Prem Watch, I am coming to Bakliwal Complex about ${intent.ask}.`,
  )}`;

  return (
    <div id="top" className="min-h-screen bg-paper text-ink">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-cream focus:px-3 focus:py-2"
      >
        Skip to content
      </a>

      <div className="border-b border-line bg-cream">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-5 py-2 text-sm text-muted">
          <p>Mandsaur, Madhya Pradesh</p>
          <p className="inline-flex items-center gap-2">
            <span
              className={`size-1.5 rounded-full ${status.open ? "bg-clay" : "bg-brass"}`}
              aria-hidden="true"
            />
            <span>{status.label}</span>
          </p>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5">
          <a href="#top" className="flex items-center gap-2 text-ink">
            <Watch className="size-5 text-brass" aria-hidden="true" />
            <span className="font-display text-xl leading-none tracking-tight">Prem Watch</span>
          </a>

          <nav aria-label="Page" className="hidden items-center gap-6 lg:flex">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="text-sm text-ink-soft hover:text-ink">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <CallLink className="inline-flex h-11 items-center gap-2 rounded-full bg-clay px-4 text-sm font-medium text-cream-ink">
              <Phone className="size-4" aria-hidden="true" />
              Call
            </CallLink>
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-cream text-ink lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            </button>
          </div>
        </div>

        {menuOpen ? (
          <nav id="mobile-nav" aria-label="Mobile" className="border-t border-line bg-paper lg:hidden">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex h-12 items-center border-b border-line px-5 text-ink last:border-b-0"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        ) : null}
      </header>

      <main id="content">
        <section className="mx-auto grid max-w-6xl items-end gap-10 px-5 pb-14 pt-10 md:grid-cols-12 md:pb-20 md:pt-16">
          <div className="md:col-span-6 lg:col-span-5">
            <p className="text-sm tracking-wide text-brass">Bakliwal Complex · Watch store</p>
            <h1 className="mt-4 font-display text-5xl leading-none tracking-tight text-ink md:text-6xl">
              A proper watch shop, with phones and sunglasses beside it.
            </h1>
            <p className="mt-6 max-w-md text-lg text-ink-soft">
              Prem Watch keeps branded wristwatches, wall clocks, cell phones, and sunglasses at
              7/8, Bakliwal Complex — and will open a watch on the bench when it needs a look.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <CallLink className="inline-flex h-12 items-center gap-2 rounded-full bg-clay px-5 text-sm font-medium text-cream-ink">
                <Phone className="size-4" aria-hidden="true" />
                Call the shop
              </CallLink>
              <a
                href={DIRECTIONS}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-line bg-cream px-5 text-sm font-medium text-ink"
              >
                Directions
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            </div>

            <p className="mt-8 flex flex-wrap items-center gap-3 text-sm text-ink-soft">
              <Stars />
              <span>
                <span className="sr-only">Rated 4 out of 5 stars, </span>
                <span className="font-medium text-ink">4 stars</span>
                <span> · 205 reviews</span>
              </span>
            </p>
          </div>

          <div className="md:col-span-6 lg:col-span-7">
            <figure className="relative">
              <img
                src="/photos/interior.jpg"
                alt="Warm wood cabinets of wristwatches in afternoon light, a sample of the shop’s mood"
                className="h-80 w-full object-cover md:h-96"
              />
              <figcaption className="mt-3 flex gap-3 border border-line bg-cream p-3 sm:absolute sm:bottom-4 sm:left-4 sm:mt-0 sm:max-w-xs">
                <img
                  src="/photos/watch.jpg"
                  alt="Steel wristwatch with a cream dial and leather strap"
                  className="size-16 shrink-0 object-cover"
                />
                <p className="text-sm text-ink-soft">
                  Wristwatches first. Wall clocks, phones, and sunglasses share the same counter.
                </p>
              </figcaption>
            </figure>
          </div>
        </section>

        <div className="overflow-hidden border-y border-line bg-cream" aria-label="What the shop carries">
          <div className="prem-ticker flex w-max">
            {[0, 1].map((copy) => (
              <ul key={copy} className="flex items-center" aria-hidden={copy === 1}>
                {BRANDS.map((brand) => (
                  <li key={`${brand}-${copy}`} className="flex items-center gap-6 px-4 py-4">
                    <span className="font-display text-lg text-ink">{brand}</span>
                    <span className="size-1 rounded-full bg-brass" aria-hidden="true" />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        <section className="mx-auto max-w-6xl px-5 py-16 md:py-24" aria-labelledby="intent-heading">
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="text-sm tracking-wide text-brass">Before you walk in</p>
              <h2 id="intent-heading" className="mt-3 font-display text-4xl tracking-tight">
                What are you coming in for?
              </h2>
            </div>
            <div className="md:col-span-8">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Choose a reason to visit">
                {INTENTS.map((item) => {
                  const selected = item.id === intent.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setIntentId(item.id)}
                      className={`inline-flex h-11 items-center rounded-full px-4 text-sm ${
                        selected ? "bg-ink text-cream-ink" : "border border-line bg-cream text-ink"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-6 max-w-xl text-lg text-ink-soft">{intent.note}</p>
              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex h-12 items-center gap-2 text-sm font-medium text-ink underline decoration-brass decoration-1 underline-offset-4"
              >
                <MessageCircle className="size-4 text-brass" aria-hidden="true" />
                Message the counter on WhatsApp
              </a>
            </div>
          </div>
        </section>

        <Floor
          id="timepieces"
          index="01"
          kicker="Watch store"
          title="Wristwatches and the clock on the wall"
          body="Casio, Titan, Fastrack, and Sonata — analog and digital — plus wall clocks for the house or the shop. Say who it’s for and how they wear a watch. The counter will pull a few that actually fit."
          points={["Everyday, dress, and sport watches", "Digital pieces alongside analog", "Wall clocks, not an afterthought"]}
          images={[
            {
              src: "/photos/watch.jpg",
              alt: "Cream-dial wristwatch on linen",
              className: "sm:col-span-3",
            },
            {
              src: "/photos/clock.jpg",
              alt: "Round brass-rimmed wall clock on a plaster wall",
              className: "sm:col-span-2",
            },
          ]}
        />

        <Floor
          id="phones"
          index="02"
          kicker="Cell phone store"
          title="Phones, and the bits that go with them"
          body="Smartphones and mobile accessories, with someone who will help set a phone up instead of sliding a box across the glass. Cables, covers, and the usual extras live at the same counter."
          points={["Smartphones and cell phones", "Covers, cables, and accessories", "A person who will actually explain it"]}
          images={[
            {
              src: "/photos/phone.jpg",
              alt: "Graphite smartphone and a coiled cable on a wood table",
              className: "sm:col-span-5",
            },
          ]}
          flip
        />

        <Floor
          id="sunglasses"
          index="03"
          kicker="Sunglasses store"
          title="Shade, without a separate trip"
          body="Sunglasses and a few lifestyle pieces sit with the watches, so you can leave with a strap and a pair of frames. Useful on a Mandsaur afternoon, not a fashion detour across town."
          points={["Everyday sunglasses", "Lifestyle accessories", "Same visit as the watch counter"]}
          images={[
            {
              src: "/photos/sunglasses.jpg",
              alt: "Tortoiseshell sunglasses with warm lenses on pale stone",
              className: "sm:col-span-5",
            },
          ]}
        />

        <section id="repair" className="bg-ink text-cream-ink">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-12 md:py-24">
            <div className="md:col-span-6">
              <p className="text-sm tracking-wide text-brass-soft">04 · The bench</p>
              <h2 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">
                If it has stopped, bring it in.
              </h2>
              <p className="mt-5 max-w-md text-lg text-brass-soft">
                Diagnostic repair, not a guess from across the counter. The case comes open, the
                movement gets a look, and you hear what it needs — a battery, a strap, ordinary
                service, or a plain no when the part isn’t one we keep.
              </p>
              <ul className="mt-6 space-y-2 text-cream">
                <li>Diagnosis before a promise</li>
                <li>Batteries, straps, and routine service</li>
                <li>An honest answer when a part isn’t in stock</li>
              </ul>
              <CallLink className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-cream px-5 text-sm font-medium text-ink">
                <Phone className="size-4" aria-hidden="true" />
                Ask about a repair
              </CallLink>
            </div>
            <div className="md:col-span-6">
              <img
                src="/photos/repair.jpg"
                alt="Open watch movement and a brass screwdriver on a wooden bench"
                className="h-80 w-full object-cover md:h-96"
              />
            </div>
          </div>
        </section>

        <section id="visit" className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="text-sm tracking-wide text-brass">Visit</p>
              <h2 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">
                Bakliwal Complex, Mandsaur.
              </h2>
              <address className="mt-6 not-italic text-lg text-ink-soft">
                7/8, Bakliwal Complex
                <br />
                Mandsaur, Madhya Pradesh 458001
                <br />
                India
              </address>

              <div className="mt-6 flex flex-col gap-3 text-ink">
                <a href={`tel:${PHONE_TEL}`} className="inline-flex items-center gap-2">
                  <Phone className="size-4 text-brass" aria-hidden="true" />
                  {PHONE_DISPLAY}
                </a>
                <a
                  href={DIRECTIONS}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <MapPin className="size-4 text-brass" aria-hidden="true" />
                  Open in Google Maps
                </a>
              </div>

              <div className="mt-8 border border-line bg-cream">
                <div className="flex items-center gap-2 border-b border-line px-4 py-3 text-sm text-muted">
                  <Clock3 className="size-4 text-brass" aria-hidden="true" />
                  Published hours · India time
                </div>
                <ul>
                  {HOURS.map((row) => {
                    const today = status.weekday === row.key;
                    return (
                      <li
                        key={row.key}
                        className={`flex items-center justify-between px-4 py-2.5 text-sm ${
                          today ? "bg-brass-soft text-ink" : "text-ink-soft"
                        }`}
                      >
                        <span>
                          {row.label}
                          {today ? <span className="ml-2 text-brass">Today</span> : null}
                        </span>
                        <span className="tabular-nums">{row.hours}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <p className="mt-3 text-sm text-muted">Call ahead on festival days — the door follows the town.</p>
            </div>

            <div className="md:col-span-7">
              <div className="h-96 overflow-hidden border border-line bg-cream md:h-full md:min-h-96">
                <iframe
                  title="Map showing Prem Watch at Bakliwal Complex, Mandsaur"
                  src={MAP_EMBED}
                  className="h-96 w-full border-0 md:h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-cream">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-2xl tracking-tight">Prem Watch</p>
            <p className="mt-2 text-sm text-muted">Watch store · Cell phone store · Sunglasses store</p>
            <p className="mt-1 text-sm text-muted">Mandsaur, Madhya Pradesh</p>
          </div>
          <div className="flex flex-col gap-2 text-sm md:items-end">
            <a href={`tel:${PHONE_TEL}`} className="text-ink">
              {PHONE_DISPLAY}
            </a>
            <a
              href="https://www.prem-watch.business.site/"
              target="_blank"
              rel="noreferrer"
              className="text-muted underline decoration-line underline-offset-4"
            >
              prem-watch.business.site
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Floor({
  id,
  index,
  kicker,
  title,
  body,
  points,
  images,
  flip = false,
}: {
  id: string;
  index: string;
  kicker: string;
  title: string;
  body: string;
  points: string[];
  images: { src: string; alt: string; className: string }[];
  flip?: boolean;
}) {
  const copy = (
    <div className={flip ? "md:col-span-5 md:col-start-8 md:row-start-1" : "md:col-span-5"}>
      <p className="font-display text-4xl text-brass">{index}</p>
      <p className="mt-4 text-sm tracking-wide text-brass">{kicker}</p>
      <h2 className="mt-2 font-display text-4xl tracking-tight">{title}</h2>
      <p className="mt-4 text-lg text-ink-soft">{body}</p>
      <ul className="mt-6 space-y-2 text-ink">
        {points.map((point) => (
          <li key={point} className="flex gap-3">
            <span className="mt-2 size-1 shrink-0 rounded-full bg-brass" aria-hidden="true" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const media = (
    <div className={`grid gap-3 sm:grid-cols-5 ${flip ? "md:col-span-6 md:col-start-1 md:row-start-1" : "md:col-span-6 md:col-start-7"}`}>
      {images.map((image) => (
        <img
          key={image.src}
          src={image.src}
          alt={image.alt}
          className={`h-72 w-full object-cover sm:h-96 ${image.className}`}
        />
      ))}
    </div>
  );

  return (
    <section id={id} className="border-t border-line">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-12 md:py-24">
        {flip ? (
          <>
            {media}
            {copy}
          </>
        ) : (
          <>
            {copy}
            {media}
          </>
        )}
      </div>
    </section>
  );
}
