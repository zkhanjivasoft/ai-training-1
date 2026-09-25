#!/bin/bash
# Read the JSON event data from stdin (unused beyond this — we just need to drain it).
event_json="$(cat)"

echo "Reminder: run /check-changes before committing"
exit 0
