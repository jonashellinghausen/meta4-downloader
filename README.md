# Meta4 Downloader

Eine moderne Web-Anwendung zum Hochladen, Analysieren und Herunterladen von Dateien aus Meta4/Metalink-Dateien.

## Was ist Meta4/Metalink?

Meta4 (Metalink 4.0) ist ein XML-basiertes Metadaten-Format, das verwendet wird, um Informationen über herunterladbare Dateien zu speichern. Es enthält:

- **Dateiinformationen**: Name, Größe, Sprache, Betriebssystem
- **Hash-Werte**: MD5, SHA-1, SHA-256 für Integritätsprüfung
- **Multiple Download-URLs**: Mit Prioritäten und geografischen Standorten
- **Metadaten**: Veröffentlichungsdatum, Generator-Informationen

## Features

- **Drag & Drop**: Meta4-Dateien einfach per Drag & Drop hochladen
- **Detaillierte Anzeige**: Alle Metadaten übersichtlich dargestellt
- **Multiple Download-URLs**: Alle verfügbaren Download-Quellen anzeigen
- **Prioritäten**: URLs nach Priorität sortiert
- **Hash-Anzeige**: Alle Hash-Werte für Integritätsprüfung
- **Responsive Design**: Funktioniert auf Desktop und Mobile
- **Moderne UI**: Ansprechendes, benutzerfreundliches Design

## Installation & Verwendung

### Lokale Verwendung

1. Repository klonen oder herunterladen:
```bash
git clone <repository-url>
cd meta4-downloader
```

2. Die `index.html` Datei in einem Webbrowser öffnen:
```bash
# Mit einem einfachen HTTP-Server (empfohlen)
python3 -m http.server 8000
# Dann öffnen Sie http://localhost:8000 im Browser

# Oder direkt öffnen
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

### Verwendung

1. Öffnen Sie die Anwendung im Browser
2. Klicken Sie auf die Upload-Zone oder ziehen Sie eine `.meta4` oder `.metalink` Datei hinein
3. Die App zeigt alle Dateiinformationen an
4. Klicken Sie auf "Download" bei der gewünschten URL, um die Datei herunterzuladen

### Beispiel-Datei testen

Eine Beispiel-Meta4-Datei (`example.meta4`) ist im Repository enthalten. Verwenden Sie diese, um die Funktionalität der App zu testen.

## Dateistruktur

```
meta4-downloader/
├── index.html       # Haupt-HTML-Datei
├── styles.css       # CSS-Styling
├── app.js          # JavaScript-Logik
├── example.meta4   # Beispiel-Meta4-Datei zum Testen
└── README.md       # Diese Datei
```

## Technische Details

### Unterstützte Formate

- `.meta4` - Metalink 4.0 Format
- `.metalink` - Alternative Dateiendung für Metalink

### Browser-Kompatibilität

Die Anwendung funktioniert in allen modernen Browsern:
- Chrome/Edge (Version 90+)
- Firefox (Version 88+)
- Safari (Version 14+)

### Meta4 XML-Struktur

Die App parst folgende XML-Elemente:

```xml
<metalink xmlns="urn:ietf:params:xml:ns:metalink">
  <file name="filename.ext">
    <size>bytes</size>
    <language>en</language>
    <os>Linux</os>
    <hash type="md5">hash-value</hash>
    <url priority="1" location="de">http://...</url>
  </file>
</metalink>
```

## Funktionsweise

1. **Upload**: Benutzer lädt Meta4-Datei hoch (Drag & Drop oder Klick)
2. **Parsing**: XML wird mit DOMParser analysiert
3. **Extraktion**: Dateiinformationen, Hashes und URLs werden extrahiert
4. **Anzeige**: Daten werden in benutzerfreundlicher Form dargestellt
5. **Download**: Bei Klick auf Download-Button wird die Datei vom Server heruntergeladen

## Sicherheit

- **Keine Server-Kommunikation**: Alle Verarbeitung erfolgt lokal im Browser
- **Keine Datenübertragung**: Meta4-Dateien werden nicht hochgeladen oder gespeichert
- **XSS-Schutz**: Alle Benutzereingaben werden escaped
- **Nur lesender Zugriff**: Die App modifiziert keine Dateien

## Entwicklung

### Erweiterungsmöglichkeiten

- **Torrent-Unterstützung**: Integration von BitTorrent-URLs
- **Hash-Verifizierung**: Automatische Überprüfung heruntergeladener Dateien
- **Download-Manager**: Integrierter Download-Manager mit Fortschrittsanzeige
- **Batch-Download**: Alle Dateien gleichzeitig herunterladen
- **PGP-Signatur**: Unterstützung für digitale Signaturen
- **Mirror-Auswahl**: Automatische Auswahl des schnellsten Mirrors

### Code-Struktur

Die Anwendung ist objektorientiert aufgebaut:

- **Meta4Parser**: Hauptklasse für Parsing und UI-Verwaltung
  - `init()`: Event-Listener einrichten
  - `handleFile()`: Datei-Upload behandeln
  - `parseMetalink()`: XML parsen
  - `parseFile()`: Einzelne Datei-Nodes parsen
  - `displayMetalink()`: UI aktualisieren
  - `downloadFile()`: Download initiieren

## Lizenz

Open Source - Frei verwendbar

## Support

Bei Fragen oder Problemen öffnen Sie bitte ein Issue im Repository.