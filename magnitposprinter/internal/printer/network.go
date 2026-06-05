package printer

import (
	"fmt"
	"net"
	"time"
)

type NetworkPrinter struct {
	conn net.Conn
}

func NewNetworkPrinter(host string, port int) (*NetworkPrinter, error) {
	address := fmt.Sprintf("%s:%d", host, port)
	conn, err := net.DialTimeout("tcp", address, 3*time.Second)
	if err != nil {
		return nil, fmt.Errorf("TCP Connection to printer failed: %v", err)
	}
	return &NetworkPrinter{conn: conn}, nil
}

func (np *NetworkPrinter) Write(data []byte) error {
	if np.conn == nil {
		return fmt.Errorf("printer connection is closed")
	}
	_, err := np.conn.Write(data)
	if err != nil {
		return fmt.Errorf("failed writing raw ESC/POS bytes to network printer: %v", err)
	}
	return nil
}

func (np *NetworkPrinter) Close() error {
	if np.conn != nil {
		return np.conn.Close()
	}
	return nil
}
