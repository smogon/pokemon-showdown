/**
 * Master - Master/Worker pattern implementation
 * https://pokemonshowdown.com/
 *
 * This makes it possible to parse messages from sockets and the parent process
 * concurrently. A command queue stores commands created by the multiplexer and
 * IPC connection. The master contains a pool of command channels belonging to
 * workers. Once a command is available in the queue, the master takes a
 * worker's command channel from its pool and enqueues it. The worker takes the
 * command and processes it before enqueueing its command channel back into the
 * master's pool. The workers are distributed round-robin, much like Node's
 * cluster module (when not using Windows).
 */

package sockets

// A global command channel for the multiplexer and IPC connection to enqueue
// their new commands to be processed by the workers.
var CmdQueue = make(chan *Command)

type master struct {
	wpool chan chan *Command // Pool of worker command queues.
	count int                // Number of workers.
}

func NewMaster(count int) *master {
	wpool := make(chan chan *Command, count)
	return &master{
		wpool: wpool,
		count: count,
	}
}

// Create the initial set of workers and make them listen before the master.
func (m *master) Spawn() {
	for i := 0; i < m.count; i++ {
		w := newWorker(m.wpool)
		w.listen()
	}
}

// Listen for new commands to remove from the command queue and pass to the
// first available worker.
func (m *master) Listen() {
	for {
		cmd := <-CmdQueue
		cmdch := <-m.wpool
		cmdch <- cmd
	}
}

type worker struct {
	wpool chan chan *Command // The master's pool of worker command queues.
	cmdch chan *Command      // Queue for incoming commands from CmdQueue.
	quit  chan bool          // Channel used to kill the worker when needed.
}

func newWorker(wpool chan chan *Command) *worker {
	cmdch := make(chan *Command)
	quit := make(chan bool)
	return &worker{
		wpool: wpool,
		cmdch: cmdch,
		quit:  quit,
	}
}

func (w *worker) listen() {
	go func() {
		for {
			w.wpool <- w.cmdch
			select {
			case cmd := <-w.cmdch:
				// Invokes *Multiplexer.Process or *Connection.Process, where
				// the command is finally handled and used to update state.
				cmd.target.Process(cmd)
			case <-w.quit:
				return
			}
		}
	}()
}
