@echo off
echo Building Magnit POS Printer Agent for Windows...
set GOOS=windows
set GOARCH=amd64
go build -o magnitposprinter.exe
echo Build complete: magnitposprinter.exe
pause
