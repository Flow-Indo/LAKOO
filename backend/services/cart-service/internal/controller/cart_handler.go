package controller

import (
	"errors"
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
	// Header-auth user-facing routes
	userFacing := cartExternalRouter.PathPrefix("").Subrouter()
	userFacing.Use(middleware.UserIDMiddleware)
	userFacing.HandleFunc("/addToCart", h.AddToCart).Methods("POST")
	userFacing.HandleFunc("/", h.GetActiveCart).Methods("GET")

	// Path-based routes for order-service compatibility
	cartExternalRouter.HandleFunc("/{userId}", h.GetCartByUserID).Methods("GET")
	cartExternalRouter.HandleFunc("/{userId}", h.ClearCartByUserID).Methods("DELETE")

	//for internal
	cartInternalRouter.Use(middleware.ServiceAuthMiddleware)

}

func (h *CartHandler) AddToCart(w http.ResponseWriter, r *http.Request) {
	//take user id
	userId, err := middleware.GetUserIdFromContext(r.Context())
	if err != nil {
		utils.WriteJSONResponse(w, http.StatusUnauthorized, err)
		return
	}

	var cartItemRequest types.CartItemRequest
	if err := utils.ParseJSONBody(r.Body, &cartItemRequest); err != nil {
		utils.WriteJSONResponse(w, http.StatusBadRequest, err)
		return
	}

	//validate if align with struct

	if err := utils.ValidatePayload(cartItemRequest); err != nil {
		utils.WriteJSONResponse(w, http.StatusBadRequest, err)
		return
	}

	if err := h.service.AddToCart(r.Context(), userId, cartItemRequest); err != nil {
		utils.WriteJSONResponse(w, http.StatusInternalServerError, err)
		return
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

func (h *CartHandler) GetCartByUserID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID := vars["userId"]
	if userID == "" {
		utils.WriteError(w, http.StatusBadRequest, errors.New("missing userId path parameter"))
		return
	}

	cart, err := h.service.GetActiveCart(userID)
	if err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	utils.WriteJSONResponse(w, http.StatusOK, cart)
}

func (h *CartHandler) ClearCartByUserID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID := vars["userId"]
	if userID == "" {
		utils.WriteError(w, http.StatusBadRequest, errors.New("missing userId path parameter"))
		return
	}

	if err := h.service.ClearCart(userID); err != nil {
		utils.WriteError(w, http.StatusInternalServerError, err)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
