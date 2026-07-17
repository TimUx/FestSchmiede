/**
 * Homepage-Inhalte (www) – problemorientiert, vereinsnah, LLMO-tauglich.
 * Keine Feature-Werbeliste: zuerst Problem, dann Lösung.
 */

export const HOME_HERO = {
  title: 'Digitale Organisation für Vereinsfeste',
  subtitle:
    'FestSchmiede ist Open-Source-Software für Vereine: Bestellungen, Küche und Abholung laufen in einem System – statt Zetteln, Zurufen und Warteschlangen. Für Feuerwehrfeste, Schützenfeste, Dorffeste und ähnliche Veranstaltungen.',
  primaryCta: { label: 'So läuft der Ablauf', to: '/#bestellprozess' },
  secondaryCtaApply: { label: 'Mandant beantragen', to: '/mandant-beantragen' },
  secondaryCtaContact: { label: 'Kontakt', to: '/kontakt' },
};

export const HOME_QUICK_BENEFITS = [
  { label: 'Online-Bestellungen', href: '/digitale-essensbestellung' },
  { label: 'Küchenmonitor', href: '/kuechenmonitor' },
  { label: 'Digitale Abholnummern', href: '/abholnummern' },
  { label: 'Kasse vor Ort', href: '/funktionen' },
  { label: 'Mehrere Veranstaltungen', href: '/festverwaltung' },
  { label: 'Für Vereine gedacht', href: '/fuer-vereine' },
] as const;

export interface HomeProblemSection {
  id: string;
  title: string;
  problem: string;
  causes: string[];
  solution: string;
  bullets: string[];
  link: { label: string; to: string };
}

