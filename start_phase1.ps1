$phase1 = "C:\Users\Admin\Documents\PHASE 1"

Start-Process powershell -WindowStyle Hidden -ArgumentList `
  "-NoProfile", `
  "-Command", `
  "Set-Location '$phase1\Week1'; docker compose up -d"

Start-Process powershell -WindowStyle Hidden -ArgumentList `
  "-NoProfile", `
  "-Command", `
  "Set-Location '$phase1\Week4'; .\.venv\Scripts\python.exe -m uvicorn src.api:app --reload --port 8000"

Start-Process powershell -WindowStyle Hidden -ArgumentList `
  "-NoProfile", `
  "-Command", `
  "Set-Location '$phase1\Week2'; npm run dev"

Start-Sleep -Seconds 8

Start-Process "http://localhost:5173/dashboard"