package sockets

import (
	"encoding/json"
	"testing"
)

func TestConfig(t *testing.T) {
	var c config
	cj := []byte(`{"workers": 1, "port": ":8000", "bindAddress": "0.0.0.0", "ssl": null}`)
	err := json.Unmarshal(cj, &c)
	if err != nil {
		t.Errorf("Sockets: failed to parse config JSON with SSL being null: %v", err)
	}
	if c.SSL.Port != "" || c.SSL.Options.Cert != "" || c.SSL.Options.Key != "" {
		t.Errorf("Sockets: config failed to omit null SSL config")
	}

	c.SSL = sslconf{
		Port: ":443",
		Options: sslcert{
			Cert: "",
			Key:  "",
		},
	}

	cj, _ = json.Marshal(c)
	if err != nil {
		t.Errorf("Sockets: failed to stringify config JSON: %v", err)
	}

	err = json.Unmarshal(cj, &c)
	if err != nil {
		t.Errorf("Sockets: failed to parse config JSON containing SSL config")
	}
}
