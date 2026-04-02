@echo off
title Sashti Sparkle Frontend
echo ---------------------------------------------------
echo Starting Sashti Sparkle Frontend...
echo ---------------------------------------------------
cd /d %~dp0
pnpm --filter=sasthik dev
pause
