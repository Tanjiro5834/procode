// ProCode's renderer only needs localStorage, which is available by default
// in a BrowserWindow — no contextBridge APIs required today.
//
// This file exists as the wiring point for later: if you add features that
// need main-process access (native file save/export, auto-update, a "reset
// all data" that also clears app data on disk, etc.), expose them here via
// contextBridge.exposeInMainWorld rather than turning nodeIntegration back
// on — keeps the renderer sandboxed the way main.js configures it.
