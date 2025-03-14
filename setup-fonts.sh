#!/bin/bash

# Create fonts directory if it doesn't exist
mkdir -p src/fonts

# Copy Cash Sans fonts
cp /Users/rsa/Downloads/CashSans_OTF/*.otf src/fonts/

echo "Cash Sans fonts copied to src/fonts/"