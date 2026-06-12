package escpos

import (
	"bytes"
	"encoding/hex"
	"fmt"
	"strconv"
	"strings"
	"time"

	"golang.org/x/text/encoding/charmap"
)

type ReceiptItem struct {
	Name  string  `json:"name"`
	Qty   float64 `json:"qty"`
	Price float64 `json:"price"`
	Total float64 `json:"total"`
}

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

func NormalizeUzbek(s string) string {
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

func EncodeToCP866(s string) []byte {
	s = NormalizeUzbek(s)
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

func WriteText(buf *bytes.Buffer, text string) {
	buf.Write(EncodeToCP866(text))
}

func CenterText(buf *bytes.Buffer, text string, width int) {
	text = NormalizeUzbek(text)
	runes := []rune(text)
	if len(runes) >= width {
		WriteText(buf, string(runes[:width])+"\n")
		return
	}
	leftPadding := (width - len(runes)) / 2
	rightPadding := width - len(runes) - leftPadding
	paddingStr := strings.Repeat(" ", leftPadding) + string(runes) + strings.Repeat(" ", rightPadding) + "\n"
	WriteText(buf, paddingStr)
}

func LeftRight(buf *bytes.Buffer, left string, right string, width int) {
	left = NormalizeUzbek(left)
	right = NormalizeUzbek(right)
	leftRunes := []rune(left)
	rightRunes := []rune(right)

	totalLen := len(leftRunes) + len(rightRunes)
	if totalLen <= width {
		spaces := width - totalLen
		lineStr := string(leftRunes) + strings.Repeat(" ", spaces) + string(rightRunes) + "\n"
		WriteText(buf, lineStr)
	} else {
		WriteText(buf, string(leftRunes)+"\n")
		spaces := width - len(rightRunes)
		if spaces < 0 {
			spaces = 0
		}
		lineStr := strings.Repeat(" ", spaces) + string(rightRunes) + "\n"
		WriteText(buf, lineStr)
	}
}

func Line(buf *bytes.Buffer, width int) {
	WriteText(buf, strings.Repeat("-", width)+"\n")
}

func CutPaper(buf *bytes.Buffer) {
	buf.Write([]byte("\n\n\n\n"))
	buf.Write([]byte{0x1d, 0x56, 0x00}) // Cut command (GS V 0) auto cut
}

func WrapText(text string, width int) []string {
	text = NormalizeUzbek(text)
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

func SetBold(buf *bytes.Buffer, bold bool) {
	if bold {
		buf.Write([]byte{0x1b, 0x45, 0x01})
	} else {
		buf.Write([]byte{0x1b, 0x45, 0x00})
	}
}

func FormatMoneyWithoutSuffix(val float64) string {
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

func FormatMoney(val float64) string {
	return FormatMoneyWithoutSuffix(val) + " UZS"
}

func BuildTestReceipt(ip string, port int, model string) []byte {
	var buf bytes.Buffer
	buf.Write([]byte{0x1b, 0x40})       // Initialize
	buf.Write([]byte{0x1b, 0x74, 0x07}) // Select CP866

	SetBold(&buf, true)
	CenterText(&buf, "MAGNIT POS AGENT TEST", 48)
	SetBold(&buf, false)
	Line(&buf, 48)

	CenterText(&buf, "Uzbek Cyrillic / O'zbekcha", 48)
	WriteText(&buf, "Узбекча (ў,қ,ғ,ҳ): узбекча киргизиш\n")
	WriteText(&buf, "O'zbekcha oʻgʻil bolalar (curly normal)\n")
	WriteText(&buf, "O'zbekcha o‘g‘il bolalar (curly normal 2)\n")

	Line(&buf, 48)
	CenterText(&buf, "Russian Cyrillic / Русский", 48)
	WriteText(&buf, "Русский текст: Проверка кириллицы CP866\n")
	WriteText(&buf, "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ\n")
	WriteText(&buf, "абвгдежзийклмнопрстуфхцчшщъыьэюя\n")

	Line(&buf, 48)
	LeftRight(&buf, "Printer IP:", ip, 48)
	LeftRight(&buf, "Port:", strconv.Itoa(port), 48)
	LeftRight(&buf, "Model:", model, 48)
	LeftRight(&buf, "Vaqt/Время:", time.Now().Format("02.01.2006 15:04:05"), 48)
	Line(&buf, 48)

	CenterText(&buf, "TEST PRINT COMPLETED / OK", 48)
	CutPaper(&buf)

	return buf.Bytes()
}

func BuildReceiptEscpos(req ReceiptRequest) []byte {
	var buf bytes.Buffer
	buf.Write([]byte{0x1b, 0x40})       // Initialize
	buf.Write([]byte{0x1b, 0x74, 0x07}) // Select CP866

	SetBold(&buf, true)
	CenterText(&buf, "MAGNIT SUPERMARKET", 48)
	SetBold(&buf, false)
	CenterText(&buf, "STIR: 309228654", 48)
	CenterText(&buf, "Do'kon: Magnit №1", 48)
	CenterText(&buf, "Kontakt: +998 71 123-45-67", 48)
	CenterText(&buf, "Ish tartibi: 08:00 - 22:00", 48)
	Line(&buf, 48)

	LeftRight(&buf, "Sotuv raqami:", "#"+req.SaleID, 48)
	LeftRight(&buf, "Sana:", time.Now().Format("02.01.2006 15:04:05"), 48)
	LeftRight(&buf, "Sotuvchi:", req.Cashier, 48)
	if req.Customer != "" {
		LeftRight(&buf, "Mijoz:", req.Customer, 48)
	}
	Line(&buf, 48)

	for _, item := range req.Items {
		wrappedNames := WrapText(item.Name, 48)
		for _, nameLine := range wrappedNames {
			WriteText(&buf, nameLine+"\n")
		}
		qtyStr := strconv.FormatFloat(item.Qty, 'f', -1, 64)
		leftPart := fmt.Sprintf("  %s x %s", qtyStr, FormatMoneyWithoutSuffix(item.Price))
		rightPart := "= " + FormatMoneyWithoutSuffix(item.Total) + " UZS"
		LeftRight(&buf, leftPart, rightPart, 48)
	}

	Line(&buf, 48)
	LeftRight(&buf, "Umumiy narx:", FormatMoney(req.Subtotal), 48)
	if req.Discount > 0 {
		LeftRight(&buf, "Shtrix-kodli chegirma:", FormatMoney(req.Discount), 48)
	}
	if req.VATAmount > 0 {
		LeftRight(&buf, "Umumiy QQS:", FormatMoney(req.VATAmount), 48)
	}
	SetBold(&buf, true)
	LeftRight(&buf, "Yakuniy narx (TO'LOV):", FormatMoney(req.TotalAmount), 48)
	SetBold(&buf, false)
	Line(&buf, 48)

	payTypeLabel := "Naqd to'lov:"
	if req.PaymentType == "card" || req.PaymentType == "cardless" {
		payTypeLabel = "Karta orqali to'lov:"
	} else if req.PaymentType != "cash" && req.PaymentType != "" {
		payTypeLabel = fmt.Sprintf("To'lov (%s):", req.PaymentType)
	}
	LeftRight(&buf, payTypeLabel, FormatMoney(req.PaidAmount), 48)
	LeftRight(&buf, "Qaytim:", FormatMoney(req.ChangeAmount), 48)
	Line(&buf, 48)

	if req.ChequeType != "" {
		chequeTypeStr := strings.ToUpper(req.ChequeType)
		if chequeTypeStr == "SALE" {
			chequeTypeStr = "SOTUV"
		} else if chequeTypeStr == "RETURN" {
			chequeTypeStr = "QAYTARISH"
		}
		LeftRight(&buf, "Chek turi:", chequeTypeStr, 48)
	}
	if req.FiscalSign != "" {
		LeftRight(&buf, "Fiskal belgi (FM):", req.FiscalSign, 48)
	}
	if req.FiscalNumber != "" {
		LeftRight(&buf, "Fiskal raqami:", req.FiscalNumber, 48)
	}
	if req.ChequeType != "" || req.FiscalSign != "" || req.FiscalNumber != "" {
		Line(&buf, 48)
	}

	SetBold(&buf, true)
	CenterText(&buf, "SOTILGAN TOVAR ALMASHTIRILMAYDI", 48)
	CenterText(&buf, "VA QAYTARIB OLINMAYDI", 48)
	SetBold(&buf, false)
	CenterText(&buf, "XARIDINGIZ UCHUN RAHMAT!!!", 48)
	CutPaper(&buf)

	return buf.Bytes()
}

func GetDrawerKickCommand(hexCmd string) []byte {
	if hexCmd == "" {
		return []byte{0x1B, 0x70, 0x00, 0x19, 0xFA}
	}
	bytes, err := hex.DecodeString(hexCmd)
	if err != nil {
		return []byte{0x1B, 0x70, 0x00, 0x19, 0xFA}
	}
	return bytes
}

type RawTemplateRequest struct {
	Lines       []string `json:"lines"`
	PaymentType string   `json:"paymentType"`
}

func GenerateQRCodeCmd(data string) []byte {
	var buf bytes.Buffer
	buf.Write([]byte{0x1b, 0x61, 0x01}) // center align
	buf.Write([]byte{0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x43, 0x05}) // module size 5
	buf.Write([]byte{0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x45, 0x30}) // L correction
	dataLen := len(data) + 3
	pL := byte(dataLen % 256)
	pH := byte(dataLen / 256)
	buf.Write([]byte{0x1d, 0x28, 0x6b, pL, pH, 0x31, 0x50, 0x30})
	buf.Write([]byte(data))
	buf.Write([]byte{0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x51, 0x30}) // print
	buf.Write([]byte{0x1b, 0x61, 0x00}) // left align
	return buf.Bytes()
}

func ProcessRawTemplate(req RawTemplateRequest) []byte {
	var buf bytes.Buffer
	buf.Write([]byte{0x1b, 0x40})       // Initialize
	buf.Write([]byte{0x1b, 0x74, 0x07}) // Select CP866

	for _, line := range req.Lines {
		if line == "[BOLD_START]" {
			SetBold(&buf, true)
		} else if line == "[BOLD_END]" {
			SetBold(&buf, false)
		} else if line == "[CUT]" {
			CutPaper(&buf)
		} else if strings.HasPrefix(line, "[QR:") && strings.HasSuffix(line, "]") {
			qrData := line[4 : len(line)-1]
			buf.Write(GenerateQRCodeCmd(qrData))
		} else {
			WriteText(&buf, line+"\n")
		}
	}

	return buf.Bytes()
}
