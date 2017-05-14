package sockets

import (
	"net"
	"net/http"
	"strconv"
	"testing"

	"github.com/igm/sockjs-go/sockjs"
)

type testSocket struct {
	sockjs.Session
}

func (ts testSocket) Send(msg string) error {
	return nil
}

func (ts testSocket) Close(code uint32, signal string) error {
	return nil
}

func (ts testSocket) Request() *http.Request {
	return &http.Request{}
}

func TestMasterListen(t *testing.T) {
	t.Parallel()
	ln, _ := net.Listen("tcp", "localhost:3000")
	defer ln.Close()

	conn, _ := NewConnection("PS_IPC_PORT")
	defer conn.Close()

	mux := NewMultiplexer()
	mux.Listen(conn)
	conn.Listen(mux)

	m := NewMaster(4)
	m.Spawn()
	go m.Listen()

	for i := 0; i < m.count*250; i++ {
		id := strconv.Itoa(i)
		t.Run("Worker/Multiplexer command #"+id, func(t *testing.T) {
			go func(id string, mux *Multiplexer, conn *Connection) {
				mux.smux.Lock()
				sid := strconv.FormatUint(mux.nsid, 10)
				mux.sockets[sid] = testSocket{}
				mux.nsid++
				mux.smux.Unlock()

				cmd := BuildCommand(mux, SOCKET_DISCONNECT, sid)
				cmd.Process()
				if len(CmdQueue) != 0 {
					t.Error("Sockets: master failed to pass command struct from worker to multiplexer")
				}

				mux.socketRemove(sid, true)
			}(id, mux, conn)
		})
		t.Run("Worker/Connection command #"+id, func(t *testing.T) {
			go func(id string, mux *Multiplexer, conn *Connection) {
				mux.smux.Lock()
				sid := strconv.FormatUint(mux.nsid, 10)
				mux.sockets[sid] = testSocket{}
				mux.nsid++
				mux.smux.Unlock()

				cmd := BuildCommand(conn, SOCKET_CONNECT, sid, "0.0.0.0", "", "websocket")
				cmd.Process()
				if len(CmdQueue) != 0 {
					t.Error("Sockets: master failed to pass command struct from worker to connection")
				}

				mux.socketRemove(sid, true)
			}(id, mux, conn)
		})
	}

	for len(m.wpool) > 0 {
		<-m.wpool
	}
}
