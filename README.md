# Zufälliger Namensgenerator

Dieses Programm generiert zufällige Namen aus einer Liste von Wörtern in einer JSON-Datei und einer Konfigurationsdatei.

## Verwendung
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
    node app.js
    ```

### Dateien

- app.js: Hauptprogrammdatei
- word-list.json: Liste von Wörtern, die zum Generieren von Namen verwendet werden
- config.json: Konfigurationsdatei mit Wahrscheinlichkeiten und Trennzeichen

## Anpassung

Das Programm kann angepasst werden, indem die word-list.json und config.json bearbeiten werden. Es können mehr Wörter hinzugefügt oder geändert werden und die Wahrscheinlichkeiten angepasst werden, um verschiedene Namenskombinationen zu erhalten.
