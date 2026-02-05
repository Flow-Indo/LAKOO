# =============================================================================
# Service-to-Service Communication Test Script (PowerShell)
# Tests: order -> product, order -> payment
# =============================================================================

$ErrorActionPreference = "Continue"

# Service URLs
$ORDER_SERVICE = "http://localhost:3006"
$PRODUCT_SERVICE = "http://localhost:3002"
$PAYMENT_SERVICE = "http://localhost:3007"
$ADDRESS_SERVICE = "http://localhost:3010"
$LOGISTIC_SERVICE = "http://localhost:3009"

# Shared secret
$SERVICE_SECRET = "dev-service-secret"

Write-Host "========================================" -ForegroundColor Blue
Write-Host "Service Communication Test" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue

# Function to generate HMAC-SHA256 service token
function Get-ServiceToken {
    param([string]$ServiceName)

    $timestamp = [int][double]::Parse((Get-Date -UFormat %s))
    $message = "${ServiceName}:${timestamp}"

    $hmacsha = New-Object System.Security.Cryptography.HMACSHA256
    $hmacsha.Key = [Text.Encoding]::UTF8.GetBytes($SERVICE_SECRET)
    $hash = $hmacsha.ComputeHash([Text.Encoding]::UTF8.GetBytes($message))
    $signature = [BitConverter]::ToString($hash).Replace("-", "").ToLower()

    return "${ServiceName}:${timestamp}:${signature}"
}

# Function to check service health
function Test-ServiceHealth {
    param([string]$Name, [string]$Url)

    Write-Host "  ${Name}: " -NoNewline
    try {
        $response = Invoke-RestMethod -Uri "$Url/health" -Method Get -TimeoutSec 5 -ErrorAction Stop
        Write-Host "OK" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "FAILED" -ForegroundColor Red
        return $false
    }
}

# =============================================================================
# STEP 1: Health Checks
# =============================================================================
Write-Host "`n[Step 1] Health Checks" -ForegroundColor Yellow
Write-Host "----------------------------------------"

Test-ServiceHealth -Name "Order Service (3006)" -Url $ORDER_SERVICE
Test-ServiceHealth -Name "Product Service (3002)" -Url $PRODUCT_SERVICE
Test-ServiceHealth -Name "Payment Service (3007)" -Url $PAYMENT_SERVICE
Test-ServiceHealth -Name "Address Service (3010)" -Url $ADDRESS_SERVICE
Test-ServiceHealth -Name "Logistic Service (3009)" -Url $LOGISTIC_SERVICE

# =============================================================================
# STEP 2: Test Product Service - List Products
# =============================================================================
Write-Host "`n[Step 2] Test Product Service - List Products" -ForegroundColor Yellow
Write-Host "----------------------------------------"

try {
    $productResponse = Invoke-RestMethod -Uri "$PRODUCT_SERVICE/api/products?limit=1" -Method Get -TimeoutSec 10
    Write-Host "Products found: $($productResponse.products.Count)" -ForegroundColor Green

    if ($productResponse.products -and $productResponse.products.Count -gt 0) {
        $productId = $productResponse.products[0].id
        $productName = $productResponse.products[0].name
        Write-Host "Using product: $productName ($productId)" -ForegroundColor Green
    } else {
        Write-Host "No products found in database" -ForegroundColor Yellow
        $productId = $null
    }
} catch {
    Write-Host "Failed to list products: $_" -ForegroundColor Red
    $productId = $null
}

# =============================================================================
# STEP 3: Test Order -> Product Communication
# =============================================================================
Write-Host "`n[Step 3] Test Order -> Product Communication" -ForegroundColor Yellow
Write-Host "----------------------------------------"

if ($productId) {
    $serviceToken = Get-ServiceToken -ServiceName "order-service"

    $headers = @{
        "X-Service-Auth" = $serviceToken
        "X-Service-Name" = "order-service"
    }

    try {
        $productFetch = Invoke-RestMethod -Uri "$PRODUCT_SERVICE/api/products/id/$productId" -Method Get -Headers $headers -TimeoutSec 10
        Write-Host "Product fetched successfully!" -ForegroundColor Green
        Write-Host "  Name: $($productFetch.name)"
        Write-Host "  Price: $($productFetch.baseSellPrice)"
        Write-Host "Order -> Product communication: SUCCESS" -ForegroundColor Green
    } catch {
        Write-Host "Failed to fetch product: $_" -ForegroundColor Red
        Write-Host "Order -> Product communication: FAILED" -ForegroundColor Red
    }
} else {
    Write-Host "Skipping - no product ID available" -ForegroundColor Yellow
}

# =============================================================================
# STEP 4: Test Full Order Creation Flow (Order -> Product -> Payment)
# =============================================================================
Write-Host "`n[Step 4] Test Full Order Creation Flow" -ForegroundColor Yellow
Write-Host "----------------------------------------"

