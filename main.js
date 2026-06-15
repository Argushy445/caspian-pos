const { app, BrowserWindow } = require('electron');
const http = require('http');
const os = require('os');

// ============================================================
// Built-in Call Bridge (no separate window needed)
// Phone -> http://<this-pc-ip>:8910/call?number=...
// POS page polls -> http://localhost:8910/latest
// ============================================================
const PORT = 8910;
let latest = { id: 0, number: '', name: '' };

function startBridge() {
  http.createServer((req, res) => {
    let u;
    try { u = new URL(req.url, 'http://localhost'); }
    catch (e) { res.writeHead(400); res.end('bad'); return; }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-store');

    if (u.pathname === '/call') {
      const num  = (u.searchParams.get('number') || u.searchParams.get('n') || '').trim();
      const name = (u.searchParams.get('name')   || '').trim();
      if (num || name) latest = { id: Date.now(), number: num, name: name };
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('OK ' + (num || name));
      return;
    }
    if (u.pathname === '/latest') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(latest));
      return;
    }
    if (u.pathname === '/clear') {
      latest = { id: 0, number: '', name: '' };
      res.writeHead(200); res.end('cleared');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Caspian Call Bridge running');
  }).listen(PORT, '0.0.0.0');
}

function lanIP() {
  const nets = os.networkInterfaces();
  for (const name in nets) {
    for (const n of nets[name]) {
      if (n.family === 'IPv4' && !n.internal) return n.address;
    }
  }
  return '127.0.0.1';
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    fullscreen: true,
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true }
  });

  const ip = lanIP();
  win.loadFile('delivery342.html');

  // Keep our title (with the phone-link IP) instead of the page's title.
  win.on('page-title-updated', (e) => e.preventDefault());
  win.webContents.on('did-finish-load', () => {
    win.setTitle('Caspian POS      —      Phone Link: ' + ip + ':' + PORT);
  });
}

app.whenReady().then(() => {
  startBridge();
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
