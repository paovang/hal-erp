# Company Product & Company Vendor — เลือกจาก master กลางมาผูกใช้ต่อ company

สองฟีเจอร์คู่กันที่ใช้แนวคิดเดียวกัน: ข้อมูล master เป็นของกลาง (แชร์ทุก company) แล้วแต่ละ company
"เลือก (assign)" รายการมาผูกใช้งานของตัวเองผ่าน join table

| ฟีเจอร์ | master กลาง | join table | endpoint |
| ------- | ----------- | ---------- | -------- |
| **Company Product** | `products` (catalog) | `company_products` | `/api/company-products` |
| **Company Vendor**  | `vendors` (master)  | `company_vendors`  | `/api/company-vendors`  |

- **Base URL (dev):** `http://localhost:3000/api`
- **Base URL (prod):** ตามที่ฝั่ง backend ประกาศ
- **Auth:** ทุก endpoint ต้องมี JWT — การ scope ตาม company อิงจาก auth user
- **Timezone:** วันเวลาใน response ตีความเป็นเวลาประเทศลาว (`Asia/Vientiane`, UTC+7)

> ## ✅ สถานะการ implement
>
> | ส่วน | Company Product | Company Vendor |
> | ---- | --------------- | -------------- |
> | DDD/CQRS vertical slice ครบทุก layer | ✅ | ✅ |
> | REST API CRUD | ✅ | ✅ |
> | Company isolation จาก auth | ✅ | ✅ |
> | build + lint | ✅ ผ่าน | ✅ ผ่าน |
> | **Migration สร้างตาราง** | ⛔ ยังไม่รัน | ⛔ ยังไม่รัน |
> | ทดสอบ endpoint จริง (manual) | ⛔ รอ DB | ⛔ รอ DB |
>
> spec: [company-product-catalog](../../openspec/specs/company-product-catalog/spec.md) · [company-vendor-onboarding](../../openspec/specs/company-vendor-onboarding/spec.md)

---

## ภาพรวมแนวคิด (เหมือนกันทั้งสอง)

```
[ master กลาง ]   products / vendors  (สร้าง/แก้ที่เดิม ไม่มี company_id)
       ▲
       │  เลือกมาใช้ (assign)
       │
[ join table ]    company_products / company_vendors  (company_id + ref_id + status + ...)
       │
       ▼
[ companies ]     แต่ละ company มีชุดของตัวเอง
```

- master 1 ตัว **หลาย company เลือกใช้ได้** (many-to-many)
- 1 คู่ `(company_id, ref_id)` ที่ยังไม่ถูกลบ มีได้ **เพียงรายการเดียว** (กันผูกซ้ำ)
- การ unassign = **soft delete** (เก็บประวัติ) และ re-assign ใหม่ได้

---

## การ scope ตาม company (เหมือนกันทั้งสอง — สำคัญ)

อิง role จาก auth user (resolve company จาก `CompanyUserOrmEntity`) — pattern เดียวกับ document list isolation:

| role | assign (POST) | list (GET) |
| ---- | ------------- | ---------- |
| `super-admin` / `admin` | **ต้องระบุ** `company_id` ใน body | เห็น **ทุก company** (ไม่ scope) |
| อื่น ๆ (non-admin) | ใช้ company ของตัวเองอัตโนมัติ — `company_id` ใน body ถูก **ignore** | เห็นเฉพาะของ **company ตัวเอง** |
| non-admin ที่ไม่มี company | ❌ `403 forbidden` | ได้ผลลัพธ์ **ว่าง** (fail-safe) |

**Error ที่ใช้ร่วมกัน:** `400 is_required` (admin ไม่ส่ง company_id) · `403 forbidden` (non-admin ไม่มี company) ·
`404` (ref/company ไม่มีอยู่) · `409 already_exists` (ผูกซ้ำ)

---

## Data models

### `company_products`

