# 🚀 LAKOO Social Commerce - MVP Roadmap

**Created:** 2026-01-27
**Updated:** 2026-01-28
**Target:** Production-Ready MVP
**Platform:** Social Commerce (Xiaohongshu/Pinterest style)

---

## 📊 Executive Summary

This roadmap outlines all remaining work to achieve a **deployable MVP** for LAKOO's social commerce platform.

**Current Progress:** ~85% complete
**Current Phase:** Phase 2 - Seller Service
**Core Features:** Product catalog, social posts, product tagging, feeds, payments

### Phase Status
| Phase | Status | Notes |
|-------|--------|-------|
| Phase 1: Service Integration | ✅ COMPLETE | All 4 services pulled, reviewed, P0 fixed |
| Phase 2: Seller Service | 🔄 IN PROGRESS | Pull from friend, review |
| Phase 3: Event-Driven Integration | ⏳ PENDING | |
| Phase 4: Notification Service | ⏳ PENDING | |
| Phase 5: End-to-End Testing | ⏳ PENDING | |
| Phase 6: Deployment Preparation | ⏳ PENDING | |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         API GATEWAY (nginx)                          │
│                    Authentication & Rate Limiting                    │
└─────────────────────────────────────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐         ┌───────────────┐         ┌───────────────┐
│  auth-service │         │ user-service  │         │seller-service │
│   (3001)      │         │   (3004)      │         │   (3015)      │
│   ✅ DONE     │         │   ✅ DONE     │         │   🔄 PULL     │
└───────────────┘         └───────────────┘         └───────────────┘
        │                           │                           │
        └───────────────────────────┼───────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐         ┌───────────────┐         ┌───────────────┐
│product-service│         │content-service│         │ feed-service  │
│   (3002)      │         │   (3017)      │         │   (3018)      │
│   ✅ DONE     │         │   ✅ DONE     │         │   ✅ DONE     │
└───────────────┘         └───────────────┘         └───────────────┘
        │                           │                           │
        └───────────────────────────┼───────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐         ┌───────────────┐         ┌───────────────┐
│ cart-service  │         │ order-service │         │payment-service│
│   (3003)      │         │   (3006)      │         │   (3007)      │
│   ✅ DONE     │         │   ✅ DONE     │         │   ✅ DONE     │
└───────────────┘         └───────────────┘         └───────────────┘
        │                           │                           │
        └───────────────────────────┼───────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐         ┌───────────────┐         ┌───────────────┐
