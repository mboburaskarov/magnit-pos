package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"path/filepath"
	"runtime"
	"strconv"
	"strings"
	"time"

	"golang.org/x/text/encoding/charmap"
)

// Config holds local printer settings
type Config struct {
	ReceiptPrinterIP   string `json:"receiptPrinterIp"`
	ReceiptPrinterPort int    `json:"receiptPrinterPort"`
	PrinterModel       string `json:"printerModel"`
}

// ReceiptItem represents a line item in a receipt
type ReceiptItem struct {
	Name  string  `json:"name"`
	Qty   float64 `json:"qty"`
	Price float64 `json:"price"`
	Total float64 `json:"total"`
}

// ReceiptRequest represents the printing payload
type ReceiptRequest struct {
	SaleID       string        `json:"saleId"`
	Cashier      string        `json:"cashier"`
	PaymentType  string        `json:"paymentType"`
	Items        []ReceiptItem `json:"items"`
	Subtotal     float64       `json:"subtotal"`
	Discount     float64       `json:"discount"`
	TotalAmount  float64       `json:"totalAmount"`
	PaidAmount   float64       `json:"paidAmount"`
	ChangeAmount float64       `json:"changeAmount"`
	VATAmount    float64       `json:"vatAmount"`
	ChequeType   string        `json:"chequeType"`
	FiscalSign   string        `json:"fiscalSign"`
	FiscalNumber string        `json:"fiscalNumber"`
	Customer     string        `json:"customer"`
}

var (
	configPath string
	appConfig  Config
)

func init() {
	// Determine configuration path depending on Operating System
	if runtime.GOOS == "windows" {
		configPath = filepath.Join("C:\\", "ProgramData", "MagnitPOSPrinter", "config.json")
	} else {
		// macOS and Linux
		homeDir, err := os.UserHomeDir()
		if err != nil {
			log.Fatalf("Error getting user home directory: %v", err)
		}
		configPath = filepath.Join(homeDir, "Library", "Application Support", "MagnitPOSPrinter", "config.json")
	}

	loadConfig()
}

func loadConfig() {
	// Create directory if it doesn't exist
	dir := filepath.Dir(configPath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		log.Printf("Error creating config directory: %v", err)
	}

	// Default config
	appConfig = Config{
		ReceiptPrinterIP:   "",
		ReceiptPrinterPort: 9100,
		PrinterModel:       "ESC/POS",
	}

	// Read existing config or create default
	if _, err := os.Stat(configPath); os.IsNotExist(err) {
		saveConfig(appConfig)
	} else {
		file, err := os.Open(configPath)
		if err != nil {
			log.Printf("Error opening config file: %v", err)
			return
		}
		defer file.Close()

		decoder := json.NewDecoder(file)
		if err := decoder.Decode(&appConfig); err != nil {
			log.Printf("Error decoding config file: %v. Using defaults.", err)
		}
	}
}

func saveConfig(cfg Config) error {
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
	return encoder.Encode(cfg)
}

// Middleware to enable CORS preflight handling and headers
func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next(w, r)
	}
}

func handleStatus(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	response := map[string]interface{}{
		"ok":                true,
		"agent":             "Magnit POS Printer Agent",
		"version":           "1.0.0",
		"printerConfigured": appConfig.ReceiptPrinterIP != "",
		"printer": map[string]interface{}{
			"ip":    appConfig.ReceiptPrinterIP,
			"port":  appConfig.ReceiptPrinterPort,
			"model": appConfig.PrinterModel,
		},
	}
	json.NewEncoder(w).Encode(response)
}

func handleGetSettings(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(appConfig)
}

func handlePostSettings(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var newConfig Config
	if err := json.NewDecoder(r.Body).Decode(&newConfig); err != nil {
		http.Error(w, fmt.Sprintf("Invalid JSON: %v", err), http.StatusBadRequest)
		return
	}

	if newConfig.ReceiptPrinterPort == 0 {
		newConfig.ReceiptPrinterPort = 9100
	}
	if newConfig.PrinterModel == "" {
		newConfig.PrinterModel = "ESC/POS"
	}

	if err := saveConfig(newConfig); err != nil {
		http.Error(w, fmt.Sprintf("Failed to save config: %v", err), http.StatusInternalServerError)
		return
	}

	appConfig = newConfig
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"ok": true, "settings": appConfig})
}

