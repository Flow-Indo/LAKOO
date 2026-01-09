package controller

import (
	"net/http"

	"github.com/Flow-Indo/LAKOO/backend/services/order-service/internal/service"
	"github.com/Flow-Indo/LAKOO/backend/services/order-service/types"
	"github.com/Flow-Indo/LAKOO/backend/services/order-service/utils"
	"github.com/gorilla/mux"
)

type OrderHandler struct {
	orderService *service.OrderService
}

func NewHandler(orderService *service.OrderService) *OrderHandler {
	return &OrderHandler{
		orderService: orderService,
	}
}

func (h *OrderHandler) RegisterRoutes(orderRouter *mux.Router) {

	orderRouter.HandleFunc("", h.getOrders).Methods("GET")
	orderRouter.HandleFunc("", h.createOrder).Methods("POST")
	// orderRouter.HandleFunc("/bulk", h.orderService.createBulkOrders).Methods("POST")
	// orderRouter.HandleFunc("/{orderId}/cancel", h.orderService.cancelOrder).Methods("POST")
	// orderRouter.HandleFunc("/stats", h.orderService.getOrderStats).Methods("GET")
	// orderRouter.HandleFunc("/user/{userId}", h.orderService.getUserOrders).Methods("GET")
	// orderRouter.HandleFunc("/factory/{factoryId}", h.orderService.getFactoryOrders).Methods("GET")
	// orderRouter.HandleFunc("number/{orderNumber}", h.orderService.getOrderByNumber).Methods("GET")
	// orderRouter.HandleFunc("/{orderId}", h.orderService.getOrderById).Methods("GET")
	// orderRouter.HandleFunc("/{orderId}/status", h.orderService.updateOrderStatus).Methods("PUT")
	// orderRouter.HandleFunc("/{orderId}/shipping-cost", h.orderService.updateShippingCost).Methods("PUT")
}

func (h *OrderHandler) getOrders(w http.ResponseWriter, r *http.Request) {
	var orderFilterPayload types.OrderFilterPayload
	if err := utils.DecodeQueryParamsWithValidation(&orderFilterPayload, r); err != nil {
		utils.WriteError(w, http.StatusBadRequest, err)
		return
	}

	orders, err := h.orderService.GetOrders(orderFilterPayload)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	if err := utils.WriteJSONResponse(w, http.StatusOK, orders); err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}
}

func (h *OrderHandler) createOrder(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	var createOrderPayload types.CreateOrderPayload
	if err := utils.ParseJSONBody(r.Body, &createOrderPayload); err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
	}

	if err := h.orderService.CreateOrder(createOrderPayload, ctx); err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
	}

}
