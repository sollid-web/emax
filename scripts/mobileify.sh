#!/usr/bin/env bash
# mobileify.sh: perform basic mobile-first rewrites on JSX className attributes

# 1. add w-full and move explicit widths to lg:
grep -R --line-number 'className=.*w-' app components |
  cut -d: -f1 | sort -u |
while read -r file; do
  sed -i -E '
    # if className contains w-[0-9] or w-[^ ] add w-full at beginning
    s/(className=")([^"]*?)\b(w-[0-9A-Za-z_\[\]-]+)([^"]*")/\1w-full \2lg:\3\4/g;
    # also catch max-w- classes
    s/(className=")([^"]*?)\b(max-w-[0-9A-Za-z_\[\]-]+)([^"]*")/\1w-full \2lg:\3\4/g;
  ' "$file"
done

# 2. make all flex containers column-first
grep -R --line-number 'className=.*\bflex\b' app components |
  cut -d: -f1 | sort -u |
while read -r file; do
  sed -i -E '
    # ensure flex-col is present and add lg:flex-row if needed
    s/(className="[^"]*?)\bflex\b([^"]*")/\1flex flex-col\2/;
    s/(className="[^"]*?)\bflex-col\b([^"]*")/\1flex-col lg:flex-row\2/;
    s/(className="[^"]*?)\bflex-row\b([^"]*")/\1flex-col lg:flex-row\2/;
  ' "$file"
done

# 3. flag tables for manual refactor (insert JS comment at top)
grep -R --line-number '<table' app components |
  cut -d: -f1 | sort -u |
while read -r file; do
  # prepend a JS comment; safe in TSX/JSX
  sed -i -E '1i// TODO: convert table to mobile cards (hidden lg:table)' "$file"
done

echo "Finished sed pass – inspect the modified files and adjust as needed."