#!/bin/bash
# Script to test Supabase connection with system CA certificates

# Try to locate system CA certificate files
echo "Looking for system CA certificate files..."

if [ -f "/etc/ssl/cert.pem" ]; then
  echo "Found CA certificates at /etc/ssl/cert.pem"
  export NODE_EXTRA_CA_CERTS="/etc/ssl/cert.pem"
elif [ -f "/private/etc/ssl/cert.pem" ]; then 
  echo "Found CA certificates at /private/etc/ssl/cert.pem"
  export NODE_EXTRA_CA_CERTS="/private/etc/ssl/cert.pem"
elif [ -f "/etc/ssl/certs/ca-certificates.crt" ]; then
  echo "Found CA certificates at /etc/ssl/certs/ca-certificates.crt"
  export NODE_EXTRA_CA_CERTS="/etc/ssl/certs/ca-certificates.crt"
elif [ -d "/etc/ssl/certs" ]; then
  echo "Found certificate directory at /etc/ssl/certs"
  export NODE_EXTRA_CA_CERTS="/etc/ssl/certs"
fi

if [ -n "$NODE_EXTRA_CA_CERTS" ]; then
  echo "Setting NODE_EXTRA_CA_CERTS=$NODE_EXTRA_CA_CERTS"
  echo "Running test with system certificates..."
  node test-fetch.mjs
else
  echo "No CA certificate files found. Trying without setting NODE_EXTRA_CA_CERTS..."
  node test-fetch.mjs
fi
