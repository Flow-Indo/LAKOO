# =============================================================================
# Full E-Commerce Checkout Flow Test Script (PowerShell)
# Tests the complete flow: Product -> Address -> Shipping Rates -> Order -> Payment
# =============================================================================

$ErrorActionPreference = "Continue"

# Helper: best-effort decimal conversion
function To-DecimalSafe {
    param($Value)
    try {
        if ($null -eq $Value) { return [decimal]0 }
        return [decimal]$Value
    } catch {
        return [decimal]0
    }
}

# Helper: best-effort number conversion (returns $null if missing/invalid)
function To-NumberSafe {
    param($Value)
    try {
        if ($null -eq $Value -or $Value -eq "") { return $null }
        return [double]$Value
    } catch {
        return $null
    }
}

# Service URLs
$GATEWAY = "http://localhost:3000"

# Direct service URLs (health checks only)
$ORDER_SERVICE = "http://localhost:3006"
$PRODUCT_SERVICE = "http://localhost:3002"
$PAYMENT_SERVICE = "http://localhost:3007"
$ADDRESS_SERVICE = "http://localhost:3010"
$LOGISTIC_SERVICE = "http://localhost:3009"

# Shared secrets (must match docker-compose envs)
$SERVICE_SECRET = "dev-service-secret"

# Test user
$testUserId = "00000000-0000-4000-8000-000000000001"
$testSellerId = "11111111-1111-1111-1111-111111111111"
$quantity = 1

Write-Host "========================================" -ForegroundColor Blue
Write-Host "Full E-Commerce Checkout Flow Test" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue
Write-Host "Test User ID: $testUserId" -ForegroundColor Gray
Write-Host ""

# Function to generate HMAC-SHA256 service token
function Get-ServiceToken {
    param([string]$ServiceName)

    # Use UTC to avoid timezone issues with Docker containers
    $timestamp = [int64](([datetime]::UtcNow - [datetime]'1970-01-01T00:00:00Z').TotalSeconds)
    $message = "${ServiceName}:${timestamp}"

    $hmacsha = New-Object System.Security.Cryptography.HMACSHA256
    $hmacsha.Key = [Text.Encoding]::UTF8.GetBytes($SERVICE_SECRET)
    $hash = $hmacsha.ComputeHash([Text.Encoding]::UTF8.GetBytes($message))
    $signature = [BitConverter]::ToString($hash).Replace("-", "").ToLower()

    return "${ServiceName}:${timestamp}:${signature}"
}