| field | ชนิด | required | คำอธิบาย |
| ----- | ---- | -------- | -------- |
| `id` | int | — | primary key |
| `company_id` | int | yes | FK → `companies.id` |
| `product_id` | int | yes | FK → `products.id` |
| `status` | enum `active`/`inactive` | yes | default `active` |
| timestamps + `deleted_at` | | — | soft delete |

Index: partial unique `(company_id, product_id) WHERE deleted_at IS NULL`

### `company_vendors`

| field | ชนิด | required | คำอธิบาย |
| ----- | ---- | -------- | -------- |
| `id` | bigint | — | primary key |
| `company_id` | bigint | yes | FK → `companies.id` |
| `vendor_id` | bigint | yes | FK → `vendors.id` |
| `status` | enum `active`/`inactive` | yes | default `active` |
| `credit_term_days` | int | — | เครดิตเทอม (วัน) default `0` |
| `credit_limit` | decimal(18,2) | — | วงเงินเครดิต default `0` |
| `payment_term` | varchar(255) | — | เงื่อนไขการชำระ (nullable) |
| timestamps + `deleted_at` | | — | soft delete |

> ความต่างหลัก: **company-vendor มี credit terms ต่อ company** (`credit_term_days`, `credit_limit`, `payment_term`)

---

## API — Company Product (`/api/company-products`)

### Assign products เข้า company (รองรับ **array**)

```
POST /api/company-products
```

```json
{
  "product_ids": [1, 2, 3],
  "status": "active",      // optional, default active
  "company_id": 5          // admin/super-admin เท่านั้น
}
```

- assign หลาย product พร้อมกัน (dedupe ให้), product ที่เลือกไว้แล้ว → **ข้าม** (idempotent)
- คืน **array เฉพาะรายการที่สร้างใหม่จริง**

### endpoint อื่น

| method | path | หมายเหตุ |
| ------ | ---- | -------- |
| `GET` | `/api/company-products` | list (scoped) — query: `page,limit,search,company_id,product_id,status` |
| `GET` | `/api/company-products/:id` | ดูรายการเดียว |
| `PUT` | `/api/company-products/:id` | แก้ไข (ส่วนใหญ่เปลี่ยน `status`) |
| `DELETE` | `/api/company-products/:id` | unassign (soft delete) |

---

## API — Company Vendor (`/api/company-vendors`)

### Assign vendor เข้า company (**ทีละรายการ** + credit terms)

```
POST /api/company-vendors
```

```json
{
  "vendor_id": 7,
  "status": "active",         // optional, default active
  "credit_term_days": 30,     // optional
  "credit_limit": 1000000,    // optional
  "payment_term": "Net 30",   // optional
  "company_id": 5             // admin/super-admin เท่านั้น
}
```

- assign **ทีละ vendor** (ไม่ทำ array) เพราะ credit terms ต่างกันรายตัว
- ผูกซ้ำ `(company_id, vendor_id)` → `409 already_exists`
- คืน record เดียวที่สร้าง (มี nested `company`/`vendor`)

### endpoint อื่น

| method | path | หมายเหตุ |
| ------ | ---- | -------- |
| `GET` | `/api/company-vendors` | list (scoped) — query: `page,limit,search,company_id,vendor_id,status` |
| `GET` | `/api/company-vendors/:id` | ดูรายการเดียว |
| `PUT` | `/api/company-vendors/:id` | แก้ไข (`status`, `credit_term_days`, `credit_limit`, `payment_term`) |
| `DELETE` | `/api/company-vendors/:id` | unassign (soft delete) |

> เมธอดเสริม `findActiveByCompanyAndVendor(companyId, vendorId)` ใน read repo — ใช้ gate การเลือก vendor
> บนเอกสารของ company (ยังไม่ได้นำไป wire กับ PR/PO ในงานนี้)

---

## เปรียบเทียบสองฟีเจอร์

