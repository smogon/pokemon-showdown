/**
 * Config
 * https://pokemonshowdown.com/
 *
 * Config is a struct representing the config settings the parent process
 * passed to us by stringifying pertinent settings as JSON and assigning it to
 * the $PS_CONFIG environment variable.
 */

package sockets

import (
	"encoding/json"
	"os"
)

type sslcert struct {
	Cert string `json:"cert"` // Path to the SSL certificate.
	Key  string `json:"key"`  // Path to the SSL key.
}

type sslconf struct {
	Port    string  `json:"port"`              // HTTPS server port.
	Options sslcert `json:"options,omitempty"` // SSL config settings.
}

type config struct {
	Workers     int     `json:"workers"`       // Number of workers for the master to spawn.
	Port        string  `json:"port"`          // HTTP server port.
	BindAddress string  `json:"bindAddress"`   // HTTP/HTTPS server(s) hostname.
	SSL         sslconf `json:"ssl,omitempty"` // HTTPS config settings.
}

func NewConfig(envVar string) (c config, err error) {
	configEnv := os.Getenv(envVar)
	err = json.Unmarshal([]byte(configEnv), &c)
	return
}
