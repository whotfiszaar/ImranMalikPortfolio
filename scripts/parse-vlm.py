#!/usr/bin/env python3
"""Parse z-ai vision CLI output files: strip banner lines, print message content."""
import json
import re
import sys

for path in sys.argv[1:]:
    txt = open(path).read()
    m = re.search(r'\{.*\}', txt, re.S)
    if not m:
        print(f'--- {path}: NO JSON ---')
        continue
    d = json.loads(m.group(0))
    content = d['choices'][0]['message']['content']
    print(f'--- {path} ---')
    print(content)
    print()