# Function to generate HMAC-SHA256 gateway token (apiGateway:timestamp:signature)
function Get-TestJwtFromGateway {
    param([string]$UserId, [string]$PhoneNumber, [string]$Role)

    $serviceName = "test-runner"
    $serviceAuth = Get-ServiceToken -ServiceName $serviceName

    $headers = @{
        "Content-Type" = "application/json"
        "x-service-name" = $serviceName
        "x-service-auth" = $serviceAuth
    }

    $body = @{
        userId = $UserId
        phoneNumber = $PhoneNumber
        role = $Role
    } | ConvertTo-Json

    $resp = Invoke-RestMethod -Uri "$GATEWAY/api/test/token" -Method Post -Headers $headers -Body $body -TimeoutSec 10 -ErrorAction Stop
    return $resp.token
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

# Function to check gateway health
function Test-GatewayHealth {
    param([string]$Url)

    Write-Host "  API Gateway (3000): " -NoNewline
    try {
        $null = Invoke-RestMethod -Uri "$Url/api/health" -Method Get -TimeoutSec 5 -ErrorAction Stop
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
Write-Host "[Step 1] Health Checks" -ForegroundColor Yellow
Write-Host "----------------------------------------"

$allHealthy = $true
$allHealthy = (Test-GatewayHealth -Url $GATEWAY) -and $allHealthy
$allHealthy = (Test-ServiceHealth -Name "Order Service (3006)" -Url $ORDER_SERVICE) -and $allHealthy
$allHealthy = (Test-ServiceHealth -Name "Product Service (3002)" -Url $PRODUCT_SERVICE) -and $allHealthy
$allHealthy = (Test-ServiceHealth -Name "Payment Service (3007)" -Url $PAYMENT_SERVICE) -and $allHealthy
$allHealthy = (Test-ServiceHealth -Name "Address Service (3010)" -Url $ADDRESS_SERVICE) -and $allHealthy
$allHealthy = (Test-ServiceHealth -Name "Logistic Service (3009)" -Url $LOGISTIC_SERVICE) -and $allHealthy

if (-not $allHealthy) {
    Write-Host "`nSome services are not healthy. Please start all services first." -ForegroundColor Red
    exit 1
}

# =============================================================================
# STEP 1b: Get Test JWT from API Gateway
# =============================================================================
Write-Host "`n[Step 1b] Gateway Authentication" -ForegroundColor Yellow
Write-Host "----------------------------------------"

$jwt = $null
try {
    $jwt = Get-TestJwtFromGateway -UserId $testUserId -PhoneNumber "+6281234567890" -Role "user"
    Write-Host "Got JWT from gateway test endpoint." -ForegroundColor Green
} catch {
    Write-Host "Failed to get JWT from gateway. Make sure api-gateway has ENABLE_TEST_TOKEN_ENDPOINT=true and SERVICE_SECRET matches." -ForegroundColor Red
    Write-Host $_ -ForegroundColor Red
    exit 1
}

$authHeaders = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $jwt"
}

# =============================================================================
# STEP 2: Get Available Product
# =============================================================================
Write-Host "`n[Step 2] Get Available Product" -ForegroundColor Yellow
Write-Host "----------------------------------------"

$product = $null
try {
    $productResponse = Invoke-RestMethod -Uri "$GATEWAY/api/products?limit=1" -Method Get -Headers $authHeaders -TimeoutSec 10

    $productList = $null
    if ($productResponse.products) { $productList = $productResponse.products }
    elseif ($productResponse.data -and $productResponse.data.products) { $productList = $productResponse.data.products }

    if ($productList -and $productList.Count -gt 0) {
        $product = $productList[0]

        # Fetch full product details (to show weight/dimensions used by logistic-service -> Biteship)
        try {
            $productDetail = Invoke-RestMethod -Uri "$GATEWAY/api/products/id/$($product.id)" -Method Get -Headers $authHeaders -TimeoutSec 10
            if ($productDetail.data) { $product = $productDetail.data }
        } catch {
            # Best effort only; proceed with the list result if the details endpoint isn't available.
        }

        Write-Host "Product found:" -ForegroundColor Green
        Write-Host "  ID: $($product.id)" -ForegroundColor Cyan
        Write-Host "  Name: $($product.name)"
        Write-Host "  Price: Rp $($product.baseSellPrice)"
        Write-Host "  Seller ID: $($product.sellerId)"

        $pWeight = $null
        if ($product.PSObject.Properties.Name -contains "weightGrams") { $pWeight = $product.weightGrams }
        $pLen = $null
        if ($product.PSObject.Properties.Name -contains "lengthCm") { $pLen = $product.lengthCm }
        $pWid = $null
        if ($product.PSObject.Properties.Name -contains "widthCm") { $pWid = $product.widthCm }
        $pHei = $null
        if ($product.PSObject.Properties.Name -contains "heightCm") { $pHei = $product.heightCm }

        $lenVal = To-NumberSafe $pLen
        $widVal = To-NumberSafe $pWid
        $heiVal = To-NumberSafe $pHei
        $wgtVal = To-NumberSafe $pWeight

        Write-Host "  Package (from product DB):" -ForegroundColor Gray
        Write-Host "    Weight (g): $($wgtVal)" -ForegroundColor Gray
        Write-Host "    Dimensions (cm): L=$($lenVal) W=$($widVal) H=$($heiVal)" -ForegroundColor Gray

        # Use the product's seller ID if available
        if ($product.sellerId) {
            $testSellerId = $product.sellerId
        }
    } else {
        Write-Host "No active products found. Creating test scenario..." -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "Failed to get products: $_" -ForegroundColor Red
    exit 1
}

# =============================================================================
# STEP 3: Create/Get Shipping Address
# =============================================================================
Write-Host "`n[Step 3] Create Shipping Address" -ForegroundColor Yellow
Write-Host "----------------------------------------"

$headers = $authHeaders

$address = $null
$addressBody = @{
    label = "Home"
    recipientName = "Test Customer"
    phoneNumber = "+6281234567890"
    provinceName = "DKI Jakarta"
    cityName = "Jakarta Selatan"
    district = "Kebayoran Baru"
    subdistrict = "Senayan"
    postalCode = "12190"
    streetAddress = "Jl. Asia Afrika No. 8, Gelora"
    latitude = -6.2146
    longitude = 106.8022
    isDefault = $true
} | ConvertTo-Json

try {
    # Try to get existing addresses first using the correct endpoint
    $existingAddresses = Invoke-RestMethod -Uri "$GATEWAY/api/addresses/user/$testUserId" -Method Get -Headers $headers -TimeoutSec 10

    if ($existingAddresses.data -and $existingAddresses.data.Count -gt 0) {
        $address = $existingAddresses.data[0]
        Write-Host "Using existing address:" -ForegroundColor Green
    } else {
        # Create new address
        $addressResponse = Invoke-RestMethod -Uri "$GATEWAY/api/addresses" -Method Post -Headers $headers -Body $addressBody -TimeoutSec 10
        $address = $addressResponse.data
        Write-Host "Created new address:" -ForegroundColor Green
    }

    Write-Host "  ID: $($address.id)" -ForegroundColor Cyan
    Write-Host "  Recipient: $($address.recipientName)"
    Write-Host "  City: $($address.cityName), $($address.provinceName)"
    Write-Host "  Postal Code: $($address.postalCode)"
} catch {
    Write-Host "Address service error: $_" -ForegroundColor Yellow
    Write-Host "Continuing with inline address..." -ForegroundColor Yellow
}

# =============================================================================
# STEP 4: Get Shipping Rates
# =============================================================================
Write-Host "`n[Step 4] Get Shipping Rates" -ForegroundColor Yellow
Write-Host "----------------------------------------"

$shippingRate = $null
$shippingCost = 15000  # Default fallback

$rateHeaders = $authHeaders

$destPostalCode = if ($address -and $address.postalCode) { $address.postalCode } else { "51111" }

$rateBodyObj = @{
    originPostalCode = "10110"
    destPostalCode = $destPostalCode
    productId = $product.id
    quantity = $quantity
    itemValue = [int]$product.baseSellPrice
}

# Always send weightGrams (per-item) for backward compatibility with older logistic-service validation.
# logistic-service still uses productId to ensure dimensions (and ideally weight) come from product DB.
$productWeightPerItem = To-NumberSafe $product.weightGrams
if (-not $productWeightPerItem -or $productWeightPerItem -le 0) {
    $rateBodyObj.weightGrams = 500
} else {
    $rateBodyObj.weightGrams = [int][math]::Floor($productWeightPerItem)
}

$expectedLen = (To-NumberSafe $product.lengthCm)
$expectedWid = (To-NumberSafe $product.widthCm)
$expectedHei = (To-NumberSafe $product.heightCm)
$expectedWgt = (To-NumberSafe $rateBodyObj.weightGrams)

if (-not $expectedLen -or $expectedLen -le 0) { $expectedLen = 10 }
if (-not $expectedWid -or $expectedWid -le 0) { $expectedWid = 10 }
if (-not $expectedHei -or $expectedHei -le 0) { $expectedHei = 10 }
if (-not $expectedWgt -or $expectedWgt -le 0) { $expectedWgt = 0 }

Write-Host "Rate request (logistic-service will call Biteship with these package details):" -ForegroundColor Gray
Write-Host "  Qty: $quantity" -ForegroundColor Gray
Write-Host "  Weight (g): $expectedWgt" -ForegroundColor Gray
Write-Host "  Dimensions (cm): $expectedLen x $expectedWid x $expectedHei" -ForegroundColor Gray

$rateBody = $rateBodyObj | ConvertTo-Json -Depth 5

try {
    $rateResponse = Invoke-RestMethod -Uri "$GATEWAY/api/rates" -Method Post -Headers $rateHeaders -Body $rateBody -TimeoutSec 15

    # logistic-service returns { success: true, data: ShippingRateResponse[] }
    if ($rateResponse.data -and $rateResponse.data.Count -gt 0) {
        # Get the cheapest rate
        $shippingRate = $rateResponse.data | Sort-Object { $_.rate } | Select-Object -First 1
        $shippingCost = $shippingRate.rate

        Write-Host "Shipping rates retrieved:" -ForegroundColor Green
        Write-Host "  Courier: $($shippingRate.courier)" -ForegroundColor Cyan
        Write-Host "  Service: $($shippingRate.serviceName)"
        Write-Host "  Cost: Rp $shippingCost"
        Write-Host "  ETA: $($shippingRate.estimatedDays) days"

        Write-Host "`n  All available rates:"
        foreach ($rate in $rateResponse.data) {
            Write-Host "    - $($rate.courier) $($rate.serviceName): Rp $($rate.rate) ($($rate.estimatedDays) days)"
        }
    } else {
        Write-Host "No shipping rates available, using default: Rp $shippingCost" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Shipping rate calculation failed: $_" -ForegroundColor Yellow
    Write-Host "Using default shipping cost: Rp $shippingCost" -ForegroundColor Yellow
}

# =============================================================================
# STEP 5: Calculate Order Total
# =============================================================================
Write-Host "`n[Step 5] Calculate Order Total" -ForegroundColor Yellow
Write-Host "----------------------------------------"

$productPrice = [decimal]$product.baseSellPrice
$subtotal = $productPrice * $quantity
$taxAmount = [math]::Round($subtotal * 0.11, 0)  # 11% VAT
$totalAmount = $subtotal + $shippingCost + $taxAmount

Write-Host "Order Summary:" -ForegroundColor Green
Write-Host "  Product: $($product.name)"
Write-Host "  Quantity: $quantity"
Write-Host "  ----------------------------------------"
Write-Host "  Subtotal:     Rp $subtotal"
Write-Host "  Shipping:     Rp $shippingCost"
Write-Host "  Tax (11%):    Rp $taxAmount"
Write-Host "  ----------------------------------------"
Write-Host "  Total:        Rp $totalAmount" -ForegroundColor Cyan

# =============================================================================
# STEP 6: Create Order with Full Details
# =============================================================================
Write-Host "`n[Step 6] Create Order" -ForegroundColor Yellow
Write-Host "----------------------------------------"

$orderIdempotencyKey = "checkout-$(Get-Date -UFormat %s)-$([guid]::NewGuid().ToString().Substring(0,8))"

$orderHeaders = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $jwt"
}

$shippingAddress = @{
    name = "Test Customer"
    phone = "+6281234567890"
    province = "DKI Jakarta"
    city = "Jakarta Selatan"
    district = "Kebayoran Baru"
    postalCode = "12190"
    address = "Jl. Asia Afrika No. 8, Gelora, Senayan"
    latitude = -6.2146
    longitude = 106.8022
}

if ($address) {
    $shippingAddress = @{
        name = $address.recipientName
        phone = $address.phoneNumber
        province = $address.provinceName
        city = $address.cityName
        district = $address.districtName
        postalCode = $address.postalCode
        address = $address.streetAddress
        latitude = $address.latitude
        longitude = $address.longitude
    }
}

$orderBody = @{
    idempotencyKey = $orderIdempotencyKey
    items = @(
        @{
            productId = $product.id
            quantity = $quantity
        }
    )
    shippingAddress = $shippingAddress
    shippingNotes = "Please call before delivery"
    shippingCost = [int]$shippingCost
    taxAmount = [int]$taxAmount
    paymentMethod = "bank_transfer"
    metadata = @{
        courierCode = if ($shippingRate) { $shippingRate.courier } else { "jne" }
        serviceType = if ($shippingRate) { $shippingRate.serviceCode } else { "REG" }
    }
} | ConvertTo-Json -Depth 5

$createdOrder = $null
try {
    Write-Host "Submitting order..." -ForegroundColor Gray
    $orderResponse = Invoke-RestMethod -Uri "$GATEWAY/api/orders" -Method Post -Headers $orderHeaders -Body $orderBody -TimeoutSec 30

    if ($orderResponse.success) {
        Write-Host "Order created successfully!" -ForegroundColor Green

        # Extract order details
        if ($orderResponse.data.orders -and $orderResponse.data.orders.Count -gt 0) {
            $createdOrder = $orderResponse.data.orders[0]
        } elseif ($orderResponse.data.id) {
            $createdOrder = $orderResponse.data
        }

        if ($createdOrder) {
            Write-Host "  Order ID: $($createdOrder.id)" -ForegroundColor Cyan
            Write-Host "  Order Number: $($createdOrder.orderNumber)" -ForegroundColor Cyan
            Write-Host "  Status: $($createdOrder.status)"
            Write-Host "  Total Amount: Rp $($createdOrder.totalAmount)"

            $apiTotal = To-DecimalSafe $createdOrder.totalAmount
            if ($apiTotal -ne (To-DecimalSafe $totalAmount)) {
                Write-Host "  WARNING: API total ($apiTotal) != script total ($totalAmount). Check shipping/tax allocation." -ForegroundColor Yellow
            }
        }

        # Check if payment was created
        if ($orderResponse.data.payments -and $orderResponse.data.payments.Count -gt 0) {
            $payment = $orderResponse.data.payments[0]
            Write-Host "`n  Payment created automatically:" -ForegroundColor Green
            Write-Host "    Payment URL: $($payment.paymentUrl)" -ForegroundColor Cyan
        }
    } else {
        Write-Host "Order creation returned unexpected response" -ForegroundColor Yellow
        Write-Host ($orderResponse | ConvertTo-Json -Depth 3)
    }
} catch {
    $errorMessage = $_.Exception.Message
    $errorResponse = $_.ErrorDetails.Message
    Write-Host "Order creation failed: $errorMessage" -ForegroundColor Red
    Write-Host "Error details: $errorResponse" -ForegroundColor Red
    exit 1
}

# =============================================================================
# STEP 7: Verify Payment was Created
# =============================================================================
Write-Host "`n[Step 7] Verify Payment Status" -ForegroundColor Yellow
Write-Host "----------------------------------------"

if ($createdOrder) {
    $paymentHeaders = @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $jwt"
    }

    try {
        $paymentCheck = Invoke-RestMethod -Uri "$GATEWAY/api/payments/order/$($createdOrder.id)" -Method Get -Headers $paymentHeaders -TimeoutSec 10

        if ($paymentCheck.success -and $paymentCheck.data) {
            $paymentData = $paymentCheck.data
            Write-Host "Payment found:" -ForegroundColor Green
            Write-Host "  Payment ID: $($paymentData.id)" -ForegroundColor Cyan
            Write-Host "  Payment Number: $($paymentData.paymentNumber)"
            Write-Host "  Amount: Rp $($paymentData.amount)"
            Write-Host "  Status: $($paymentData.status)"
            Write-Host "  Gateway: $($paymentData.paymentGateway)"
            Write-Host "  Invoice URL: $($paymentData.gatewayInvoiceUrl)" -ForegroundColor Cyan

            if ($paymentData.expiresAt) {
                $expiryTime = [DateTime]::Parse($paymentData.expiresAt)
                Write-Host "  Expires: $($expiryTime.ToString('yyyy-MM-dd HH:mm:ss'))"
            }

            if ($createdOrder) {
                $orderTotal = To-DecimalSafe $createdOrder.totalAmount
                $paymentAmount = To-DecimalSafe $paymentData.amount
                if ($orderTotal -ne 0 -and $paymentAmount -ne $orderTotal) {
                    Write-Host "  WARNING: Payment amount ($paymentAmount) != order total ($orderTotal)." -ForegroundColor Yellow
                }
            }
        }
    } catch {
        Write-Host "Could not verify payment: $_" -ForegroundColor Yellow
    }
}

# =============================================================================
# STEP 8: Check Order Status
# =============================================================================
Write-Host "`n[Step 8] Check Order Status" -ForegroundColor Yellow
Write-Host "----------------------------------------"

if ($createdOrder) {
    try {
        $orderCheck = Invoke-RestMethod -Uri "$GATEWAY/api/orders/$($createdOrder.id)" -Method Get -Headers $orderHeaders -TimeoutSec 10

        if ($orderCheck.success -and $orderCheck.data) {
            $orderData = $orderCheck.data
            Write-Host "Order details:" -ForegroundColor Green
            Write-Host "  Order Number: $($orderData.orderNumber)" -ForegroundColor Cyan
            Write-Host "  Status: $($orderData.status)"
            Write-Host "  Subtotal: Rp $($orderData.subtotal)"
            Write-Host "  Shipping Cost: Rp $($orderData.shippingCost)"
            Write-Host "  Tax: Rp $($orderData.taxAmount)"
            Write-Host "  Total: Rp $($orderData.totalAmount)"
            Write-Host "  Shipping Recipient: $($orderData.shippingRecipient)"
            Write-Host "  Shipping City: $($orderData.shippingCity)"

            if ($orderData.items -and $orderData.items.Count -gt 0) {
                Write-Host "`n  Order Items:" -ForegroundColor Green
                foreach ($item in $orderData.items) {
                    $name = if ($item.snapshotProductName) { $item.snapshotProductName } else { $item.productName }
                    Write-Host "    - $name x$($item.quantity) @ Rp $($item.unitPrice)"
                }
            }
        }
    } catch {
        Write-Host "Could not check order: $_" -ForegroundColor Yellow
    }
}

# =============================================================================
# SUMMARY
# =============================================================================
Write-Host "`n========================================" -ForegroundColor Blue
Write-Host "Test Summary" -ForegroundColor Blue
Write-Host "========================================" -ForegroundColor Blue

Write-Host "`nFlow completed:" -ForegroundColor Green
Write-Host "  1. Health checks passed for all services"
Write-Host "  2. Product retrieved: $($product.name)"
if ($address) {
    Write-Host "  3. Address created/retrieved: $($address.cityName)" 
} else {
    Write-Host "  3. Address: Using inline address"
}
    if ($shippingRate) {
        Write-Host "  4. Shipping rate: $($shippingRate.courier) $($shippingRate.serviceName) - Rp $shippingCost"
    } else {
        Write-Host "  4. Shipping rate: Default - Rp $shippingCost"
    }
Write-Host "  5. Order total calculated: Rp $totalAmount"
if ($createdOrder) {
    Write-Host "  6. Order created: $($createdOrder.orderNumber)" -ForegroundColor Cyan
    Write-Host "  7. Payment pending - awaiting customer payment"
    Write-Host "  8. Order status: $($createdOrder.status)"
}

Write-Host "`nNext steps (manual):" -ForegroundColor Yellow
Write-Host "  - Customer pays via the Xendit invoice URL"
Write-Host "  - Xendit sends webhook to /api/webhooks/xendit"
Write-Host "  - Payment status updates to 'paid'"
Write-Host "  - Order status updates to 'paid' then 'confirmed'"
Write-Host "  - Seller processes and ships the order"

Write-Host "`n========================================" -ForegroundColor Blue
Write-Host "Full checkout flow test completed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Blue