func handlePing(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	if appConfig.ReceiptPrinterIP == "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{"ok": false, "message": "Printer IP is empty"})
		return
	}

	address := fmt.Sprintf("%s:%d", appConfig.ReceiptPrinterIP, appConfig.ReceiptPrinterPort)
	conn, err := net.DialTimeout("tcp", address, 3*time.Second)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusGatewayTimeout)
		json.NewEncoder(w).Encode(map[string]interface{}{"ok": false, "message": fmt.Sprintf("TCP Connection failed: %v", err)})
		return
	}
	conn.Close()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"ok": true, "message": "Ping success"})
}

func normalizeUzbek(s string) string {
	r := strings.NewReplacer(
		"oʻ", "o'", "Oʻ", "O'",
		"o‘", "o'", "O‘", "O'",
		"o`", "o'", "O`", "O'",
		"o'", "o'", "O'", "O'",
		"gʻ", "g'", "Gʻ", "G'",
		"g‘", "g'", "G‘", "G'",
		"g`", "g'", "G`", "G'",
		"g'", "g'", "G'", "G'",
		"ʻ", "'", "‘", "'", "`", "'",
		"ў", "у", "Ў", "У",
		"қ", "к", "Қ", "К",
		"ғ", "г", "Ғ", "Г",
		"ҳ", "х", "Ҳ", "Х",
	)
	return r.Replace(s)
}

func encodeToCP866(s string) []byte {
	s = normalizeUzbek(s)
	encoder := charmap.CodePage866.NewEncoder()
	res, err := encoder.Bytes([]byte(s))
	if err != nil {
		var buf bytes.Buffer
		for _, r := range s {
			b, err := encoder.Bytes([]byte(string(r)))
			if err == nil {
				buf.Write(b)
			} else {
				buf.WriteByte('?')
			}
		}
		return buf.Bytes()
	}
	return res
}

func writeRaw(buf *bytes.Buffer, data []byte) {
	buf.Write(data)
}

func writeText(buf *bytes.Buffer, text string) {
	buf.Write(encodeToCP866(text))
}

func centerText(buf *bytes.Buffer, text string, width int) {
	text = normalizeUzbek(text)
	runes := []rune(text)
	if len(runes) >= width {
		writeText(buf, string(runes[:width])+"\n")
		return
	}
	leftPadding := (width - len(runes)) / 2
	rightPadding := width - len(runes) - leftPadding
	paddingStr := strings.Repeat(" ", leftPadding) + string(runes) + strings.Repeat(" ", rightPadding) + "\n"
	writeText(buf, paddingStr)
}

func leftRight(buf *bytes.Buffer, left string, right string, width int) {
	left = normalizeUzbek(left)
	right = normalizeUzbek(right)
	leftRunes := []rune(left)
	rightRunes := []rune(right)

	totalLen := len(leftRunes) + len(rightRunes)
	if totalLen <= width {
		spaces := width - totalLen
		lineStr := string(leftRunes) + strings.Repeat(" ", spaces) + string(rightRunes) + "\n"
		writeText(buf, lineStr)
	} else {
		writeText(buf, string(leftRunes)+"\n")
		spaces := width - len(rightRunes)
		if spaces < 0 {
			spaces = 0
		}
		lineStr := strings.Repeat(" ", spaces) + string(rightRunes) + "\n"
		writeText(buf, lineStr)
	}
}

func line(buf *bytes.Buffer, width int) {
	writeText(buf, strings.Repeat("-", width)+"\n")
}

func cutPaper(buf *bytes.Buffer) {
	buf.Write([]byte("\n\n\n\n"))
	buf.Write([]byte{0x1d, 0x56, 0x42, 0x00}) // Cut command (GS V 66 0)
}

func wrapText(text string, width int) []string {
	text = normalizeUzbek(text)
	words := strings.Fields(text)
	if len(words) == 0 {
		return []string{""}
	}

	var lines []string
	currentLine := words[0]

	for _, word := range words[1:] {
		if len([]rune(currentLine))+1+len([]rune(word)) <= width {
			currentLine += " " + word
		} else {
			lines = append(lines, currentLine)
			currentLine = word
		}
	}
	lines = append(lines, currentLine)
	return lines
}

func setBold(buf *bytes.Buffer, bold bool) {
	if bold {
		buf.Write([]byte{0x1b, 0x45, 0x01})
	} else {
		buf.Write([]byte{0x1b, 0x45, 0x00})
	}
}