│warehouse-svc  │         │logistic-svc   │         │address-service│
│   (3012)      │         │   (3009)      │         │   (3010)      │
│   ✅ DONE     │         │   ✅ DONE     │         │   ✅ DONE     │
└───────────────┘         └───────────────┘         └───────────────┘
```

---

## 📋 Service Status Matrix

### ✅ Completed Services (Ready for MVP)

| Service | Port | Language | Database | Status | Notes |
|---------|------|----------|----------|--------|-------|
| auth-service | 3001 | TypeScript | auth_db | ✅ Complete | P0 fixed (USER_SERVICE_URL) |
| product-service | 3002 | TypeScript | product_db | ✅ Complete | Draft/moderation workflow |
| cart-service | 3003 | **Go** | cart_db | ✅ Complete | P0 fixed (product contract) |
| user-service | 3004 | TypeScript | user_db | ✅ Complete | P0 fixed (response + auth) |
| brand-service | 3005 | TypeScript | brand_db | ✅ Complete | |
| order-service | 3006 | **Go** | order_db | ✅ Complete | P0 fixed (gateway auth + cart clear) |
| payment-service | 3007 | TypeScript | payment_db | ✅ Complete | |
| logistic-service | 3009 | TypeScript | logistic_db | ✅ Complete | |
| address-service | 3010 | TypeScript | address_db | ✅ Complete | |
| warehouse-service | 3012 | TypeScript | warehouse_db | ✅ Complete | Full inventory management |
| review-service | 3016 | TypeScript | review_db | ✅ Complete | |
| content-service | 3017 | TypeScript | content_db | ✅ Complete | Social commerce content |
| feed-service | 3018 | TypeScript | feed_db | ✅ Complete | Feed + trending |

### 🔄 Services to Pull (Phase 2 - Current)

| Service | Port | Database | Priority | Notes |
|---------|------|----------|----------|-------|
| seller-service | 3015 | seller_db | HIGH | Pull from friend, review |

### ⏳ Services to Create (Future Phases)

| Service | Port | Database | Priority |
|---------|------|----------|----------|
| notification-service | 3008 | notification_db | MEDIUM |
| wallet-service | 3011 | wallet_db | LOW (MVP optional) |
| advertisement-service | 3013 | ad_db | LOW (Post-MVP) |
| support-service | 3014 | support_db | LOW (Post-MVP) |

---

## 🎯 MVP Feature Scope

### Core Features (MUST HAVE)

| Feature | Services Involved | Status |
|---------|-------------------|--------|
| User Registration/Login | auth-service | 🔄 Pull |
| User Profiles | user-service | 🔄 Pull |
| Browse Products | product-service | ✅ Done |
| Product Categories | product-service | ✅ Done |
| Create Posts | content-service | ✅ Done |
| Tag Products in Posts | content-service + product-service | ✅ Done |
| Like/Comment on Posts | content-service | ✅ Done |
| Follow Users | feed-service | ✅ Done |
| Personalized Feed | feed-service | ✅ Done |
| Add to Cart | cart-service | 🔄 Pull |
| Checkout | order-service + payment-service | 🔄 Pull |
| Order Tracking | order-service | 🔄 Pull |
| Shipping Calculation | logistic-service | ✅ Done |
| Address Management | address-service | ✅ Done |

### Nice-to-Have (MVP+)

| Feature | Services Involved | Status |
|---------|-------------------|--------|
| Seller Registration | seller-service | ⏳ Todo |
| Seller Product Drafts | seller-service + product-service | ⏳ Todo |
| Push Notifications | notification-service | ⏳ Todo |
| Wallet/Balance | wallet-service | ⏳ Todo |
| Sponsored Posts | advertisement-service | ⏳ Post-MVP |
| Customer Support | support-service | ⏳ Post-MVP |

---

## 📅 Implementation Phases

### Phase 1: Service Integration ✅ COMPLETE

**Goal:** Integrate pulled services with existing infrastructure
**Completed:** 2026-01-28

#### 1.1 Pull and Setup Services ✅
```bash
# Completed for auth-service, user-service, order-service, cart-service
# TypeScript services: auth-service, user-service
# Go services: cart-service, order-service
```

#### 1.2 Comprehensive Service Review ✅
- [x] Reviewed all 8 core services
- [x] Identified P0/P1/P2 issues per service
- [x] Documented in `SERVICE_REVIEW_RESULTS.md`

#### 1.3 P0 Fixes Round 1 ✅
- [x] auth↔user route mismatch
- [x] user-service external route
- [x] cart-service stubbed methods
- [x] cart-service SQL query
- [x] cart-service API routes
- [x] order-service persistence
- [x] order-service response
- [x] order-service payment auth
- [x] order-service Kafka config

#### 1.4 P0 Fixes Round 2 ✅
- [x] Response field mapping (`id` vs `userId`) - user-service
- [x] Broken error propagation - user-service
- [x] Internal endpoints unprotected - user-service
- [x] Wrong USER_SERVICE_URL default - auth-service
- [x] No auth middleware - order-service
- [x] Checkout incomplete (cart clear) - order-service
- [x] Product contract mismatch - cart-service

**Reference Files:**
- `ORCHESTRATOR_STATUS_REPORT.md` - Final status
- `SERVICE_REVIEW_RESULTS.md` - Detailed review
- `P0_FIXES_COMPLETED.md` - Round 1 fixes
- `P0_FIXES_ROUND2_COMPLETED.md` - Round 2 fixes

---

### Phase 2: Seller Service 🔄 IN PROGRESS

**Goal:** Enable seller product listings
**Status:** Waiting for seller-service pull from friend

#### 2.1 Pull and Review seller-service
- [ ] Pull seller-service from friend's repository
- [ ] Perform comprehensive review (same as Phase 1)
- [ ] Identify P0/P1/P2 issues
- [ ] Fix P0 issues
- [ ] Document in `SELLER_SERVICE_REVIEW.md`

#### 2.2 Expected Features
```
seller-service/
├── Seller registration
├── Seller verification (manual approval)
├── Seller profiles
├── Seller inventory (SellerInventory table)
├── Seller payouts
└── Connect to product drafts
```

#### 2.3 Integration Points to Verify
| From | To | Purpose |
|------|-----|---------|
| seller-service | auth-service | Verify seller identity |
| seller-service | product-service | Create product drafts |
| product-service | seller-service | Update seller stats |
| order-service | seller-service | Notify seller of orders |
| payment-service | seller-service | Process seller payouts |

#### 2.4 Review Checklist (after pull)
- [ ] Schema uses snake_case with proper @map directives
- [ ] Service-to-service auth implemented
- [ ] Gateway auth middleware on external routes
- [ ] Error handling and propagation
- [ ] No stubbed/incomplete methods
- [ ] Integration endpoints match contracts

---

### Phase 3: Event-Driven Integration (Week 2) 🔄

**Goal:** Enable real-time updates across services

#### 3.1 Event Bus Setup
Options:
- **Option A:** Redis Pub/Sub (Simple, good for MVP)
- **Option B:** Kafka (Scalable, production-ready)
- **Option C:** Polling with Outbox (Current pattern)

#### 3.2 Critical Event Flows

```
POST CREATED:
content-service → feed-service
  ├── Fan-out to followers' feeds
  └── Update trending scores

