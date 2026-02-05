# Docker-only stack (travel setup)

Goal: run the LAKOO services with **only Docker** (no `pnpm`, no Go toolchain on the laptop).

## Quick start (build locally)

From the repo root:

```powershell
docker compose -f backend/docker-compose.stack.yml up -d --build
```

Health:

```powershell
docker compose -f backend/docker-compose.stack.yml ps
Invoke-RestMethod http://localhost:3000/api/health
```

Run the end-to-end test:

```powershell
.\backend\services\test-full-checkout-flow.ps1
```

## Quick start (pull images, no build)

If you publish images to a registry, set:

```powershell
$env:LAKOO_IMAGE_REGISTRY="ghcr.io/<you>/lakoo"
$env:LAKOO_IMAGE_TAG="latest"
```

Then:

```powershell
docker compose -f backend/docker-compose.stack.yml pull
docker compose -f backend/docker-compose.stack.yml up -d --no-build
```

## Accessing it while abroad

Two practical options:

1) **Run the stack on a VPS** (recommended for “works anywhere”):
   - Install Docker on the VPS
   - Clone repo, run the `docker compose ... up -d --build` command
   - Open only the gateway port (3000) in the firewall/security group

2) **Run at home + private tunnel** (safer than opening ports):
   - Run the stack on your home PC/server
   - Use Tailscale / WireGuard / Cloudflare Tunnel so you can reach `http://<host>:3000` from anywhere without exposing ports publicly

## Environment notes

- The stack uses each service’s own `.env` file where present (already in the repo for most services).
- `api-gateway` uses compose defaults (see `backend/docker-compose.stack.yml`).
- `cart-service` uses `backend/services/cart-service/.env.example` by default.

