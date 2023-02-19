#!/usr/bin/env bash

set -e;

if [ "$SKIP_POSTINSTALL" == "yes" ]; then
  echo "skipping postinstall routine.";
  exit 0;
fi

npx lessc 'src/styles/rsuite_components.less' src/styles/rsuite_components.css