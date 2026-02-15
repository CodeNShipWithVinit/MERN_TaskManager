#!/usr/bin/env bash
# =============================================================================
#  test-api.sh  —  cURL smoke-tests for the Task Manager API
#
#  Usage:
#    chmod +x test-api.sh
#    ./test-api.sh
#
#  Prerequisites:
#    - Backend running on http://localhost:5000  (npm run dev)
#    - jq installed for pretty-printing JSON  (brew install jq  /  apt install jq)
#    - A sample PDF at ./sample.pdf for file upload tests
# =============================================================================

BASE="http://localhost:5000/api/tasks"
SEP="──────────────────────────────────────────────"

echo ""
echo "🧪  Task Manager API — cURL Tests"
echo "$SEP"


# ─── 1. Health check ──────────────────────────────────────────────────────
echo ""
echo "1️⃣   GET /health"
curl -s http://localhost:5000/health | jq .


# ─── 2. GET all tasks (initially just the seeded task) ────────────────────
echo ""
echo "$SEP"
echo "2️⃣   GET /api/tasks"
curl -s "$BASE" | jq .


# ─── 3. POST — create a task WITHOUT a file ───────────────────────────────
echo ""
echo "$SEP"
echo "3️⃣   POST /api/tasks  (no file)"
NEW_TASK=$(curl -s -X POST "$BASE" \
  -F "title=Learn React Hooks" \
  -F "description=Study useState, useEffect and custom hooks in depth." \
  -F "deadline=2025-12-31")
echo "$NEW_TASK" | jq .

# Extract the _id for subsequent tests
TASK_ID=$(echo "$NEW_TASK" | jq -r '.data._id')
echo "   ↳  Created task id: $TASK_ID"


# ─── 4. POST — create a task WITH a PDF ───────────────────────────────────
echo ""
echo "$SEP"
echo "4️⃣   POST /api/tasks  (with PDF)"

# Create a minimal valid PDF on the fly if sample.pdf doesn't exist
if [ ! -f "./sample.pdf" ]; then
  printf '%%PDF-1.4\n1 0 obj<</Type /Catalog /Pages 2 0 R>>endobj 2 0 obj<</Type /Pages /Kids [3 0 R] /Count 1>>endobj 3 0 obj<</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792]>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\ntrailer<</Size 4 /Root 1 0 R>>\nstartxref\n190\n%%%%EOF' > ./sample.pdf
  echo "   ↳  Created minimal sample.pdf for testing"
fi

FILE_TASK=$(curl -s -X POST "$BASE" \
  -F "title=Study TypeScript Advanced" \
  -F "description=Generics, decorators and utility types." \
  -F "deadline=2025-11-30" \
  -F "linkedFile=@./sample.pdf;type=application/pdf")
echo "$FILE_TASK" | jq .

FILE_TASK_ID=$(echo "$FILE_TASK" | jq -r '.data._id')
echo "   ↳  Created file task id: $FILE_TASK_ID"


# ─── 5. GET single task ───────────────────────────────────────────────────
echo ""
echo "$SEP"
echo "5️⃣   GET /api/tasks/:id"
curl -s "$BASE/$TASK_ID" | jq .


# ─── 6. PUT — update task title and deadline ──────────────────────────────
echo ""
echo "$SEP"
echo "6️⃣   PUT /api/tasks/:id  (update title + deadline)"
curl -s -X PUT "$BASE/$TASK_ID" \
  -F "title=Learn React Hooks (Updated)" \
  -F "deadline=2026-03-01" | jq .


# ─── 7. PATCH — mark task as DONE ─────────────────────────────────────────
echo ""
echo "$SEP"
echo "7️⃣   PATCH /api/tasks/:id/status  (mark as done)"
curl -s -X PATCH "$BASE/$TASK_ID/status" | jq .


# ─── 8. GET file download (file task) ─────────────────────────────────────
echo ""
echo "$SEP"
echo "8️⃣   GET /api/tasks/:id/file  (download PDF)"
curl -s -o ./downloaded.pdf -w "   HTTP status: %{http_code}\n" \
  "$BASE/$FILE_TASK_ID/file"
echo "   ↳  Saved to ./downloaded.pdf"


# ─── 9. DELETE a task ─────────────────────────────────────────────────────
echo ""
echo "$SEP"
echo "9️⃣   DELETE /api/tasks/:id"
curl -s -X DELETE "$BASE/$TASK_ID" | jq .


# ─── 10. Validation error — missing required fields ───────────────────────
echo ""
echo "$SEP"
echo "🔟   POST /api/tasks  (missing description → expect 400)"
curl -s -X POST "$BASE" \
  -F "title=Incomplete Task" | jq .


# ─── 11. 404 — task not found ─────────────────────────────────────────────
echo ""
echo "$SEP"
echo "1️⃣ 1️⃣  GET /api/tasks/000000000000000000000000  (non-existent id → expect 404)"
curl -s "$BASE/000000000000000000000000" | jq .


echo ""
echo "$SEP"
echo "✅  All tests complete."
echo ""
