# Company Product — เลือก product จาก catalog กลางมาผูกใช้ต่อ company

`products` เป็น **catalog กลาง** ที่แชร์กันทุก company (ไม่มี `company_id` ในตาราง products)
ฟีเจอร์นี้เพิ่มชั้น "การเลือกมาใช้": สร้าง product ไว้ที่ catalog กลางตามเดิม แล้วค่อย **เลือก (assign)
product มาผูกกับ company** ผ่าน join table `company_products` (รูปแบบเดียวกับ `vendor_products`)

- **Base URL (dev):** `http://localhost:3000/api`
- **Base URL (prod):** ตามที่ฝั่ง backend ประกาศ
- **Auth:** ทุก endpoint ต้องมี JWT — การ scope ตาม company อิงจาก auth user
- **Timezone:** วันเวลาใน response ตีความเป็นเวลาประเทศลาว (`Asia/Vientiane`, UTC+7)

> ## ✅ สถานะการ implement
>
> | ส่วน | สถานะ |
> | ---- | ----- |
> | Join entity + ตาราง `company_products` (DDD/CQRS ครบทุก layer) | ✅ โค้ดเสร็จ (build + lint ผ่าน) |
> | REST API CRUD `/api/company-products` (assign แบบ array / list / get / update / unassign) | ✅ เสร็จ |
> | Company isolation จาก auth (non-admin = company ตัวเอง, admin = เลือกได้) | ✅ เสร็จ |
> | `GET /api/products?...` รองรับ auto-scope ตาม company ที่ user สังกัด | ✅ เสร็จ |
> | **Migration สร้างตาราง `company_products`** | ⛔ **ยังไม่รัน** — ต้อง `migration:generate` + `migration:run` ก่อนใช้งานจริง |
> | ทดสอบ endpoint จริง (manual) | ⛔ ยังไม่ทำ (รอ DB) |

---

## ภาพรวมแนวคิด

```
[ products ]  catalog กลาง (สร้าง/แก้ที่เดิม ไม่มี company_id)
     ▲
     │  เลือกมาใช้ (assign)
     │
[ company_products ]  join: company_id + product_id + status
     │
     ▼
[ companies ]  แต่ละ company มีชุด product ที่ "เลือกใช้" ของตัวเอง
```

- product 1 ตัว **หลาย company เลือกใช้ได้** (many-to-many)
- 1 คู่ `(company_id, product_id)` ที่ยังไม่ถูกลบ มีได้ **เพียงรายการเดียว** (กันผูกซ้ำ)
- การ unassign = **soft delete** (เก็บประวัติ) และ re-assign ใหม่ได้

---

## Data model — `company_products`

| field        | ชนิด                    | required | คำอธิบาย                                          |
| ------------ | ----------------------- | -------- | ------------------------------------------------- |
| `id`         | int (unsigned)          | —        | primary key                                       |
| `company_id` | int (unsigned)          | yes      | FK → `companies.id` (onDelete CASCADE)            |
| `product_id` | int (unsigned)          | yes      | FK → `products.id` (onDelete CASCADE)             |
| `status`     | enum `active`/`inactive`| yes      | default `active`                                  |
| `created_at` | timestamp               | —        | สร้างอัตโนมัติ                                     |
| `updated_at` | timestamp               | —        | อัปเดตอัตโนมัติ                                    |
| `deleted_at` | timestamp (nullable)    | —        | soft delete                                       |

**Index:** partial unique `uq_company_products_company_product` บน `(company_id, product_id)`
โดยมีเงื่อนไข `WHERE deleted_at IS NULL` → กันผูกซ้ำเฉพาะแถวที่ยัง active (soft-deleted ผูกใหม่ได้)

ORM entity: [`company-product.orm.ts`](../src/common/infrastructure/database/typeorm/company-product.orm.ts)
และเพิ่ม `@OneToMany company_products` ใน [`company.orm.ts`](../src/common/infrastructure/database/typeorm/company.orm.ts) / [`product.orm.ts`](../src/common/infrastructure/database/typeorm/product.orm.ts)

---

## การ scope ตาม company (สำคัญ)

อิง role จาก auth user (resolve company จาก `CompanyUserOrmEntity`) — pattern เดียวกับ document list isolation:

| role | assign (POST) | list (GET) |
| ---- | ------------- | ---------- |
| `super-admin` / `admin` | **ต้องระบุ** `company_id` ใน body ว่าจะ assign ให้ company ไหน | เห็น **ทุก company** (ไม่ scope) |
| อื่น ๆ (non-admin) | ใช้ company ของตัวเองอัตโนมัติ — ส่ง `company_id` มาก็ถูก **ignore** | เห็นเฉพาะ assignment ของ **company ตัวเอง** |
| non-admin ที่ไม่มี company | ❌ `403 forbidden` | ได้ผลลัพธ์ **ว่าง** (fail-safe ไม่ leak) |

---

## API

### 1) Assign product เข้า company (รองรับ array)

```
POST /api/company-products
```

**Body**

```json
{
  "product_ids": [1, 2, 3],
  "status": "active",      // optional, default "active"
  "company_id": 5          // admin/super-admin เท่านั้น (non-admin ถูก ignore)
}
```

| field | required | หมายเหตุ |
| ----- | -------- | -------- |
| `product_ids` | ✅ | array ของ product id (ต้องไม่ว่าง) ระบบ dedupe ให้ |
| `status` | — | `active` \| `inactive` (default `active`) |
| `company_id` | เฉพาะ admin | non-admin ใช้ company จาก auth เสมอ |

**พฤติกรรม**
- เช็ค company มีจริง + product แต่ละตัวมีจริง (ไม่มี → error ทั้งก้อนหยุด)
- product ที่ company **เลือกไว้แล้ว** (ยังไม่ลบ) → **ข้าม** (idempotent ไม่ error)
- คืน **array เฉพาะรายการที่สร้างใหม่จริง**

**Response `201`**

```json
[
  { "id": 10, "company_id": 5, "product_id": 1, "status": "active",
    "company": { "id": 5, "name": "..." }, "product": { "id": 1, "name": "..." },
    "created_at": "...", "updated_at": "..." },
  { "id": 11, "company_id": 5, "product_id": 2, "status": "active", "...": "..." }
]
```

**Error**
- `400 is_required` (property `company_id`) — admin ไม่ส่ง company_id
- `403 forbidden` — non-admin ไม่มี company
- `404` — product / company ที่อ้างถึงไม่มีอยู่

---

### 2) List product ที่ผูกกับ company

```
GET /api/company-products
```

**Query params** (ทั้งหมด optional): `page`, `limit`, `search` (ชื่อ product/company),
`company_id`, `product_id`, `status`

- non-admin: ผลลัพธ์ถูกบังคับ scope เป็น company ตัวเอง
- admin/super-admin: เห็นทุก company (ใส่ `company_id` เพื่อ filter เองได้)

**Response `200`** — paginated `data[]` ของ company_products (มี nested `company` / `product`)

---

### 3) ดูรายการเดียว

```
GET /api/company-products/:id
```

คืน assignment เดียว พร้อม nested `company` / `product`

---

### 4) แก้ไข (เช่น เปลี่ยน status)

```
PUT /api/company-products/:id
```

**Body** (optional ทุก field): `status`, `product_id`, `company_id`
ใช้กับ row เดียว (ตาม `:id`) — ส่วนใหญ่ใช้สลับ `status` เป็น `inactive`/`active`

---

### 5) Unassign (เอา product ออกจาก company)

```
DELETE /api/company-products/:id
```

**soft delete** — หายจาก list แต่เก็บประวัติ และ assign product เดิมกลับเข้ามาใหม่ได้

---

## ผลกระทบต่อ `GET /api/products` (catalog list) — ต้องอ่าน

เพื่อให้ "ตอนเลือก product (เช่น dropdown ใน PR/PO) เห็นเฉพาะของ company ตัวเอง"
endpoint **เดิม** `GET /api/products` ถูกปรับให้ **auto-scope ตาม company ที่ user สังกัด**:

| ผู้เรียก | ก่อน | หลัง |
| -------- | ---- | ---- |
| `admin` / `super-admin` | เห็น catalog เต็ม | **เหมือนเดิม** (เต็ม) — ใส่ `?company_id=` เพื่อดูของ company ใด company หนึ่งได้ |
| non-admin | เห็น catalog เต็ม | **เห็นเฉพาะ product ที่ company ตัวเองเลือกไว้** (`status = active`) |
| non-admin (ยังไม่มี assignment) | เห็นเต็ม | **เห็นว่าง** |