func formatMoneyWithoutSuffix(val float64) string {
	s := strconv.FormatFloat(val, 'f', 0, 64)
	var res []rune
	l := len(s)
	for i, r := range s {
		res = append(res, r)
		if (l-i-1)%3 == 0 && i != l-1 {
			res = append(res, ' ')
		}
	}
	return string(res)
}

func handlePrintTest(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	if appConfig.ReceiptPrinterIP == "" {
		http.Error(w, "Printer IP is not configured", http.StatusBadRequest)
		return
	}

	var buf bytes.Buffer
	buf.Write([]byte{0x1b, 0x40})       // Initialize
	buf.Write([]byte{0x1b, 0x74, 0x07}) // Select CP866

	setBold(&buf, true)
	centerText(&buf, "MAGNIT POS AGENT TEST", 48)
	setBold(&buf, false)
	line(&buf, 48)

	centerText(&buf, "Uzbek Cyrillic / O'zbekcha", 48)
	writeText(&buf, "Узбекча (ў,қ,ғ,ҳ): узбекча киргизиш\n")
	writeText(&buf, "O'zbekcha oʻgʻil bolalar (curly normal)\n")
	writeText(&buf, "O'zbekcha o‘g‘il bolalar (curly normal 2)\n")

	line(&buf, 48)
	centerText(&buf, "Russian Cyrillic / Русский", 48)
	writeText(&buf, "Русский текст: Проверка кириллицы CP866\n")
	writeText(&buf, "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ\n")
	writeText(&buf, "абвгдежзийклмнопрстуфхцчшщъыьэюя\n")

	line(&buf, 48)
	leftRight(&buf, "Printer IP:", appConfig.ReceiptPrinterIP, 48)
	leftRight(&buf, "Port:", strconv.Itoa(appConfig.ReceiptPrinterPort), 48)
	leftRight(&buf, "Model:", appConfig.PrinterModel, 48)
	leftRight(&buf, "Vaqt/Время:", time.Now().Format("02.01.2006 15:04:05"), 48)
	line(&buf, 48)

	centerText(&buf, "TEST PRINT COMPLETED / OK", 48)
	cutPaper(&buf)

	err := sendToPrinter(buf.Bytes())
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadGateway)
		json.NewEncoder(w).Encode(map[string]interface{}{"ok": false, "message": err.Error()})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"ok": true, "message": "Test print sent successfully"})
}

