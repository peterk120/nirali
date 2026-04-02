@echo off
title Nirali Sai Centralized Backend
echo ---------------------------------------------------
echo Starting Nirali Sai Centralized Backend...
echo Serving: Sashti Sparkle and Boutique Quest
echo Port: 3001
echo ---------------------------------------------------
cd /d %~dp0
set "MONGODB_URI=mongodb+srv://prajancs22_db_user:0611@cluster0.2zvslh8.mongodb.net/sashti-sparkle?retryWrites=true&w=majority"
set PORT=3001

cd backend
npm run dev
pause