ORDER PAID:
payment-service → order-service
  ├── Update order status
  └── Confirm inventory reservation

payment-service → warehouse-service
  └── Confirm reservation

payment-service → notification-service
  └── Send payment confirmation

ORDER SHIPPED:
order-service → notification-service
  └── Send shipping notification

PRODUCT APPROVED:
product-service → content-service
  └── Product now taggable

product-service → seller-service
  └── Update seller product count
```

#### 3.3 Implementation Tasks
- [ ] Choose event bus technology
- [ ] Implement event publishers in all services
- [ ] Implement event consumers
- [ ] Add retry logic for failed events
- [ ] Add dead letter queue for unprocessable events

---

### Phase 4: Notification Service (Week 2) ⏳

**Goal:** Enable push notifications

#### 4.1 Notification Types
| Type | Trigger | Recipients |
|------|---------|------------|
| order_placed | Order created | Buyer |
| order_paid | Payment confirmed | Buyer, Seller |
| order_shipped | Order shipped | Buyer |
| order_delivered | Order delivered | Buyer |
| new_follower | User followed | Followee |
| post_liked | Post liked | Post author |
| post_commented | Comment added | Post author |
| product_approved | Draft approved | Seller |
| product_rejected | Draft rejected | Seller |

#### 4.2 Channels
- [ ] Push notifications (Firebase/OneSignal)
- [ ] Email (SendGrid/SES)
- [ ] SMS (Twilio/local provider)
- [ ] In-app notifications

---

### Phase 5: End-to-End Testing (Week 3) 🧪

**Goal:** Verify complete user journeys

#### 5.1 Critical User Flows

**Flow 1: Buyer Journey**
```
1. Register → Login
2. Browse feed → See posts with product tags
3. Click product tag → View product details
4. Add to cart → View cart
5. Checkout → Enter shipping address
6. Pay → Receive confirmation
7. Track order → Receive delivery
8. Leave review
```

**Flow 2: Seller Journey**
```
1. Register as seller → Verify account
2. Create product draft → Submit for approval
3. Product approved → Live on platform
4. Receive order → Process order
5. Ship order → Update tracking
6. Receive payout
```

**Flow 3: Social Journey**
```
1. Create post → Tag products
2. Add hashtags → Post published
3. Post appears in followers' feeds
4. Users like/comment
5. Post trends → Appears in explore
```

#### 5.2 Integration Test Checklist
- [ ] User registration and login
- [ ] User profile management
- [ ] Product browsing and search
- [ ] Post creation with product tags
- [ ] Feed generation (following, for-you, explore)
- [ ] Cart management
- [ ] Checkout flow
- [ ] Payment processing
- [ ] Order tracking
- [ ] Seller product submission
- [ ] Seller order fulfillment

---

### Phase 6: Deployment Preparation (Week 3) 🚀

**Goal:** Production-ready deployment

#### 6.1 Infrastructure Setup
- [ ] Docker Compose for local development
- [ ] Kubernetes manifests OR Docker Swarm
- [ ] Environment variable management
- [ ] Secrets management (Vault or K8s secrets)
- [ ] SSL certificates

#### 6.2 Database Setup
- [ ] Neon PostgreSQL production databases
- [ ] Connection pooling (PgBouncer or Neon pooler)
- [ ] Backup strategy
- [ ] Migration scripts

#### 6.3 Monitoring & Logging
- [ ] Centralized logging (ELK or CloudWatch)
- [ ] Health check endpoints (all services have /health)
- [ ] Metrics collection (Prometheus)
- [ ] Alerting (PagerDuty or similar)
- [ ] Error tracking (Sentry)

#### 6.4 Security Checklist
- [ ] API Gateway authentication
- [ ] Service-to-service auth (HMAC)
- [ ] Rate limiting
- [ ] Input validation (all services)
- [ ] SQL injection prevention (Prisma handles this)
- [ ] XSS prevention
- [ ] CORS configuration
- [ ] Helmet.js for HTTP headers

#### 6.5 Performance
- [ ] Database indexes verified
- [ ] Query optimization
- [ ] Caching strategy (Redis)
- [ ] CDN for static assets
- [ ] Image optimization

---

## 🔧 Technical Debt to Address

### Before MVP
| Issue | Service | Priority |
|-------|---------|----------|
| Event consumers not implemented | feed-service | HIGH |
| Feed syndication missing | content-service → feed-service | HIGH |
| Legacy @repo/database imports | product-service (some files) | MEDIUM |

### Post-MVP
| Issue | Service | Priority |
|-------|---------|----------|
| Automated test suite | All | MEDIUM |
| CI/CD pipeline | All | MEDIUM |
| API documentation (Swagger) | All | LOW |
| Performance optimization | All | LOW |

---

## 📊 MVP Success Metrics

### Launch Criteria
- [ ] All 13+ services deployed and healthy
- [ ] End-to-end buyer flow working
- [ ] End-to-end seller flow working (if seller-service done)
- [ ] Payment processing working (test mode)
- [ ] No critical bugs in production

### KPIs to Track
- User registration rate
- Post creation rate
- Product tag clicks
- Conversion rate (view → cart → purchase)
- Order completion rate
- Seller onboarding rate

---

## 🗓️ Timeline Summary

```
Week 1:
├── Day 1-2: Pull and integrate auth, user, cart, order services
├── Day 3-4: Verify integrations, fix issues
└── Day 5: Start seller-service

