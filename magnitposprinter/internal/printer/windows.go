//go:build windows
// +build windows

package printer

import (
	"fmt"
	"strings"
	"syscall"
	"unsafe"
)

var (
	winspool = syscall.NewLazyDLL("winspool.drv")
	
	openPrinter        = winspool.NewProc("OpenPrinterW")
	closePrinter       = winspool.NewProc("ClosePrinter")
	startDocPrinter    = winspool.NewProc("StartDocPrinterW")
	endDocPrinter      = winspool.NewProc("EndDocPrinter")
	startPagePrinter   = winspool.NewProc("StartPagePrinter")
	endPagePrinter     = winspool.NewProc("EndPagePrinter")
	writePrinter       = winspool.NewProc("WritePrinter")
	enumPrinters       = winspool.NewProc("EnumPrintersW")
)

const (
	PRINTER_ENUM_LOCAL       = 2
	PRINTER_ENUM_CONNECTIONS = 4
)

type DOC_INFO_1 struct {
	pDocName    *uint16
	pOutputFile *uint16
	pDatatype   *uint16
}

type PRINTER_INFO_4 struct {
	pPrinterName *uint16
	pServerName  *uint16
	Attributes   uint32
}

type PRINTER_INFO_2 struct {
	pServerName         *uint16
	pPrinterName        *uint16
	pShareName          *uint16
	pPortName           *uint16
	pDriverName         *uint16
	pComment            *uint16
	pLocation           *uint16
	pDevMode            uintptr
	pSepFile            *uint16
	pPrintProcessor     *uint16
	pDatatype           *uint16
	pParameters         *uint16
	pSecurityDescriptor uintptr
	Attributes          uint32
	Priority            uint32
	DefaultPriority     uint32
	StartTime           uint32
	UntilTime           uint32
	Status              uint32
	cJobs               uint32
	AveragePPM          uint32
}

type WindowsPrinter struct {
	name   string
	handle syscall.Handle
}

func NewLocalPrinter(name string) (*WindowsPrinter, error) {
	var handle syscall.Handle
	namePtr, err := syscall.UTF16PtrFromString(name)
	if err != nil {
		return nil, err
	}

	ret, _, err := openPrinter.Call(
		uintptr(unsafe.Pointer(namePtr)),
		uintptr(unsafe.Pointer(&handle)),
		0,
	)

	if ret == 0 {
		return nil, fmt.Errorf("failed to open printer: %v", err)
	}

	return &WindowsPrinter{name: name, handle: handle}, nil
}

func (wp *WindowsPrinter) Write(data []byte) error {
	docName, _ := syscall.UTF16PtrFromString("Magnit POS Receipt")
	dataType, _ := syscall.UTF16PtrFromString("RAW")

	docInfo := DOC_INFO_1{
		pDocName:  docName,
		pDatatype: dataType,
	}

	ret, _, err := startDocPrinter.Call(
		uintptr(wp.handle),
		1,
		uintptr(unsafe.Pointer(&docInfo)),
	)
	if ret == 0 {
		return fmt.Errorf("failed to start doc: %v", err)
	}
	defer endDocPrinter.Call(uintptr(wp.handle))

	ret, _, err = startPagePrinter.Call(uintptr(wp.handle))
	if ret == 0 {
		return fmt.Errorf("failed to start page: %v", err)
	}
	defer endPagePrinter.Call(uintptr(wp.handle))

	var bytesWritten uint32
	ret, _, err = writePrinter.Call(
		uintptr(wp.handle),
		uintptr(unsafe.Pointer(&data[0])),
		uintptr(len(data)),
		uintptr(unsafe.Pointer(&bytesWritten)),
	)
	if ret == 0 {
		return fmt.Errorf("failed to write printer: %v", err)
	}

	return nil
}

func (wp *WindowsPrinter) Close() error {
	if wp.handle != 0 {
		closePrinter.Call(uintptr(wp.handle))
		wp.handle = 0
	}
	return nil
}

func isRecommended(name string) bool {
	lowerName := strings.ToLower(name)
	keywords := []string{"xprinter", "rongta", "bixolon", "xp-", "rp-", "pos", "receipt", "thermal", "58", "80"}
	for _, kw := range keywords {
		if strings.Contains(lowerName, kw) {
			return true
		}
	}
	return false
}

func ptrToString(p *uint16) string {
	if p == nil {
		return ""
	}
	// find length
	n := 0
	for ptr := unsafe.Pointer(p); *(*uint16)(ptr) != 0; n++ {
		ptr = unsafe.Pointer(uintptr(ptr) + 2)
	}
	
	slice := unsafe.Slice(p, n)
	return string(syscall.UTF16ToString(slice))
}

func GetLocalPrinters() ([]PrinterInfo, error) {
	var bytesNeeded, returned uint32
	enumPrinters.Call(
		uintptr(PRINTER_ENUM_LOCAL|PRINTER_ENUM_CONNECTIONS),
		0,
		2,
		0,
		0,
		uintptr(unsafe.Pointer(&bytesNeeded)),
		uintptr(unsafe.Pointer(&returned)),
	)

	if bytesNeeded == 0 {
		return nil, nil
	}

	buf := make([]byte, bytesNeeded)
	ret, _, err := enumPrinters.Call(
		uintptr(PRINTER_ENUM_LOCAL|PRINTER_ENUM_CONNECTIONS),
		0,
		2,
		uintptr(unsafe.Pointer(&buf[0])),
		uintptr(bytesNeeded),
		uintptr(unsafe.Pointer(&bytesNeeded)),
		uintptr(unsafe.Pointer(&returned)),
	)

	if ret == 0 {
		return nil, fmt.Errorf("EnumPrinters failed: %v", err)
	}

	printers := make([]PrinterInfo, 0, returned)
	info2Arr := (*[2048]PRINTER_INFO_2)(unsafe.Pointer(&buf[0]))[:returned:returned]

	for i := uint32(0); i < returned; i++ {
		info := info2Arr[i]
		name := ptrToString(info.pPrinterName)
		driver := ptrToString(info.pDriverName)
		port := ptrToString(info.pPortName)
		
		isDef := (info.Attributes & 0x00000004) != 0 // PRINTER_ATTRIBUTE_DEFAULT

		printers = append(printers, PrinterInfo{
			ID:           strings.ReplaceAll(strings.ToLower(name), " ", "_"),
			Name:         name,
			Type:         "local",
			Driver:       driver,
			Port:         port,
			IsDefault:    isDef,
			Recommended:  isRecommended(name),
			SupportedRaw: true,
		})
	}
	return printers, nil
}
