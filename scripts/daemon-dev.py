#!/usr/bin/env python3
"""Double-fork daemonize the Next.js dev server so it survives tool calls."""
import os
import sys
import subprocess
from pathlib import Path

PROJECT = "/home/z/my-project"
LOG = open("/home/z/my-project/scripts/dev-server.log", "ab", buffering=0)

# First fork
pid = os.fork()
if pid > 0:
    print(f"parent exiting, child={pid}")
    sys.exit(0)

# Detach: new session, drop terminal control
os.setsid()

# Second fork: ensure the daemon can never re-acquire a terminal
pid = os.fork()
if pid > 0:
    sys.exit(0)

# Redirect stdio to the log file
os.dup2(LOG.fileno(), 1)
os.dup2(LOG.fileno(), 2)
os.close(0)

os.chdir(PROJECT)
env = dict(os.environ)
subprocess.Popen(
    ["npm", "run", "dev"],
    cwd=PROJECT,
    stdout=LOG.fileno(),
    stderr=LOG.fileno(),
    stdin=subprocess.DEVNULL,
    env=env,
    start_new_session=True,
)
print("daemon spawned")
