/**
 * Multiplexer - Socket/Channel/Subchannel state machine
 * https://pokemonshowdown.com/
 *
 * This keeps track of the sockets that connect to the SockJS server. Sockets
 * are stored in the multiplexer to allow the parent process to manipulate them
 * as it pleases. Channels represent rooms in the parent process; subchannels
 * split battle rooms into three groups: side 1, side 2, and spectators.
 * Certain messages will display differently depending on which subchannel the
 * user's socket is in.
 */

package sockets

import (
	"fmt"
	"net"
	"path"
	"regexp"
	"strconv"
	"strings"
	"sync"
	"sync/atomic"
	"time"

	"github.com/igm/sockjs-go/sockjs"
)

// Subchannel IDs
const (
	DEFAULT_SUBCHANNEL_ID byte = '0'
	P1_SUBCHANNEL_ID      byte = '1'
	P2_SUBCHANNEL_ID      byte = '2'
)

// Map of socket IDs to subchannel IDs.
type Channel map[string]byte

type Multiplexer struct {
	nsid     uint64                    // Socket ID counter.
	sockets  map[string]sockjs.Session // Map of socket IDs to sockets.
	smux     sync.RWMutex              // nsid and sockets mutex.
	channels map[string]Channel        // Map of channel (i.e. room) IDs to channels.
	cmux     sync.RWMutex              // channels mutex.
	scre     *regexp.Regexp            // Regex for splitting subchannel broadcasts into their three messages.
	conn     *Connection               // Target for commands originating from here.
}

func NewMultiplexer() *Multiplexer {
	sockets := make(map[string]sockjs.Session)
	channels := make(map[string]Channel)
	scre := regexp.MustCompile(`\|split\n([^\n]*)\n([^\n]*)\n([^\n]*)\n[^\n]*`)
	return &Multiplexer{
		sockets:  sockets,
		channels: channels,
		scre:     scre,
	}
}

func (m *Multiplexer) Listen(conn *Connection) {
	m.conn = conn
}

func (m *Multiplexer) Process(cmd *Command) (err error) {
	// fmt.Printf("IPC => Sockets: %v\n", cmd.Message())
	params := cmd.Params()

	// Parse the command's params and call the appropriate method.
	switch token := cmd.Token(); token {
	case SOCKET_DISCONNECT:
		sid := params[0]
		err = m.socketRemove(sid, true)
	case SOCKET_SEND:
		sid := params[0]
		msg := params[1]
		err = m.socketSend(sid, msg)
	case SOCKET_RECEIVE:
		sid := params[0]
		msg := params[1]
		err = m.socketReceive(sid, msg)
	case CHANNEL_ADD:
		cid := params[0]
		sid := params[1]
		err = m.channelAdd(cid, sid)
	case CHANNEL_REMOVE:
		cid := params[0]
		sid := params[1]
		err = m.channelRemove(cid, sid)
	case CHANNEL_BROADCAST:
		cid := params[0]
		msg := params[1]
		err = m.channelBroadcast(cid, msg)
	case SUBCHANNEL_MOVE:
		cid := params[0]
		scid := params[1][0]
		sid := params[2]
		err = m.subchannelMove(cid, scid, sid)
	case SUBCHANNEL_BROADCAST:
		cid := params[0]
		msg := params[1]
		err = m.subchannelBroadcast(cid, msg)
	default:
		err = fmt.Errorf("Sockets: received unknown message of type %v: %v", cmd.Token(), cmd.Message())
	}

	if err != nil {
		// Message timing error.
		// fmt.Printf("%v\n", err)
	}

	return
}

func (m *Multiplexer) socketAdd(s sockjs.Session) (sid string) {
	nsid := atomic.LoadUint64(&m.nsid)
	sid = strconv.FormatUint(nsid, 10)
	atomic.AddUint64(&m.nsid, 1)

	m.smux.Lock()
	m.sockets[sid] = s
	m.smux.Unlock()

	if !m.conn.Listening() {
		s.Close(1000, "Normal closure")
		return
	}

	req := s.Request()
	ip, _, _ := net.SplitHostPort(req.RemoteAddr)
	ips := req.Header.Get("X-Forwarded-For")
	protocol := path.Base(req.URL.Path)

	go func() {
		cmd := BuildCommand(m.conn, SOCKET_CONNECT, sid, ip, ips, protocol)
		CmdQueue <- cmd
	}()

	time.Sleep(1 * time.Nanosecond)

	return
}

func (m *Multiplexer) socketRemove(sid string, forced bool) error {
	m.cmux.Lock()
	for cid, c := range m.channels {
		if _, ok := c[sid]; ok {
			delete(c, sid)
			if len(c) == 0 {
				delete((*m).channels, cid)
			}
		}
	}
	m.cmux.Unlock()

	m.smux.Lock()
	defer m.smux.Unlock()

	s, ok := m.sockets[sid]
	if ok {
		delete((*m).sockets, sid)
	} else {
		return fmt.Errorf("Sockets: attempted to remove non-existent socket of ID %v", sid)
	}

	if forced {
		s.Close(1000, "Normal closure")
		return nil
	}

	if m.conn.Listening() {
		go func() {
			cmd := BuildCommand(m.conn, SOCKET_DISCONNECT, sid)
			CmdQueue <- cmd
		}()

		time.Sleep(1 * time.Nanosecond)
	}

	return nil
}

