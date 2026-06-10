# Mail Send Window — ช่วงเวลารับอีเมลแจ้งอนุมัติของผู้ใช้

ฟีเจอร์ให้ผู้ใช้แต่ละคนตั้ง "ช่วงเวลาต่อวัน" ที่ยอมให้ระบบส่งอีเมลแจ้งอนุมัติ (เช่น `08:00–17:00`)
ถ้าถึงคิวต้องแจ้งผู้อนุมัติคนถัดไป **นอกช่วงเวลานี้** ระบบจะ **เลื่อนการส่ง** ไว้ก่อน แล้ว
ส่งให้อัตโนมัติเมื่อถึงช่วงเวลาที่อนุญาต

- **Base URL (dev):** `http://localhost:3000/api`
- **Base URL (prod):** ตามที่ฝั่ง backend ประกาศ
- **Timezone:** เวลาทั้งหมดตีความเป็นเวลาประเทศลาว (`Asia/Vientiane`, UTC+7)

> ## ⚠️ สถานะการ implement (อ่านก่อน)
>
> | ส่วน | สถานะ |
> | ---- | ----- |
> | เก็บค่า preference ใน DB (`user_mail_preferences`) | ✅ มีแล้ว |
> | ตรรกะ "อยู่นอกช่วง → เลื่อนส่ง → scheduler ส่งให้ทีหลัง" | ✅ มีแล้ว |
> | **REST API สำหรับ get/set ช่วงเวลา (หน้า Settings)** | ❌ **ยังไม่ได้ทำ** — ดูหัวข้อ [Proposed API](#proposed-api-สำหรับหน้า-settings) |
>
> ตอนนี้ค่า preference ถูกตั้งได้ทางตรง (seed / migration / DB เท่านั้น) ฝั่ง frontend
> **ยังเรียก API เพื่อแก้ค่าไม่ได้** จนกว่าจะ implement endpoint ตามสัญญาด้านล่าง
> หัวข้อ [Proposed API](#proposed-api-สำหรับหน้า-settings) เป็น **ข้อเสนอ contract** ไว้ให้ FE/BE
> ตกลงกันก่อนสร้างจริง — อย่าเพิ่งนำไปต่อ production จนกว่า backend จะ confirm

---

## ภาพรวม flow

```
ผู้อนุมัติคนปัจจุบันกด approve
          │
          ▼
[hal-erp API]  resolve "ผู้อนุมัติคนถัดไป" + ดู mail window ของเขา
          │
   ┌──────┴───────────────────────────┐
   │ อยู่ในช่วง (หรือไม่ได้ตั้งค่า)        │  อยู่นอกช่วง
   ▼                                  ▼
ส่งอีเมลทันที (เหมือนเดิม)         เก็บเป็น PENDING ไว้ใน DB
                                       │
                            ทุก ๆ 5 นาที (cron)
                                       ▼
                        เมื่อถึงช่วงเวลา → ส่งอีเมล + mark SENT
```

**ผลต่อ UX ที่ frontend ควรรู้:**
- ผู้ขอ/ผู้อนุมัติคนก่อนหน้า **ไม่เห็นความแตกต่าง** — การ approve สำเร็จทันทีเหมือนเดิม
  (การเลื่อนเป็นเรื่องของ "อีเมลแจ้งเตือนผู้อนุมัติคนถัดไป" เท่านั้น ไม่บล็อกการอนุมัติ)
- ผู้อนุมัติคนถัดไปที่ตั้ง window ไว้ อาจ **ได้รับอีเมลช้ากว่าเวลาที่เกิดเหตุการณ์จริง**
  สูงสุดประมาณ 1 รอบ cron (default 5 นาที) หลังช่วงเวลาเปิด
- ถ้าผู้ใช้ **ไม่ตั้งค่า** หรือ **ปิด** (`is_enabled = false`) → พฤติกรรมเหมือนระบบเดิมทุกอย่าง (ส่งทันที)

---

## Data model — `user_mail_preferences`

หนึ่งแถวต่อหนึ่ง user (unique `user_id`)

| field        | ชนิด           | required | คำอธิบาย                                                                 |
| ------------ | -------------- | -------- | ------------------------------------------------------------------------ |
| `id`         | int            | —        | primary key                                                              |
| `user_id`    | int            | yes      | id ของ user เจ้าของค่า (unique)                                           |
| `start_time` | string `HH:mm` | yes\*    | เวลาเริ่มรับอีเมล เช่น `"08:00"` (เก็บเป็น Postgres `time`)                 |
| `end_time`   | string `HH:mm` | yes\*    | เวลาสิ้นสุดรับอีเมล เช่น `"17:00"`                                          |
| `is_enabled` | boolean        | yes      | `true` = บังคับใช้ช่วงเวลา, `false` = ปิด (รับได้ตลอด)                       |
| `created_at` | datetime       | —        | สร้างเมื่อ                                                                |
| `updated_at` | datetime       | —        | แก้ไขล่าสุด                                                               |

\* `start_time` / `end_time` จำเป็นเมื่อ `is_enabled = true` เท่านั้น

### กฎ validation (สำคัญสำหรับ form ฝั่ง frontend)

1. รูปแบบเวลา: `HH:mm` หรือ `HH:mm:ss` (24 ชั่วโมง) — เช่น `08:00`, `17:30`
2. **ต้องเป็นช่วงภายในวันเดียวกัน:** `start_time <= end_time`
   (เช่น `08:00–17:00` ✅ / `22:00–06:00` ที่ข้ามเที่ยงคืน ❌ — ยังไม่รองรับ)
3. ขอบเขตเป็น **inclusive** ทั้งสองด้าน — `08:00` และ `17:00` ถือว่าอยู่ในช่วง
4. เวลาเทียบกับ timezone ลาว เสมอ (frontend ไม่ต้องแปลง — ส่งเป็น wall-clock ตามที่ user เลือก)

> **Fail-open:** ถ้าค่าผิดรูป/ข้ามเที่ยงคืน/ไม่ครบ ระบบฝั่ง backend จะถือว่า "ไม่จำกัด" (ส่งทันที)
> เพื่อกันไม่ให้อีเมลค้างถาวร — แต่ frontend ควร validate ตามกฎ 1–2 ก่อน submit อยู่ดี

---

## ตัวอย่าง timeline

ผู้อนุมัติคนถัดไปตั้งค่า `08:00–17:00`, `is_enabled = true`

| เหตุการณ์ approve เกิดเวลา | ผลลัพธ์                                              |
| ------------------------- | ---------------------------------------------------- |
| 10:30                     | ส่งอีเมล **ทันที**                                     |
| 17:00                     | ส่งอีเมล **ทันที** (ขอบเขต inclusive)                  |
| 22:15                     | เลื่อนไว้ → ส่งอัตโนมัติ **วันถัดไป ~08:00–08:05**       |
| 06:40                     | เลื่อนไว้ → ส่งอัตโนมัติ **~08:00–08:05 ของวันเดียวกัน** |

---

## Proposed API (สำหรับหน้า Settings)

> ❌ **ยังไม่ได้ implement** — เป็น contract ข้อเสนอเท่านั้น ออกแบบให้ล้อกับ pattern ของ `users` controller
> (`GET/PUT /users/:id/...`) เพื่อให้ implement ต่อได้ง่าย หากต้องการใช้งานจริง แจ้ง backend ให้สร้าง endpoint นี้ก่อน

ทุก endpoint ต้อง login: `Authorization: Bearer <JWT>`

### (ข้อเสนอ) ดึงค่าปัจจุบัน

```
GET /api/users/:id/mail-preference
```

**Response 200 — กรณีมีค่า**

```json
{
  "statusCode": 200,
  "data": {
    "user_id": 9,
    "start_time": "08:00",
    "end_time": "17:00",
    "is_enabled": true
  }
}
```

**Response 200 — กรณียังไม่เคยตั้งค่า** (frontend แสดงเป็น "ไม่จำกัด")

```json
{ "statusCode": 200, "data": null }
```

### (ข้อเสนอ) ตั้ง/แก้ค่า (upsert)

```
PUT /api/users/:id/mail-preference
```

**Request body**

```json
{
  "start_time": "08:00",
  "end_time": "17:00",
  "is_enabled": true
}
```

| field        | ชนิด    | required | คำอธิบาย                                            |
| ------------ | ------- | -------- | --------------------------------------------------- |
| `is_enabled` | boolean | yes      | เปิด/ปิดการจำกัดช่วงเวลา                              |
| `start_time` | string  | ถ้า enabled | `HH:mm` — จำเป็นเมื่อ `is_enabled = true`           |
| `end_time`   | string  | ถ้า enabled | `HH:mm` — ต้อง `>= start_time`                      |

**Error ที่คาดว่าจะมี (ข้อเสนอ)**

| HTTP | message                          | สาเหตุ                                  |
| ---- | -------------------------------- | --------------------------------------- |
| 400  | `Validation failed`              | รูปแบบเวลาไม่ถูกต้อง                      |
| 400  | `errors.invalid_mail_window`     | `start_time > end_time` (ข้ามเที่ยงคืน) |
| 401  | `errors.unauthorized`            | ไม่ได้ login                            |
| 404  | `errors.not_found` (`User ID: X`)| user ไม่มีอยู่จริง                      |

### (ข้อเสนอ) TypeScript (axios)

```ts
import axios from 'axios';

export interface MailPreference {
  start_time: string; // "08:00"
  end_time: string;   // "17:00"
  is_enabled: boolean;
}

export async function getMailPreference(userId: number, jwt: string) {
  const { data } = await axios.get(
    `${API_BASE_URL}/users/${userId}/mail-preference`,
    { headers: { Authorization: `Bearer ${jwt}` } },
  );
  return data.data as MailPreference | null;
}

export async function saveMailPreference(
  userId: number,
  pref: MailPreference,
  jwt: string,
) {
  const { data } = await axios.put(
    `${API_BASE_URL}/users/${userId}/mail-preference`,
    pref,
    { headers: { Authorization: `Bearer ${jwt}` } },
  );
  return data;
}
```

---

## คำแนะนำสำหรับ UI หน้า Settings

1. **Toggle "จำกัดเวลารับอีเมลแจ้งอนุมัติ"** = `is_enabled`
   - ปิด → ซ่อน/disable ช่อง start/end, ส่ง `is_enabled: false`
2. **Time picker 2 ช่อง** (start / end) แบบ 24 ชั่วโมง — validate `start <= end` ก่อน submit
3. แสดงข้อความช่วยเหลือ: *"นอกช่วงเวลานี้ อีเมลจะถูกส่งให้อัตโนมัติเมื่อถึงเวลาที่กำหนด"*
4. หมายเหตุ timezone ให้ผู้ใช้: *"อ้างอิงเวลาประเทศลาว"*
5. กรณี `data: null` (ยังไม่ตั้งค่า) → แสดง default toggle = ปิด (รับได้ตลอด)

---

## ENV ที่เกี่ยวข้อง (ฝั่ง backend — frontend ไม่ต้อง config)

| ตัวแปร              | ค่า default       | คำอธิบาย                                                       |
| ------------------- | ----------------- | -------------------------------------------------------------- |
| `PENDING_MAIL_CRON` | `0 */5 * * * *`   | cron ของ scheduler ที่ส่งอีเมลที่ถูกเลื่อน (ทุก 5 นาที)          |

---

## คำถามที่พบบ่อย

**Q: การเลื่อนอีเมล กระทบการ approve ไหม?**
A: ไม่กระทบ — การอนุมัติ commit สำเร็จทันที เลื่อนแค่ "อีเมลแจ้งผู้อนุมัติคนถัดไป" เท่านั้น

**Q: ถ้าผู้อนุมัติคนถัดไปมีหลายคน ใช้ window ของใคร?**
A: ใช้ของผู้อนุมัติ "คนหลัก" (คนแรกที่ resolve ได้) ของ step นั้น เป็นตัวตัดสินส่ง/เลื่อน

**Q: ตั้งช่วงข้ามเที่ยงคืน (เช่น 22:00–06:00) ได้ไหม?**
A: รอบนี้ **ยังไม่รองรับ** — frontend ควรบล็อกไว้ที่ form (กฎ validation ข้อ 2)
   ถ้าหลุดเข้าไป backend จะถือว่า "ไม่จำกัด" (ส่งทันที) เพื่อไม่ให้อีเมลค้าง

**Q: เปลี่ยนความถี่ในการส่ง pending ได้ไหม?**
A: ปรับที่ `PENDING_MAIL_CRON` ฝั่ง backend — ค่ายิ่งถี่ อีเมลที่เลื่อนยิ่งถูกส่งเร็วขึ้นหลังถึงเวลา
