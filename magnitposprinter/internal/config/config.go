package config

import (
	"encoding/json"
	"os"
	"path/filepath"
	"runtime"
)

type CashDrawerConfig struct {
	Enabled           bool   `json:"enabled"`
	OpenOnCashPayment bool   `json:"openOnCashPayment"`
	OpenTiming        string `json:"openTiming"`
	Command           string `json:"command"`
}

type Config struct {
	Mode               string           `json:"mode"`
	ReceiptPrinterIp   string           `json:"receiptPrinterIp"`
	ReceiptPrinterPort int              `json:"receiptPrinterPort"`
	PrinterName        string           `json:"printerName"` // Local printer name
	PrinterModel       string           `json:"printerModel"`
	PaperWidth         int              `json:"paperWidth"`
	CashDrawer         CashDrawerConfig `json:"cashDrawer"`
}

var (
	configPath string
	AppConfig  Config
)

func InitConfig() error {
	if runtime.GOOS == "windows" {
		configPath = filepath.Join("C:\\", "ProgramData", "MagnitPOSPrinter", "config.json")
	} else {
		homeDir, err := os.UserHomeDir()
		if err != nil {
			return err
		}
		configPath = filepath.Join(homeDir, "Library", "Application Support", "MagnitPOSPrinter", "config.json")
	}

	return loadConfig()
}

func loadConfig() error {
	dir := filepath.Dir(configPath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return err
	}

	AppConfig = Config{
		Mode:               "network",
		ReceiptPrinterIp:   "",
		ReceiptPrinterPort: 9100,
		PrinterModel:       "ESC/POS",
		PaperWidth:         80,
		CashDrawer: CashDrawerConfig{
			Enabled:           true,
			OpenOnCashPayment: true,
			OpenTiming:        "after_print",
			Command:           "1B700019FA",
		},
	}

	if _, err := os.Stat(configPath); os.IsNotExist(err) {
		return SaveConfig(AppConfig)
	}

	file, err := os.Open(configPath)
	if err != nil {
		return err
	}
	defer file.Close()

	decoder := json.NewDecoder(file)
	if err := decoder.Decode(&AppConfig); err != nil {
		return err // Using defaults if fails, but returning err to log
	}

	return nil
}

func SaveConfig(cfg Config) error {
	dir := filepath.Dir(configPath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return err
	}

	file, err := os.Create(configPath)
	if err != nil {
		return err
	}
	defer file.Close()

	encoder := json.NewEncoder(file)
	encoder.SetIndent("", "  ")
	err = encoder.Encode(cfg)
	if err == nil {
		AppConfig = cfg
	}
	return err
}

func GetConfigPath() string {
	return configPath
}
