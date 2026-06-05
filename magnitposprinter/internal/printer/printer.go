package printer

type PrinterInfo struct {
	ID           string `json:"id"`
	Name         string `json:"name"`
	Type         string `json:"type"`
	Driver       string `json:"driver,omitempty"`
	Port         string `json:"port,omitempty"`
	IsDefault    bool   `json:"isDefault"`
	Recommended  bool   `json:"recommended"`
	SupportedRaw bool   `json:"supportedRaw"`
}

type PrinterWriter interface {
	Write(data []byte) error
	Close() error
}