export const HOME_PROBLEMS: HomeProblemSection[] = [
  {
    id: 'papierlisten',
    title: 'Papierlisten beim Vereinsfest',
    problem:
      'Sobald Grill, Küche und Ausgabe parallel laufen, werden Zettel zum Flaschenhals. Bestellungen gehen verloren, Nummern werden doppelt vergeben, und niemand weiß, welche Bestellung gerade in Arbeit ist. Der Stress trifft Helfer und Gäste gleichzeitig – ausgerechnet dann, wenn das Fest eigentlich Gemeinschaft sein soll.',
    causes: [
      'Informationen liegen an mehreren Stellen: Tresen, Küche, WhatsApp, Zuruf',
      'Schichtwechsel verlieren den Überblick über offene Bestellungen',
      'Handschrift und Lärm führen zu Fehlern bei Mengen und Sonderwünschen',
    ],
    solution:
      'FestSchmiede ersetzt die Papierliste durch einen gemeinsamen digitalen Status. Bestellungen landen einmal im System und sind für Küche und Ausgabe sichtbar – ohne dass jemand den Zettel tragen muss.',
    bullets: [
      'Eine Bestellung, ein Status – für alle Stationen',
      'Weniger Doppelarbeit zwischen Tresen und Küche',
      'Nachvollziehbare Nummern statt improvisierter Zettelstapel',
    ],
    link: { label: 'Mehr zur Essensbestellung im Verein', to: '/essensbestellung-verein' },
  },
  {
    id: 'warteschlangen',
    title: 'Lange Warteschlangen',
    problem:
      'Schlangen entstehen selten nur durch „zu viele Gäste“. Häufig warten Menschen, weil Bestellung, Zubereitung und Ausgabe nicht synchron laufen. Wer am Tresen bestellt und gleichzeitig auf Zurufe wartet, blockiert den Weg für andere.',
    causes: [
      'Bestellung und Zahlung dauern am Tresen zu lange',
      'Küche und Ausgabe wissen nicht, was als Nächstes kommt',
      'Gäste stehen in der falschen Schlange, weil niemand weiß, was fertig ist',
    ],
    solution:
      'Digitale Vorbestellung und ein Abholboard entzerren den Ablauf: Gäste bestellen früher oder parallel, die Küche arbeitet priorisiert, und die Ausgabe ruft nicht mehr ins Blaue.',
    bullets: [
      'Vorbestellung entlastet Stoßzeiten',
      'Abholboard zeigt, welche Nummern bereitliegen',
      'Kasse und Online-Zahlung können parallel laufen',
    ],
    link: { label: 'Online-Vorbestellung verstehen', to: '/online-vorbestellung-vereinsfest' },
  },
  {
    id: 'essenszettel',
    title: 'Verlorene Essenszettel',
    problem:
      'Ein Zettel, der zwischen Tresen und Grill verschwindet, kostet Zeit und Nerven. Gäste wiederholen Bestellungen, Helfer diskutieren, was „gerade eben“ schon da war – und die Küche kocht im Zweifel doppelt.',
    causes: [
      'Physische Medien gehen in der Hetze verloren oder werden unleserlich',
      'Keine gemeinsame Wahrheit über offene und erledigte Bestellungen',
      'Rückfragen belasten genau die Stationen, die schon unter Last stehen',
    ],
    solution:
      'In FestSchmiede bleibt die Bestellung digital erhalten: mit Positionen, Status und Abholnummer. Verloren geht höchstens die Aufmerksamkeit – nicht der Auftrag.',
    bullets: [
      'Bestellung bleibt im System nachvollziehbar',
      'Status von neu bis abgeholt ist für Helfer sichtbar',
      'Gäste können den Fortschritt über Status und Nummer einsehen',
    ],
    link: { label: 'Digitale Essensbestellung', to: '/digitale-essensbestellung' },
  },
  {
    id: 'kuechenuebersicht',
    title: 'Keine Übersicht in der Küche',
    problem:
      'Ohne gemeinsame Anzeige arbeitet die Küche nach Zuruf und Gefühl. Prioritäten kippen, ähnliche Bestellungen werden doppelt begonnen, und Stoßzeiten enden in Chaos statt in ruhiger Ausgabe.',
    causes: [
      'Offene Bestellungen sind nicht zentral sichtbar',
      'Tablet oder Monitor fehlt – oder die Information kommt zu spät',
      'Fertige Bestellungen werden nicht klar an die Ausgabe übergeben',
    ],
    solution:
      'Der Küchenmonitor zeigt offene Bestellungen in Echtzeit. Helfer starten Bearbeitung, markieren fertig und halten damit die Ausgabe synchron – auch bei Schichtwechsel.',
    bullets: [
      'Echtzeit-Übersicht offener Aufträge',
      'Klare Übergabe an Abholung und Abholboard',
      'Weniger Zurufe, mehr sichtbarer Status',
    ],
    link: { label: 'Küchenmonitor im Detail', to: '/kuechenmonitor' },
  },
  {
    id: 'helfer',
    title: 'Schwierige Helferkoordination',
    problem:
      'Ehrenamtliche kommen in Schichten, kennen den Stand nicht und brauchen lange Einweisung. Wenn jeder einen anderen Zettelprozess hat, entsteht Reibung – nicht aus Unwillen, sondern aus fehlender gemeinsamer Struktur.',
    causes: [
      'Wissen steckt in Köpfen, nicht im Ablauf',
      'Rollen (Küche, Ausgabe, Kasse) sind unklar getrennt',
      'Neue Helfer sehen zu viel auf einmal und werden unsicher',
    ],
    solution:
      'FestSchmiede ersetzt keinen Schichtplan. Es gibt Helfern aber klare Oberflächen und Rollenvorlagen für Küche, Abholung und Kasse – damit Einweisung kurz und der Ablauf wiederholbar bleibt.',
    bullets: [
      'Rollenbezogene Ansichten statt Universalchaos',
      'Kurze Einweisung vor dem Festtag genügt oft',
      'Ergänzend zu eurer bestehenden Helferliste',
    ],
    link: { label: 'Helferplanung & Abläufe', to: '/helferplanung-verein' },
  },
];

export interface HomeDefinition {
  term: string;
  body: string;
  to: string;
}

