#!/bin/bash
echo "Building Magnit POS Printer Agent for Windows..."
GOOS=windows GOARCH=amd64 go build -o magnitposprinter.exe
echo "Build complete: magnitposprinter.exe"