- การ filter ทำที่ [`product/read.repository.ts`](../src/modules/manage/infrastructure/repositories/product/read.repository.ts) ด้วย `INNER JOIN company_products`
- **PR/PO ไม่ต้องแก้ logic** — ยัง join `products` เหมือนเดิม แค่หน้า dropdown เรียก `GET /api/products` ตามปกติ (scope ให้อัตโนมัติ)
- `GET /api/products/:id` (get one) **ไม่เปลี่ยน** — ยังดึงได้ทุกตัว

> ⚠️ **ความเสี่ยงตอน deploy:** เพราะ non-admin ไป `INNER JOIN company_products`
> ถ้ายังไม่รัน migration (ตารางยังไม่มี) → non-admin ยิง `/api/products` จะ **error 500**
> ต้อง **รัน migration ก่อน/พร้อม deploy** โค้ดนี้ (admin ไม่ join จึงไม่กระทบ)

---

## ไฟล์ที่เพิ่ม/แก้ (อ้างอิงโค้ด)

**เพิ่มใหม่ — vertical slice `company-product`**
- ORM: `src/common/infrastructure/database/typeorm/company-product.orm.ts`
- Domain: `domain/entities/company-product.entity.ts`, `domain/value-objects/company-product-id.vo.ts`,
  `domain/builders/company-product.builder.ts`,
  `domain/ports/output/company-product-repository.interface.ts`,
  `domain/ports/input/company-product-domain-service.interface.ts`
- Application: `application/dto/create/company-product/{create,update}.dto.ts`,
  `application/dto/query/company-product-query.dto.ts`,
  `application/dto/response/company-product.response.ts`,
  `application/mappers/company-product.mapper.ts`,
  `application/commands/company-product/**`, `application/queries/company-product/**`,
  `application/services/company-product.service.ts`,
  `application/providers/company-product/**`
- Infrastructure: `infrastructure/mappers/company-product.mapper.ts`,
  `infrastructure/repositories/company-product/{read,write}.repository.ts`
- Controller: `controllers/company-product.controller.ts`

**แก้ของเดิม**
- `common/infrastructure/database/index.ts` — register entity ใน models
- `typeorm/company.orm.ts`, `typeorm/product.orm.ts` — เพิ่ม `@OneToMany company_products`
- `application/constants/inject-key.const.ts` — inject keys ใหม่ 3 ตัว
- `application/providers/index.ts`, `infrastructure/module/manage.module.ts` — register provider + controller
- `application/dto/query/product-query.dto.ts` — เพิ่ม `company_id` (admin override)
- `domain/ports/output/product-repository.interface.ts`,
  `application/queries/product/handler/get-all.command.query.ts`,
  `infrastructure/repositories/product/read.repository.ts` — auto-scope product list ตาม auth

> หมายเหตุ i18n: handler ใช้ key ที่มีอยู่แล้ว (`errors.already_exists`, `errors.is_required`,
> `errors.forbidden`, `errors.must_be_number`) และ DTO ใช้ `validation.IS_NOT_EMPTY/IS_NUMBER/IS_ENUM/IS_ARRAY`
> → **ไม่ต้องเพิ่ม key ใหม่**

---

## Decisions & Non-goals (สรุป)

**Decisions**
- ใช้ join table แยก ไม่เพิ่ม `company_id` ใน `products` → product ยังเป็น catalog กลาง, product ตัวเดียวหลาย company ใช้ได้
- กันผูกซ้ำด้วย check ใน handler + partial unique index (`WHERE deleted_at IS NULL`)
- bulk assign ตัวซ้ำ → **ข้ามเงียบ** (idempotent) ไม่ throw
- scope ตาม auth role เหมือน document list isolation

**Non-goals**
- ไม่ทำ branch-level (`branch_products`) — งานนี้ระดับ company
- ไม่ทำ pricing/quota ต่อ company (มี `quota_company` แยก)
- create ปัจจุบัน **ไม่ atomic** (product ตัวท้าย fail ตัวก่อนหน้าไม่ rollback) — ถ้าต้องการ all-or-nothing ค่อยห่อ `manager.transaction`

---

## เช็คลิสต์ก่อนใช้งานจริง

1. `pnpm run migration:generate` → review ไฟล์ migration (ตาราง `company_products` + FK + partial unique index)
2. `pnpm run migration:run`
3. ทยอย assign product เข้าแต่ละ company ก่อนเปิดให้ non-admin ใช้หน้า product list
4. ทดสอบ: assign (array) / list (per role) / get / update status / unassign / กันซ้ำ / re-assign หลัง soft-delete
