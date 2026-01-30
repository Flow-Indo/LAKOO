package api

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

type ServerConfig struct {
	Addr        string
	DB          *gorm.DB
	ServiceName string
	APIPrefix   string
}

type Server struct {
	config ServerConfig
	router *mux.Router
}

func NewServer(config ServerConfig) *Server {
	router := mux.NewRouter()
	return &Server{
		config: config,
		router: router,
	}
}

func (s *Server) AddHealthCheck() {
	s.router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, `{"status":"ok","service":"%s"}`, s.config.ServiceName)
	}).Methods("GET")
}

func (s *Server) RegisterRoutes(registerFunc func(*mux.Router, *mux.Router)) {
	prefix := strings.Trim(s.config.APIPrefix, "/")
	external_subrouter := s.router.PathPrefix(fmt.Sprintf("/api/%s", prefix)).Subrouter()
	internal_subrouter := s.router.PathPrefix(fmt.Sprintf("/internal/%s", prefix)).Subrouter()

	registerFunc(external_subrouter, internal_subrouter)
}

func (s *Server) Start() error {
	fmt.Printf("Starting %s at port: %v\n", s.config.ServiceName, s.config.Addr)
	return http.ListenAndServe(s.config.Addr, s.router)
}
