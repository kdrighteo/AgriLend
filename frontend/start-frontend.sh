#!/bin/bash

export NODE_OPTIONS=--openssl-legacy-provider
npx kill-port 3000
npm start
