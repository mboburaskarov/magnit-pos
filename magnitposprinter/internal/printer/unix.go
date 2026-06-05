//go:build darwin || linux
// +build darwin linux

package printer

import (
	"bytes"
	"fmt"
	"os/exec"
	"strings"
)

type UnixPrinter struct {
	name string
}

func NewLocalPrinter(name string) (*UnixPrinter, error) {
	return &UnixPrinter{name: name}, nil
}

func (up *UnixPrinter) Write(data []byte) error {
	cmd := exec.Command("lp", "-d", up.name, "-o", "raw")
	cmd.Stdin = bytes.NewReader(data)
	out, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("lp failed: %v, output: %s", err, string(out))
	}
	return nil
}

func (up *UnixPrinter) Close() error {
	return nil
}

func GetLocalPrinters() ([]PrinterInfo, error) {
	cmd := exec.Command("lpstat", "-a")
	out, err := cmd.Output()
	if err != nil {
		return nil, nil // return empty if lpstat fails
	}
	
	cmdDef := exec.Command("lpstat", "-d")
	outDef, _ := cmdDef.Output()
	defaultPrinterName := ""
	if strings.Contains(string(outDef), "system default destination: ") {
		defaultPrinterName = strings.TrimSpace(strings.Split(string(outDef), "system default destination: ")[1])
	}
	
	lines := strings.Split(string(out), "\n")
	var printers []PrinterInfo
	for _, line := range lines {
		if strings.TrimSpace(line) == "" {
			continue
		}
		parts := strings.Fields(line)
		if len(parts) > 0 {
			name := parts[0]
			printers = append(printers, PrinterInfo{
				ID:           strings.ReplaceAll(strings.ToLower(name), " ", "_"),
				Name:         name,
				Type:         "local",
				IsDefault:    name == defaultPrinterName,
				Recommended:  isUnixRecommended(name),
				SupportedRaw: true,
			})
		}
	}
	return printers, nil
}

func isUnixRecommended(name string) bool {
	lowerName := strings.ToLower(name)
	keywords := []string{"xprinter", "rongta", "bixolon", "xp-", "rp-", "pos", "receipt", "thermal", "58", "80"}
	for _, kw := range keywords {
		if strings.Contains(lowerName, kw) {
			return true
		}
	}
	return false
}