Week 2:
├── Day 1-3: Complete seller-service
├── Day 4-5: Event bus setup
└── Day 5: Notification service (basic)

Week 3:
├── Day 1-2: End-to-end testing
├── Day 3-4: Bug fixes and polish
└── Day 5: Deployment preparation

Week 4 (Buffer):
├── Final testing
├── Soft launch
└── Monitor and fix
```

---

## 📞 Service Ports Reference

```
auth-service          : 3001 ✅ (TypeScript)
product-service       : 3002 ✅ (TypeScript)
cart-service          : 3003 ✅ (Go)
user-service          : 3004 ✅ (TypeScript)
brand-service         : 3005 ✅ (TypeScript)
order-service         : 3006 ✅ (Go)
payment-service       : 3007 ✅ (TypeScript)
notification-service  : 3008 ⏳
logistic-service      : 3009 ✅ (TypeScript)
address-service       : 3010 ✅ (TypeScript)
wallet-service        : 3011 ⏳
warehouse-service     : 3012 ✅ (TypeScript)
advertisement-service : 3013 ⏳
support-service       : 3014 ⏳
seller-service        : 3015 🔄 (Pull from friend)
review-service        : 3016 ✅ (TypeScript)
content-service       : 3017 ✅ (TypeScript)
feed-service          : 3018 ✅ (TypeScript)
```

**Summary:** 13/18 services ready, 1 in progress (seller-service), 4 post-MVP

---

## 🚦 Go-Live Checklist

### Pre-Launch
- [ ] All services deployed
- [ ] Database migrations complete
- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] DNS configured
- [ ] Monitoring active
- [ ] Backup systems tested

### Launch Day
- [ ] Health checks passing
- [ ] Smoke tests passing
- [ ] Team on standby
- [ ] Rollback plan ready

### Post-Launch
- [ ] Monitor error rates
- [ ] Monitor performance
- [ ] User feedback collection
- [ ] Bug triage process

---

## 📝 Next Immediate Actions

### Phase 2 Tasks (Current)
1. **Pull seller-service** from friend's repository
2. **Comprehensive review** of seller-service
3. **Identify and fix P0 issues** in seller-service
4. **Verify integration points** with existing services
5. **Run integration test flow** (signup → login → create post → add to cart → checkout)

### After Phase 2
1. **Set up event bus** (for feed syndication)
2. **Implement notification-service** (basic)
3. **End-to-end testing** of all flows
4. **Deployment preparation**

---

**Document Status:** ✅ COMPLETE
**Last Updated:** 2026-01-28
**Current Phase:** Phase 2 - Seller Service
**Maintained By:** Orchestrator Agent (Claude Opus 4.5)

---

*This roadmap will be updated as progress is made.*
