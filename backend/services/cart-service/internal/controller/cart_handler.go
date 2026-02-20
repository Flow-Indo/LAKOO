package controller

import (
	"net/http"

	"github.com/Flow-Indo/LAKOO/backend/services/cart-service/domain/services"
	"github.com/Flow-Indo/LAKOO/backend/services/cart-service/domain/types"
	"github.com/Flow-Indo/LAKOO/backend/shared/go/middleware"
	"github.com/Flow-Indo/LAKOO/backend/shared/go/utils"
	"github.com/gorilla/mux"
)

type CartHandler struct {
	service services.CartServiceInterface
}

func NewCartHandler(service services.CartServiceInterface) *CartHandler {
	return &CartHandler{
		service: service,
	}
}

func (h *CartHandler) RegisterRoutes(cartExternalRouter *mux.Router, cartInternalRouter *mux.Router) {
	// cartRouter.HandleFunc("/", h.GetCart).Methods("GET")
	//for external
	cartExternalRouter.Use(middleware.UserIDMiddleware)
	cartExternalRouter.HandleFunc("/addToCart", h.AddToCart).Methods("POST")
	cartExternalRouter.HandleFunc("/", h.GetActiveCart).Methods("GET")

	//for internal
	cartInternalRouter.Use(middleware.ServiceAuthMiddleware)

}

func (h *CartHandler) AddToCart(w http.ResponseWriter, r *http.Request) {
	//take user id
	userId, err := middleware.GetUserIdFromContext(r.Context())
	if err != nil {
		utils.WriteJSONResponse(w, http.StatusUnauthorized, err)
	}

	var cartItemRequest types.CartItemRequest
	if err := utils.ParseJSONBody(r.Body, &cartItemRequest); err != nil {
		utils.WriteJSONResponse(w, http.StatusBadRequest, err)
	}

	//validate if align with struct

	if err := utils.ValidatePayload(cartItemRequest); err != nil {
		utils.WriteJSONResponse(w, http.StatusBadRequest, err)
	}

	if err := h.service.AddToCart(r.Context(), userId, cartItemRequest); err != nil {
		utils.WriteJSONResponse(w, http.StatusInternalServerError, err)
	}

	utils.WriteJSONResponse(w, http.StatusOK, map[string]any{
		"success": true,
	})

}

func (h *CartHandler) GetActiveCart(w http.ResponseWriter, r *http.Request) {
	userId, err := middleware.GetUserIdFromContext(r.Context())
	if err != nil {
		utils.WriteJSONResponse(w, http.StatusUnauthorized, err)
	}

	cart, err := h.service.GetActiveCart(userId)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
	}

	utils.WriteJSONResponse(w, http.StatusOK, cart)
}
