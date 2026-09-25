# MOSSURI

Figma-matched responsive whitelist/apply site for MOSSURI.

## Files
- `index.html` — UI
- `styles.css` — responsive Figma styling
- `script.js` — character selector, download, tasks, checker, submission, board
- `api/submit.js` — Vercel server endpoint; signs requests with HMAC
- `api/check.js` — wallet-list checker
- `api/board.js` — Mossuris Board loader
- `apps-script.gs` — Google Apps Script backend
- `public/assets/*` — supplied artwork

## Vercel environment variables
Set these in Vercel Project Settings → Environment Variables:
- `GOOGLE_APPS_SCRIPT_URL` = deployed Apps Script `/exec` URL
- `HMAC_SECRET` = a long random secret, identical to the Apps Script Script Property

Never put `HMAC_SECRET` in browser JavaScript.

## Google Sheets setup
1. Create a Google Sheet.
2. Extensions → Apps Script.
3. Paste `apps-script.gs`.
4. Replace the two placeholders in `setup()` with your Sheet ID and a long random HMAC secret.
5. Run `setup()` once and authorize the script.
6. Deploy → New deployment → Web app.
7. Execute as: Me. Who has access: Anyone.
8. Copy the `/exec` URL into Vercel as `GOOGLE_APPS_SCRIPT_URL`.
9. Put the same secret into Vercel as `HMAC_SECRET`.

### Important Apps Script note
Google Apps Script web apps do not reliably expose arbitrary custom HTTP headers to `doPost`, so the production proxy includes the HMAC signature in the JSON body. The browser never receives the secret; only Vercel and Apps Script know it.