export const HOME_DEFINITIONS: HomeDefinition[] = [
  {
    term: 'Was ist eine Vereinssoftware?',
    body: 'Vereinssoftware unterstützt Organisationen bei wiederkehrenden Aufgaben – von Mitgliedern bis Veranstaltungen. Viele Produkte decken Verwaltung und Buchhaltung ab. FestSchmiede gehört zum Teilbereich der Fest- und Veranstaltungsabläufe: Bestellung, Küche und Abholung am Festtag, nicht die Mitgliederakte.',
    to: '/vereinssoftware',
  },
  {
    term: 'Was ist eine Festsoftware?',
    body: 'Festsoftware ist digitale Unterstützung für den Betrieb eines Vereinsfests mit Speisen- und Getränkeverkauf. Sie verbindet Gäste, Küche und Ausgabe. Im Unterschied zu allgemeinen Gastro-Kassen zielt sie auf ehrenamtliche Teams, Stoßzeiten und einfache Einweisung.',
    to: '/festsoftware',
  },
  {
    term: 'Was ist eine digitale Essensbestellung?',
    body: 'Digitale Essensbestellung nimmt Aufträge online oder vor Ort im System auf – statt auf Zetteln. Positionen, Mengen und Status bleiben nachvollziehbar. Für Vereine bedeutet das weniger verlorene Aufträge und eine klarere Übergabe an die Küche.',
    to: '/digitale-essensbestellung',
  },
  {
    term: 'Was ist ein Küchenmonitor?',
    body: 'Ein Küchenmonitor ist die Anzeige offener Bestellungen für die Zubereitung – oft auf Tablet oder großem Bildschirm. Er zeigt, was ansteht, was in Arbeit ist und was fertig gemeldet werden kann. So ersetzt er Zurufe und Papierstapel in der Küche.',
    to: '/kuechenmonitor',
  },
  {
    term: 'Was ist eine digitale Abholnummer?',
    body: 'Eine digitale Abholnummer kennzeichnet eine Bestellung eindeutig von der Aufnahme bis zur Ausgabe. Gäste sehen sie im Status, die Ausgabe bestätigt damit die Übergabe, und das Abholboard zeigt öffentlich, welche Nummern bereitliegen – ohne Lautsprecherchaos.',
    to: '/abholnummern',
  },
  {
    term: 'Was ist Veranstaltungsmanagement-Software?',
    body: 'Veranstaltungsmanagement-Software organisiert Abläufe rund um Events: Planung, Verkauf, Stationen und Auswertung. FestSchmiede fokussiert den Bewirtungsstrang am Vereinsfest und lässt sich mit bestehenden Tools für Mitglieder oder Buchhaltung kombinieren.',
    to: '/veranstaltungssoftware',
  },
];

export interface HomeEventType {
  title: string;
  challenge: string;
  to: string;
}

export const HOME_EVENT_TYPES: HomeEventType[] = [
  {
    title: 'Feuerwehrfest',
    challenge:
      'Hohe Stoßzeiten, viele Helferwechsel und oft getrennte Stationen für Grill und Ausgabe. Digitale Bestellung und Küchenansicht halten den Betrieb ruhig, ohne den Charakter des Festes zu ändern.',
    to: '/feuerwehrfest-organisieren',
  },
  {
    title: 'Schützenfest',
    challenge:
      'Mehrtägige Programme und wechselnde Bewirtungsteams. Einheitliche Artikel, sichtbarer Status und Auswertungen helfen über die Festtage hinweg.',
    to: '/schuetzenfest-organisieren',
  },
  {
    title: 'Kirmes',
    challenge:
      'Viele Gäste, schnelle Ausgabe, wenig Zeit für Einweisung. Schlankes Menü, Abholboard und klare Nummern entlasten den Stand.',
    to: '/kirmes-organisieren',
  },
  {
    title: 'Dorffest',
    challenge:
      'Mehrere Vereine an gemeinsamen Ständen. Eine gemeinsame Bestellwahrheit verhindert Parallelzettel und Preisverwirrung.',
    to: '/dorffest-organisieren',
  },
  {
    title: 'Straßenfest',
    challenge:
      'Begrenzte Fläche, schlechte Netze und enge Wege. Digitale Vorbestellung und markierte Ausgabezonen halten den Betrieb beherrschbar.',
    to: '/strassenfest-organisieren',
  },
  {
    title: 'Vereinsjubiläum',
    challenge:
      'Einmalige Großveranstaltung mit ungeübten Helfern. Kurze Einweisung und klare Rollenflächen sind wichtiger als Maximalfunktionen.',
    to: '/vereinsveranstaltung-digitalisieren',
  },
  {
    title: 'Weihnachtsmarkt',
    challenge:
      'Kälte, parallele Stände und oft Getränke im Fokus. Digitale Bestellung und Auswertungen helfen bei Mengen und Schichtübergaben.',
    to: '/festverwaltung',
  },
  {
    title: 'Grillfest',
    challenge:
      'Schnelle Zubereitung, hohe Parallelität. Küchenmonitor und Abholnummern verhindern, dass fertige Portionen „irgendwo“ liegen.',
    to: '/kuechenmonitor',
  },
  {
    title: 'Vereinsveranstaltung',
    challenge:
      'Vom Vereinsabend bis zur Spendenaktion: Sobald Speisen und Getränke verkauft werden, lohnt ein gemeinsamer digitaler Ablauf statt Zettelchaos.',
    to: '/vereinsveranstaltung-digitalisieren',
  },
];

