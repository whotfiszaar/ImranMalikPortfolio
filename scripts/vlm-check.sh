#!/bin/bash
# Verify logo candidates via VLM, saving raw JSON output for parsing
OUT="$1"; shift
z-ai vision "$@" > "$OUT" 2>/dev/null
