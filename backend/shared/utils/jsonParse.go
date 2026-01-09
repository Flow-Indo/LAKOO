package utils

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"
)

func ParseJSONBody(body io.Reader, payload any) error {
	if body == nil {
		return errors.New("body is nil")
	}

	return json.NewDecoder(body).Decode(payload)
}

func WriteJSONResponse(w http.ResponseWriter, status int, v any) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	return json.NewEncoder(w).Encode(v)
}

func WriteError(w http.ResponseWriter, status int, err error) {
	WriteJSONResponse(w, status, map[string]string{"error": err.Error()})
}
