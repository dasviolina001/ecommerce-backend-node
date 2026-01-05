# Coupon System Flow

## Database Schema

### Core Models

#### **Coupon** (Main Coupon Table)
| Field | Type | Description |
|-------|------|-------------|
| `id` | Int (PK) | Auto-increment coupon ID |
| `code` | String (Unique) | Coupon code (e.g., "SAVE20") |
| `type` | Enum (FIXED \| PERCENTAGE) | Discount type |
| `value` | Float | Discount amount or percentage |
| `minOrderValue` | Float? | Minimum cart total required (optional) |
| `maxDiscount` | Float? | Maximum discount cap (optional) |
| `isStackable` | Boolean | Can be combined with other coupons |
| `isActive` | Boolean | Coupon is available |
| `startsAt` | DateTime | Coupon activation date |
| `expiresAt` | DateTime | Coupon expiration date |
| `createdAt` | DateTime | Creation timestamp |
| `updatedAt` | DateTime | Last update timestamp |

#### **CouponUser** (User Coupon Usage)
| Field | Type | Description |
|-------|------|-------------|
| `id` | String (UUID) | Primary key |
| `couponId` | Int (FK) | Links to Coupon |
| `userId` | String (FK) | Links to User |
| `usedAt` | DateTime? | When user applied this coupon |
| `createdAt` | DateTime | Record creation date |

*Constraint: Each user can use each coupon only once (Unique: couponId + userId)*

#### **CouponProduct** (Coupon-Product Association)
| Field | Type | Description |
|-------|------|-------------|
| `id` | String (UUID) | Primary key |
| `couponId` | Int (FK) | Links to Coupon |
| `productId` | String (FK) | Links to Product |
| `createdAt` | DateTime | Record creation date |

*Constraint: Unique couponId + productId*

#### **CouponCategory** (Coupon-Category Association)
| Field | Type | Description |
|-------|------|-------------|
| `id` | String (UUID) | Primary key |
| `couponId` | Int (FK) | Links to Coupon |
| `categoryId` | String (FK) | Links to Category |
| `createdAt` | DateTime | Record creation date |

*Constraint: Unique couponId + categoryId*

#### **Cart** (Cart Item with Coupon)
| Field | Type | Description |
|-------|------|-------------|
| `id` | String (UUID) | Primary key |
| `userId` | String (FK) | Links to User |
| `productId` | String (FK) | Links to Product |
| `quantity` | Int | Item quantity |
| `couponCode` | String? | Applied coupon code (nullable) |
| `createdAt` | DateTime | Record creation date |
| `updatedAt` | DateTime | Last update timestamp |

---

## User Flow

### 1. **View Available Coupons**
```
GET /api/user/coupons/available

REQUEST:
- Query: page=1, limit=10

RESPONSE:
{
  success: true,
  data: [
    {
      id: 1,
      code: "SAVE20",
      type: "PERCENTAGE",
      value: 20,
      minOrderValue: 500,
      maxDiscount: 100,
      startsAt: "2026-01-05T00:00:00Z",
      expiresAt: "2026-12-31T23:59:59Z",
      products: [...],
      categories: [...]
    }
  ],
  pagination: { page, limit, total, pages }
}

FILTERS:
- isActive = true
- startsAt <= NOW
- expiresAt >= NOW
- Ordered by: expiresAt (ascending)
```

### 2. **Validate Coupon**
```
POST /api/user/coupons/validate

REQUEST BODY:
{
  code: "SAVE20",
  cartTotal: 2000,
  productIds: ["prod-123", "prod-456"],
  categoryIds: ["cat-789"]
}

VALIDATION CHECKS:
1. Coupon exists and is active
2. Current date is within startsAt and expiresAt
3. cartTotal >= minOrderValue (if minOrderValue is set)
4. Applied to correct products/categories (if restricted)

CALCULATION:
- If type = "FIXED": discount = value
- If type = "PERCENTAGE": discount = (cartTotal * value) / 100
- If discount > maxDiscount: discount = maxDiscount

RESPONSE:
{
  success: true,
  data: {
    coupon: { id, code, type, value, ... },
    discount: 200,
    finalTotal: 1800
  }
}
```

### 3. **Apply Coupon**
```
POST /api/user/coupons/apply

REQUEST BODY:
{
  code: "SAVE20"
}

LOGIC:
1. Retrieve coupon by code
2. Check if user has already used this coupon
   - Query: CouponUser with couponId + userId
   - If exists: Throw error "You have already used this coupon"
3. Create new CouponUser record with usedAt = NOW()

RESPONSE:
{
  success: true,
  message: "Coupon applied successfully",
  data: { coupon object }
}
```

### 4. **Remove Coupon from Cart**
```
DELETE /api/user/coupons/remove/:cartId

REQUEST:
- cartId (path parameter)

LOGIC:
1. Find cart item by cartId
2. Verify ownership (cart.userId === req.user.id)
3. Set cart.couponCode = null

RESPONSE:
{
  success: true,
  message: "Coupon removed from cart successfully"
}
```

