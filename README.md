# Caspian POS — Windows app (.exe)

Wraps your Caspian POS (`delivery342.html`) into a real Windows program, and the
**Call Bridge is built in** — so you do NOT need `Start-Call-Bridge.bat` anymore
when running the exe. The window title shows your phone-link IP, e.g.
`Caspian POS — Phone Link: 192.168.1.50:8910`.

## Build it the same cloud way as the Android app

1. Make a new GitHub repo (e.g. `caspian-pos`).
2. Upload the **contents** of this folder (so `main.js`, `package.json`,
   `delivery342.html`, and the `.github` folder sit at the top level).
   - If the `.github` folder doesn't drag in (Windows hidden-folder issue),
     commit the other files first, then **Add file -> Create new file**, name it
     `.github/workflows/build.yml`, and paste the contents of that file.
3. Go to the **Actions** tab — "Build EXE" runs automatically (Windows builds take
   ~4-6 minutes).
4. When it's green, open the run -> **Artifacts** -> download **Caspian-POS-Setup**.
5. Unzip it -> you'll get **Caspian POS Setup 1.0.0.exe**. That's your installer.

## Install & run

1. Double-click the installer. Windows SmartScreen may warn (unsigned app):
   click **More info -> Run anyway**.
2. It installs and makes a desktop shortcut. Launch **Caspian POS**.
3. The Call Bridge is already running inside it. In the POS go to
   **Settings -> Caller ID**, enable it, port `8910`, Save — the dot turns green.
4. On the phone, point Caspian Call Link at the IP shown in the window title.

## Updating the POS later

When you make a newer POS version, just replace `delivery342.html` in the repo with
your new file (keep the same name), commit, and a fresh exe builds automatically.
If you rename it, update the filename in `main.js` (the `win.loadFile(...)` line).

## Prefer to build locally instead?

You have Node already. In this folder run:

```
npm install
npm run dist
```

The installer appears in the `dist` folder. (If PowerShell blocks npm scripts, run
`Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once, or use Command Prompt.)

## Notes

- Receipt printing uses the normal print dialog. Silent/auto printing can be added
  via Electron IPC later if you want it.
- The exe bundles `delivery342.html`; your data still saves locally on the PC as
  before.
