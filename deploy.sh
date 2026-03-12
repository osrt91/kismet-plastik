#!/bin/bash
# Kismet Plastik - Deploy & Rollback Script
#
# Deploy:   bash deploy.sh "commit mesajı"
# Rollback: bash deploy.sh --rollback

set -e

VPS_USER="root"
VPS_HOST="72.61.178.25"
VPS_KEY="$HOME/.ssh/kismet_vps"
VPS_REPO="/docker/kismetplastik/repo"

# ============ ROLLBACK ============
if [ "$1" = "--rollback" ]; then
  echo "========================================="
  echo "  ROLLBACK"
  echo "========================================="

  # Son 5 commit'i göster
  echo ""
  echo "Son 5 commit:"
  git log --oneline -5
  echo ""

  # Bir önceki commit'e dön
  PREV=$(git log --oneline -2 | tail -1 | cut -d' ' -f1)
  echo "Geri donulecek commit: $PREV"
  echo ""
  read -p "Emin misin? (e/h): " CONFIRM
  if [ "$CONFIRM" != "e" ]; then
    echo "Iptal edildi."
    exit 0
  fi

  # Revert commit oluştur (orijinal commit silinmez, geri alma commit'i eklenir)
  git revert HEAD --no-edit
  git push origin master

  # VPS'i güncelle
  echo ""
  echo "VPS guncelleniyor..."
  ssh -i "$VPS_KEY" -o StrictHostKeyChecking=no "$VPS_USER@$VPS_HOST" "
    cd $VPS_REPO && \
    git pull origin master && \
    npm run build && \
    pm2 restart kismetplastik
  "

  echo ""
  echo "========================================="
  echo "  Rollback tamamlandi!"
  echo "  Geri donulen commit: $PREV"
  echo "========================================="
  exit 0
fi

# ============ DEPLOY ============
MSG="${1:-update}"
DEPLOY_LOG="/tmp/kismetplastik-deploys.log"
DEPLOY_LIMIT=10
DEPLOY_WINDOW=3600  # 1 saat

# Son 1 saatteki deploy sayısını kontrol et
NOW=$(date +%s)
CUTOFF=$((NOW - DEPLOY_WINDOW))
RECENT=0
if [ -f "$DEPLOY_LOG" ]; then
  RECENT=$(awk -v cutoff="$CUTOFF" '$1 > cutoff' "$DEPLOY_LOG" 2>/dev/null | wc -l)
fi

if [ "$RECENT" -ge "$DEPLOY_LIMIT" ]; then
  echo "  !! Son 1 saatte $RECENT deploy yapildi (limit: $DEPLOY_LIMIT)"
  read -p "  Devam edilsin mi? (e/h): " CONFIRM
  if [ "$CONFIRM" != "e" ]; then
    echo "  Iptal edildi."
    exit 0
  fi
fi

# Deploy zamanını kaydet
echo "$NOW" >> "$DEPLOY_LOG"

echo "========================================="
echo "  Kismet Plastik Deploy (#$((RECENT + 1)) bu saat)"
echo "========================================="

# 1. Lokal değişiklikleri commit et
echo ""
echo "[1/4] Lokal commit..."
git add -A
git commit -m "$MSG" || echo "  (commit edilecek degisiklik yok)"

# 2. GitHub'a push
echo ""
echo "[2/4] GitHub'a push..."
git push origin master

# 3. VPS'i güncelle (pull + build + restart)
echo ""
echo "[3/4] VPS guncelleniyor..."
ssh -i "$VPS_KEY" -o StrictHostKeyChecking=no "$VPS_USER@$VPS_HOST" "
  cd $VPS_REPO && \
  git pull origin master && \
  npm run build && \
  pm2 restart kismetplastik
"

# 4. Önizleme linki
echo ""
echo "========================================="
echo "[4/4] Deploy tamamlandi!"
echo ""
echo "  Onizleme: https://www.kismetplastik.com/test/tr"
echo "  Admin:    https://www.kismetplastik.com/admin"
echo "  Bayi:     https://www.kismetplastik.com/bayi"
echo "  Studio:   https://studio.kismetplastik.com"
echo ""
echo "========================================="
