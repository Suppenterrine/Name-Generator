# Name Generator
(💡 *Vorschläge für einfallsreichere Namen sind erwünscht.*) <br>

> Dieses Programm generiert zufällige Namen (oder Sequenzen) aus Wörtern aus angegebenen CSV-Dateien und einer Konfigurationsdatei.<br>

![example](media/example.gif)


<details closed>
<summary>Installation</summary>

1. Sicherstellen das [Git](https://git-scm.com/downloads) (zum herunterladen des Projektes) und [Node.js](https://nodejs.org/en/download) (zur Ausführung des Projektes) installiert sind.
   -  Um die erfolgreiche Installation der Programm zu überprüfen kann folgendes in die Konsole eingeben werden  (*Versionszahlen können variieren*):
      -  **Git**-Installation überprüfen:
            ```bash
            git --version

            # erwartete Ausgabe:
            # git version 2.37.2.windows.2
            ```
      -  **Node.Js**-Installation überprüfen:
            ```bash
            node --version

            # erwartete Ausgabe:
            # v18.15.0
            ```
2. Mit Powershell oder CMD in den Pfad navigieren in dem diese App installiert werden soll, z.B: `C:\Users\<username>\Documents`
3. In der geöffneten Konsole (Powershell oder CMD) diesen Befehl einfügen:
    ```bash
    git clone https://github.com/Suppenterrine/Name-Generator.git
    ```
4. In das neu angelegte Verzeichnis wechseln:
    ```bash
    cd Name-Generator
    ```
   - Wenn der Pfad vom aktuellen Verzeichnis eben so aussah: `C:\Users\<username>\Documents` sollte er danach so aussehen: `C:\Users\<username>\Documents\Name-Generator` 
5. Um die App auszuführen folgendes eingeben:
    ```bash
    node app.js --help
    ```

</details>
<br>

## Projektinhalt

| Dateiname  | Beschreibung |
| ----- | ---- |
| `app.js` | Hauptprogrammdatei |
| `config.json` | Konfigurationsdatei,  Wahrscheinlichkeiten und Trennzeichen |
| `csvData/` | Ordner in welchem CSV-Dateien mit den User definierten Wörtern liegen |

## Anpassung u. Hinweis

Die Ausgabe des Programms basiert auf den Daten in den CSV-Dateien und der Konfiguration.
<br>
<details closed>
<summary>Sequenzaufbau</summary>
Präfix Artikel -  0.2 <br>
Präfix - 0.8 <br>
Seperator - 1 <br>
Hauptwort - 1 <br>
Seperator - 1 <br>
Füllwort - 1 <br>
Suffix Artikel - 0.3 <br>
Seperator - 1 <br>
Suffix Adjektiv - 0.5 <br>
Seperator -  1 <br>
Suffix - 0.5 <br>
</details>
<br>

### **CSV Spalten** <br>
Die möglichen Spalten sind zu diesem Zeitpunkt auf diese Namen festgelegt.

| CSV Spaltenname | Beschreibung | Standard Wahrscheinlichkeit (0 - 1) |
| ----- | ---- | ---- |
|`prefix` | Wahrscheinlichkeit, ein Präfix zum Namen hinzuzufügen | `0.8` |
|`word` | Wort / Hauptwort | `1` |
|`suffix_adj` | Wahrscheinlichkeit, ein Adjektiv zum Suffix hinzuzufügen | `0.5` |
|`suffix` | Wahrscheinlichkeit, einen Suffix-Namen hinzuzufügen | `0.5` |

<br>

### **Weitere Wahrscheinlichkeiten** <br>
|Name | Beschreibung | Standard Wahrscheinlichkeit (0 - 1) |
| ----- | ---- | ---- |
| `prefix_article_probality` | Wahrscheinlichkeit, "The" vor dem Präfix hinzuzufügen | `0.2` |
| `suffix_article_probability` | Wahrscheinlichkeit, "the" nach "of" hinzuzufügen | `0.3` |

<br>

### **Weitere Konfig-Einstellungen** <br>
|Name | Beschreibung | Standard |
| ----- | ---- | ---- |
| `seperator` | Wahl des Trennzeichens zwischen den Wörtern | `Leerzeichen` |
| `fillword` | Wahl das Füllwort nach dem Hauptwort zu ändern | `of` |
| `selectedFiles` | **App-Intern**: Liste mit Dateinamen von welchen Daten verwendet werden | `[ "DateiEins.csv", "DateiZwei.csv" ]` |
| `last_used_name` | **App-Intern**: Enthält zuletzt generierte Sequenz. Stellt sicher das die nächste Sequenz eine neue ist und nicht die gleiche (Kein Nutzen für User) | `"The Hearty Unease of Agitated Destruction"` |