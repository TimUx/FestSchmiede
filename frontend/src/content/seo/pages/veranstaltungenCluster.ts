import type { SeoLandingPage } from '../types';

export const VERANSTALTUNGEN_CLUSTER_PAGES: SeoLandingPage[] = [
{
    slug: 'feuerwehrfest-organisieren',
    title: 'Feuerwehrfest organisieren: Abläufe, Helfer und Essensausgabe',
    metaTitle: 'Feuerwehrfest organisieren | FestSchmiede',
    metaDescription:
      'Feuerwehrfest organisieren: Planung, Helfer, Essensausgabe und digitale Bestellabläufe. Praxisleitfaden für Wehren – mit FestSchmiede als Open-Source-Plattform.',
    cluster: 'veranstaltungen',
    keywords: [
      'Feuerwehrfest organisieren',
      'Feuerwehrfest Planung',
      'Essensausgabe Feuerwehrfest',
      'digitale Bestellung Feuerwehr',
      'Festorganisation Wehr',
    ],
    intro: [
    'Ein Feuerwehrfest ist mehr als ein Sommerabend mit Bratwurst: Es ist Sichtbarkeit für die Wehr, Gemeinschaft für Ort und Kameradschaft – und oft die wichtigste Einnahmequelle des Jahres. Wer ein Feuerwehrfest organisieren will, jongliert parallel Aufbau, Sicherheit, Programm, Helferschichten und den Dauerbrenner Essens- und Getränkeverkauf.',
    'Genau an der Verkaufsstelle entsteht bei vielen Wehren der größte Stress: Zettel zur Küche, Zurufe an die Ausgabe, unklare Nummern und lange Schlangen, während Gäste eigentlich mit der Mannschaft feiern wollen. Digitale Abläufe ändern nicht den Charakter des Festes – sie entlasten die Stationen, die am stärksten unter Last stehen.',
    'Dieser Leitfaden zeigt, wie ihr ein Feuerwehrfest strukturiert plant, welche Organisationsfehler typisch sind und wie FestSchmiede als Open-Source-Veranstaltungsplattform Bestellungen, Küche, Abholung, Abholboard, Online-Zahlung und Auswertungen unterstützt – ehrlich und ohne Feature-Versprechen außerhalb dieser Prozesskette.'
  ].join('\n\n'),
    sections: [
    {
      heading: 'Was bedeutet Feuerwehrfest organisieren?',
      body: [
    'Feuerwehrfest organisieren heißt, ein mehrtägiges oder eintägiges Event mit klaren Verantwortlichkeiten aufzusetzen: Festleitung, Aufbau, Sicherheit, Programm, Bewirtung und Nachbereitung. Anders als ein reines Vereinsjubiläum steht oft die Außendarstellung der Wehr im Vordergrund – Jugendfeuerwehr, Gerätedemonstration, Oldtimer oder Tag der offenen Tür ergänzen den klassischen Festbetrieb.',
    'Organisatorisch ist das Feuerwehrfest eine Parallelproduktion: Während draußen Programm und Publikumsverkehr laufen, muss innen die Bewirtung stabil skalieren. Wer nur das Bühnenprogramm plant und die Küche „irgendwie mitlaufen“ lässt, spürt das spätestens in der Stoßzeit nach dem Gottesdienst, nach der Großübung oder am Samstagabend.',
    'Zur Bewirtung gehören Einkauf, Kühlung, Grill oder Küchenzelt, Ausgabe, Kasse und oft ein Getränkewagen. Jede dieser Stationen braucht benannte Verantwortliche und Übergabepunkte – sonst entstehen Wissensinseln, die bei Schichtwechsel zusammenbrechen.'
  ].join('\n\n'),
      bullets: [
        'Festkonzept und Termin mit Kommune, Kirche und Nachbarschaft abstimmen',
        'Sicherheits- und Verkehrswege früh festlegen',
        'Bewirtung als eigenen Teilprojektplan führen',
        'Helferschichten für Aufbau, Küche, Ausgabe und Abbau getrennt denken',
      ],
    },
    {
      heading: 'Warum braucht ein Feuerwehrfest klare Abläufe?',
      body: [
    'Ehrenamtliche Helfer wechseln häufig zwischen Einsatzbereitschaft, Festbetrieb und Privatleben. Ohne gemeinsame Abläufe entstehen Wissensinseln: Nur die Küchenchefin weiß, was noch da ist; nur der Kassierer kennt die Preislogik; nur die Abholung ruft Nummern. Bei Personalwechsel bricht diese informelle Ordnung schnell zusammen.',
    'Klare Abläufe schützen auch die Gästezufriedenheit. Lange Schlangen und unklare Wartezeiten wirken unprofessionell – ausgerechnet bei einer Organisation, die im Ernstfall Präzision verkörpert. Digitale Bestell- und Küchenprozesse sind deshalb kein Selbstzweck, sondern eine Form von Betriebssicherheit für den Festtag.',
    'Zudem erleichtert Standardisierung die Einarbeitung jüngerer Helfer. Wer zum ersten Mal an der Ausgabe steht, braucht keine Geheimsprache aus Zurufen, sondern sichtbare Bestellstatus und klare Nummern.'
  ].join('\n\n'),
    },
    {
      heading: 'Typische Probleme am Feuerwehrfest',
      body: 'Viele Wehren erkennen dieselben Reibungspunkte wieder, sobald das Fest über den familiären Rahmen hinauswächst:',
      bullets: [
        'Essenszettel kommen unvollständig oder doppelt in der Küche an',
        'Ausgabe und Küche sind räumlich getrennt – Zurufe gehen unter',
        'Gäste fragen ständig nach dem Status ihrer Bestellung',
        'Schichtwechsel ohne Übergabe führt zu ausverkauften Artikeln „auf Zuruf“',
        'Nach dem Fest fehlen belastbare Verkaufszahlen für Einkauf und Kassenbericht',
        'Jugendliche Helfer an der Ausgabe kennen die Papierprozesse nicht',
      ],
    },
    {
      heading: 'Wie funktioniert digitale Unterstützung in der Praxis?',
      body: [
    'Mit FestSchmiede bestellen Gäste Speisen und Getränke über die öffentliche Bestellseite – am Smartphone oder an einem Tablet bzw. Monitor vor Ort. Die Bestellung landet direkt im System. Die Küche arbeitet offene Positionen in der Küchenansicht ab und markiert Bestellungen als abholbereit.',
    'Das Abholboard zeigt fertige Nummern im Wartebereich; an der Ausgabe wird die Abholung bestätigt. Online-Zahlung und Zahlung bei Abholung lassen sich kombinieren. Dashboard und Auswertungen liefern währenddessen und danach Orientierung – ohne dass jemand Zettelstapel abtippen muss.',
    'Wichtig: FestSchmiede ersetzt weder euren Schichtplan noch eure Einsatzdokumentation. Es unterstützt die Bewirtungskette Bestellung, Küche und Abholung und entlastet damit genau die Stationen, an denen Feuerwehrfeste am häufigsten heißlaufen.'
  ].join('\n\n'),
      table: {
        headers: ['Bereich', 'Klassisch', 'Mit FestSchmiede'],
        rows: [
          ['Bestellung', 'Zettel / Zuruf', 'Digitale Bestellung mit Status'],
          ['Küche', 'Stapel & Zurufe', 'Küchenmonitor in Echtzeit'],
          ['Ausgabe', 'Lautes Ausrufen', 'Abholboard + Abholnummer'],
          ['Nachbereitung', 'Schätzung', 'Auswertungen & Dashboard'],
        ],
      },
    },
    {
      heading: 'Vorteile für Wehr, Helfer und Gäste',
      body: 'Der Nutzen zeigt sich dort, wo Feuerwehrfeste besonders sensibel sind – bei Belastungsspitzen und Helferwechseln:',
      bullets: [
        'Weniger Chaos zwischen Grill, Küchenzelt und Ausgabe',
        'Ruhigere Ausgabe trotz hoher Nachfrage nach dem Programmhöhepunkt',
        'Schnellere Einarbeitung neuer Helfer an Küche und Tresen',
        'Transparente Verkaufszahlen für Vorstand und Festausschuss',
        'Open Source: nachvollziehbar, erweiterbar, ohne Lock-in-Druck',
        'Modular: nur die Funktionen aktivieren, die ihr wirklich braucht',
      ],
    },
    {
      heading: 'Für wen eignet sich dieser Ansatz?',
      body: [
    'Besonders profitieren Wehren mit getrenntem Grill oder Küche und Ausgabestand, mehrtägigen Festen oder starkem Publikumsverkehr aus dem Ort und der Umgebung. Auch Verbundfeste mehrerer Löschgruppen oder gemeinsame Feste mit Förderverein profitieren, wenn mehrere Stationen parallel bestellen und ausgeben.',
    'Bei sehr kleinen Kameradschaftsabenden mit einer Pfanne und zehn Gästen reicht Papier oft weiterhin. Der digitale Nutzen steigt, sobald parallele Bestellungen, Schichtwechsel und Nachfragen zum Normalfall werden.'
  ].join('\n\n'),
    },
    {
      heading: 'Wann solltet ihr digitalisieren?',
      body: 'Ein guter Einstieg ist nicht erst das Chaos-Jahr, sondern die Vorbereitung auf ein Fest mit erwartbarer Last:',
      bullets: [
        'Ihr plant ein größeres Jahresfest oder ein Jubiläumswochenende',
        'Küche und Ausgabe sind nicht denselben Tresen',
        'Ihr erwartet Stoßzeiten nach Gottesdienst, Übung oder Abendprogramm',
        'Neue Helfer sollen ohne lange Einweisung mitarbeiten können',
        'Der Vorstand will belastbare Zahlen für Einkauf und Nachkalkulation',
      ],
    },
    {
      heading: 'Typische Fehler bei der Organisation',
      body: [
    'Der häufigste Fehler: Bewirtung als Nebensache behandeln, obwohl sie den Tagesablauf der meisten Helfer bestimmt. Ebenso riskant ist Live-Gang ohne Probelauf – am Freitagabend zum ersten Mal Tablet und Abholboard erklären funktioniert selten.',
    'Ein weiterer Klassiker: zu großes Menü. Zwölf Grillvarianten und fünf Beilagen klingen gastfreundlich, überfordern aber Küche und Bestelloberfläche. Lieber schlankes Menü, klare Beschriftung und ein Verantwortlicher für Ausverkauft-Schalter.',
    'Und: Digitale Tools ersetzen keine Sicherheitsplanung. Verkehrswege, Brandschutz und Absperrungen bleiben eigene Arbeitspakete – FestSchmiede kümmert sich um Bestell- und Ausgabeprozesse, nicht um Genehmigungen oder Einsatzplanung.',
    'Ein unterschätzter Fehler ist die fehlende Übergabe zwischen Schichten: Frühschicht weiß, welche Gerichte knapp sind, Spätschicht erfährt es erst am leeren Grill. Digitale Verfügbarkeit und Ausverkauft-Status helfen nur, wenn jemand sie aktiv pflegt und die Ablösung kurz briefet. Ebenso riskant ist es, Technik allein der Jugendfeuerwehr zu überlassen, ohne dass die Bewirtungsleitung den Ablauf kennt – dann fehlt im Ernstfall die Entscheidungsebene. Plant deshalb Owner und Vertretung früh, nicht erst wenn das Tablet streikt.'
  ].join('\n\n'),
    },
    {
      heading: 'Best Practices fürs Feuerwehrfest',
      body: 'Erfolgreiche Wehren halten Vorbereitung und Festbetrieb pragmatisch und trennen Festleitung von Bewirtungsleitung, damit Sicherheit und Programm nicht mit Küchenentscheidungen kollidieren. Ein schlankes Menü, sichtbares Abholboard und ein geprüfter Netzbetrieb entlasten Stoßzeiten spürbar. Online-Zahlung kann Kassenengpässe reduzieren, ersetzt aber keine klare Ausgabeorganisation. Nach dem Fest liefern Auswertungen die Grundlage für Einkauf und Retro – ohne dass Kameradschaft oder Genehmigungen digitalisiert werden müssten. Die folgenden Regeln haben sich in der Praxis bewährt:',
      bullets: [
        'Festleitung und Bewirtungsleitung als getrennte Rollen benennen',
        'Menü eine Woche vorher finalisieren und testbestellen',
        'Kurzschulung für Küche und Ausgabe vor Einlass',
        'Abholboard gut sichtbar, aber außerhalb der Engstelle platzieren',
        'WLAN oder Hotspot für Bestellgeräte vor dem Fest prüfen',
        'Nach dem Fest: kurze Retro mit Zahlen aus den Auswertungen',
      ],
    },
    {
      heading: 'Praxisbeispiel: Jahresfest mit Grill und Küchenzelt',
      body: [
    'Eine Ortswehr plant das traditionelle Sommerfest mit Gottesdienst, Gerätepräsentation und abendlichem Musikprogramm. Früher liefen Bestellungen über Durchreichfenster und Zuruf; in der Stoßzeit nach 18 Uhr stapelten sich Zettel, und Gäste warteten ohne Statusinformation.',
    'Mit FestSchmiede bestellen Gäste am Stand-Tablet oder per Smartphone. Die Küche sieht offene Positionen auf dem Monitor, markiert fertige Bestellungen, und das Abholboard im Schattenzelt zeigt die Nummern. Schichtwechsel zwischen Früh- und Spätschicht brauchen nur noch eine kurze Statusübergabe statt Zettelchaos.',
    'Am Montag liefert das Dashboard belastbare Verkaufszahlen für den Einkauf im Folgejahr – und der Festausschuss diskutiert Verbesserungen anhand von Daten statt Bauchgefühl.',
    'Wichtig war außerdem, Online-Zahlung und Zahlung bei Abholung klar zu trennen: Gäste wussten, welcher Weg gilt, und die Ausgabe musste nicht parallel Kassenzettel und Zurufe jonglieren. Das Abholboard hing bewusst neben dem Wartebereich, nicht direkt am Engpass zur Gerätepräsentation. So blieb der öffentliche Charakter des Festes spürbar, während Bestellung, Küche und Abholung im Hintergrund ruhiger liefen. Genau diese Kombination aus sichtbarer Ordnung und ehrlicher Scope-Begrenzung überzeugte auch skeptische Kameraden im Folgejahr.'
  ].join('\n\n'),
    },

    {
      heading: 'Sicherheit, Öffentlichkeit und Bewirtung zusammendenken',
      body: [
    'Ein Feuerwehrfest ist öffentliche Visitenkarte. Gäste bewerten unbewusst nicht nur Bratwurst und Musik, sondern auch Ordnung an Ausgabe und Wegen. Digitalsichtbare Abläufe wirken hier ruhiger als Zurufchaos – ohne die Kameradschaft zu technisieren.',
    'Plant Bewirtungszonen so, dass Rettungswege und Gerätedarstellung nicht kollidieren. Digitale Bestellung kann Schlangen weg vom Engpass ziehen, wenn Abholboard und Wartebereich bewusst gesetzt sind. Technik ersetzt keine Absperrung, sie unterstützt aber die Lenkung von Personenströmen.',
    'Bezieht Jugendfeuerwehr und Förderverein früh ein: Wer am Stand hilft, braucht kurze Rollenkarten. Bestellseite, Küchenmonitor und Abholung lassen sich in wenigen Minuten erklären – vorausgesetzt, das Menü ist schlank und die Geräte stehen bereit.',
    'Nach großen Programmpunkten steigt die Nachfrage sprunghaft. Bereitet dafür Mengen und Personal vor und nutzt Auswertungen später, um diese Spitzen zu belegen. So wird aus Erfahrung Planung statt Anekdote im Festausschuss.',
  ].join('\n\n'),
    },

    {
      heading: 'Checkliste vom Festausschuss bis zum Abbau',
      body: [
    'Vier bis sechs Wochen vorher: Termin, Genehmigungen, Festleitung und Bewirtungsleitung fixieren. Menüentwurf erstellen, Mengen überschlagen, Geräte für Bestellung und Küche reservieren. Wer Digitalisierung plant, legt jetzt den Mandanten an und pflegt das Menü – nicht in der Aufbauwoche.',
    'Eine Woche vorher: Probelauf mit zwei kompletten Bestellzyklen. Prüft WLAN oder Hotspot, Ladekabel, Abholboard-Position und Ausverkauft-Rechte. Klärt, wer am Festtag Ansprechpartner für Technikstörungen ist, damit die Küche nicht improvisieren muss.',
    'Am Festtag: Kurzbriefing vor Einlass, Rollen klar, Menü eingefroren. Während Stoßzeiten Verfügbarkeit aktiv pflegen. Nach Programmhöhepunkten Personal an Ausgabe und Küche bündeln. Abholung sichtbar halten, Wege frei.',
    'Abbau und Montag: Geräte sichern, kurze Retro mit Zahlen aus Dashboard und Statistiken. Notiert zwei Verbesserungen fürs Folgejahr. So wird das Feuerwehrfest organisatorisch lernfähig – bei gleichbleibender Kameradschaft und Öffentlichkeit.',
  ].join('\n\n'),
      bullets: [
        'Owner für Menü und Technik benennen',
        'Probelauf verpflichtend vor dem Festwochenende',
        'Stoßzeiten am Programmplan markieren',
        'Nachbereitung mit Zahlen statt nur mit Gefühl',
      ],
    },
    {
      heading: 'Zusammenfassung',
      body: [
    'Ein Feuerwehrfest organisieren heißt, Programm, Sicherheit und Bewirtung gleichwertig zu planen. Digitale Unterstützung lohnt sich vor allem dort, wo Bestellung, Küche und Abholung parallel laufen und manuelle Koordination zum Engpass wird.',
    'FestSchmiede hilft als Open-Source-Veranstaltungsplattform genau in dieser Kette: Bestellungen, Küche, Abholung, Abholboard, Online-Zahlung und Auswertungen. So bleibt mehr Energie für Kameradschaft, Öffentlichkeit und das, was ein Feuerwehrfest ausmacht – ohne den Festbetrieb in Feature-Listen zu ersticken.',
    'Wer organisiert, sollte Digitalisierung als Ergänzung zur bestehenden Festkultur verstehen: Probelauf, schlankes Menü und klare Rollen zählen mehr als viele Module. Helferplanung und Genehmigungen bleiben analog eure Verantwortung; die Plattform macht den Bewirtungsfluss nachvollziehbar. Mit dieser Haltung wird aus dem nächsten Feuerwehrfest weniger Stress an Küche und Ausgabe – und mehr Raum für das, weshalb Menschen kommen: Gemeinschaft, Sicherheit und ein gelungenes Fest.'
  ].join('\n\n'),
    },
    ],
    faqs: [
    {
      q: 'Braucht jede Feuerwehr Software fürs Fest?',
      a: 'Nein. Bei kleinem Kameradschaftsfest mit einer Station reicht oft Papier. Sobald Küche und Ausgabe getrennt sind oder Stoßzeiten entstehen, wird ein gemeinsames System spürbar hilfreich.',
    },
    {
      q: 'Ersetzt FestSchmiede unseren Dienstplan?',
      a: 'Nein. Es gibt kein separates Schichtplan-Modul. Klare Bestell- und Küchenprozesse machen Helfereinsätze planbarer – ergänzend zu eurer bestehenden Helferliste.',
    },
    {
      q: 'Können Gäste auch ohne Smartphone bestellen?',
      a: 'Ja. Vor-Ort-Bestellung an Tablet oder Monitor ist Teil des Konzepts. Mobil bestellen ist optional und entlastet zusätzlich die Schlangen.',
    },
    {
      q: 'Wie starten wir als Wehr mit FestSchmiede?',
      a: 'Gemeinnützige Organisationen können einen Plattform-Mandanten beantragen oder selbst hosten. Legt Veranstaltung und Menü an und macht vor dem Fest einen kurzen Probelauf mit Küche und Ausgabe.',
    },
    {
      q: 'Gibt es Auswertungen für den Kassenbericht?',
      a: 'Dashboard und Statistiken liefern Verkaufszahlen und Beliebtheit von Speisen. Das ersetzt keine vollständige Vereinsbuchhaltung, unterstützt aber Nachkalkulation und Einkauf spürbar.',
    },
    ],
    relatedSlugs: [
      'software-fuer-vereinsfeste',
      'essensbestellung-verein',
      'kuechenmonitor',
      'abholnummern',
      'vereinsveranstaltung-digitalisieren',
    ],
    cta: {
      title: 'Feuerwehrfest digital entlasten',
      subtitle: 'Mandant beantragen oder Funktionen ansehen – Open Source für Wehren und Fördervereine.',
    },
  },
{
    slug: 'schuetzenfest-organisieren',
    title: 'Schützenfest organisieren: Tradition, Programm und Festbetrieb',
    metaTitle: 'Schützenfest organisieren | FestSchmiede',
    metaDescription:
      'Schützenfest organisieren: Königsschießen, Festzelt, Bewirtung und digitale Abläufe. Praxisleitfaden für Schützenvereine – mit FestSchmiede als Open Source.',
    cluster: 'veranstaltungen',
    keywords: [
      'Schützenfest organisieren',
      'Schützenfest Planung',
      'Festzelt Bewirtung',
      'Königsschießen Organisation',
      'digitale Festabläufe Schützenverein',
    ],
    intro: [
    'Ein Schützenfest zu organisieren bedeutet, Tradition und Logistik unter einen Hut zu bringen: Vogelschießen oder Scheibe, Festzug, Königshaus, Musik, Zeltbetrieb und oft ein mehrtägiges Programm mit wechselnden Höhepunkten. Zwischen Zeremonie und Geselligkeit muss die Bewirtung mitlaufen – sonst wird aus Feierstimmung Warteschlangenfrust.',
    'Gerade im Festzelt oder an den Essensständen treffen hohe Nachfrage und ehrenamtliche Helfer aufeinander. Wer Zettel, Zuruf und Zurufketten nutzt, kennt die typischen Brüche: Bestellungen gehen unter, die Küche kocht ins Blaue, die Ausgabe ruft Nummern, die niemand hört.',
    'Dieser Ratgeber erklärt die Organisationsbausteine eines Schützenfestes und zeigt, wie FestSchmiede als Open-Source-Veranstaltungsplattform Bestellung, Küche, Abholung, Abholboard, Online-Zahlung und Auswertungen entlastet – ohne Tradition durch Technik zu ersetzen.'
  ].join('\n\n'),
    sections: [
    {
      heading: 'Was gehört zum Organisieren eines Schützenfestes?',
      body: [
    'Schützenfest organisieren umfasst sportlich-zeremonielle Teile ebenso wie Gastgeberpflichten. Typische Bausteine sind Ausschussarbeit, Genehmigungen, Festplatz oder Zelt, Programmablauf, Protokoll und Bewirtung. Jeder Baustein hat eigene Verantwortliche – und genau deshalb braucht es Schnittstellen, die nicht nur irgendwie funktionieren.',
    'Die Bewirtung ist oft der größte Personalblock: Einkauf, Kühlung, Küche, Ausschank, Kasse und Ausgabe. Wenn diese Kette stockt, spüren Gäste das sofort – unabhängig davon, wie gelungen Königsschießen und Festzug waren.',
    'Ein mehrtägiges Fest multipliziert die Komplexität: Freitagabend, Festzugstag und Königsabend haben unterschiedliche Stoßzeiten und Menübedarfe. Wer das nicht vorplant, überfordert Küche und Helfer in den lautesten Stunden.'
  ].join('\n\n'),
      bullets: [
        'Festausschuss mit klaren Ressorts für Programm, Platz, Bewirtung und Sicherheit',
        'Zeitplan von Aufbau über Höhepunkte bis Abbau',
        'Abstimmung mit Kommune, Nachbarschaft und Musikgruppen',
        'Bewirtungskonzept inklusive Menü, Kapazität und Schichten',
      ],
    },
    {
      heading: 'Warum digitale Abläufe am Schützenfest helfen',
      body: [
    'Schützenfeste haben natürliche Stoßzeiten: nach dem Festzug, nach der Proklamation, am Samstagabend. In diesen Fenstern verdoppelt sich die Last an Küche und Ausgabe. Digitale Bestellungen und ein gemeinsamer Status reduzieren Doppelarbeit und Rückfragen genau dann, wenn Lautstärke und Menschenmenge am größten sind.',
    'Außerdem wechseln Helfer oft zwischen Zelt, Ausschank und Küche. Ein gemeinsames System macht Übergaben einfacher als ein Stapel nasser Zettel am Küchenfenster.',
    'Für Gäste wird Wartezeit erträglicher, wenn sie den Status ihrer Bestellung nachvollziehen können – statt im Lärm zu raten, ob ihre Nummer schon aufgerufen wurde.'
  ].join('\n\n'),
    },
    {
      heading: 'Typische Probleme ohne gemeinsame Prozesse',
      body: 'Ohne digitale oder zumindest streng standardisierte Abläufe entstehen typische Schützenfest-Reibungen:',
      bullets: [
        'Zettelchaos zwischen Zeltküche und Ausgabe',
        'Unklare Wartezeiten während der lautesten Programmteile',
        'Ausverkaufte Speisen werden trotzdem weiter aufgenommen',
        'Kassendifferenzen durch parallele Listen und mündliche Preisabsprachen',
        'Nachbereitung ohne belastbare Verkaufszahlen fürs Folgejahr',
      ],
    },
    {
      heading: 'Wie FestSchmiede im Festbetrieb wirkt',
      body: [
    'Gäste bestellen über die Bestellseite – mobil oder an Geräten vor Ort. Die Küche sieht offene Bestellungen in Echtzeit, arbeitet Positionen ab und setzt den Status auf abholbereit. Das Abholboard zeigt fertige Nummern; die Ausgabe bestätigt die Abholung.',
    'Online-Zahlung kann Warteschlangen an der Kasse entlasten; Zahlung bei Abholung bleibt möglich. Auswertungen helfen dem Festausschuss bei Nachkalkulation und Menüplanung – etwa welche Gerichte am Königsabend wirklich liefen.',
    'FestSchmiede ist keine Vereinsverwaltungssoftware für Mitgliederakten oder Beitragsbuchhaltung und kein Ersatz für euren Zeremonienablauf. Es ist Werkzeug für die Bewirtungskette.'
  ].join('\n\n'),
      table: {
        headers: ['Situation', 'Ohne System', 'Mit FestSchmiede'],
        rows: [
          ['Nach dem Festzug', 'Zettelstau', 'Digitale Bestellwelle mit Status'],
          ['Zeltküche', 'Zurufe', 'Küchenmonitor'],
          ['Ausgabe im Lärm', 'Nummern rufen', 'Abholboard sichtbar'],
          ['Montagsbericht', 'Schätzung', 'Dashboard und Statistiken'],
        ],
      },
    },
    {
      heading: 'Vorteile für Verein und Gäste',
      body: 'Der Gewinn liegt in ruhigeren Stationen und nachvollziehbaren Zahlen:',
      bullets: [
        'Weniger Stress in Küche und Ausgabe trotz Programmspitzen',
        'Bessere Gäste-Erfahrung durch klaren Bestellstatus',
        'Einfachere Einarbeitung von Helfern aus Nachbarvereinen',
        'Transparente Grundlage für Einkauf und Preisdiskussionen',
        'Open Source und modular – passend zu ehrenamtlichen Budgets',
      ],
    },
    {
      heading: 'Für wen ist das relevant?',
      body: [
    'Schützenvereine mit Festzelt, mehreren Essensständen oder mehrtägigem Programm profitieren am meisten. Auch gemeinsame Feste mit Spielmannszug, Musikverein oder Nachbarorten gewinnen, wenn Bestellungen zentral sichtbar sind.',
    'Kleine Vogelschießen mit Imbiss am Rand können weiterhin analog bleiben. Der Umschwung lohnt sich, sobald parallele Bestellungen und Lärm die Zuruf-Kommunikation unzuverlässig machen.'
  ].join('\n\n'),
    },
    {
      heading: 'Wann digitalisieren?',
      body: 'Sinnvolle Zeitpunkte sind Jubiläen, erstmals größeres Zelt oder wiederkehrende Beschwerden über Wartezeiten:',
      bullets: [
        'Ihr plant ein mehrtägiges Schützenfest mit Zeltbetrieb',
        'Küche und Ausgabe sind räumlich oder akustisch getrennt',
        'Ihr erwartet starke Stoßzeiten nach Zug und Proklamation',
        'Helfer aus anderen Vereinen sollen schnell mitarbeiten können',
        'Der Ausschuss will Menü und Einkauf datenbasiert verbessern',
      ],
    },
    {
      heading: 'Typische Organisationsfehler',
      body: [
    'Tradition gegen Technik ausspielen: Digitalisierung ersetzt keinen Festzug und kein Königshaus – sie entlastet die Bewirtung. Wer beides vermischt, erzeugt unnötige Debatten.',
    'Zu spätes Onboarding: Am Freitagabend Geräte auspacken ohne Schulung führt zu Frust. Besser: Menü vorher pflegen, Probelauf mit zwei Bestellungen, Rollen klären.',
    'Überladenes Sortiment: Ein Zeltmenü mit zu vielen Varianten verlangsamt Küche und Bestellung. Schlank starten, bei Bedarf erweitern.',
    'Ebenso problematisch ist, digitale Bestellung nur für den Samstagabend zu planen und Freitag sowie Sonntag analog zu lassen, ohne die Küche auf den Wechsel vorzubereiten. Parallele Prozesse erzeugen Doppelarbeit und verwirrte Gäste. Besser ist ein durchgängiger Ablauf über alle Bewirtungstage – auch wenn die Frequenz unterschiedlich ist. Wer außerdem Auswertungen ignoriert und jedes Jahr neu schätzt, verschenkt den größten Langzeitnutzen: belastbare Mengen und ruhigere Einkaufsentscheidungen vor dem nächsten Schützenfest.'
  ].join('\n\n'),
    },
    {
      heading: 'Best Practices',
      body: 'Pragmatische Regeln, die sich an Schützenfesten bewährt haben, verbinden Tradition mit ruhiger Bewirtung: Bewirtungsleitung bleibt feste Rolle, Menü folgt den Programmtagen, und das Abholboard steht außerhalb der lautesten Zone. Verfügbarkeit wird aktiv gepflegt, Netz und Ladekabel vor Einlass geprüft. Online-Zahlung und Vor-Ort-Bestellung können parallel laufen, solange Ausgabe und Küche denselben Status sehen. Sonntags liefern Auswertungen Stoff für den Ausschuss – ohne Zeremonie oder Schießbetrieb anzufassen. Konkret hilft:',
      bullets: [
        'Bewirtungsleitung als feste Rolle im Ausschuss',
        'Menü an Programmtage anpassen – leichte Speisen mittags, Klassiker abends',
        'Abholboard außerhalb der Tanzfläche, aber gut einsehbar',
        'Einen Verantwortlichen für Verfügbarkeit und Ausverkauft',
        'Kurzcheck WLAN und Ladekabel vor Einlass',
        'Sonntags kurze Auswertung mit dem Ausschuss',
      ],
    },
    {
      heading: 'Praxisbeispiel: Mehrtägiges Schützenfest im Zelt',
      body: [
    'Ein Schützenverein feiert drei Tage mit Festzug, Königsschießen und Abendprogramm. Früher brach die Essensausgabe samstags regelmäßig zusammen, weil Zettel in der lautesten Phase unleserlich wurden und Nummern untergingen.',
    'Mit FestSchmiede bestellen Gäste am Tresen-Tablet oder per Smartphone. Die Küche arbeitet am Monitor, das Abholboard zeigt fertige Nummern. Die Ausgabe bleibt ruhiger; Helferwechsel um Mitternacht brauchen keine Zettelübergabe mehr.',
    'Nach dem Fest sieht der Ausschuss, welche Gerichte an welchem Tag liefen – und plant Einkauf und Menü fürs Folgejahr ohne Ratespiel.',
    'Im zweiten Jahr verkürzte der Verein das Menü um zwei langsam laufende Varianten und verlängerte die Öffnungszeiten der leichten Mittagsgerichte. Online-Zahlung entlastete die Kasse in den lautesten Stunden, während Bargeld bei Abholung weiter möglich blieb. Das Abholboard stand bewusst abseits der Tanzfläche, aber im Blickfeld der Wartenden. Helferwechsel um Mitternacht dauerten Minuten statt einer Zettelsuche. Die Zeremonie blieb unberührt – entlastet wurde nur die Bewirtungskette hinter dem Tresen.'
  ].join('\n\n'),
    },
    {
      heading: 'Zusammenspiel von Zeremonie und Bewirtung',
      body: [
    'Königsschießen, Festzug und Proklamation erzeugen planbare Publikumsbewegungen. Nutzt diese Kenntnis für Bewirtungskapazität: Mehr Personal und vorbereitete Mengen in den bekannten Stoßfenstern, ruhigere Besetzung dazwischen.',
    'Digitale Bestellungen helfen in den lauten Phasen besonders, weil Status nicht auf Gehör angewiesen ist. Gleichzeitig bleibt Raum für persönliche Gastgeberkultur an der Ausgabe – Technik ersetzt kein Lächeln, sie reduziert nur das Chaos dahinter.',
    'Dokumentiert nach dem Fest kurz, welche Programmteile welche Last erzeugt haben. So wird aus Erfahrung Planung statt Legende – und das Schützenfest bleibt traditionell, aber organisatorisch lernfähig.',
  ].join('\n\n'),
    },

    {
      heading: 'Menü, Zeltakustik und Stoßzeiten praktisch planen',
      body: [
    'Im Festzelt konkurrieren Bestellrufe mit Musik und Gesang. Deshalb sind sichtbare Statusanzeigen wertvoller als lauteres Rufen. Ein Abholboard an einer ruhigeren Wandseite entlastet Ausgabe und Gäste zugleich.',
    'Plant Menüs nach Tageszeit: mittags schnell und leicht, abends klassische Festgerichte. Digitale Verfügbarkeit verhindert, dass ausverkaufte Artikel weiter aufgenommen werden – ein häufiger Stressfaktor in der zweiten Zeltnacht.',
    'Koordiniert Bewirtung mit dem Zeremonienplan. Nach Proklamation und Festzug kommen Wellen; dazwischen gibt es Atempausen für Vorproduktion. Küchenmonitor und Bestelllage machen diese Wellen steuerbar, statt sie nur auszuhalten.',
    'Helfer aus befreundeten Vereinen schätzt ihr, wenn der Ablauf selbsterklärend ist. Ein gemeinsames System verkürzt Einweisung und reduziert Fehler an fremden Tresen. Das ist gelebte Vereinsfreundschaft mit weniger Reibung.',
  ].join('\n\n'),
    },

    {
      heading: 'Checkliste für Ausschuss und Bewirtungsteam',
      body: [
    'Frühphase: Ressorts im Festausschuss besetzen und Bewirtung als eigenes Arbeitspaket führen. Zeltplan mit Küche, Ausgabe, Abholzone und Laufwegen skizzieren. Digitalisierung gehört in denselben Plan wie Strom und Kühlung.',
    'Vorbereitungsphase: Menü finalisieren, Artikelbezeichnungen vereinheitlichen, Preise freigeben. FestSchmiede-Veranstaltung anlegen, Module aktivieren, Testbestellungen fahren. Helfer aus Nachbarvereinen erhalten eine Ein-Seiten-Kurzanleitung.',
    'Festtage: Schichtübergaben mit Blick auf offene Bestellungen und Ausverkauft-Status. Nach Festzug und Proklamation Personal verstärken. Abholboard gegen Lärm und Gedränge schützen, aber sichtbar lassen.',
    'Nachbereitung: Auswertung teilen, Menü und Mengen fürs Folgejahr anpassen, Technikfeedback sammeln. Tradition bleibt im Zeremoniell; Lernen gehört in die Bewirtung. Genau diese Trennung hält das Schützenfest zukunftsfähig.',
  ].join('\n\n'),
      bullets: [
        'Bewirtung und Zeremonie getrennte Verantwortliche',
        'Testlauf vor dem ersten Zeltabend',
        'Stoßfenster im Programm kalendern',
        'Zahlenbasierte Retro im Ausschuss',
      ],
    },

    {
      heading: 'Was FestSchmiede bewusst nicht ersetzt',
      body: [
    'Schützenfest braucht Zeremonie, Protokoll und Vereinskultur – das bleibt analog und menschlich. FestSchmiede ersetzt weder Schießbetrieb noch Festzugslogistik noch Mitgliederverwaltung.',
    'Ebenso wenig ist es ein vollständiges Kassenbuch oder ein Schichtplan-Modul. Helferplanung bleibt eure Liste; Getränke erscheinen als Katalogartikel in Bestellungen mit Umsatzstatistik, nicht als separates Abrechnungssystem.',
    'Diese Grenzen sind Absicht: Weniger Scope bedeutet höhere Alltagstauglichkeit. Wer ehrlich kommuniziert, was die Plattform kann, vermeidet Enttäuschung und gewinnt Vertrauen im Ausschuss.',
  ].join('\n\n'),
    },

    {
      heading: 'Kommunikation im Festzelt',
      body: [
    'Im Zelt gilt: kurze Ansagen, große Sichtbarkeit. Erklärt Gästen einmal, wo bestellt und wo abgeholt wird, und wiederholt das bei Schichtwechsel. Digitale Nummern wirken nur mit lokalem Verständnis.',
    'Für das Königshaus und Ehrengäste könnt ihr analoge Sonderwege behalten, solange die Küche sie als priorisierte Ausnahmen kennt. Transparente Ausnahmen sind besser als heimliche Parallelzettel.',
  ].join('\n\n'),
    },
    {
      heading: 'Zusammenfassung',
      body: [
    'Schützenfest organisieren bleibt Handwerk aus Tradition, Programm und Gastgeberpflicht. Digitale Abläufe entlasten vor allem die Bewirtung in Stoßzeiten und machen Helferwechsel robuster.',
    'FestSchmiede unterstützt als Open-Source-Veranstaltungsplattform Bestellungen, Küche, Abholung, Abholboard, Online-Zahlung und Auswertungen – damit Feier und Festbetrieb zusammenpassen, ohne die Zeremonie zu digitalisieren.',
    'Für Ausschüsse heißt das konkret: Tradition pflegen und Bewirtung modern ruhig halten. Kein Schichtplan-Modul, keine Getränkeabrechnung als Kontensystem – dafür klare Status von Bestellung bis Abholung und Zahlen für die Nachkalkulation. Wer diesen Scope ehrlich kommuniziert, gewinnt Vertrauen und vermeidet Enttäuschung. So bleibt das Schützenfest das, was es sein soll: Festkultur mit belastbarer Organisation im Hintergrund.'
  ].join('\n\n'),
    },
    ],
    faqs: [
    {
      q: 'Stört digitale Bestellung die Zeltatmosphäre?',
      a: 'Nein, wenn ihr sie dezent einsetzt: Tablets am Stand, Abholboard im Wartebereich. Gäste können weiter vor Ort bestellen; Smartphones sind optional.',
    },
    {
      q: 'Können wir Bargeld und Online-Zahlung mischen?',
      a: 'Ja. Typisch ist die Kombination aus Online-Zahlung und Zahlung bei Abholung – je nachdem, was für eure Gäste und Helfer passt.',
    },
    {
      q: 'Brauchen wir FestSchmiede fürs Königsschießen?',
      a: 'Nein. Sport und Zeremonie bleiben eure Domäne. FestSchmiede hilft bei Speisen- und Getränkeabläufen rund ums Fest.',
    },
    {
      q: 'Wie aufwendig ist die Einrichtung?',
      a: 'Veranstaltung und Menü sind schnell angelegt. Plant zusätzlich einen kurzen Probelauf mit Küche und Ausgabe – das spart am Festtag die meisten Nerven.',
    },
    {
      q: 'Ist die Software für gemeinnützige Vereine geeignet?',
      a: 'Ja. FestSchmiede ist Open Source; gemeinnützige Organisationen können einen Plattform-Mandanten beantragen oder selbst hosten.',
    },
    ],
    relatedSlugs: [
      'festsoftware',
      'veranstaltungssoftware',
      'digitale-essensbestellung',
      'online-vorbestellung-vereinsfest',
      'kirmes-organisieren',
    ],
    cta: {
      title: 'Schützenfest-Bewirtung entlasten',
      subtitle: 'Jetzt Mandant beantragen oder Funktionen von FestSchmiede ansehen.',
    },
  },
{
    slug: 'kirmes-organisieren',
    title: 'Kirmes organisieren: Stände, Abläufe und Essensverkauf',
    metaTitle: 'Kirmes organisieren | FestSchmiede',
    metaDescription:
      'Kirmes organisieren: Stände, Helfer, Essensverkauf und digitale Bestellprozesse. Leitfaden für Vereine und Ortsgemeinschaften – mit FestSchmiede Open Source.',
    cluster: 'veranstaltungen',
    keywords: [
      'Kirmes organisieren',
      'Kirmes Planung',
      'Kirchweih Organisation',
      'Essensstände Kirmes',
      'digitale Bestellung Kirmes',
    ],
    intro: [
    'Kirmes – regional auch Kirchweih, Kerb oder Räggeli – ist Ortsfest und Vereinsprojekt zugleich. Wer eine Kirmes organisieren will, koordiniert Platz, Stände, Programm, Sicherheit und oft mehrere Bewirtungspunkte gleichzeitig. Die Stimmung soll locker sein; die Logistik dahinter ist es selten.',
    'Gerade Essens- und Getränkestände erzeugen an Stoßzeiten Warteschlangen, die den Charakter der Kirmes prägen – im Guten wie im Schlechten. Zettelwirtschaft und Zurufe skalieren schlecht, wenn mehrere Stände parallel bedienen und Helfer stündlich wechseln.',
    'Dieser Leitfaden sortiert die Organisationsaufgaben einer Kirmes und zeigt, wo FestSchmiede als Open-Source-Veranstaltungsplattform mit Bestellungen, Küche, Abholung, Abholboard, Online-Zahlung und Auswertungen ehrlich unterstützt.'
  ].join('\n\n'),
    sections: [
    {
      heading: 'Was heißt Kirmes organisieren?',
      body: [
    'Kirmes organisieren bedeutet, ein öffentliches Ortsfest mit wechselnden Akteuren aufzusetzen: Vereine, Standbetreiber, Musik, oft Kirche und Kommune. Neben dem sichtbaren Programm stehen Genehmigungen, Strom, Absperrungen, Müll und Bewirtung.',
    'Im Unterschied zu einem reinen Vereinsabend ist die Kirmes publikumsstark und oft mehrtägig. Das erhöht die Anforderungen an reproduzierbare Abläufe – besonders an Essensständen, die von ehrenamtlichen Teams betrieben werden.',
    'Viele Orte verbinden Brauchtum mit Vereinsfinanzierung: Der Stand muss laufen, sonst fehlt am Jahresende Spielraum für Jugendarbeit oder Geräte. Deshalb ist stabile Bewirtungslogistik kein Nice-to-have, sondern Teil der Vereinsstrategie.'
  ].join('\n\n'),
      bullets: [
        'Gesamtkoordination Platz und Zeiten',
        'Abstimmung mit Behörden und Nachbarschaft',
        'Standkonzept inklusive Bewirtung und Strom',
        'Helferpools der beteiligten Vereine synchronisieren',
      ],
    },
    {
      heading: 'Warum klare Verkaufsabläufe entscheidend sind',
      body: [
    'An der Kirmes treffen Laufkundschaft und Stammgäste auf begrenzte Kapazität. Wenn Bestellung und Ausgabe nicht greifen, entstehen Schlangen, die den gesamten Platz blockieren. Das ist nicht nur unbequem – es kostet Umsatz und Nerven.',
    'Digitale Bestellprozesse schaffen Sichtbarkeit über Standgrenzen hinweg: Was ist offen, was ist fertig, was ist ausverkauft? Gerade wenn Küche im Zelt und Ausgabe am Tresen getrennt sind, ersetzt Status die Zurufkette.',
    'Klarheit hilft auch dem Einkauf: Wenn ihr seht, welche Speisen wann liefen, plant ihr Mengen realistischer und reduziert sowohl Engpässe als auch Lebensmittelverschwendung.'
  ].join('\n\n'),
    },
    {
      heading: 'Typische Probleme auf der Kirmes',
      body: 'Viele Ortsfeste scheitern nicht am Programm, sondern an der Bewirtungslogistik:',
      bullets: [
        'Mehrere Stände mit unterschiedlichen Zettel-Systemen',
        'Keine gemeinsame Sicht auf offene Bestellungen',
        'Ausverkauf wird zu spät kommuniziert',
        'Helferwechsel ohne Übergabe in Stoßzeiten',
        'Kaum belastbare Zahlen für die Nachkalkulation der Vereine',
        'Jugendhelfer kennen den informellen Ablauf nicht',
      ],
    },
    {
      heading: 'Wie digitale Bestellung auf der Kirmes funktioniert',
      body: [
    'Mit FestSchmiede legt ihr Veranstaltung und Speisen sowie Getränke an. Gäste bestellen online oder vor Ort; die Küche arbeitet in der Küchenansicht; Abholung und Abholboard koordinieren die Ausgabe. Optional unterstützen Online-Zahlungen den bargeldarmen Betrieb.',
    'Ihr aktiviert modular nur das, was ihr braucht. Für die Kirmes typisch: Bestellung, Küche, Abholung, Abholboard und Auswertungen. Ein separates Kirmes-Modul für Schaustellerverwaltung oder Platzbelegung gibt es nicht – der Fokus bleibt die Bewirtungskette.',
    'Vorbestellungen können Stoßzeiten entzerren, etwa für feste Menüs am Samstagabend. Das ist optional, aber besonders hilfreich, wenn der Platz eng und die Nachfrage absehbar ist.'
  ].join('\n\n'),
      table: {
        headers: ['Standprozess', 'Analog', 'Digital mit FestSchmiede'],
        rows: [
          ['Aufnahme', 'Zuruf oder Zettel', 'Bestellseite'],
          ['Zubereitung', 'Stapel', 'Küchenmonitor'],
          ['Ausgabe', 'Namen rufen', 'Abholnummer und Board'],
          ['Auswertung', 'Schätzung', 'Dashboard'],
        ],
      },
    },
    {
      heading: 'Vorteile für Ortsvereine und Gäste',
      body: 'Der Nutzen verteilt sich auf Organisationsteam, Helfer und Publikum:',
      bullets: [
        'Kürzere, ruhigere Schlangen an Essensständen',
        'Weniger Missverständnisse zwischen Küche und Ausgabe',
        'Schnellere Einarbeitung wechselnder Helfer',
        'Gemeinsame Zahlenbasis für beteiligte Vereine',
        'Open Source ohne Zwang zu proprietären Komplettpaketen',
      ],
    },
    {
      heading: 'Für wen eignet sich der Ansatz?',
      body: [
    'Ideal für Vereine und Ortsgemeinschaften, die eigene Bewirtung betreiben – Feuerwehr, Sportverein, Musikverein, Förderkreis. Weniger relevant ist der Ansatz für reine Schausteller-Kirmes ohne Vereinsgastronomie.',
    'Wenn mehrere Vereine an einem Wochenende nacheinander denselben Stand betreiben, hilft ein gemeinsames System besonders bei Schichtübergaben und Menüklarheit.'
  ].join('\n\n'),
    },
    {
      heading: 'Wann solltet ihr umstellen?',
      body: 'Gute Anlässe für den Wechsel:',
      bullets: [
        'Wiederkehrende Beschwerden über Wartezeiten',
        'Erstmals eigener großer Essensstand oder Zeltküche',
        'Jubiläums-Kirmes mit erwartbar mehr Publikum',
        'Wunsch nach Online-Vorbestellung für feste Menüs',
        'Vorstand will Einkauf und Preise datenbasiert steuern',
      ],
    },
    {
      heading: 'Typische Fehler',
      body: [
    'Alles auf einmal digitalisieren wollen: Startet mit der Bewirtungskette, nicht mit einer Vision komplette Kirmes-App.',
    'Netz vergessen: Ohne stabile Verbindung für Tablets stockt der Betrieb. Prüft Strom und WLAN oder Hotspot früh.',
    'Zu viele Sonderwünsche im Menü: Kirmes lebt von Klarheit – drei starke Gerichte schlagen zwölf Varianten.',
    'Keine klare Ansage an Gäste, wo bestellt und abgeholt wird – dann entstehen Parallelschlangen am alten Tresen.',
    'Ein weiterer Klassiker: Auswertungen nach der Kirmes in der Schublade lassen. Dann wiederholt sich Verschwendung und Unterversorgung im Folgejahr. Wer Verkaufszahlen und Beliebtheit der Speisen teilt, verbessert Einkauf und Schichtbesetzung. Ebenso riskant ist es, Online-Zahlung einzuführen, ohne Kassenteam und Ausgabe auf gemischte Zahlungswege vorzubereiten. Klare Regeln und ein kurzer Probelauf verhindern, dass Technik am Samstagabend zur Zusatzlast wird statt zur Entlastung.'
  ].join('\n\n'),
    },
    {
      heading: 'Best Practices',
      body: 'So bleibt die Kirmes entspannt und zahlungskräftig: Ein Bewirtungsverantwortlicher über alle Schichten hält Preise und Artikel einheitlich, Probeläufe decken Netz- und Menüfehler vor dem Publikum auf, und das Abholboard hält Wege frei. Ausverkauft wird konsequent geschaltet, damit Küche und Bestellung nicht auseinanderlaufen. Nach der Kirmes teilt ihr Zahlen und passt Mengen an – genau dort entsteht der Mehrjahresnutzen von FestSchmiede als Open-Source-Veranstaltungsplattform für Bestellungen, Küche, Abholung und Auswertungen. Im Alltag zählen:',
      bullets: [
        'Einen Bewirtungsverantwortlichen über alle Schichten',
        'Einheitliche Preise und Artikelbezeichnungen',
        'Probelauf am Vortag mit zwei kompletten Bestellzyklen',
        'Abholboard so platzieren, dass Schlangen den Weg nicht blockieren',
        'Ausverkauft-Status konsequent pflegen',
        'Nach der Kirmes Zahlen teilen und Menü anpassen',
      ],
    },
    {
      heading: 'Praxisbeispiel: Vereinsstand auf der Orts-Kirmes',
      body: [
    'Ein Sportverein betreibt den zentralen Essensstand am Kirmeswochenende. Früher notierten Jugendliche Bestellungen auf Blocks; in der Samstagsstoßzeit gingen Zettel verloren, und die Küche kochte Positionen doppelt.',
    'Mit FestSchmiede bestellen Gäste am Stand oder per Smartphone. Die Küche sieht den Monitor, das Abholboard entzerrt die Ausgabe. Am Montag zeigt die Auswertung, welche Gerichte wirklich liefen – Grundlage für den Einkauf der nächsten Kirmes.',
    'Nebenbei sank der Stress in der Jugendarbeit: Neue Helfer brauchten weniger Einweisung, weil Status und Nummern sichtbar waren statt Geheimwissen.',
    'Im Folgejahr nutzte der Verein die Auswertungen, um Mittags- und Abendmengen zu trennen und zwei langsam laufende Beilagen zu streichen. Das Abholboard wurde näher an den Wartebereich gerückt, die Bestelltablets blieben am Standrand. Online-Zahlung entlastete Stoßzeiten, Bargeld bei Abholung blieb für Laufkundschaft möglich. Entscheidend war die ehrliche Begrenzung: FestSchmiede steuerte Bestellungen, Küche, Abholung und Zahlen – nicht Platzvergabe oder Schaustellerkoordination. Genau deshalb blieb die Akzeptanz im Vorstand hoch.'
  ].join('\n\n'),
    },

    {
      heading: 'Platz, Strom und Standlogistik für die Bewirtung',
      body: [
    'Kirmesplätze sind voll: Kinderkarussell, Bühne, Stände, Laufwege. Bewirtung braucht deshalb klar markierte Bestell- und Abholzonen. Digitale Nummern helfen nur, wenn Gäste wissen, wohin sie schauen sollen.',
    'Stromkreise und Netz für Küche sowie Tablets früh mitdenken. Ein geniales Bestellsystem ohne Strom ist am Samstagabend wertlos. Hotspot-Tests am Aufbautag sparen Eskalationen in der Stoßzeit.',
    'Wenn mehrere Vereine nacheinander denselben Stand übernehmen, standardisiert Artikelbezeichnungen und Preise. Sonst entstehen Missverständnisse in Bestellung und Auswertung. Ein gemeinsames Menü mit klaren Verantwortlichen schlägt kreative Chaos-Varianten.',
    'Nutzt Auswertungen nicht nur für den Kassensturz, sondern für Mengenplanung: Welche Speisen gingen freitags, welche samstags? So sinkt Verschwendung und ihr startet die nächste Kirmes mit weniger Bauchgefühl und mehr Ruhe.',
  ].join('\n\n'),
    },

    {
      heading: 'Vom Aufbau bis zur Nachkalkulation',
      body: [
    'Vor der Kirmes: Standflächen, Strom, Kühlung und Netz klären. Menü mit realistischen Mengen planen und digital anlegen. Wer Vorbestellung nutzt, kommuniziert Fristen klar an Ortsvereine und Stammgäste.',
    'Aufbautag: Geräte positionieren, Abholzone markieren, Kurzschulung halten. Zwei Testbestellungen von Aufnahme bis Abholung. Ohne diesen Check bleiben Fehler unsichtbar, bis die erste Stoßwelle kommt.',
    'Betriebstage: Verfügbarkeit pflegen, Schichten übergeben, Schlangen beobachten. Wenn der Weg blockiert wird, Ausgabezone anpassen – Technik folgt der Fläche, nicht umgekehrt. Online-Zahlung nur dort einsetzen, wo sie wirklich entlastet.',
    'Danach: Dashboard auswerten, Einkaufslisten korrigieren, Feedback der Helfer sammeln. Eine kurze Dokumentation reicht, damit der nächste Jahrgang nicht bei null beginnt. So wird Kirmes-Organisation zum wiederholbaren Handwerk.',
  ].join('\n\n'),
      bullets: [
        'Netz und Strom vor dem Festtag testen',
        'Abholzone im Platzplan verankern',
        'Mengenplanung mit Vorjahreszahlen koppeln',
        'Helferfeedback systematisch festhalten',
      ],
    },

    {
      heading: 'Was FestSchmiede bewusst nicht ersetzt',
      body: [
    'Kirmes braucht Platzvergabe, Schaustellerkoordination und behördliche Auflagen – das bleibt außerhalb der Plattform. FestSchmiede fokussiert die Vereinsbewirtung: Bestellung, Küche, Abholung, Abholboard, Zahlung und Auswertung.',
    'Es gibt kein separates Schaustellerportal und kein Kirmes-Gesamtmanagement. Dafür gibt es klare Oberflächen für Helfer am Stand und nachvollziehbare Zahlen danach.',
    'Ehrlich bleiben lohnt sich: Wer Digitales nur dort einsetzt, wo Zettelchaos echt weh tut, bekommt Akzeptanz. Der Rest der Kirmes darf analog, laut und lebendig bleiben.',
  ].join('\n\n'),
    },

    {
      heading: 'Kommunikation vor und während der Kirmes',
      body: [
    'Kündigt digitale Bestellung früh an: Aushang, Vereinschat, ggf. Ortsblatt. Gäste akzeptieren neue Wege, wenn sie wissen, wo bestellt und wo abgeholt wird. Unangekündigte Parallelprozesse erzeugen Doppelarbeit.',
    'Während der Kirmes reicht ein kurzer Hinweis am Stand: Bestellen hier, abholen dort, Nummer beachten. Helfer sollten denselben Satz verwenden. Einheitliche Sprache reduziert Nachfragen spürbar.',
    'Nach Stoßzeiten kurz innehalten: Läuft das Board? Sind Artikel korrekt ausverkauft? Kleine Checks verhindern, dass sich Fehler über den Abend aufschaukeln. Digitalisierung braucht Aufmerksamkeit, nicht Dauerstress.',
  ].join('\n\n'),
    },
    {
      heading: 'Nachhaltiger Betrieb über mehrere Jahre',
      body: [
    'Kirmes wiederholt sich. Speichert Menüversionen und Mengennotizen digital oder zumindest zentral. Der größte Produktivitätsgewinn entsteht oft im zweiten und dritten Jahr, wenn das Team den Ablauf kennt.',
    'Wechselt Festleitung oder Standcrew, bleibt der Prozess. Genau dafür lohnen schlanke Systeme und kurze Leitfäden mehr als persönliche Heldengeschichten vom Tresen.',
  ].join('\n\n'),
    },
    {
      heading: 'Zusammenfassung',
      body: [
    'Kirmes organisieren verbindet Ortsfest und Vereinsarbeit. Digitale Unterstützung lohnt sich vor allem am Essens- und Getränkeverkauf, wo parallele Bestellungen und Helferwechsel klassische Zettelprozesse überfordern.',
    'FestSchmiede bietet als Open-Source-Veranstaltungsplattform Bestellungen, Küche, Abholung, Abholboard, Online-Zahlung und Auswertungen – ehrlich fokussiert auf diese Abläufe, damit die Kirmes wieder nach Fest klingt und nicht nach Warteschlange.',
    'Organisation heißt hier: früh netzfähig planen, Menü schlank halten, Gästewege beschildern und nach der Kirmes lernen. Wer Digitalisierung als Jahresschleife versteht – Vorbereitung, Probelauf, Betrieb, Retro – baut Kompetenz auf, die Helferwechsel übersteht. Der Rest der Kirmes darf laut, analog und ortstypisch bleiben. Genau diese Haltung macht digitale Bewirtung im Vereinsalltag tragfähig.'
  ].join('\n\n'),
    },
    ],
    faqs: [
    {
      q: 'Können mehrere Vereine dieselbe Instanz nutzen?',
      a: 'Jede Organisation erhält typischerweise einen eigenen Mandanten. Für gemeinsame Stände klärt ihr, wer Veranstaltung und Menü verantwortet – technisch bleibt die Trennung der Mandanten klar.',
    },
    {
      q: 'Funktioniert das auch bei schwachem Empfang auf dem Festplatz?',
      a: 'Plant Netz früh: Hotspot, Kabel oder stabile WLAN-Versorgung für Küche und Bestellgeräte. Ohne Verbindung hilft keine Software.',
    },
    {
      q: 'Gibt es Vorbestellung für feste Menüs?',
      a: 'Ja. Über die öffentliche Bestellseite können Speisen vorab gewählt werden – das entlastet Schlangen und hilft der Küche bei der Planung.',
    },
    {
      q: 'Ersetzt FestSchmiede die Standkasse komplett?',
      a: 'Es unterstützt Bestellungen und optionale Online-Zahlung sowie Auswertungen. Ein separates Kassenbuch- oder Schausteller-Abrechnungssystem ist es nicht.',
    },
    {
      q: 'Für welche Kirmes-Größe lohnt sich der Einstieg?',
      a: 'Sobald ihr parallele Bestellungen, getrennte Küche und Ausgabe oder spürbare Stoßzeiten habt. Bei einem kleinen Kuchenstand kann Papier weiterhin reichen.',
    },
    ],
    relatedSlugs: [
      'digitale-essensbestellung',
      'essensbestellung-verein',
      'abholnummern',
      'dorffest-organisieren',
      'festverwaltung',
    ],
    cta: {
      title: 'Kirmes-Bewirtung digital ordnen',
      subtitle: 'Mandant beantragen oder FestSchmiede-Funktionen ansehen – Open Source für Ortsvereine.',
    },
  },
  {
    slug: 'dorffest-organisieren',
    title: 'Dorffest organisieren: Gemeinschaft, Stände und Abläufe',
    metaTitle: 'Dorffest organisieren | FestSchmiede',
    metaDescription:
      'Dorffest organisieren: Planung, Vereine, Essensstände und digitale Abläufe. Praxisguide für Ortsgemeinschaften – mit FestSchmiede als Open-Source-Plattform.',
    cluster: 'veranstaltungen',
    keywords: [
      'Dorffest organisieren',
      'Dorffest Planung',
      'Ortsfest Organisation',
      'Essensstand Dorffest',
      'digitale Festorganisation Dorf',
    ],
    intro: [
    'Ein Dorffest zu organisieren heißt, viele kleine Kräfte zu einem gemeinsamen Nachmittag oder Wochenende zu bündeln: Vereine, Nachbarschaft, Kommune, manchmal Kirche und Schule. Die Stärke liegt in der Vielfalt – und genau dort liegt auch die Organisationskomplexität.',
    'Wenn jeder Stand sein System hat, entstehen Reibungen: unterschiedliche Preise, Zettelchaos, unklare Zuständigkeiten. Gäste erleben das als Warteschlange; Helfer als Stress; der Organisationskreis als Diskussion am Montag danach.',
    'Dieser Leitfaden zeigt, wie ihr ein Dorffest strukturiert aufsetzt und wo FestSchmiede als Open-Source-Veranstaltungsplattform mit Bestellungen, Küche, Abholung, Abholboard, Online-Zahlung und Auswertungen den Bewirtungsteil entlastet – ohne das Dorffest zur IT-Veranstaltung zu machen.'
  ].join('\n\n'),
    sections: [
    {
      heading: 'Was umfasst die Organisation eines Dorffestes?',
      body: [
    'Dorffest organisieren verbindet Programmplanung mit Infrastruktur: Bühne oder Spielstraße, Stände, Strom, Toiletten, Müll, Sicherheit und Bewirtung. Meist gibt es einen Organisationskreis, in dem Vereine Sitze haben – Entscheidungen brauchen deshalb Klarheit und frühe Deadlines.',
    'Die Bewirtung ist häufig auf mehrere Akteure verteilt: Kuchenstand, Grill, Getränkewagen, vielleicht eine gemeinsame Küche. Ohne gemeinsame Abläufe multiplizieren sich Fehlerquellen.',
    'Gerade weil im Dorf viel über persönliche Netzwerke läuft, fehlt oft schriftliche Übergabe. Digitalisierung zwingt hier zu einer hilfreichen Klarheit: Wer pflegt das Menü? Wer schaltet ausverkauft? Wer steht an der Ausgabe?'
  ].join('\n\n'),
      bullets: [
        'Organisationskreis mit Ressorts und Terminen',
        'Platzplan inklusive Wege und Notzufahrten',
        'Programm, das Auf- und Abbauzeiten respektiert',
        'Bewirtungskonzept mit klaren Standverantwortlichen',
      ],
    },
    {
      heading: 'Warum gemeinsame Abläufe im Dorf helfen',
      body: [
    'Im Dorf kennt man sich – das erleichtert vieles, verführt aber auch zu informellen Prozessen. Das haben wir immer so gemacht funktioniert, bis die Generation wechselt oder das Fest wächst. Dann fehlen schriftliche oder digitale Standards.',
    'Ein gemeinsames Bestell- und Ausgabesystem schafft Verbindlichkeit ohne Bürokratie: Jeder Helfer sieht denselben Stand. Das ist besonders wertvoll, wenn Jugendliche, Eltern und Großeltern in einer Schicht zusammenarbeiten.',
    'Transparente Zahlen nach dem Fest entschärfen zudem Diskussionen zwischen Vereinen darüber, was gelaufen ist und was sich gelohnt hat.'
  ].join('\n\n'),
    },
    {
      heading: 'Typische Probleme am Dorffest',
      body: 'Wiederkehrende Reibungspunkte lassen sich früh adressieren:',
      bullets: [
        'Unklare Zuständigkeit zwischen Vereinsständen',
        'Zettel und Zurufe zwischen Grill und Ausgabe',
        'Lange Schlangen genau dann, wenn das Bühnenprogramm pausiert',
        'Ausverkaufte Speisen werden weiter versprochen',
        'Keine gemeinsamen Zahlen für die Abrechnung der Vereine',
      ],
    },
    {
      heading: 'Wie FestSchmiede am Dorffest eingesetzt wird',
      body: [
    'Für den zentralen Essensbereich oder die Vereinsküche: Gäste bestellen digital, die Küche arbeitet am Monitor, Abholung und Abholboard steuern die Ausgabe. Online-Zahlung kann optional ergänzt werden; Auswertungen helfen bei der Nachbereitung.',
    'FestSchmiede ersetzt nicht die gesamte Dorffest-Koordination – keine Platzvergabe-App, kein Programmheft-CMS. Es unterstützt die Prozesskette rund um Speisen und Getränke – dort, wo ehrenamtliche Teams am häufigsten überlastet sind.',
    'Wenn nur ein Verein den Hauptstand digital fährt und andere analog bleiben, funktioniert das, solange die Zuständigkeiten klar kommuniziert sind.'
  ].join('\n\n'),
      table: {
        headers: ['Aufgabe', 'Klassisch', 'Mit FestSchmiede'],
        rows: [
          ['Bestellung aufnehmen', 'Block und Stift', 'Bestellseite'],
          ['Küche steuern', 'Zuruf', 'Küchenansicht'],
          ['Ausgabe', 'Namen rufen', 'Abholboard'],
          ['Nachkalkulation', 'Bauchgefühl', 'Statistiken'],
        ],
      },
    },
    {
      heading: 'Vorteile für Ortsgemeinschaft und Gäste',
      body: 'Der Nutzen ist praktisch und sozial zugleich:',
      bullets: [
        'Weniger Stress an den meistfrequentierten Ständen',
        'Fairere Wartezeiten und klarer Status für Gäste',
        'Einfachere Einarbeitung neuer Helfer aus dem Ort',
        'Transparente Grundlage für Vereinsabrechnungen',
        'Open Source und modular – passend zu kleinen Budgets',
      ],
    },
    {
      heading: 'Für wen ist das geeignet?',
      body: [
    'Ortschaften und Vereine mit eigenem Essens- oder Getränkeverkauf profitieren am meisten. Auch Schul- und Fördervereine, die das Dorffest mittragen, können denselben Ablauf nutzen.',
    'Reine Basare ohne warme Küche brauchen oft kein Bestellsystem. Sobald Grill, Pfanne oder getrennte Ausgabe dazukommen, steigt der Nutzen deutlich.'
  ].join('\n\n'),
    },
    {
      heading: 'Wann digitalisieren?',
      body: 'Sinnvolle Trigger:',
      bullets: [
        'Das Dorffest wächst über den familiären Rahmen hinaus',
        'Ihr plant erstmals eine gemeinsame Küche mehrerer Vereine',
        'Beschwerden über Wartezeiten häufen sich',
        'Ihr wollt Vorbestellungen für Menüs anbieten',
        'Nachbereitung soll mit Zahlen statt Schätzungen laufen',
      ],
    },
    {
      heading: 'Typische Fehler',
      body: [
    'Zu späte Einigung im Organisationskreis: Software-Einführung braucht einen Verantwortlichen und einen Probelauf – nicht erst am Festmorgen.',
    'Jedes Ressort digitalisieren wollen: Bleibt bei Bestellung, Küche und Abholung, statt das ganze Dorffest in ein Tool zu pressen.',
    'Menü ohne Kapazitätsdenken: Drei starke Gerichte mit klarer Verfügbarkeit schlagen ein überladenes Angebot.',
    'Häufig scheitert Digitalisierung auch an fehlender Gastkommunikation: Ohne Schilder und Ansage entstehen Parallelschlangen am gewohnten Tresen. Ebenso problematisch ist, Ausverkauft nur mündlich zu regeln, während das System weiter Bestellungen annimmt. Und wer Zahlen nach dem Fest nicht teilt, verschenkt den Kooperationsnutzen zwischen Vereinen – dann bleibt Misstrauen über Aufwand und Erlöse, obwohl die Daten längst vorlägen. Klare Owner, sichtbare Status und eine kurze Retro gehören deshalb zur Organisation, nicht zur Kür.'
  ].join('\n\n'),
    },
    {
      heading: 'Best Practices',
      body: 'Pragmatische Regeln für ruhige Dorffeste setzen auf Kooperation statt Parallelwelten: Ein Bewirtungs-Owner, einheitliche Artikel an gemeinsamen Ständen und eine Kurzschulung vor Einlass reichen oft. Abholboard und Wartebereich werden bewusst geplant, Ausverkauft ernst genommen. Montags folgen Zahlen und zwei Verbesserungen – so lernen Vereine gemeinsam, ohne dass FestSchmiede Mitgliederverwaltung oder Helferlisten ersetzen müsste. Bewährt haben sich:',
      bullets: [
        'Eine Person als Bewirtungs-Owner über alle Schichten',
        'Einheitliche Artikel und Preise an gemeinsamen Ständen',
        'Kurzschulung vor Einlass – fünfzehn Minuten reichen oft',
        'Abholboard und Wartebereich bewusst planen',
        'Ausverkauft-Schalter ernst nehmen',
        'Montags Retro mit Zahlen und zwei Verbesserungen fürs Folgejahr',
      ],
    },
    {
      heading: 'Praxisbeispiel: Gemeinsame Dorfküche',
      body: [
    'Drei Vereine betreiben gemeinsam die warme Küche am Dorffest. Früher hatte jeder seinen Block; Bestellungen kollidierten, und die Ausgabe rief durcheinander.',
    'Mit FestSchmiede bestellen Gäste zentral. Die Küche sieht alle offenen Positionen, markiert abholbereit, und das Board entzerrt die Abholung.',
    'Nach dem Fest teilen die Vereine die Auswertung – Grundlage für eine fairere Verteilung von Aufwand und Erlösen im Folgejahr und für ein schlankeres gemeinsames Menü.',
    'Praktisch bedeutete das: einheitliche Artikelbezeichnungen, ein gemeinsames Abholboard und eine Person mit Entscheidungsrecht für Ausverkauft. Online-Zahlung entlastete die Kasse in der Mittagsstoßzeit; Vor-Ort-Bestellung blieb für Gäste ohne Smartphone selbstverständlich. Die Küche arbeitete am Monitor statt an drei Blocks. Beim zweiten Dorffest dauerte die Einweisung neuer Helfer nur noch wenige Minuten, weil der Ablauf sichtbar und wiederholbar war. Digitalisierung wirkte hier als gemeinsame Höflichkeit – nicht als Technikprojekt einzelner Vereine.'
  ].join('\n\n'),
    },

    {
      heading: 'Vereinskooperation ohne Zuständigkeitsnebel',
      body: [
    'Dorffeste scheitern selten am Willen, oft an unklaren Zuständigkeiten. Benennt für die Bewirtung eine Person mit Entscheidungsrecht für Menü, Ausverkauft und Geräte. Digitale Tools brauchen einen Owner – sonst pflegt sie niemand.',
    'Unterschiedliche Vereinskulturen treffen am gemeinsamen Tresen aufeinander. Ein einheitlicher Bestell- und Ausgabeprozess verhindert, dass jede Gruppe ihren eigenen Zettelstil mitbringt. Das ist weniger Kontrolle als gemeinsame Höflichkeit gegenüber Gästen und Helfern.',
    'Kommuniziert analog und digital: Schilder am Stand, kurzer Hinweis im Programm, vielleicht eine Vorbestelloption für Menüs. Je klarer der Gastweg, desto kürzer die Schlange und desto entspannter die Schicht.',
    'Die Nachbereitung gehört zur Organisation. Teilt Zahlen im Organisationskreis und entscheidet zwei konkrete Verbesserungen. So wird Digitalisierung zum Lernzyklus statt zum einmaligen Experiment, das niemand wiederholen will.',
  ].join('\n\n'),
    },

    {
      heading: 'Fahrplan für Organisationskreis und Standteams',
      body: [
    'Im Organisationskreis früh entscheiden, welche Stände digital arbeiten und wer Owner ist. Gemeinsame Artikel und Preise verhindern Gastverwirrung. Digitalisierung ohne Einigung erzeugt Parallelwelten am selben Tresen.',
    'Vor dem Fest: Menü pflegen, Geräte besorgen, Probelauf mit gemischtem Helferteam aus mehreren Vereinen. Genau dieser Mischlauf zeigt, ob Einweisung und Beschriftung reichen.',
    'Am Dorffest: Klare Gastführung zu Bestellung und Abholung. Bei Programmwechseln Personal verschieben. Ausverkauft konsequent schalten, statt mündlich zu blockieren. So bleibt Fairness sichtbar.',
    'Nach dem Fest: Zahlen teilen, Aufwand und Erlöse besprechen, zwei Verbesserungen beschließen. Dorfgemeinschaft lebt von Wiederholung – und Wiederholung wird leichter, wenn Wissen nicht nur in Köpfen liegt.',
  ].join('\n\n'),
      bullets: [
        'Digitale Stände und Owner schriftlich festhalten',
        'Gemeinsamer Probelauf über Vereinsgrenzen',
        'Gastweg beschildern',
        'Retro im Organisationskreis mit Daten',
      ],
    },

    {
      heading: 'Was FestSchmiede bewusst nicht ersetzt',
      body: [
    'Dorffest-Organisation umfasst Programmheft, Bühne, Spielstraße und Vereinsabsprachen. FestSchmiede ist keine All-in-one-Dorfplattform, sondern Unterstützung für Speisen- und Getränkeabläufe.',
    'Mitgliederverwaltung, Beitragsbuchhaltung und klassische Vereinssoftware bleiben eigene Werkzeuge. Helferlisten führt ihr weiter selbst; die Plattform macht Einsätze an Küche und Ausgabe planbarer durch klare Status.',
    'Gerade im Dorf ist Ehrlichkeit entscheidend: Versprecht Entlastung am Stand, nicht die Digitalisierung des ganzen Ortes. Dann bleibt Technik hilfreich statt übergriffig.',
  ].join('\n\n'),
    },

    {
      heading: 'Kommunikation im Ort und am Stand',
      body: [
    'Dorffeste leben von Mundpropaganda. Nutzt sie für Klarheit: Wer digital bestellt, weiß früher, was gilt. Ein Satz im Programmheft und ein Schild am Stand reichen oft.',
    'Im Organisationskreis vorab klären, wie mit Beschwerden umgegangen wird – etwa wenn ein Gast analog bestellen will. Vor-Ort-Bestellung bleibt Teil des Konzepts; niemand muss ein Smartphone haben.',
    'Teilt Erfolge nach dem Fest: kürzere Schlangen, klarere Zahlen, ruhigere Schichten. Sichtbarer Nutzen überzeugt skeptische Vereine schneller als jede Feature-Demo.',
  ].join('\n\n'),
    },
    {
      heading: 'Nachhaltigkeit im Organisationskreis',
      body: [
    'Dorffeste brauchen Kontinuität über Amtszeiten hinweg. Haltet fest, welche Geräte wo standen, welches Menü funktionierte und welche Stoßzeiten kritisch waren. Das ist unspektakulär – und extrem wertvoll.',
    'Digitale Auswertungen machen diese Kontinuität greifbar. Neue Verantwortliche starten mit Zahlen statt mit Gerüchten. So bleibt das Dorffest lernfähig, ohne seinen Charakter zu verlieren.',
    'Plant außerdem bewusst Erholung für Kernhelfer. Ruhigere Abläufe an Küche und Ausgabe sind auch ein Beitrag gegen Ehrenamtsmüdigkeit.',
  ].join('\n\n'),
    },

    {
      heading: 'Wetter, Ausweichflächen und ruhige Ausgabe',
      body: [
    'Dorffeste sind wetterabhängig. Plant eine trockene Zone für Bestellgeräte und Abholboard. Digitale Abläufe bleiben nur hilfreich, wenn Tablets nicht im Regen stehen und Gäste das Board noch lesen können.',
    'Bei Ausweichzielen in die Halle dieselben Rollen beibehalten: Bestellung, Küche, Abholung. Wer Prozesse kennt, baut schneller um. Genau darin liegt der Vorteil klarer Standards gegenüber spontaner Zurufkultur.',
  ].join('\n\n'),
    },
    {
      heading: 'Zusammenfassung',
      body: [
    'Dorffest organisieren lebt von Kooperation. Digitale Abläufe helfen vor allem dort, wo Bewirtung parallel und öffentlich stattfindet – nicht als Selbstzweck, sondern als Entlastung für Ehrenamtliche.',
    'FestSchmiede unterstützt als Open-Source-Veranstaltungsplattform Bestellungen, Küche, Abholung, Abholboard, Online-Zahlung und Auswertungen. So bleibt das Dorffest ein Gemeinschaftsprojekt – nur mit weniger Zettelchaos.',
    'Wer organisiert, sollte Technik an Kooperation koppeln: Owner benennen, Probelauf mit gemischtem Team, Gastwege beschildern, Zahlen teilen. Mitgliederverwaltung und Helferlisten bleiben eigene Werkzeuge; die Plattform macht Bewirtung nachvollziehbar. Mit dieser Begrenzung bleibt Digitalisierung im Dorf glaubwürdig – und das Fest das, was es sein soll: Begegnung, nicht Tool-Demo.'
  ].join('\n\n'),
    },
    ],
    faqs: [
    {
      q: 'Müssen alle Vereine am Dorffest mitmachen?',
      a: 'Nein. Oft reicht es, die gemeinsame Küche oder den Hauptstand digital zu fahren. Andere Stände können analog bleiben, solange Zuständigkeiten klar sind.',
    },
    {
      q: 'Ist FestSchmiede Vereinssoftware für Mitglieder?',
      a: 'Nein. Der Fokus liegt auf Veranstaltungsabläufen rund um Bestellung, Küche und Abholung, nicht auf Mitgliederverwaltung.',
    },
    {
      q: 'Können wir vorab Menüs anbieten?',
      a: 'Ja. Online-Vorbestellung über die Bestellseite entlastet Schlangen und hilft der Küche bei der Vorbereitung.',
    },
    {
      q: 'Was brauchen wir technisch vor Ort?',
      a: 'Typisch: Tablet oder Monitor für Bestellung und Küche, sichtbares Abholboard, stabile Netzverbindung und geladene Geräte. Mehr ist oft nicht nötig.',
    },
    {
      q: 'Wie ehrlich ist der Nutzen bei kleinem Dorf?',
      a: 'Bei sehr kleinem Rahmen kann Papier reichen. Der Nutzen steigt mit parallelen Bestellungen, getrennten Stationen und wachsendem Publikum.',
    },
    ],
    relatedSlugs: [
      'software-fuer-vereinsfeste',
      'helferplanung-verein',
      'kuechenmonitor',
      'strassenfest-organisieren',
      'vereinssoftware',
    ],
    cta: {
      title: 'Dorffest-Bewirtung vereinfachen',
      subtitle: 'Mandant beantragen oder Funktionen ansehen – gemacht für Vereine und Ortsgemeinschaften.',
    },
  },
{
    slug: 'strassenfest-organisieren',
    title: 'Straßenfest organisieren: Genehmigungen, Stände und Betrieb',
    metaTitle: 'Straßenfest organisieren | FestSchmiede',
    metaDescription:
      'Straßenfest organisieren: Genehmigungen, Stände, Essensverkauf und digitale Abläufe. Leitfaden für Initiativen und Vereine – mit FestSchmiede Open Source.',
    cluster: 'veranstaltungen',
    keywords: [
      'Straßenfest organisieren',
      'Straßenfest Planung',
      'Genehmigung Straßenfest',
      'Essensstand Straßenfest',
      'digitale Bestellung Straßenfest',
    ],
    intro: [
    'Ein Straßenfest organisieren heißt, öffentlichen Raum zeitweise zum Festplatz zu machen: Absperrungen, Genehmigungen, Anwohnerkommunikation, Stände, Programm und Bewirtung. Die Kulisse ist urban oder dörflich – die organisatorische Dichte ist in beiden Fällen hoch.',
    'Auf der Straße sind Wege eng, Stoßzeiten abrupt und die Toleranz für Chaos gering. Essensstände ohne klare Abläufe erzeugen Schlangen mitten im Fußverkehr. Digitale Bestellung und Ausgabe entlasten genau diese Engstellen.',
    'Dieser Guide beschreibt die Organisationslogik eines Straßenfestes und erklärt, wie FestSchmiede als Open-Source-Veranstaltungsplattform Bestellungen, Küche, Abholung, Abholboard, Online-Zahlung und Auswertungen unterstützt – ohne Genehmigungsprozesse oder Platzverwaltung zu ersetzen.'
  ].join('\n\n'),
    sections: [
    {
      heading: 'Was gehört zum Organisieren eines Straßenfestes?',
      body: [
    'Straßenfest organisieren beginnt oft Monate vorher: Antrag bei der Kommune, Verkehrs- und Sicherheitkonzept, Versicherung, Strom, Toiletten, Müll und Standvergabe. Parallel entsteht das Programm und die Bewirtung durch Vereine oder Initiativen.',
    'Am Festtag dominiert Betrieb: Aufbau vor Sperrung, laufender Publikumsverkehr, Lärm, Wetter und enge Flächen. Prozesse, die in der Turnhalle noch irgendwie klappen, scheitern auf der Straße an Platz und Lautstärke.',
    'Deshalb müssen Bewirtungsabläufe besonders schlank sein: Wenige Schritte, klare Zonen, sichtbarer Status. Jede Extra-Schleife kostet Fläche und Geduld.'
  ].join('\n\n'),
      bullets: [
        'Genehmigungen und Auflagen früh klären',
        'Anwohner und Anlieger transparent informieren',
        'Platz- und Wegekonzept inklusive Notzufahrt',
        'Bewirtungsstände mit klarer Ausgabezone planen',
      ],
    },
    {
      heading: 'Warum Abläufe auf der Straße besonders kritisch sind',
      body: [
    'Auf der Straße ist jede Schlange gleichzeitig ein Verkehrsproblem. Wenn Gäste vor dem Stand warten, weil die Küche den Überblick verloren hat, blockieren sie Gehwege und Nachbarstände. Statussichtbarkeit ist deshalb keine Komfortfunktion, sondern Flächeneffizienz.',
    'Dazu kommt: Helfer wechseln oft, Geräte teilen sich Stromkreise, und der Handyempfang kann schwanken. Robuste, schlanke Abläufe schlagen komplexe Sonderlösungen.',
    'Auch das Wetter spielt mit: Nasse Zettel und unleserliche Blöcke sind auf der Straße häufiger als in der Halle. Digitale Bestellungen bleiben lesbar – sofern Strom und Netz stehen.'
  ].join('\n\n'),
    },
    {
      heading: 'Typische Probleme beim Straßenfest',
      body: 'Diese Muster treten häufig auf:',
      bullets: [
        'Ausgabezone zu klein – Schlange steht auf dem Weg',
        'Zettel fliegen weg oder werden unleserlich',
        'Küche im Hinterhof, Ausgabe an der Straße – Zurufe unmöglich',
        'Ausverkauf wird nicht synchron kommuniziert',
        'Nach dem Fest fehlen Zahlen für Abrechnung und Sponsorenbericht',
      ],
    },
    {
      heading: 'Wie FestSchmiede im Straßenbetrieb hilft',
      body: [
    'Gäste bestellen am Stand-Tablet oder mobil. Die Küche – oft im Hinterhof oder Zelt – arbeitet am Monitor. Abholbereit-Status und Abholboard halten die Ausgabezone kompakt, weil Gäste nicht dauernd nachfragen müssen. Online-Zahlung reduziert Bargeldhandling an engen Tresen.',
    'Was FestSchmiede nicht leistet: Verkehrsplanung, Genehmigungsworkflow oder Standbuchungssystem. Der Nutzen liegt in der Bewirtungskette Bestellung, Küche und Abholung inklusive Auswertungen.',
    'Modularität hilft: Aktiviert nur Bestellung, Küche und Abholung, wenn Zahlung später kommen soll. Weniger Oberfläche bedeutet weniger Erklärbedarf für Kurzzeithelfer.'
  ].join('\n\n'),
      table: {
        headers: ['Engpass', 'Ohne System', 'Mit FestSchmiede'],
        rows: [
          ['Bestellaufnahme', 'Gedränge am Tresen', 'Bestellung mobil oder vor Ort'],
          ['Küche abseits', 'Läufer oder Zuruf', 'Küchenmonitor'],
          ['Ausgabe eng', 'Wartende fragen nach', 'Abholboard und Nummer'],
          ['Abrechnung', 'Zettelreste', 'Dashboard'],
        ],
      },
    },
    {
      heading: 'Vorteile für Initiativen und Gäste',
      body: 'Auf der Straße zählt jede entspannte Minute:',
      bullets: [
        'Kompaktere Ausgabezonen trotz hoher Nachfrage',
        'Weniger Stress bei getrennter Küche und Tresen',
        'Bessere Einarbeitung von Kurzzeithelfern',
        'Klarere Zahlen für Vereine und Sponsorenkommunikation',
        'Modular und Open Source – ohne überdimensionierte Event-Suite',
      ],
    },
    {
      heading: 'Für wen eignet sich das?',
      body: [
    'Vereine, Quartiersinitiativen und gemeinnützige Träger mit eigener Bewirtung profitieren. Auch Schulen und Jugendgruppen mit Food-Stand am Straßenfest können den Ablauf nutzen.',
    'Reine Informationsstände ohne Verkauf brauchen kein Bestellsystem. Sobald warme Speisen oder Getränke mit Wartezeit verkauft werden, steigt der Nutzen.'
  ].join('\n\n'),
    },
    {
      heading: 'Wann umstellen?',
      body: 'Gute Anlässe:',
      bullets: [
        'Erstmals eigener Essensstand auf gesperrter Straße',
        'Küche und Ausgabe sind räumlich getrennt',
        'Auflagen verlangen geordnete Wartebereiche',
        'Ihr erwartet hohe Laufkundschaft in kurzen Zeitfenstern',
        'Nachbereitung soll mit belastbaren Verkaufszahlen laufen',
      ],
    },
    {
      heading: 'Typische Fehler',
      body: [
    'Technik ohne Flächenplanung: Abholboard mitten im Engpass stellt das Problem nur digital nach. Plant Warte- und Abholzonen bewusst.',
    'Netz unterschätzen: Straßenfeste brauchen früh getestete Hotspots oder Kabelstrecken.',
    'Feature-Overkill: Bleibt bei Bestellung, Küche, Abholung – nicht bei einer imaginären Gesamtplattform fürs Quartiersmanagement.',
    'Ein weiterer Fehler: Abholung ohne sichtbare Nummernlogik, während die Straße voller Laufkundschaft ist. Dann entstehen Zurufe und Doppelausgaben trotz digitaler Bestellung. Ebenso riskant ist Regen ohne Backup – nasse Tablets und unsichtbare Boards stoppen den Betrieb schneller als jedes Menüproblem. Plant trockene Zonen und kurze Eskalationswege. Und wertet nach dem Fest aus: Welche Stunden liefen, welche Gerichte stockten? Sonst wiederholt sich Flächen- und Mengenplanung jedes Jahr als Bauchgefühl statt als Lernen.'
  ].join('\n\n'),
    },
    {
      heading: 'Best Practices',
      body: 'So bleibt der Straßenbetrieb beherrschbar: Ausgabezone und Abholboard gehören in den Platzplan, das Menü bleibt schlank, Strom und Netz werden vor Aufbau abgenommen. Jede Schicht kennt die Ausverkauft-Regel; bei Regen gibt es einen Backup für Geräte. Online-Zahlung entlastet Stoßzeiten, ersetzt aber keine markierte Warteschlange. Nach dem Fest sichern Zahlen und zwei Prozessverbesserungen den Lernfortschritt fürs Folgejahr. Konkret:',
      bullets: [
        'Ausgabezone und Abholboard im Platzplan verankern',
        'Menü schlank halten – schnelle Ausgabe schlägt Vielfalt',
        'Strom und Netz vor Aufbau abnehmen',
        'Kurzbriefing für jede Schicht inklusive Ausverkauft-Regel',
        'Bei Regen Geräte und Backup-Plan prüfen',
        'Nach dem Fest Zahlen und zwei Prozessverbesserungen notieren',
      ],
    },
    {
      heading: 'Praxisbeispiel: Vereinsgrill auf gesperrter Straße',
      body: [
    'Ein Musikverein betreibt den Grillstand auf dem jährlichen Straßenfest. Die Küche steht im Hinterhof, die Ausgabe an der Straße. Früher liefen Jugendliche mit Zetteln; in Stoßzeiten staute sich die Schlange bis zur Bühne.',
    'Mit FestSchmiede bestellen Gäste am Tresen oder mobil. Die Küche sieht Bestellungen am Tablet, markiert abholbereit, und das Board an der Ausgabe hält Nachfragen gering.',
    'Die Schlange bleibt in der markierten Zone – und der Verein hat abends belastbare Verkaufszahlen für Vorstand und Sponsorenbericht.',
    'Im Folgejahr rückten sie das Abholboard näher an die Ausgabe und kürzten das Menü um eine Grillvariante, die nur in der ersten Stunde lief. Online-Zahlung entlastete die Stoßzeit vor dem Abendprogramm; Bargeld blieb bei Abholung möglich. Strom und Hotspot wurden am Aufbautag getestet, nicht erst bei Einlass. Die Küche im Hinterhof arbeitete ruhiger, weil Status sichtbar war statt Zuruf über den Hof. Genau diese Kombination aus Flächenplanung und schlanker Digitalisierung überzeugte auch die Nachbarinitiativen.'
  ].join('\n\n'),
    },

    {
      heading: 'Fläche, Wetter und kurze Wege am Stand',
      body: [
    'Auf der Straße ist Fläche teuer. Plant Bestellung, Wartebereich und Abholung als kompakte Sequenz, nicht als drei konkurrierende Trauben. Ein Abholboard kann die Schlange vom Tresen wegziehen, wenn der Bodenbelag und die Absperrung das zulassen.',
    'Wetterpläne sind Teil der Digitalisierung: Tablets brauchen Schutz, Akkus Reserve, Netz eine Alternative. Wer nur Schönwetter testet, erlebt den ersten Schauer als Totalausfall.',
    'Kurzzeithelfer sind typisch für Straßenfeste. Deshalb muss der Ablauf in fünf Minuten erklärbar sein. Wenige Artikel, klare Buttons, sichtbare Nummern – das schlägt ausgefeilte Sonderwünsche.',
    'Dokumentiert Auflagen der Genehmigung und eure Standzonen zusammen. Digitale Abläufe entlasten, wenn sie die Auflagen respektieren statt sie zu ignorieren. Sicherheit und Bewirtung sind keine Gegensätze, sondern parallele Pflichten.',
  ].join('\n\n'),
    },

    {
      heading: 'Betriebsablauf unter Auflagen und Engstellen',
      body: [
    'Genehmigungsauflagen und Bewirtungszonen zusammen lesen. Wo Warteflächen erlaubt sind, dort Abholung und Board platzieren. Digitale Nummern ohne legale Wartezone erzeugen nur verteiltes Stehen auf der Fahrbahn.',
    'Techniksetup: wetterfeste Positionen, Stromreserven, getestetes Netz. Kurzzeithelfer bekommen eine Minuten-Einweisung und eine sichtbare Ansprechperson. Komplexität ist der Feind enger Straßenstände.',
    'Während des Festes: Schlange beobachten, Menü nicht erweitern, Ausverkauft pflegen. Bei Störungen zuerst Betrieb stabilisieren, dann Features diskutieren. Der Gast merkt Ruhe, nicht Modulvielfalt.',
    'Abschluss: Abbau gemäß Sperrzeiten, Zahlen sichern, Sponsoren und Verein mit knapper Auswertung informieren. Straßenfeste sind anstrengend – belastbare Nachweise machen den Aufwand sichtbar und wiederholbar.',
  ].join('\n\n'),
      bullets: [
        'Auflagen und Standzonen deckungsgleich planen',
        'Wetter- und Netz-Reserve vorhalten',
        'Einweisung auf fünf Minuten begrenzen',
        'Auswertung für Verein und Sponsoren nutzen',
      ],
    },

    {
      heading: 'Was FestSchmiede bewusst nicht ersetzt',
      body: [
    'Straßenfeste leben von Genehmigungen, Absperrungen und Nachbarschaftsarbeit. Das bleibt eure Verantwortung. FestSchmiede greift erst dort, wo Speisen und Getränke bestellt, zubereitet und ausgegeben werden.',
    'Kein Verkehrsplanungs-Tool, kein Anwohnerportal, kein Standmarktplatz. Dafür Bestellstatus, Küchenmonitor, Abholboard und Auswertungen – also genau die Kette, die auf enger Fläche am ehesten kippt.',
    'Wer diese Grenze kennt, plant besser: Behördenarbeit analog und früh, Bewirtung digital und schlank. So ergänzen sich Pflicht und Entlastung statt sich zu vermischen.',
  ].join('\n\n'),
    },

    {
      heading: 'Kommunikation mit Anwohnern und Gästen',
      body: [
    'Anwohner brauchen früh Informationen zu Sperrung und Lärm; Gäste brauchen Orientierung zu Bestellung und Abholung. Beides gehört zur Organisation, auch wenn nur letzteres digital unterstützt wird.',
    'Am Stand: große, wetterfeste Hinweise statt feiner Schrift. Auf der Straße liest niemand lange Texte. Ein Piktogramm für Bestellen und Abholen wirkt besser als Absätze.',
    'Wenn Online-Zahlung aktiv ist, sagt klar, welche Alternativen es gibt. Mischbetrieb funktioniert, wenn Helfer und Gäste dieselben Regeln kennen – sonst entstehen Diskussionen genau im Engpass.',
  ].join('\n\n'),
    },

    {
      heading: 'Wiederholung und Lernen zwischen den Jahren',
      body: [
    'Straßenfeste haben jedes Jahr ähnliche Engstellen. Fotografiert Standzonen und Board-Positionen fürs Folgejahr. Kombiniert das mit Verkaufszahlen, und ihr plant Flächen und Mengen treffsicherer.',
    'Wenn Auflagen wechseln, passt zuerst die Fläche an und dann die digitale Anordnung. Technik folgt dem Platz, nicht umgekehrt. Diese Reihenfolge verhindert teure Fehlversuche am Festmorgen.',
    'Teilt Learnings mit anderen Initiativen im Ort. Wiederholbare Bewirtungsabläufe sind ein Gemeingut – passend zum Open-Source-Gedanken hinter FestSchmiede.',
  ].join('\n\n'),
    },

    {
      heading: 'Kurzcheck vor der Straßensperrung',
      body: [
    'Vor der Sperrung: Strom, Netz, Geräteakkus, Beschilderung und Abholzone prüfen. Danach ist Nachbessern teuer und laut. Ein Fünf-Minuten-Check mit Bewirtungsleitung verhindert die Hälfte der Festtagsstörungen.',
    'Stimmt die Reihenfolge: Fläche und Auflagen zuerst, digitale Anordnung danach. Wenn die Zone stimmt, entfalten Bestellseite und Abholboard ihre Wirkung – sonst digitalisiert ihr nur das Gedränge.',
  ].join('\n\n'),
    },
    {
      heading: 'Zusammenfassung',
      body: [
    'Straßenfest organisieren verbindet Behördenarbeit, Nachbarschaft und Festbetrieb. Digitale Unterstützung lohnt sich vor allem an Bewirtungsständen mit Platzmangel und getrennten Stationen.',
    'FestSchmiede hilft als Open-Source-Veranstaltungsplattform bei Bestellungen, Küche, Abholung, Abholboard, Online-Zahlung und Auswertungen – damit das Straßenfest lebendig bleibt, ohne im Stau vor dem Grill zu enden. Mit klarer Fläche, schlankem Menü und getestetem Netz wird daraus ein wiederholbarer Betriebsstandard statt jedes Jahr dasselbe Improvisationstheater für Helfer und Gäste.',
    'Organisation auf der Straße bleibt Handwerk: Genehmigungen, Nachbarschaft und Wetter sind eigene Themen. Digitalisierung entlastet nur die Bewirtungskette – und genau dort spüren Helfer und Gäste den Unterschied. Wer Probelauf, Ausverkauft-Pflege und eine kurze Retro fest verankert, baut Kompetenz auf, die Auflagenwechsel übersteht. So bleibt das Straßenfest lebendig, geordnet und wiederholbar.'
  ].join('\n\n'),
    },
    ],
    faqs: [
    {
      q: 'Ersetzt FestSchmiede die behördliche Genehmigung?',
      a: 'Nein. Genehmigungen, Verkehrs- und Sicherheitsauflagen bleiben eure Aufgabe. Die Software unterstützt nur die Bewirtungsabläufe.',
    },
    {
      q: 'Was, wenn der Empfang auf der Straße schlecht ist?',
      a: 'Plant Hotspot oder Kabelverbindung für Küche und Bestellgeräte. Ohne stabile Verbindung stockt jeder digitale Ablauf.',
    },
    {
      q: 'Können Gäste bargeldlos zahlen?',
      a: 'Ja, über optionale Online-Zahlungsintegrationen – abhängig von der Mandanten-Konfiguration. Zahlung bei Abholung bleibt möglich.',
    },
    {
      q: 'Brauchen wir FestSchmiede für jeden Infostand?',
      a: 'Nein. Sinnvoll ist der Einsatz dort, wo Speisen oder Getränke bestellt, zubereitet und ausgegeben werden.',
    },
    {
      q: 'Wie starten Initiativen ohne große IT?',
      a: 'Mandant beantragen, Veranstaltung und Menü anlegen, Probelauf mit dem Standteam. Self-Hosting ist optional und braucht mehr Technikkenntnis.',
    },
    ],
    relatedSlugs: [
      'online-vorbestellung-vereinsfest',
      'abholnummern',
      'getraenkeabrechnung-verein',
      'dorffest-organisieren',
      'veranstaltungssoftware',
    ],
    cta: {
      title: 'Straßenfest-Stand digital entlasten',
      subtitle: 'Jetzt Mandant beantragen oder FestSchmiede-Funktionen kennenlernen.',
    },
  },
  {
    slug: 'vereinsveranstaltung-digitalisieren',
    title: 'Vereinsveranstaltung digitalisieren: klarer Einstieg ohne Chaos',
    metaTitle: 'Vereinsveranstaltung digitalisieren | FestSchmiede',
    metaDescription:
      'Vereinsveranstaltung digitalisieren: Bestellung, Küche und Abholung Schritt für Schritt. Praxisleitfaden mit FestSchmiede als Open-Source-Plattform.',
    cluster: 'organisation',
    keywords: [
      'Vereinsveranstaltung digitalisieren',
      'digitales Vereinsfest',
      'Festabläufe digitalisieren',
      'Bestellsystem Verein',
      'Open Source Veranstaltungsplattform',
    ],
    intro: [
    'Eine Vereinsveranstaltung digitalisieren klingt nach großem Transformationsprojekt – in der Praxis reicht oft ein klarer Schnitt an einer Engstelle: Bestellung, Küche oder Abholung. Wer zu viel auf einmal umstellt, erzeugt Widerstand; wer gar nichts ändert, wiederholt dasselbe Chaos jedes Jahr.',
    'Digitalisierung im Vereinsfest bedeutet nicht, Tradition zu ersetzen. Sie bedeutet, Informationen gemeinsam sichtbar zu machen, damit Helfer weniger improvisieren müssen. Genau dort setzt FestSchmiede an: als Open-Source-Veranstaltungsplattform für Bestellungen, Küche, Abholung, Abholboard, Online-Zahlung und Auswertungen.',
    'Dieser Leitfaden zeigt einen ehrlichen Einstieg: Was sich lohnt zu digitalisieren, was besser analog bleibt, welche Fehler typisch sind und wie ihr in wenigen Schritten zum ersten stabilen Festbetrieb kommt.'
  ].join('\n\n'),
    sections: [
    {
      heading: 'Was heißt Vereinsveranstaltung digitalisieren?',
      body: [
    'Digitalisieren heißt hier: Papier-, Zuruf- und Chat-Prozesse durch einen gemeinsamen digitalen Ablauf ersetzen – zumindest für den Teil, der regelmäßig stressig wird. Für die meisten Vereine ist das die Kette von der Bestellung bis zur Ausgabe.',
    'Es heißt nicht automatisch: Mitgliederverwaltung in die Cloud, Buchhaltung ablösen oder jeden Helfer mit einer App ausstatten. FestSchmiede ist bewusst auf Veranstaltungsabläufe fokussiert und ersetzt keine klassische Vereinsverwaltung.',
    'Ein guter Digitalschnitt ist spürbar am Festtag: weniger Nachfragen, klarere Übergaben, nachvollziehbare Nummern. Alles andere kann später kommen.'
  ].join('\n\n'),
      bullets: [
        'Bestellungen digital aufnehmen – mobil oder vor Ort',
        'Küche über eine gemeinsame Ansicht steuern',
        'Abholung mit Nummern und Abholboard entzerren',
        'Optional Online-Zahlung und Auswertungen nutzen',
      ],
    },
    {
      heading: 'Warum Digitalisierung im Verein oft scheitert – und wann sie gelingt',
      body: [
    'Scheitern entsteht meist durch Überambition: zu viele Module, zu wenig Schulung, Live-Gang ohne Test. Gelingen entsteht durch Fokus: eine Prozesskette, klare Rollen, Probelauf, Retro.',
    'Ehrenamtliche akzeptieren Tools, wenn sie am Festtag spürbar entlasten. Ein Küchenmonitor, der Doppelarbeit verhindert, überzeugt mehr als eine Feature-Liste. Genau deshalb lohnt ein ehrlicher Scope.',
    'Auch die Kommunikation zählt: Sagt dem Team, was sich ändert und was bewusst analog bleibt – etwa die Schichtliste auf Papier oder im bestehenden Tool.'
  ].join('\n\n'),
    },
    {
      heading: 'Typische Probleme vor der Digitalisierung',
      body: 'Wenn ihr diese Punkte wiedererkennt, seid ihr reif für den Einstieg:',
      bullets: [
        'Niemand hat den Gesamtüberblick über offene Bestellungen',
        'Schichtwechsel verlieren Wissen',
        'Gäste fragen ständig nach dem Status',
        'Nach dem Fest fehlen Zahlen für Einkauf und Kasse',
        'WhatsApp-Gruppen ersetzen Prozesse – und erzeugen Rauschen',
      ],
    },
    {
      heading: 'Wie der Einstieg mit FestSchmiede funktioniert',
      body: [
    'Schritt für Schritt: Mandant beantragen oder Self-Hosting prüfen. Veranstaltung anlegen und Menü schlank pflegen. Module aktivieren, die ihr braucht – Bestellung, Küche, Abholung, Zahlung, Auswertungen. Probelauf mit Küche und Ausgabe. Am Festtag Rollen klar halten. Danach Zahlen ansehen und nachjustieren.',
    'Der Setup-Assistent unterstützt die Ersteinrichtung. Responsive Oberflächen laufen auf Smartphone, Tablet und Desktop – wichtig für gemischte Helferteams. Mandantenfähigkeit hält eure Daten getrennt von anderen Organisationen.',
    'Plant realistisch: Lieber ein ruhiger erster Einsatz mit kleinem Menü als ein Feature-Feuerwerk, das niemand bedienen kann.'
  ].join('\n\n'),
      table: {
        headers: ['Schritt', 'Ziel', 'Häufiger Fehler'],
        rows: [
          ['Scope festlegen', 'Nur Bewirtungskette', 'Alles auf einmal'],
          ['Menü anlegen', 'Schlank und klar', 'Zu viele Varianten'],
          ['Probelauf', 'Zwei komplette Zyklen', 'Live ohne Test'],
          ['Festtag', 'Rollen halten', 'Jeder macht alles'],
          ['Retro', 'Zwei Verbesserungen', 'Keine Auswertung'],
        ],
      },
    },
    {
      heading: 'Vorteile eines fokussierten Einstiegs',
      body: 'Weniger Scope, mehr Wirkung:',
      bullets: [
        'Schneller spürbarer Nutzen an Küche und Ausgabe',
        'Höhere Akzeptanz bei Helferinnen und Helfern',
        'Geringeres Risiko am ersten Festtag',
        'Lernkurve für Folgeveranstaltungen',
        'Open Source: transparent und ohne Lock-in-Druck',
      ],
    },
    {
      heading: 'Für wen ist die Digitalisierung geeignet?',
      body: [
    'Für Vereine, Feuerwehren, Schulen, Hilfsorganisationen und Kommunen mit Speisen- oder Getränkeverkauf und mehreren Stationen. Besonders wertvoll bei wiederkehrenden Festen, weil sich der Lerngewinn multipliziert.',
    'Weniger dringend: einmalige Kaffeetafeln mit zehn Gästen. Mehr dringend: jedes Event, bei dem ihr hinterher sagt, nie wieder so mit Zetteln.'
  ].join('\n\n'),
    },
    {
      heading: 'Wann solltet ihr starten?',
      body: 'Startet nicht am Festmorgen, sondern in der Vorbereitung:',
      bullets: [
        'Mindestens eine Woche Puffer vor dem Event',
        'Ein benannter Owner für System und Menü',
        'Zwei Helfer aus Küche und Ausgabe im Probelauf',
        'Klarheit, was analog bleibt – zum Beispiel die Schichtliste',
        'Bereitschaft, das Menü zugunsten von Tempo zu verschlanken',
      ],
    },
    {
      heading: 'Typische Fehler beim Digitalisieren',
      body: [
    'Helferplanung und Getränkeabrechnung als Automatik erwarten: FestSchmiede unterstützt Helfer über Bestell-, Küchen- und Service-Oberflächen und liefert Umsatzzahlen über Bestellungen – ist aber kein dediziertes Schichtplan- oder Getränkeabrechnungs-Modul.',
    'Zu viele Sonderfälle vor dem ersten Einsatz. Erst Standard stabil, dann Ausnahmen.',
    'Keine Kommunikation an Gäste: Sagt klar, wo bestellt und wo abgeholt wird – sonst entsteht Parallelverkehr am alten Tresen.',
    'Ebenso häufig: zu späte Einführung ohne Owner. Dann liegt niemand fest, wer Menü pflegt, Geräte lädt und Ausverkauft schaltet. Digitalisierung ohne Verantwortlichkeit wird zur Geisteraufgabe. Ein weiterer Fehler ist, nach dem ersten Fest keine Retro zu machen – dann bleiben dieselben Stolpersteine. Wer Auswertungen ignoriert, verschenkt den Lernzyklus zwischen den Jahren. Startet schlank, testet zweimal und dokumentiert zwei Verbesserungen; das schlägt jedes Feature-Versprechen ohne Praxis.'
  ].join('\n\n'),
    },
    {
      heading: 'Best Practices',
      body: 'So bleibt Digitalisierung im Verein nachhaltig: Ein Prozess und eine Wahrheit im System schlagen Parallelzettel. Kurzschulung ersetzt lange Handbücher; Verfügbarkeit und Ausverkauft werden aktiv gepflegt. Nach jedem Fest kommen Zahlen plus maximal zwei Änderungen, und der nächste Festleiter findet eine kurze Dokumentation vor. Module bleiben schlank – Bestellungen, Küche, Abholung, Abholboard, Online-Zahlung und Auswertungen genügen für den ersten großen Nutzen. Im Alltag:',
      bullets: [
        'Ein Prozess – eine Wahrheit, also Status im System',
        'Kurzschulung schlägt langes Handbuch',
        'Verfügbarkeit und Ausverkauft aktiv pflegen',
        'Nach jedem Fest: Zahlen plus maximal zwei Änderungen',
        'Dokumentation für den nächsten Festleiter hinterlegen',
        'Module schlank halten – weniger ist stabiler',
      ],
    },
    {
      heading: 'Praxisbeispiel: Vom Zettelchaos zum zweiten ruhigen Fest',
      body: [
    'Ein Sportverein digitalisiert zuerst nur Grill und Ausgabe. Der erste Probelauf deckt auf, dass zwei Artikel falsch benannt waren und das Abholboard zu weit weg hing. Am Festtag läuft es akzeptabel; am zweiten Fest ruhig und klar.',
    'Entscheidend war nicht mehr Software, sondern Fokus, Test und Retro. Die Auswertungen halfen zudem, das Menü im Folgejahr zu kürzen – weniger Stress, ähnliche Erlöse.',
    'Andere Vereine im Ort übernahmen später denselben Ablauf für Dorffest und Straßenfest – mit dem Wissensvorsprung aus dem ersten Jahr.',
    'Entscheidend war die ehrliche Kommunikation im Vorstand: FestSchmiede als Open-Source-Veranstaltungsplattform für Bestellungen, Küche, Abholung, Abholboard, Online-Zahlung und Auswertungen – nicht als Ersatz für Helferlisten oder Getränkeabrechnung. Genau diese Begrenzung schuf Vertrauen. Am zweiten Fest brauchten neue Helfer nur eine Kurzschulung, weil Status sichtbar und Rollen klar waren. Die Auswertungen steuerten Einkauf und Menü; der Stress an der Ausgabe sank spürbar. Digitalisierung wirkte als Entlastung, nicht als Modernisierungsbefehl.'
  ].join('\n\n'),
    },

    {
      heading: 'Change im Ehrenamt: Akzeptanz statt Zwang',
      body: [
    'Digitalisierung im Verein gelingt als Entlastungsversprechen, nicht als Modernisierungsbefehl. Zeigt Helfern den konkreten Gewinn: weniger Zurufe, klarere Nummern, kürzere Übergaben. Wer nur Features präsentiert, verliert die Praxisstimmen.',
    'Nehmt Skeptiker ernst. Manche kennen gescheiterte Tools. Antwortet mit Scope-Begrenzung und Probelauf statt mit Marketing. FestSchmiede bleibt ehrlich: Bestellung, Küche, Abholung, Abholboard, Zahlung, Auswertungen – nicht alles.',
    'Schafft Doppelbesetzung in der ersten Stunde: Eine erfahrene Person steht neben neuen Helfern. Nach der Eingewöhnung reicht der Normalbetrieb. Diese Investition ist kleiner als ein chaotischer Festabend.',
    'Verankert Wissen nach dem Fest: Kurze Notiz zu Menü, Geräteplatzierung und typischen Fehlern. Der nächste Festleiter startet nicht bei null. Genau so wird Digitalisierung nachhaltig statt personenabhängig.',
  ].join('\n\n'),
    },

    {
      heading: '90-Tage-Pfad zum ersten digitalen Fest',
      body: [
    'Tage 1–30: Ziel festlegen – nur Bewirtungskette. Owner benennen, Mandant beantragen oder Hosting klären, Ist-Ablauf mit Zetteln dokumentieren. Ohne Ist-Bild digitalisiert ihr Blindstellen.',
    'Tage 31–60: Menü schlank anlegen, Module aktivieren, Geräte organisieren. Ersten Probelauf mit Küche und Ausgabe. Feedback sammeln und Menü oder Beschriftung nachschärfen. Noch keine Live-Show.',
    'Tage 61–90: Zweiter Probelauf, Kurzleitfaden für Helfer, Gastkommunikation vorbereiten. Festtag mit klaren Rollen. Danach Retro mit Zahlen und maximal zwei Änderungen für die nächste Veranstaltung.',
    'Dieser Pfad ist bewusst langsam genug für Ehrenamt und schnell genug für ein Saisonziel. Er verhindert Feature-Overload und erzeugt sichtbaren Nutzen. Genau so bleibt Digitalisierung im Verein anschlussfähig – auch für skeptische Helfer.',
  ].join('\n\n'),
      bullets: [
        'Ein Owner, ein Scope, ein Probelauf',
        'Menü zugunsten von Tempo kürzen',
        'Gastkommunikation nicht vergessen',
        'Nach dem Fest Wissen dokumentieren',
      ],
    },

    {
      heading: 'Grenzen der Digitalisierung klar kommunizieren',
      body: [
    'Sagt im Verein laut, was nicht kommt: keine automatische Helferplanung als Roster-Modul, keine vollständige Getränkeabrechnung als Kontensystem, keine Mitgliederverwaltung. Das verhindert falsche Erwartungen.',
        'Sagt ebenso klar, was kommt: gemeinsame Bestellungen, Küchenansicht, Abholung mit Board, optionale Online-Zahlung, Dashboard und Statistiken. Das ist genug Stoff für spürbare Entlastung.',
    'FestSchmiede ist Open Source und modular. Ihr aktiviert nur, was ihr braucht, beantragt einen Mandanten oder hostet selbst. Der Digitalschritt bleibt beherrschbar – und genau deshalb im Ehrenamt realistisch.',
  ].join('\n\n'),
    },

    {
      heading: 'Messbare Ziele für den ersten Digitalschritt',
      body: [
    'Definiert vor dem Fest zwei bis drei messbare Ziele: weniger Nachfragen an der Ausgabe, kürzere Übergabezeiten, belastbare Verkaufszahlen am Montag. Ohne Ziele bleibt Erfolg Geschmackssache.',
    'Messung darf einfach sein: Strichliste für Nachfragen in der ersten Stunde, subjektive Einschätzung der Küche, Screenshot vom Dashboard. Perfekte KPI-Systeme braucht kein Ehrenamt.',
    'Nach dem Fest Ziele gegen Realität halten und nur dann erweitern, wenn der Kern stabil war. So wächst Digitalisierung organisch – von der Engstelle aus, nicht von der Visionstafel.',
  ].join('\n\n'),
    },
    {
      heading: 'Wiederholung und Lernen zwischen den Jahren',
      body: [
    'Straßenfeste haben jedes Jahr ähnliche Engstellen. Fotografiert Standzonen und Board-Positionen fürs Folgejahr. Kombiniert das mit Verkaufszahlen, und ihr plant Flächen und Mengen treffsicherer.',
    'Wenn Auflagen wechseln, passt zuerst die Fläche an und dann die digitale Anordnung. Technik folgt dem Platz, nicht umgekehrt. Diese Reihenfolge verhindert teure Fehlversuche am Festmorgen.',
    'Teilt Learnings mit anderen Initiativen im Ort. Wiederholbare Bewirtungsabläufe sind ein Gemeingut – passend zum Open-Source-Gedanken hinter FestSchmiede.',
  ].join('\n\n'),
    },
    {
      heading: 'Zusammenfassung',
      body: [
    'Vereinsveranstaltung digitalisieren gelingt, wenn ihr Engpässe statt Ideologien adressiert. Die Bewirtungskette Bestellung, Küche und Abholung ist der Hebel mit dem größten Alltagsnutzen.',
    'FestSchmiede bietet dafür als Open-Source-Veranstaltungsplattform Bestellungen, Küche, Abholung, Abholboard, Online-Zahlung und Auswertungen – ehrlich begrenzt, dafür praxistauglich für ehrenamtliche Teams.',
    'Wer digitalisiert, sollte Erfolg an ruhigeren Schichten und belastbaren Zahlen messen – nicht an der Länge der Feature-Liste. Probelauf, schlankes Menü und dokumentierte Retro machen den Unterschied zwischen einmaligem Experiment und nachhaltigem Standard. Helferplanung und Mitgliederverwaltung bleiben analog oder in bestehenden Tools; die Bewirtungskette wird nachvollziehbar. Mit dieser Haltung bleibt Digitalisierung im Verein anschlussfähig – auch für skeptische Ehrenamtliche.'
  ].join('\n\n'),
    },
    ],
    faqs: [
    {
      q: 'Müssen wir alles auf einmal digitalisieren?',
      a: 'Nein. Startet mit Bestellung, Küche und Abholung. Weitere Module nur aktivieren, wenn sie am Festtag wirklich helfen.',
    },
    {
      q: 'Ersetzt das unsere Helferplanung?',
      a: 'Nein. Es gibt kein dediziertes Schichtplan-Modul. Klare Bestell- und Küchenprozesse machen Einsätze planbarer – ergänzend zu eurer Helferliste.',
    },
    {
      q: 'Können wir Getränkeabrechnung damit machen?',
      a: 'Getränke sind Katalogartikel in Bestellungen; Auswertungen liefern Umsatzzahlen. Ein separates Getränkeabrechnungs- oder Kontenbuch-Modul ist es nicht.',
    },
    {
      q: 'Wie lange dauert die Einführung?',
      a: 'Menü und Veranstaltung oft in wenigen Stunden. Entscheidend ist der Probelauf mit Küche und Ausgabe vor dem Festtag.',
    },
    {
      q: 'Ist FestSchmiede kostenlos nutzbar?',
      a: 'Der Quellcode ist Open Source. Gemeinnützige Organisationen können einen kostenlosen Plattform-Mandanten beantragen; alternativ ist Self-Hosting möglich.',
    },
    {
      q: 'Wo sehen wir den Ablauf vorher?',
      a: 'Auf der Marketing-Website unter Funktionen und Screenshots – Bestellseite, Küche, Abholboard und Administration im Überblick.',
    },
    ],
    relatedSlugs: [
      'software-fuer-vereinsfeste',
      'festverwaltung',
      'essensbestellung-verein',
      'helferplanung-verein',
      'feuerwehrfest-organisieren',
    ],
    cta: {
      title: 'Erste Vereinsveranstaltung digital vorbereiten',
      subtitle: 'Mandant beantragen oder Funktionen ansehen – Open Source, ehrlich auf Festabläufe fokussiert.',
    },
  }
];
