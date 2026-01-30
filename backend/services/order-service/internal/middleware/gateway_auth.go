package middleware

import (
	"errors"
	"net/http"
	"os"

	"github.com/Flow-Indo/LAKOO/backend/shared/go/utils"
)

// GatewayAuth enforces that requests came through the API Gateway.
// If GATEWAY_SECRET_KEY is not set, this middleware is a no-op (local/dev friendly).
func GatewayAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		expected := os.Getenv("GATEWAY_SECRET_KEY")
		if expected == "" {
			next.ServeHTTP(w, r)
			return
		}

		got := r.Header.Get("x-gateway-key")
		if got == "" || got != expected {
			utils.WriteError(w, http.StatusUnauthorized, errors.New("Unauthorized"))
			return
		}

		next.ServeHTTP(w, r)
	})
}