export const HOME_COMPARISON = {
  title: 'Papierorganisation vs. digitale Organisation',
  headers: ['Thema', 'Klassisch mit Papier', 'Mit FestSchmiede'],
  rows: [
    ['Bestellung', 'Zettel, Zuruf, WhatsApp', 'Online oder vor Ort im System'],
    ['Küche', 'Stapel und Zurufe', 'Küchenmonitor mit Status'],
    ['Ausgabe', 'Namen rufen, Schlange raten', 'Abholnummer und Abholboard'],
    ['Schichtwechsel', 'Wissen geht verloren', 'Offene Bestellungen bleiben sichtbar'],
    ['Auswertung', 'Schätzungen und Kassenreste', 'Zahlen aus dem Bestellverlauf'],
    ['Fehlerquelle', 'Verlorene / unleserliche Zettel', 'Eine gemeinsame Bestellwahrheit'],
  ],
};

export const HOME_EEAT = {
  whyTitle: 'Warum wurde FestSchmiede entwickelt?',
  whyBody:
    'Aus der Praxis ehrenamtlicher Veranstaltungen: Lange Schlangen, unklare Küchenübergaben und Papierchaos belasten genau die Menschen, die das Fest tragen. FestSchmiede entstand als Open-Source-Antwort darauf – fokussiert auf Bestellung, Küche und Abholung, ohne Vereine in ein geschlossenes System zu zwingen.',
  whoTitle: 'Für welche Vereine eignet sich die Software?',
  whoBody:
    'Für Organisationen mit Essens- und Getränkeverkauf und mehreren Stationen: Feuerwehren, Schützenvereine, Sportvereine, Hilfsorganisationen, Schulen und Kommunen. Besonders dann, wenn Stoßzeiten regelmäßig Stress verursachen.',
  whenTitle: 'Wann lohnt sich der Einsatz?',
  whenBody:
    'Wenn parallele Bestellungen, räumlich getrennte Küche und Ausgabe oder unklare Nummern zum Normalfall werden. Bei sehr kleinen, ruhigen Abläufen kann Papier weiter reichen – Digitalisierung lohnt sich, sobald Übersicht und Übergaben kritisch werden.',
  diffTitle: 'Was unterscheidet FestSchmiede von allgemeinen Bestellsystemen?',
  diffBody:
    'Allgemeine Gastro- oder Bestell-Apps zielen oft auf Betriebe mit fester Belegschaft. FestSchmiede ist auf Vereinsfeste ausgelegt: kurze Einweisung, Rollenvorlagen, Abholboard, optionale Module und Open Source. Es ersetzt keine Mitgliederverwaltung und kein klassisches Kassensystem für den Dauerbetrieb.',
};

export const HOME_TOPIC_LINKS = [
  { label: 'Vereinssoftware', to: '/vereinssoftware' },
  { label: 'Festsoftware', to: '/festsoftware' },
  { label: 'Veranstaltungssoftware', to: '/veranstaltungssoftware' },
  { label: 'Essensbestellung', to: '/essensbestellung-verein' },
  { label: 'Küchenmonitor', to: '/kuechenmonitor' },
  { label: 'Abholnummern', to: '/abholnummern' },
  { label: 'Helferplanung', to: '/helferplanung-verein' },
  { label: 'Festverwaltung', to: '/festverwaltung' },
  { label: 'Alle Themen', to: '/themen' },
] as const;

export const HOME_SUMMARY = {
  title: 'Kurz zusammengefasst',
  points: [
    'FestSchmiede digitalisiert Bestellung, Küche und Abholung am Vereinsfest.',
    'Zielgruppe sind ehrenamtliche Teams – nicht klassische Restaurantketten.',
    'Probleme wie Papierchaos, Schlangen und fehlende Küchenübersicht stehen im Vordergrund.',
    'Open Source: nachvollziehbar, erweiterbar, ohne Anbieter-Lock-in.',
    'Einstieg über Plattform-Mandant oder Self-Hosting – mit Probelauf vor dem Festtag.',
  ],
};
