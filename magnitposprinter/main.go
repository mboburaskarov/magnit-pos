package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"runtime"
	"sync"
	"time"

	"magnitposprinter/internal/config"
	"magnitposprinter/internal/escpos"
	"magnitposprinter/internal/printer"
)

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

func handleHealth(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	response := map[string]interface{}{
		"ok":      true,
		"version": "1.1.0",
		"os":      runtime.GOOS,
		"service": "magnit-pos-printer-agent",
	}
	json.NewEncoder(w).Encode(response)
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
		"version":           "1.1.0",
		"printerConfigured": config.AppConfig.Mode != "",
		"printer": map[string]interface{}{
			"ip":    config.AppConfig.ReceiptPrinterIp,
			"port":  config.AppConfig.ReceiptPrinterPort,
			"model": config.AppConfig.PrinterModel,
			"mode":  config.AppConfig.Mode,
		},
	}
	json.NewEncoder(w).Encode(response)
}

func handleGetPrinters(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	printers, err := printer.GetLocalPrinters()
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]interface{}{"ok": false, "message": err.Error()})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"printers": printers})
}

func handleGetSettings(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(config.AppConfig)
}

func handlePostSettings(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var newConfig config.Config
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
	if newConfig.Mode == "" {
		newConfig.Mode = "network"
	}

	if err := config.SaveConfig(newConfig); err != nil {
		http.Error(w, fmt.Sprintf("Failed to save config: %v", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"ok": true, "settings": config.AppConfig})
}

func getPrinterWriter() (printer.PrinterWriter, error) {
	if config.AppConfig.Mode == "local" {
		if config.AppConfig.PrinterName == "" {
			return nil, fmt.Errorf("local printer name is empty")
		}
		return printer.NewLocalPrinter(config.AppConfig.PrinterName)
	} else {
		if config.AppConfig.ReceiptPrinterIp == "" {
			return nil, fmt.Errorf("network printer IP is empty")
		}
		return printer.NewNetworkPrinter(config.AppConfig.ReceiptPrinterIp, config.AppConfig.ReceiptPrinterPort)
	}
}

func handlePrintTest(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	pw, err := getPrinterWriter()
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{"ok": false, "message": err.Error()})
		return
	}
	defer pw.Close()

	testBytes := escpos.BuildTestReceipt(config.AppConfig.ReceiptPrinterIp, config.AppConfig.ReceiptPrinterPort, config.AppConfig.PrinterModel)

	err = pw.Write(testBytes)
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

	pw, err := getPrinterWriter()
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{"ok": false, "message": err.Error()})
		return
	}
	defer pw.Close()

	var req escpos.ReceiptRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{"ok": false, "message": fmt.Sprintf("Invalid request payload: %v", err)})
		return
	}

	receiptBytes := escpos.BuildReceiptEscpos(req)
	err = pw.Write(receiptBytes)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadGateway)
		json.NewEncoder(w).Encode(map[string]interface{}{"ok": false, "message": err.Error()})
		return
	}

	if config.AppConfig.CashDrawer.Enabled && (req.PaymentType == "cash" || req.PaymentType == "naqd") && config.AppConfig.CashDrawer.OpenOnCashPayment {
		time.Sleep(200 * time.Millisecond) // Slight delay before kicking drawer
		drawerBytes := escpos.GetDrawerKickCommand(config.AppConfig.CashDrawer.Command)
		pw.Write(drawerBytes)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"ok": true, "message": "Receipt printed successfully"})
}

func handlePrintRawTemplate(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	pw, err := getPrinterWriter()
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{"ok": false, "message": err.Error()})
		return
	}
	defer pw.Close()

	var req escpos.RawTemplateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{"ok": false, "message": fmt.Sprintf("Invalid request payload: %v", err)})
		return
	}

	receiptBytes := escpos.ProcessRawTemplate(req)
	err = pw.Write(receiptBytes)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadGateway)
		json.NewEncoder(w).Encode(map[string]interface{}{"ok": false, "message": err.Error()})
		return
	}

	if config.AppConfig.CashDrawer.Enabled && (req.PaymentType == "cash" || req.PaymentType == "naqd") && config.AppConfig.CashDrawer.OpenOnCashPayment {
		time.Sleep(200 * time.Millisecond)
		drawerBytes := escpos.GetDrawerKickCommand(config.AppConfig.CashDrawer.Command)
		pw.Write(drawerBytes)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"ok": true, "message": "Receipt raw template printed successfully"})
}

func handleCashDrawerOpen(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	pw, err := getPrinterWriter()
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{"ok": false, "message": err.Error()})
		return
	}
	defer pw.Close()

	drawerBytes := escpos.GetDrawerKickCommand(config.AppConfig.CashDrawer.Command)
	err = pw.Write(drawerBytes)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadGateway)
		json.NewEncoder(w).Encode(map[string]interface{}{"ok": false, "message": err.Error()})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"ok": true, "message": "Cash drawer open command sent"})
}

func handlePing(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	pw, err := getPrinterWriter()
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]interface{}{"ok": false, "message": err.Error()})
		return
	}
	defer pw.Close()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"ok": true, "message": "Ping success"})
}

func main() {
	if err := config.InitConfig(); err != nil {
		log.Printf("Warning: failed to init config: %v", err)
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/health", corsMiddleware(handleHealth))
	mux.HandleFunc("/status", corsMiddleware(handleStatus))
	mux.HandleFunc("/printers", corsMiddleware(handleGetPrinters))
	mux.HandleFunc("/settings", corsMiddleware(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			handleGetSettings(w, r)
		} else if r.Method == http.MethodPost {
			handlePostSettings(w, r)
		} else {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	}))
	mux.HandleFunc("/printer/ping", corsMiddleware(handlePing))
	mux.HandleFunc("/printers/test", corsMiddleware(handlePrintTest)) // new alias
	mux.HandleFunc("/print/test", corsMiddleware(handlePrintTest))
	mux.HandleFunc("/print/receipt", corsMiddleware(handlePrintReceipt))
	mux.HandleFunc("/print/raw-template", corsMiddleware(handlePrintRawTemplate))
	mux.HandleFunc("/cash-drawer/open", corsMiddleware(handleCashDrawerOpen))

	var wg sync.WaitGroup
	ports := []string{"7788", "7777"}

	for _, p := range ports {
		wg.Add(1)
		go func(port string) {
			defer wg.Done()
			log.Printf("Starting Magnit POS Printer Agent on 127.0.0.1:%s", port)
			if err := http.ListenAndServe("127.0.0.1:"+port, mux); err != nil {
				log.Printf("Server on port %s error: %v", port, err)
			}
		}(p)
	}

	log.Printf("Persisting configurations inside: %s", config.GetConfigPath())
	wg.Wait()
}
