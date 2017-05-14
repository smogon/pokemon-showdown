package sockets

import "testing"

type testTarget struct {
	CommandIO
}

func TestCommands(t *testing.T) {
	tokens := []byte{
		SOCKET_CONNECT,
		SOCKET_DISCONNECT,
		SOCKET_RECEIVE,
		SOCKET_SEND,
		CHANNEL_ADD,
		CHANNEL_REMOVE,
		CHANNEL_BROADCAST,
		SUBCHANNEL_MOVE,
		SUBCHANNEL_BROADCAST,
	}

	cmds := make([]*Command, len(tokens))
	for i, token := range tokens {
		cmds[i] = NewCommand(string(token)+"1\n2\n3\n4", testTarget{})
	}
}