### 5. **Check My Coupon Usage**
```
GET /api/user/coupons/my-usage

RESPONSE:
{
  success: true,
  data: [
    {
      id: "usage-uuid",
      couponId: 1,
      userId: "user-123",
      usedAt: "2026-01-05T10:30:00Z",
      coupon: {
        id: 1,
        code: "SAVE20",
        type: "PERCENTAGE",
        value: 20,
        createdAt: "2025-12-01T00:00:00Z",
        expiresAt: "2026-12-31T23:59:59Z"
      }
    }
  ]
}
```

---

## Admin Flow

### 1. **Create Coupon**
```
POST /api/admin/coupons/create

REQUEST BODY:
{
  code: "SAVE20",
  type: "PERCENTAGE",
  value: 20,
  minOrderValue: 500,
  maxDiscount: 100,
  isStackable: false,
  startsAt: "2026-01-05T00:00:00Z",
  expiresAt: "2026-12-31T23:59:59Z",
  productIds: ["prod-123", "prod-456"],
  categoryIds: ["cat-789"]
}

LOGIC:
1. Validate code is unique (case-insensitive)
2. Validate startsAt < expiresAt
3. Create Coupon record
4. If productIds provided: Create CouponProduct records
5. If categoryIds provided: Create CouponCategory records

RESPONSE:
{
  success: true,
  data: { created coupon object }
}
```

### 2. **Update Coupon**
```
PUT /api/admin/coupons/:couponId

REQUEST BODY:
{
  code?: "SAVE25",
  type?: "FIXED",
  value?: 25,
  minOrderValue?: 1000,
  maxDiscount?: 500,
  isStackable?: true,
  startsAt?: "2026-01-10T00:00:00Z",
  expiresAt?: "2026-12-31T23:59:59Z"
}

LOGIC:
1. Find coupon by ID
2. Validate unique code (if changed)
3. Validate date logic (if dates changed)
4. Update coupon fields

RESPONSE:
{
  success: true,
  data: { updated coupon object }
}
```

### 3. **Delete Coupon**
```
DELETE /api/admin/coupons/:couponId

LOGIC:
1. Find coupon by ID
2. Delete coupon (cascades to CouponUser, CouponProduct, CouponCategory)

RESPONSE:
{
  success: true,
  message: "Coupon deleted successfully"
}
```

### 4. **Get All Coupons (Admin)**
```
GET /api/admin/coupons?page=1&limit=10

RESPONSE:
{
  success: true,
  data: [
    {
      id: 1,
      code: "SAVE20",
      type: "PERCENTAGE",
      value: 20,
      minOrderValue: 500,
      maxDiscount: 100,
      isStackable: false,
      isActive: true,
      startsAt: "2026-01-05T00:00:00Z",
      expiresAt: "2026-12-31T23:59:59Z",
      usageCount: 45,
      products: [{ product details }],
      categories: [{ category details }]
    }
  ],
  pagination: { ... }
}
```

### 5. **Toggle Coupon Status**
```
PATCH /api/admin/coupons/:couponId/status

REQUEST BODY:
{
  isActive: false
}

RESPONSE:
{
  success: true,
  data: { updated coupon object }
}
```

---

## Discount Calculation Flow

```
┌─────────────────────────────────────────┐
│    User Validates/Applies Coupon        │
└────────────────┬────────────────────────┘
                 │
                 ▼
         ┌──────────────────┐
         │  Fetch Coupon    │
         └────────┬─────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
  ┌─────────────┐      ┌──────────────┐
  │ FIXED Type  │      │ PERCENTAGE   │
  │ discount =  │      │ discount =   │
  │   value     │      │ (total *     │
  │             │      │  value) / 100│
  └─────────┬───┘      └────────┬─────┘
            │                   │
            └─────────┬─────────┘
                      │
                      ▼
         ┌──────────────────────────┐
         │  Check maxDiscount       │
         │  discount > maxDiscount? │
         └────────┬────────┬────────┘
                  │        │
              YES │        │ NO
                  ▼        ▼
         ┌──────────────┐ finalDiscount
         │ discount =   │
         │ maxDiscount  │
         └──────────────┘
                  │
                  ▼
         ┌──────────────────┐
         │ finalTotal =     │
         │ cartTotal -      │
         │ discount         │
         └──────────────────┘
```

---

## Key Business Rules

### Coupon Eligibility
- ✅ Coupon must be active (`isActive = true`)
- ✅ Current date must be between `startsAt` and `expiresAt`
- ✅ Cart total must meet `minOrderValue` (if set)
- ✅ Coupon applies only to specified products/categories (if restricted)
- ❌ User cannot use same coupon twice (enforced by CouponUser unique constraint)

### Discount Calculation
- **FIXED**: Direct discount amount
- **PERCENTAGE**: Calculate percentage of cart total
- **maxDiscount**: Cap the discount if set

### Stackability
- `isStackable = true`: Can combine with other coupons (future implementation)
- `isStackable = false`: Cannot stack with other coupons

---

## Relationships Summary

```
User (1) ──── (M) CouponUser (M) ──── (1) Coupon (1) ──── (M) CouponProduct (M) ──── (1) Product
                                         │
                                         └──── (M) CouponCategory (M) ──── (1) Category
                                         │
                                         └──── (M) Cart ──── (1) User
```

