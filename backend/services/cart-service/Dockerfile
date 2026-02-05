FROM golang:1.22-alpine AS builder

WORKDIR /app

RUN apk add --no-cache ca-certificates git

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /out/cart-service ./cmd/main

FROM alpine:3.19

WORKDIR /app

RUN apk add --no-cache ca-certificates wget && update-ca-certificates

COPY --from=builder /out/cart-service /app/cart-service

EXPOSE 3003

CMD ["/app/cart-service"]
