#!/bin/bash
# =============================================================================
# Service-to-Service Communication Test Script
# Tests: order -> product, order -> payment
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Service URLs
ORDER_SERVICE="http://localhost:3006"
PRODUCT_SERVICE="http://localhost:3002"
PAYMENT_SERVICE="http://localhost:3007"
ADDRESS_SERVICE="http://localhost:3010"
LOGISTIC_SERVICE="http://localhost:3009"

# Shared secret for service-to-service auth
SERVICE_SECRET="dev-service-secret"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Service Communication Test${NC}"
echo -e "${BLUE}========================================${NC}"

# Function to generate service auth token
generate_service_token() {
    local service_name=$1
    local timestamp=$(date +%s)
    local message="${service_name}:${timestamp}"
    local signature=$(echo -n "$message" | openssl dgst -sha256 -hmac "$SERVICE_SECRET" | awk '{print $2}')
    echo "${service_name}:${timestamp}:${signature}"
}

# Function to check service health
check_health() {
    local name=$1
    local url=$2
    echo -ne "  ${name}: "
    if curl -s -o /dev/null -w "%{http_code}" "${url}/health" | grep -q "200"; then
        echo -e "${GREEN}OK${NC}"
        return 0
    else
        echo -e "${RED}FAILED${NC}"
        return 1
    fi
}

# =============================================================================
# STEP 1: Health Checks
# =============================================================================
echo -e "\n${YELLOW}[Step 1] Health Checks${NC}"
echo "----------------------------------------"

check_health "Order Service (3006)" "$ORDER_SERVICE" || true
check_health "Product Service (3002)" "$PRODUCT_SERVICE" || true
check_health "Payment Service (3007)" "$PAYMENT_SERVICE" || true
check_health "Address Service (3010)" "$ADDRESS_SERVICE" || true
check_health "Logistic Service (3009)" "$LOGISTIC_SERVICE" || true

# =============================================================================
# STEP 2: Test Product Service directly
# =============================================================================
echo -e "\n${YELLOW}[Step 2] Test Product Service - List Products${NC}"
echo "----------------------------------------"

PRODUCT_RESPONSE=$(curl -s "${PRODUCT_SERVICE}/api/products?limit=1")
echo "Response: $(echo $PRODUCT_RESPONSE | head -c 200)..."

# Try to get a product ID
PRODUCT_ID=$(echo $PRODUCT_RESPONSE | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -n "$PRODUCT_ID" ]; then
    echo -e "${GREEN}Found product ID: $PRODUCT_ID${NC}"
