#!/bin/bash
echo "Building Magnit POS Printer Agent for macOS..."
go build -o magnitposprinter
echo "Build complete: magnitposprinter"
chmod +x magnitposprinter
