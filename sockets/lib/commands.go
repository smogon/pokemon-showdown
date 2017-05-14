/**
 * Commands
 * https://pokemonshowdown.com/
 *
 * Commands are an abstraction over IPC messages sent to and received from the
 * parent process. Each message follows a specific syntax: a one character
 * token, followed by any number of parametres separated by newlines. Commands
 * give the multiplexer and IPC connection a simple way to determine which
 * struct it's meant to be handled by, before enqueueing it to be distributed
 * to workers to finally process their payload concurrently.
 */

package sockets

import "strings"

// IPC message types
const (
	SOCKET_CONNECT       byte = '*'
	SOCKET_DISCONNECT    byte = '!'
	SOCKET_RECEIVE       byte = '<'
	SOCKET_SEND          byte = '>'
	CHANNEL_ADD          byte = '+'
	CHANNEL_REMOVE       byte = '-'
	CHANNEL_BROADCAST    byte = '#'
	SUBCHANNEL_MOVE      byte = '.'
	SUBCHANNEL_BROADCAST byte = ':'
)

var PARAM_COUNTS = map[byte]int{
	SOCKET_CONNECT:       4,
	SOCKET_DISCONNECT:    1,
	SOCKET_RECEIVE:       2,
	SOCKET_SEND:          2,
	CHANNEL_ADD:          2,
	CHANNEL_REMOVE:       2,
	CHANNEL_BROADCAST:    2,
	SUBCHANNEL_MOVE:      3,
	SUBCHANNEL_BROADCAST: 2,
}

type Command struct {
	token  byte      // Token designating the type of command.
	params []string  // The command parametre list, parsed.
	target CommandIO // The target to process this command.
}

// The multiplexer and the IPC connection both implement this interface. Its
// purpose is solely to allow the two structs to be used in Command.
type CommandIO interface {
	Process(*Command) error // Invokes one of its methods using the command's token and parametres.
}

func NewCommand(msg string, target CommandIO) *Command {
	token := msg[0]
	count := PARAM_COUNTS[token]
	params := strings.SplitN(msg[1:], "\n", count)
	return &Command{
		token:  token,
		params: params,
		target: target,
	}
}

func BuildCommand(target CommandIO, token byte, params ...string) *Command {
	return &Command{
		token:  token,
		params: params,
		target: target,
	}
}

func (c *Command) Token() byte {
	return c.token
}

func (c *Command) Params() []string {
	return c.params
}

func (c *Command) Message() string {
	return string(c.token) + strings.Join(c.params, "\n")
}

func (c *Command) Process() error {
	return c.target.Process(c)
}