func handlePrintReceipt(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	if appConfig.ReceiptPrinterIP == "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{"ok": false, "message": "Printer IP is not configured"})
		return
	}

	var req ReceiptRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{"ok": false, "message": fmt.Sprintf("Invalid request payload: %v", err)})
		return
	}

	var buf bytes.Buffer
	buf.Write([]byte{0x1b, 0x40})       // Initialize
	buf.Write([]byte{0x1b, 0x74, 0x07}) // Select CP866

	setBold(&buf, true)
	centerText(&buf, "MAGNIT SUPERMARKET", 48)
	setBold(&buf, false)
	centerText(&buf, "STIR: 309228654", 48)
	centerText(&buf, "Do'kon: Magnit №1", 48)
	centerText(&buf, "Kontakt: +998 71 123-45-67", 48)
	centerText(&buf, "Ish tartibi: 08:00 - 22:00", 48)
	line(&buf, 48)

	leftRight(&buf, "Sotuv raqami:", "#"+req.SaleID, 48)
	leftRight(&buf, "Sana:", time.Now().Format("02.01.2006 15:04:05"), 48)
	leftRight(&buf, "Sotuvchi:", req.Cashier, 48)
	if req.Customer != "" {
		leftRight(&buf, "Mijoz:", req.Customer, 48)
	}
	line(&buf, 48)

	for _, item := range req.Items {
		wrappedNames := wrapText(item.Name, 48)
		for _, nameLine := range wrappedNames {
			writeText(&buf, nameLine+"\n")
		}
		qtyStr := strconv.FormatFloat(item.Qty, 'f', -1, 64)
		leftPart := fmt.Sprintf("  %s x %s", qtyStr, formatMoneyWithoutSuffix(item.Price))
		rightPart := "= " + formatMoneyWithoutSuffix(item.Total) + " UZS"
		leftRight(&buf, leftPart, rightPart, 48)
	}

	line(&buf, 48)
	leftRight(&buf, "Umumiy narx:", formatMoney(req.Subtotal), 48)
	if req.Discount > 0 {
		leftRight(&buf, "Shtrix-kodli chegirma:", formatMoney(req.Discount), 48)
	}
	if req.VATAmount > 0 {
		leftRight(&buf, "Umumiy QQS:", formatMoney(req.VATAmount), 48)
	}
	setBold(&buf, true)
	leftRight(&buf, "Yakuniy narx (TO'LOV):", formatMoney(req.TotalAmount), 48)
	setBold(&buf, false)
	line(&buf, 48)

	payTypeLabel := "Naqd to'lov:"
	if req.PaymentType == "card" || req.PaymentType == "cardless" {
		payTypeLabel = "Karta orqali to'lov:"
	} else if req.PaymentType != "cash" && req.PaymentType != "" {
		payTypeLabel = fmt.Sprintf("To'lov (%s):", req.PaymentType)
	}
	leftRight(&buf, payTypeLabel, formatMoney(req.PaidAmount), 48)
	leftRight(&buf, "Qaytim:", formatMoney(req.ChangeAmount), 48)
	line(&buf, 48)

	if req.ChequeType != "" {
		chequeTypeStr := strings.ToUpper(req.ChequeType)
		if chequeTypeStr == "SALE" {
			chequeTypeStr = "SOTUV"
		} else if chequeTypeStr == "RETURN" {
			chequeTypeStr = "QAYTARISH"
		}
		leftRight(&buf, "Chek turi:", chequeTypeStr, 48)
	}
	if req.FiscalSign != "" {
		leftRight(&buf, "Fiskal belgi (FM):", req.FiscalSign, 48)
	}
	if req.FiscalNumber != "" {
		leftRight(&buf, "Fiskal raqami:", req.FiscalNumber, 48)
	}
	if req.ChequeType != "" || req.FiscalSign != "" || req.FiscalNumber != "" {
		line(&buf, 48)
	}

	setBold(&buf, true)
	centerText(&buf, "SOTILGAN TOVAR ALMASHTIRILMAYDI", 48)
	centerText(&buf, "VA QAYTARIB OLINMAYDI", 48)
	setBold(&buf, false)
	centerText(&buf, "XARIDINGIZ UCHUN RAHMAT!!!", 48)
	cutPaper(&buf)

	err := sendToPrinter(buf.Bytes())
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadGateway)
		json.NewEncoder(w).Encode(map[string]interface{}{"ok": false, "message": err.Error()})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"ok": true, "message": "Receipt printed successfully"})
}

func sendToPrinter(data []byte) error {
	address := fmt.Sprintf("%s:%d", appConfig.ReceiptPrinterIP, appConfig.ReceiptPrinterPort)
	conn, err := net.DialTimeout("tcp", address, 3*time.Second)
	if err != nil {
		return fmt.Errorf("TCP Connection to printer failed: %v", err)
	}
	defer conn.Close()

	_, err = conn.Write(data)
	if err != nil {
		return fmt.Errorf("Failed writing raw ESC/POS bytes to printer: %v", err)
	}

	return nil
}

func formatMoney(val float64) string {
	s := strconv.FormatFloat(val, 'f', 0, 64)
	var res []rune
	l := len(s)
	for i, r := range s {
		res = append(res, r)
		if (l-i-1)%3 == 0 && i != l-1 {
			res = append(res, ' ')
		}
	}
	return string(res) + " UZS"
}

func main() {
	// Custom port via environment variable or default
	portStr := os.Getenv("MAGNIT_AGENT_PORT")
	if portStr == "" {
		portStr = "7777"
	}

	http.HandleFunc("/status", corsMiddleware(handleStatus))
	http.HandleFunc("/settings", corsMiddleware(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			handleGetSettings(w, r)
		} else if r.Method == http.MethodPost {
			handlePostSettings(w, r)
		} else {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	}))
	http.HandleFunc("/printer/ping", corsMiddleware(handlePing))
	http.HandleFunc("/print/test", corsMiddleware(handlePrintTest))
	http.HandleFunc("/print/receipt", corsMiddleware(handlePrintReceipt))

	log.Printf("Starting Magnit POS Printer Agent on 127.0.0.1:%s", portStr)
	log.Printf("Persisting configurations inside: %s", configPath)
	if err := http.ListenAndServe("127.0.0.1:"+portStr, nil); err != nil {
		log.Fatalf("Server error: %v", err)
	}
}
