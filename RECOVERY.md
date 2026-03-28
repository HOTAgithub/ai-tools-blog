# ai-tools-blog 再起動後リカバリ手順

## 現在の状態
- ブログ: ~/ai-tools-blog (Next.js, ポート3081)
- 公開: Cloudflare Quick Tunnel（アカウント不要、URLは毎回ランダム）
- cloudflared: インストール済み (v2026.3.0)
- systemdサービスファイル: 作成済みだが未登録（bus断）

## PC/WSL再起動後にやること

### 1. systemd有効化
```bash
loginctl enable-linger hohoh
export XDG_RUNTIME_DIR=/run/user/$(id -u)
systemctl --user daemon-reload
```

### 2. サービスファイル確認
```bash
cat ~/.config/systemd/user/ai-tools-blog.service
cat ~/.config/systemd/user/cloudflared-tunnel.service
```

### 3. ブログ起動
```bash
cd ~/ai-tools-blog
PORT=3081 nohup npm start &>/tmp/blog-3081.log &
sleep 6
curl -s -o /dev/null -w "%{http_code}" http://localhost:3081
# → 200ならOK
```

### 4. Cloudflare Tunnel起動
```bash
nohup cloudflared tunnel --url http://localhost:3081 &>/tmp/cloudflared.log &
sleep 10
grep -o 'https://[a-z0-9-]*\.trycloudflare\.com' /tmp/cloudflared.log | tail -1
# → URLが表示される
```

### 5. 確認
ブラウザで表示されたURLを開く

## systemdサービス版（上記手動が動いたら登録）
```bash
systemctl --user enable --now ai-tools-blog.service cloudflared-tunnel.service
systemctl --user status ai-tools-blog.service
systemctl --user status cloudflared-tunnel.service
```

## 注意点
- Quick TunnelのURLは起動ごとに変わる（固定URLにするにはCloudflareアカウント+ドメインが必要）
- Cloudflare Zero Trustは無料プランでもカード必須 → Quick Tunnelで回避
- ポート3080はゾンビプロセスで占有されたまま → 3081を使用
- npm/nodeパスは ~/.local/bin/ （systemdのExecStartはフルパス必須）