$createdOrderId = $null
$testUserId = "00000000-0000-4000-8000-000000000001"

if ($productId) {
    $orderIdempotencyKey = "order-test-$(Get-Date -UFormat %s)"

    $headers = @{
        "Content-Type" = "application/json"
        "x-user-id" = $testUserId
        "x-user-role" = "user"
    }

    $orderBody = @{
        idempotencyKey = $orderIdempotencyKey
        items = @(
            @{
                productId = $productId
                quantity = 1
            }
        )
        shippingAddress = @{
            name = "Test User"
            phone = "081234567890"
            province = "DKI Jakarta"
            city = "Jakarta Selatan"
            district = "Kebayoran Baru"
            postalCode = "12110"
            address = "Jl. Test No. 123"
        }
        paymentMethod = "bank_transfer"
    } | ConvertTo-Json -Depth 5

    Write-Host "Creating order with product: $productId"

    try {
        $orderResponse = Invoke-RestMethod -Uri "$ORDER_SERVICE/api/orders" -Method Post -Headers $headers -Body $orderBody -TimeoutSec 30
        Write-Host "Order created successfully!" -ForegroundColor Green

        # Extract the created order ID for Step 5
        if ($orderResponse.data -and $orderResponse.data.orders -and $orderResponse.data.orders.Count -gt 0) {
            $createdOrderId = $orderResponse.data.orders[0].id
            Write-Host "  Order ID: $createdOrderId" -ForegroundColor Cyan
        } elseif ($orderResponse.data -and $orderResponse.data.id) {
            $createdOrderId = $orderResponse.data.id
            Write-Host "  Order ID: $createdOrderId" -ForegroundColor Cyan
        }

        Write-Host "Full order flow: SUCCESS" -ForegroundColor Green
    } catch {
        $errorMessage = $_.Exception.Message
        $errorResponse = $_.ErrorDetails.Message
        Write-Host "Order creation failed: $errorMessage" -ForegroundColor Yellow
        Write-Host "Error details: $errorResponse" -ForegroundColor Yellow
    }
} else {
    Write-Host "Skipping full order flow - no product available" -ForegroundColor Yellow
}

# =============================================================================
# STEP 5: Test Direct Payment Creation (with real order)
# =============================================================================
Write-Host "`n[Step 5] Test Direct Payment Creation" -ForegroundColor Yellow
Write-Host "----------------------------------------"

if ($createdOrderId) {
    $idempotencyKey = "test-payment-$(Get-Date -UFormat %s)"

    $headers = @{
        "Content-Type" = "application/json"
        "x-user-id" = $testUserId
        "x-user-role" = "user"
    }

    $paymentBody = @{
        orderId = $createdOrderId
        userId = $testUserId
        amount = 50000
        idempotencyKey = $idempotencyKey
        paymentMethod = "bank_transfer"
    } | ConvertTo-Json

    Write-Host "Creating payment for order: $createdOrderId"

    try {
        $paymentResponse = Invoke-RestMethod -Uri "$PAYMENT_SERVICE/api/payments" -Method Post -Headers $headers -Body $paymentBody -TimeoutSec 10
        Write-Host "Payment created successfully!" -ForegroundColor Green
        Write-Host "  Payment URL: $($paymentResponse.data.paymentUrl)" -ForegroundColor Cyan
        Write-Host "Order -> Payment communication: SUCCESS" -ForegroundColor Green
    } catch {
        $errorMessage = $_.Exception.Message
        $errorResponse = $_.ErrorDetails.Message
        Write-Host "Payment creation failed: $errorMessage" -ForegroundColor Yellow
        Write-Host "Error details: $errorResponse" -ForegroundColor Yellow
    }
} else {
    Write-Host "Skipping payment test - no order was created in Step 4" -ForegroundColor Yellow
    Write-Host "Note: Step 4 must succeed to test payment creation" -ForegroundColor Yellow
}

# =============================================================================
# SUMMARY
# =============================================================================
Write-Host "`n========================================" -ForegroundColor Blue
Write-Host "Test Summary" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue
Write-Host "Services tested:"
Write-Host "  - Order Service (3006)"
Write-Host "  - Product Service (3002)"
Write-Host "  - Payment Service (3007)"
Write-Host "  - Address Service (3010)"
Write-Host "  - Logistic Service (3009)"
Write-Host ""
Write-Host "Communication flows tested:"
Write-Host "  - Order -> Product (fetch product details)"
Write-Host "  - Order -> Payment (create payment)"
Write-Host "  - Full checkout flow (Order orchestrating Product + Payment)"
Write-Host ""
Write-Host "Test script completed!" -ForegroundColor Green