else
    echo -e "${YELLOW}No products found. Creating a test product...${NC}"

    # Generate service auth headers
    SERVICE_TOKEN=$(generate_service_token "test-script")

    # Create a test product
    CREATE_PRODUCT_RESPONSE=$(curl -s -X POST "${PRODUCT_SERVICE}/api/products" \
        -H "Content-Type: application/json" \
        -H "X-Service-Auth: $SERVICE_TOKEN" \
        -H "X-Service-Name: test-script" \
        -H "x-user-id: 00000000-0000-0000-0000-000000000001" \
        -H "x-user-role: admin" \
        -d '{
            "name": "Test Product for Service Communication",
            "slug": "test-product-service-comm",
            "description": "A test product to verify service-to-service communication",
            "baseSellPrice": 50000,
            "categoryId": null,
            "status": "approved"
        }')

    echo "Create product response: $CREATE_PRODUCT_RESPONSE"
    PRODUCT_ID=$(echo $CREATE_PRODUCT_RESPONSE | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
fi

# =============================================================================
# STEP 3: Test Order Service -> Product Service communication
# =============================================================================
echo -e "\n${YELLOW}[Step 3] Test Order -> Product Communication${NC}"
echo "----------------------------------------"

if [ -n "$PRODUCT_ID" ]; then
    echo "Testing order service fetching product: $PRODUCT_ID"

    # Generate service auth token for order-service
    SERVICE_TOKEN=$(generate_service_token "order-service")

    # Call product service directly with service auth (simulating what order-service does)
    PRODUCT_FETCH_RESPONSE=$(curl -s "${PRODUCT_SERVICE}/api/products/id/${PRODUCT_ID}" \
        -H "X-Service-Auth: $SERVICE_TOKEN" \
        -H "X-Service-Name: order-service")

    echo "Product fetch response: $(echo $PRODUCT_FETCH_RESPONSE | head -c 300)..."

    if echo "$PRODUCT_FETCH_RESPONSE" | grep -q "id"; then
        echo -e "${GREEN}Order -> Product communication: SUCCESS${NC}"
    else
        echo -e "${RED}Order -> Product communication: FAILED${NC}"
    fi
else
    echo -e "${RED}No product ID available for testing${NC}"
fi

# =============================================================================
# STEP 4: Test Payment Service directly
# =============================================================================
echo -e "\n${YELLOW}[Step 4] Test Payment Service - Health & Endpoints${NC}"
echo "----------------------------------------"

PAYMENT_HEALTH=$(curl -s "${PAYMENT_SERVICE}/health")
echo "Payment health: $PAYMENT_HEALTH"

# =============================================================================
# STEP 5: Test Order Service -> Payment Service communication
# =============================================================================
echo -e "\n${YELLOW}[Step 5] Test Order -> Payment Communication${NC}"
echo "----------------------------------------"

SERVICE_TOKEN=$(generate_service_token "order-service")
TEST_ORDER_ID="00000000-0000-0000-0000-000000000099"
TEST_USER_ID="00000000-0000-0000-0000-000000000001"
IDEMPOTENCY_KEY="test-idem-$(date +%s)"

echo "Creating test payment via payment service..."
PAYMENT_RESPONSE=$(curl -s -X POST "${PAYMENT_SERVICE}/api/payments" \
    -H "Content-Type: application/json" \
    -H "X-Service-Auth: $SERVICE_TOKEN" \
    -H "X-Service-Name: order-service" \
    -d "{
        \"orderId\": \"$TEST_ORDER_ID\",
        \"userId\": \"$TEST_USER_ID\",
        \"amount\": 50000,
        \"idempotencyKey\": \"$IDEMPOTENCY_KEY\",
        \"paymentMethod\": \"bank_transfer\"
    }")

echo "Payment response: $(echo $PAYMENT_RESPONSE | head -c 500)..."

if echo "$PAYMENT_RESPONSE" | grep -q -E "(id|success|payment)"; then
    echo -e "${GREEN}Order -> Payment communication: SUCCESS${NC}"
else
    echo -e "${YELLOW}Order -> Payment communication: Check response above${NC}"
fi

# =============================================================================
# STEP 6: Test Address Service
# =============================================================================
echo -e "\n${YELLOW}[Step 6] Test Address Service${NC}"
echo "----------------------------------------"

ADDRESS_HEALTH=$(curl -s "${ADDRESS_SERVICE}/health" 2>/dev/null || echo "Service not available")
echo "Address health: $ADDRESS_HEALTH"

# =============================================================================
# STEP 7: Test Logistic Service
# =============================================================================
echo -e "\n${YELLOW}[Step 7] Test Logistic Service${NC}"
echo "----------------------------------------"

LOGISTIC_HEALTH=$(curl -s "${LOGISTIC_SERVICE}/health" 2>/dev/null || echo "Service not available")
echo "Logistic health: $LOGISTIC_HEALTH"

# =============================================================================
# SUMMARY
# =============================================================================
echo -e "\n${BLUE}========================================${NC}"
echo -e "${BLUE}Test Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo "Services tested:"
echo "  - Order Service (3006)"
echo "  - Product Service (3002)"
echo "  - Payment Service (3007)"
echo "  - Address Service (3010)"
echo "  - Logistic Service (3009)"
echo ""
echo "Communication flows tested:"
echo "  - Order -> Product (fetch product details)"
echo "  - Order -> Payment (create payment)"
echo ""
echo -e "${GREEN}Test script completed!${NC}"