func (m *Multiplexer) socketReceive(sid string, msg string) error {
	m.smux.RLock()
	defer m.smux.RUnlock()

	if _, ok := m.sockets[sid]; ok {
		// Drop empty messages (DDOS?).
		if len(msg) == 0 {
			return nil
		}

		// Drop >100KB messages.
		if len(msg) > 100*1024 {
			fmt.Printf("Dropping client message %vKB...\n%v\n", len(msg)/1024, msg[:160])
			return nil
		}

		// Drop legacy JSON messages.
		if strings.HasPrefix(msg, "{") {
			return nil
		}

		// Drop invalid messages (again, DDOS?).
		if strings.HasSuffix(msg, "|") || !strings.Contains(msg, "|") {
			return nil
		}

		if m.conn.Listening() {
			go func() {
				cmd := BuildCommand(m.conn, SOCKET_RECEIVE, sid, msg)
				CmdQueue <- cmd
			}()

			time.Sleep(1 * time.Nanosecond)
		}

		return nil
	}

	// This should never happen. If it does, it's likely a SockJS bug.
	return fmt.Errorf("Sockets: received message for a non-existent socket of ID %v: %v", sid, msg)
}

func (m *Multiplexer) socketSend(sid string, msg string) error {
	m.smux.RLock()
	defer m.smux.RUnlock()

	if s, ok := m.sockets[sid]; ok {
		s.Send(msg)
		return nil
	}

	return fmt.Errorf("Sockets: attempted to send to non-existent socket of ID %v: %v", sid, msg)
}

func (m *Multiplexer) channelAdd(cid string, sid string) error {
	m.cmux.Lock()
	defer m.cmux.Unlock()

	c, ok := m.channels[cid]
	if !ok {
		c = make(Channel)
		m.channels[cid] = c
	}

	c[sid] = DEFAULT_SUBCHANNEL_ID

	return nil
}

func (m *Multiplexer) channelRemove(cid string, sid string) error {
	m.cmux.Lock()
	defer m.cmux.Unlock()

	c, ok := m.channels[cid]
	if ok {
		if _, ok = c[sid]; !ok {
			return fmt.Errorf("Sockets: failed to remove non-existent socket of ID %v from channel %v", sid, cid)
		}
	} else {
		// This happens on user-initiated disconnect. Mitigate until this race
		// condition is fixed.
		return nil
	}

	delete(c, sid)
	if len(c) == 0 {
		delete((*m).channels, cid)
	}

	return nil
}

func (m *Multiplexer) channelBroadcast(cid string, msg string) error {
	m.cmux.RLock()
	defer m.cmux.RUnlock()

	c, ok := m.channels[cid]
	if !ok {
		// This happens occasionally when the sole user in a room leaves.
		// Mitigate until this race condition is fixed.
		return nil
	}

	m.smux.RLock()
	defer m.smux.RUnlock()

	for sid := range c {
		var s sockjs.Session
		if s, ok = m.sockets[sid]; ok {
			s.Send(msg)
		} else {
			return fmt.Errorf("Sockets: attempted to broadcast to non-existent socket of ID %v in channel %v: %v", sid, cid, msg)
		}
	}

	return nil
}

func (m *Multiplexer) subchannelMove(cid string, scid byte, sid string) error {
	m.cmux.Lock()
	defer m.cmux.Unlock()

	c, ok := m.channels[cid]
	if !ok {
		return fmt.Errorf("Sockets: attempted to move socket of ID %v in non-existent channel %v to subchannel %v", sid, cid, scid)
	}

	c[sid] = scid
	return nil
}

func (m *Multiplexer) subchannelBroadcast(cid string, msg string) error {
	m.cmux.RLock()
	defer m.cmux.RUnlock()

	c, ok := m.channels[cid]
	if !ok {
		return fmt.Errorf("Sockets: attempted to broadcast to subchannels in channel %v, which doesn't exist: %v", cid, msg)
	}

	m.smux.RLock()
	defer m.smux.RUnlock()

	msgs := make(map[byte]string)
	for sid, scid := range c {
		s, ok := m.sockets[sid]
		if !ok {
			return fmt.Errorf("Sockets: attempted to broadcast to subchannels in channel %v, but socket of ID %v doesn't exist: %v", cid, sid, msg)
		}

		if _, ok := msgs[scid]; !ok {
			switch scid {
			case DEFAULT_SUBCHANNEL_ID:
				msgs[scid] = m.scre.ReplaceAllString(msg, "$1")
			case P1_SUBCHANNEL_ID:
				msgs[scid] = m.scre.ReplaceAllString(msg, "$2")
			case P2_SUBCHANNEL_ID:
				msgs[scid] = m.scre.ReplaceAllString(msg, "$3")
			}
		}

		s.Send(msgs[scid])
	}

	return nil
}

// This is the HTTP handler for the SockJS server. This is where new sockets
// arrive for us to use.
func (m *Multiplexer) Handler(s sockjs.Session) {
	sid := m.socketAdd(s)
	for {
		msg, err := s.Recv()
		if err != nil {
			if err == sockjs.ErrSessionNotOpen {
				// User disconnected.
			} else {
				fmt.Printf("Sockets: SockJS error on message receive for socket of ID %v: %v\n", sid, err)
			}
			break
		}

		if err = m.socketReceive(sid, msg); err != nil {
			fmt.Printf("%v\n", err)
			break
		}
	}

	if err := m.socketRemove(sid, false); err != nil {
		fmt.Printf("%v\n", err)
	}
}
