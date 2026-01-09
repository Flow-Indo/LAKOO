package api

import (
	"fmt"
	"net/http"

	"github.com/Flow-Indo/LAKOO/backend/services/order-service/internal/controller"
	"github.com/Flow-Indo/LAKOO/backend/services/order-service/internal/repository"
	"github.com/Flow-Indo/LAKOO/backend/services/order-service/internal/service"
	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

type APIServer struct {
	addr string
	db   *gorm.DB
}

func NewAPIServer(addr string, db *gorm.DB) *APIServer {
	return &APIServer{
		addr: addr,
		db:   db,
	}
}

func (s *APIServer) Start() error {
	router := mux.NewRouter()

	subrouter := router.PathPrefix("/api/orders").Subrouter()

	orderRepository := repository.NewOrderRepository(s.db)
	orderService := service.NewService(orderRepository)
	orderHandler := controller.NewHandler(orderService)

	orderHandler.RegisterRoutes(subrouter)

	// subrouter.Use(func(next http.Handler) http.Handler {
	// 	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	// 		fmt.Printf("Received request: %s %s\n", r.Method, r.URL.Path)
	// 		next.ServeHTTP(w, r)
	// 	})
	// })

	fmt.Printf("Listening at port: %v\n", s.addr)
	return http.ListenAndServe(":"+s.addr, router)
}