| หัวข้อ | Company Product | Company Vendor |
| ------ | --------------- | -------------- |
| assign แบบ array | ✅ (`product_ids[]`) | ❌ ทีละรายการ |
| field เพิ่มเติม | — | credit_term_days, credit_limit, payment_term |
| ผูกซ้ำ → | ข้ามเงียบ (idempotent) | `409` error |
| company scope (list/assign) | auth-based | auth-based (เหมือนกัน) |
| soft delete / re-assign | ✅ | ✅ |

---

## ผลกระทบต่อ `GET /api/products` (เฉพาะฝั่ง product)

เพื่อให้ "ตอนเลือก product (เช่น dropdown ใน PR/PO) เห็นเฉพาะของ company ตัวเอง" endpoint **เดิม**
`GET /api/products` ถูกปรับให้ **auto-scope ตาม company ที่ user สังกัด**:

| ผู้เรียก | ก่อน | หลัง |
| -------- | ---- | ---- |
| `admin` / `super-admin` | เห็น catalog เต็ม | เหมือนเดิม — ใส่ `?company_id=` เพื่อดูของ company ใด company หนึ่งได้ |
| non-admin | เห็น catalog เต็ม | เห็นเฉพาะ product ที่ company ตัวเองเลือกไว้ (`status = active`) |
| non-admin (ยังไม่มี assignment) | เห็นเต็ม | เห็นว่าง |

- `GET /api/products/:id` (get one) **ไม่เปลี่ยน**
- **PR/PO ไม่ต้องแก้ logic** — ยัง join `products` เหมือนเดิม
- ⚠️ เพราะ non-admin ไป `INNER JOIN company_products` — **ต้องรัน migration ก่อน deploy** ไม่งั้น non-admin
  ยิง `/api/products` จะ error 500 (ตารางยังไม่มี)

> หมายเหตุ: ฝั่ง **vendor ยังไม่มี** auto-scope endpoint master (`GET /api/vendors`) แบบเดียวกับ product —
> ถ้าต้องการให้เลือก vendor เห็นเฉพาะของ company ค่อยเพิ่มภายหลัง (ปัจจุบันใช้ `GET /api/company-vendors` แทน)

---

## เช็คลิสต์ก่อนใช้งานจริง (ทั้งสองฟีเจอร์)

1. `pnpm run migration:generate` → review (ตาราง `company_products` + `company_vendors` + FK + partial unique index)
2. `pnpm run migration:run`
3. ทยอย assign product/vendor เข้าแต่ละ company ก่อนเปิดให้ non-admin ใช้
4. ทดสอบ: assign (per role) / list (scoped) / get / update / unassign / กันซ้ำ / re-assign หลัง soft-delete

---

## โครงไฟล์ (อ้างอิงโค้ด)

ทั้งสองฟีเจอร์เป็น vertical slice แบบเดียวกัน (`company-product` เป็นแม่แบบของ `company-vendor`):

```
common/infrastructure/database/typeorm/{company-product,company-vendor}.orm.ts
modules/manage/domain/{entities,builders,value-objects}/company-{product,vendor}*
modules/manage/domain/ports/{input,output}/company-{product,vendor}-*.interface.ts
modules/manage/application/dto/{create,query,response}/company-{product,vendor}*
modules/manage/application/mappers/company-{product,vendor}.mapper.ts
modules/manage/application/{commands,queries}/company-{product,vendor}/**
modules/manage/application/services/company-{product,vendor}.service.ts
modules/manage/application/providers/company-{product,vendor}/**
modules/manage/infrastructure/mappers/company-{product,vendor}.mapper.ts
modules/manage/infrastructure/repositories/{company-product,companyVendor}/{read,write}.repository.ts
modules/manage/controllers/company-{product,vendor}.controller.ts
```

register ใน: `common/infrastructure/database/index.ts` (models), `application/providers/index.ts`,
`infrastructure/module/manage.module.ts`, `application/constants/inject-key.const.ts`
