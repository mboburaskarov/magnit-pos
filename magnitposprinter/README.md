# Magnit POS Printer Agent

The Magnit POS Printer Agent is a lightweight Golang local server designed to enable direct network receipt printing from the Magnit POS progressive web app (PWA). It listens on `http://127.0.0.1:7777` and writes raw ESC/POS commands over TCP sockets on port `9100` to your receipt printer.

## Tech Specs
- Language: Golang (Go 1.18+)
- Local Port: `7777` (overridable via `MAGNIT_AGENT_PORT` env variable)
- Local configuration: Persisted locally at `C:\ProgramData\MagnitPOSPrinter\config.json` (Windows) or `~/Library/Application Support/MagnitPOSPrinter/config.json` (macOS).

---

## Build and Run Instructions

### 1. Prerequisites
Ensure you have [Golang](https://go.dev/) installed in your system path.

### 2. Build Commands

#### Windows
To compile the execution binary on Windows:
```bash
go mod init magnitposprinter
go mod tidy
go build -o magnitposprinter.exe
```

#### macOS / Linux
To compile the execution binary on macOS:
```bash
go mod init magnitposprinter
go mod tidy
go build -o magnitposprinter
```

### 3. Running the Agent
Run the compiled binary directly:
```bash
./magnitposprinter
```

---

## REST API Endpoints

- **GET `/status`**: Returns current agent info and printer configured state.
- **GET `/settings`**: Returns JSON of active settings.
- **POST `/settings`**: Update IP, Port, or Model configurations.
- **POST `/printer/ping`**: Runs a quick TCP check on target printer IP.
- **POST `/print/test`**: Feeds and cuts a trial ESC/POS receipt.
- **POST `/print/receipt`**: Accepts standard POS checkout JSON objects, formats table columns, and prints the ticket.
