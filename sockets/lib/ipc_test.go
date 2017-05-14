package sockets

import (
	"net"
	"os"
	"testing"
)

func TestConnection(t *testing.T) {
	port := ":3000"
	ln, err := net.Listen("tcp", "localhost"+port)
	defer ln.Close()
	if err != nil {
		t.Errorf("Sockets: failed to launch TCP server on port %v: %v", port, err)
	}

	envVar := "PS_IPC_PORT"
	err = os.Setenv(envVar, port)
	if err != nil {
		t.Errorf("Sockets: failed to set %v environment variable: %v", envVar, port)
	}

	conn, err := NewConnection(envVar)
	defer conn.Close()
	if err != nil {
		t.Errorf("%v", err)
	}

	mux := NewMultiplexer()
	mux.Listen(conn)
	conn.Listen(mux)

	cmd := BuildCommand(mux, SOCKET_SEND, "0", "|ayy lmao")
	err = conn.Process(cmd)
	if err != nil {
		t.Errorf("%v", err)
	}
}
