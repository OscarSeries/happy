#!/usr/bin/env node
/**
 * Happy Auth Link Server (port 3006)
 * Generates happy://terminal?<key> and shows it as a web page.
 */
import http from 'http';
import { createRequire } from 'module';
import { randomBytes } from 'crypto';

const require = createRequire(import.meta.url);
const repoRoot = new URL('..', import.meta.url).pathname;
const nacl = require(repoRoot + 'node_modules/tweetnacl/nacl-fast.js');

const SERVER_URL = process.env.HAPPY_SERVER_URL || 'http://localhost:3005';
const PORT = process.env.AUTH_SERVER_PORT || 3006;

function generateKeypair() {
    const secret = randomBytes(32);
    const keypair = nacl.box.keyPair.fromSecretKey(secret);
    const pubB64url = Buffer.from(keypair.publicKey).toString('base64url');
    const pubB64std = Buffer.from(keypair.publicKey).toString('base64');
    return { pubB64url, pubB64std };
}

async function createAuthRequest(pubB64std) {
    const res = await fetch(`${SERVER_URL}/v1/auth/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicKey: pubB64std, supportsV2: true })
    });
    return res.ok;
}

function renderHtml(authUrl, statusColor, statusMsg) {
    return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Happy Auth</title>
<style>
  body{font-family:-apple-system,sans-serif;background:#18171C;color:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}
  .card{background:#2a2930;border-radius:16px;padding:32px;max-width:480px;width:90%;text-align:center}
  h2{margin:0 0 8px;font-size:20px}
  p{color:#aaa;font-size:14px;margin:0 0 24px}
  .url-box{background:#18171C;border-radius:10px;padding:16px;font-family:monospace;font-size:11px;word-break:break-all;color:#7ee8a2;margin-bottom:20px;cursor:pointer;user-select:all}
  .btn{display:block;background:#6c47ff;color:#fff;text-decoration:none;padding:14px;border-radius:10px;font-size:16px;font-weight:600;margin-bottom:12px}
  .btn-secondary{background:#333;font-size:14px;padding:10px}
  .status{font-size:12px;color:${statusColor};margin-top:16px}
</style>
</head>
<body>
<div class="card">
  <h2>Happy 인증</h2>
  <p>URL을 복사하거나 앱에서 열기 버튼을 누르세요</p>
  <div class="url-box" onclick="navigator.clipboard.writeText(this.innerText).then(()=>alert('복사됨!'))">${authUrl}</div>
  <a class="btn" href="${authUrl}">앱에서 열기</a>
  <a class="btn btn-secondary" href="/">새 인증 URL 생성</a>
  <div class="status">${statusMsg}</div>
</div>
</body>
</html>`;
}

const server = http.createServer(async (req, res) => {
    if (req.url !== '/') { res.writeHead(404); res.end(); return; }

    const { pubB64url, pubB64std } = generateKeypair();
    const authUrl = `happy://terminal?${pubB64url}`;

    let statusColor = '#aaa', statusMsg = '인증 URL 생성됨';
    try {
        const ok = await createAuthRequest(pubB64std);
        if (ok) {
            statusColor = '#7ee8a2';
            statusMsg = '✓ 서버에 인증 요청 등록됨 — 앱에서 URL을 열어주세요';
        } else {
            statusColor = '#ff6b6b';
            statusMsg = '⚠ 서버 요청 실패';
        }
    } catch (e) {
        statusColor = '#ff6b6b';
        statusMsg = `⚠ 서버 연결 실패: ${e.message}`;
    }

    const html = renderHtml(authUrl, statusColor, statusMsg);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
});

server.listen(PORT, () => console.log(`Happy Auth Server: http://localhost:${PORT}`));
