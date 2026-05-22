# Approval Workflow — Email Approval API

API ใหม่ 2 ตัว สำหรับ flow "ส่งอีเมลให้ approver กดอนุมัติได้โดยไม่ต้อง login"

- **Base URL (dev):** `http://localhost:3000/api`
- **Base URL (prod):** ตามที่ฝั่ง backend ประกาศ
- **Auth header (เฉพาะ API ที่ต้อง login):** `Authorization: Bearer <JWT>`

---

## ภาพรวม flow

```
[Requester (web)]
       │  1. POST /approval-workflows/:id/send-approval-mail
       ▼
[hal-erp API]  ── enqueue ──▶  [hal-erp-approval] ── SMTP ──▶  [Approver email]
                                                                      │
                                                  คลิกปุ่มในเมล      │
                                                                      ▼
                            [Frontend approve page]  อ่าน query string token + approval_workflow_id
                                       │  2. POST /approval-workflows/approve-by-token
                                       ▼
                                [hal-erp API]  → update status = approved
```

ลิงก์ในอีเมลจะเป็นรูปแบบ:

```
${HAL_DOMAIN}/approve?token=<JWT>&approval_workflow_id=<id>
```

โดย `HAL_DOMAIN` ตั้งค่าฝั่ง **hal-erp-approval** (`.env`) — เช่น `https://erp.halgroup.la`
หน้า frontend ต้องอ่าน `token` และ `approval_workflow_id` จาก query string แล้ว POST ต่อไปยัง API #2

---

## 1. ส่งอีเมลให้ approver

ต้องเป็น user ที่ login แล้ว (ผู้ขอ) — ระบบจะ sign JWT, สร้าง approve URL, แล้วส่งอีเมลให้ approver

### Endpoint

```
POST /api/approval-workflows/:id/send-approval-mail
```

### Path params

| ชื่อ | ชนิด | คำอธิบาย                         |
| ---- | ---- | -------------------------------- |
| `id` | int  | id ของ approval_workflow ที่ pending |

### Headers

```
Authorization: Bearer <JWT ของ requester>
Content-Type: application/json
```

### Request body

```json
{
  "approver_user_id": 9,
  "description": "ขออนุมัติเร่งด่วนภายในวันนี้"
}
```

| field              | ชนิด   | required | คำอธิบาย                                                           |
| ------------------ | ------ | -------- | ------------------------------------------------------------------- |
| `approver_user_id` | int    | yes      | id ของ user ที่จะให้อนุมัติ (เลือกได้คนเดียวต่อหนึ่ง request)         |
| `description`      | string | no       | ข้อความเพิ่มเติม (เช่น เหตุผล/ความเร่งด่วน) — แสดงเป็นกล่อง "ໝາຍເຫດຈາກຜູ້ສະເໜີ" ในอีเมล |

**เงื่อนไข approver:**
- ต้องเป็น user ที่มีอยู่จริงและมี email
- ถ้า role เป็น `super-admin` หรือ `admin` → ผ่านได้โดยไม่ต้องอยู่ใน `company_users` ของบริษัทเดียวกับ workflow
- กรณีอื่นต้องเป็น `company_users` ของบริษัทเดียวกับ workflow

### Response 200/201 (success)

```json
{
  "statusCode": 201,
  "data": {
    "id": 35,
    "name": "ໃບເບີກຈ່າຍບໍລິຫານສູນ",
    "document_type_id": 1,
    "company_id": 1,
    "status": "pending",
    "created_at": "22-05-2026 14:00:00",
    "updated_at": "22-05-2026 14:00:00",
    "document_type": { ... },
    "company": { ... },
    "steps": [ ... ]
  }
}
```

อีเมลถูก enqueue ไป Redis queue ของ hal-erp-approval — API ตอบกลับทันที ไม่รอ SMTP

### Error responses

| HTTP | message                                       | สาเหตุ                                                          |
| ---- | --------------------------------------------- | ---------------------------------------------------------------- |
| 400  | `Validation failed`                           | `approver_user_id` ไม่ถูกต้องตาม class-validator                   |
| 400  | `errors.must_be_number`                       | `:id` ไม่ใช่ตัวเลข                                                |
| 400  | `errors.not_found` (`approver_email`)         | approver ไม่มี email                                              |
| 401  | `errors.unauthorized`                         | ไม่มี JWT ของ caller (ไม่ได้ login)                               |
| 404  | `errors.not_found` (`Approval Workflow ID: X`)| workflow id นี้ไม่มี                                              |
| 404  | `errors.not_found` (`User ID: Y`)             | approver_user_id ไม่มีอยู่จริง                                    |
| 403  | `errors.unauthorized` (`approver_user_id`)    | approver ไม่ใช่ super-admin/admin และไม่อยู่ใน company ของ workflow |
| 409  | `errors.already_approved`                     | workflow นี้ status ไม่ใช่ `pending` (อาจ approved ไปแล้ว)         |

### ตัวอย่างเรียกใช้

#### cURL

```bash
curl -X POST http://localhost:3000/api/approval-workflows/35/send-approval-mail \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"approver_user_id": 9, "description": "ขออนุมัติเร่งด่วน"}'
```

#### TypeScript (axios)

```ts
import axios from 'axios';

export async function sendApprovalMail(
  workflowId: number,
  approverUserId: number,
  jwt: string,
  description?: string,
) {
  const { data } = await axios.post(
    `${API_BASE_URL}/approval-workflows/${workflowId}/send-approval-mail`,
    {
      approver_user_id: approverUserId,
      ...(description ? { description } : {}),
    },
    { headers: { Authorization: `Bearer ${jwt}` } },
  );
  return data;
}
```

---

## 2. อนุมัติด้วย token จากอีเมล

**public endpoint** — ไม่ต้อง login ใช้ token จาก URL ในอีเมลแทน

### Endpoint

```
POST /api/approval-workflows/approve-by-token
```

### Headers

```
Content-Type: application/json
```

ไม่ต้องส่ง `Authorization`

### Request body

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "approval_workflow_id": 35
}
```

| field                  | ชนิด   | required | คำอธิบาย                                              |
| ---------------------- | ------ | -------- | ------------------------------------------------------ |
| `token`                | string | yes      | JWT จาก query string `?token=` ในลิงก์อีเมล              |
| `approval_workflow_id` | int    | yes      | id จาก query string `?approval_workflow_id=` ในลิงก์อีเมล |

**หมายเหตุ:** ฝั่ง backend จะตรวจว่า `approval_workflow_id` ใน body ตรงกับใน payload ของ token (anti-replay)

### Response 200/201 (success)

```json
{
  "statusCode": 201,
  "data": {
    "id": 35,
    "name": "ໃບເບີກຈ່າຍບໍລິຫານສູນ",
    "status": "approved",
    "updated_at": "22-05-2026 15:30:00",
    ...
  }
}
```

### Error responses

| HTTP | message                                | สาเหตุ                                                                                |
| ---- | -------------------------------------- | -------------------------------------------------------------------------------------- |
| 400  | `errors.bad_request` (`approval_workflow_id`) | `approval_workflow_id` ใน body ไม่ตรงกับใน token payload                                |
| 401  | `errors.unauthorized` (`token`)        | token signature ผิด / หมดอายุ / `purpose` ไม่ใช่ `approval-workflow-approve`              |
| 403  | `errors.unauthorized` (`approver_user_id`) | approver ที่ผูกกับ token หาไม่เจอ / ไม่อยู่ใน company / role ไม่มีสิทธิ์ (ไม่ใช่ super-admin/admin/company-admin) |
| 404  | `errors.not_found` (`Approval Workflow ID: X`) | workflow id นี้ไม่มี                                                                  |
| 409  | `errors.already_approved`              | workflow เคย approve ไปแล้ว — token ใช้ได้ครั้งเดียวเชิงตรรกะ                              |

### ตัวอย่างเรียกใช้

#### cURL

```bash
curl -X POST http://localhost:3000/api/approval-workflows/approve-by-token \
  -H "Content-Type: application/json" \
  -d '{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "approval_workflow_id": 35
  }'
```

#### TypeScript (axios) — สำหรับหน้า approve page

```ts
import axios from 'axios';
import { useSearchParams } from 'next/navigation'; // หรือ router ที่ใช้

export async function approveByToken(token: string, workflowId: number) {
  const { data } = await axios.post(
    `${API_BASE_URL}/approval-workflows/approve-by-token`,
    { token, approval_workflow_id: workflowId },
  );
  return data;
}

// ตัวอย่าง: หน้า /approve อ่าน query string แล้ว POST
// URL: /approve?token=<JWT>&approval_workflow_id=35

export function ApprovePage() {
  const params = useSearchParams();
  const token = params.get('token');
  const idStr = params.get('approval_workflow_id');

  const handleApprove = async () => {
    if (!token || !idStr) return alert('ลิงก์ไม่ถูกต้อง');
    try {
      await approveByToken(token, Number(idStr));
      // → แสดงหน้า "อนุมัติสำเร็จ"
    } catch (err) {
      // → แสดง error message ตามที่ map ไว้
    }
  };

  return <button onClick={handleApprove}>ຢືນຢັນ &amp; ອະນຸມັດ</button>;
}
```

---

## คำแนะนำสำหรับหน้า approve ของ frontend

1. **อ่าน query string ตอน mount หน้า:** `token` + `approval_workflow_id`
2. **อย่า auto-approve เมื่อ page load** — ให้ user กดปุ่มยืนยันก่อน (กัน link preview/email scanner กดอัตโนมัติ)
3. **แสดงรายละเอียด workflow ก่อน confirm** ถ้าต้องการ ให้ดึงข้อมูลผ่าน `GET /approval-workflows/:id` (แต่ endpoint นี้ require auth — สำหรับหน้า public approve อาจสร้าง endpoint สาธารณะแยกในอนาคต หรือพึ่งข้อมูลใน token payload)
4. **Map error code → ข้อความภาษา:**
   - 401 → "ลิงก์หมดอายุหรือไม่ถูกต้อง กรุณาขอลิงก์ใหม่"
   - 409 → "รายการนี้ถูกอนุมัติไปแล้ว"
   - 403 → "ท่านไม่มีสิทธิ์อนุมัติรายการนี้"
   - 404 → "ไม่พบรายการ"
5. **Success state:** redirect ไปหน้า dashboard หรือแสดง success page

---

## ENV ที่เกี่ยวข้อง (ฝั่ง backend — frontend ไม่ต้อง config)

**hal-erp** (`hal-erp/.env`)

| ตัวแปร                             | ค่า default | คำอธิบาย                                                  |
| ---------------------------------- | ----------- | ---------------------------------------------------------- |
| `APPROVAL_MAIL_TOKEN_SECRET`       | (required)  | secret สำหรับ sign JWT ของอีเมล                              |
| `APPROVAL_MAIL_TOKEN_EXPIRES_IN`   | `24h`       | อายุของ token (ใช้รูปแบบของ `ms` package)                     |
| `APPROVAL_API_URL`                 | (required)  | URL ของ hal-erp-approval service                            |
| `APPROVAL_SECRET_KEY`              | (required)  | x-secret-key สำหรับ hal-erp → hal-erp-approval               |

**hal-erp-approval** (`hal-erp-approval/.env`)

| ตัวแปร       | ค่า default | คำอธิบาย                                                  |
| ------------ | ----------- | ---------------------------------------------------------- |
| `HAL_DOMAIN` | (required)  | base URL ของ frontend ที่ใช้ประกอบลิงก์ในอีเมล (จะต่อด้วย `/approve`) |
| `MAIL_*`     | (required)  | SMTP credentials                                           |
| `API_SECRET_KEY` | (required) | ต้องตรงกับ `APPROVAL_SECRET_KEY` ของ hal-erp                |

---

## คำถามที่พบบ่อย

**Q: token ใช้ได้กี่ครั้ง?**
A: เชิงตรรกะใช้ได้ครั้งเดียว — หลังจาก approve สำเร็จ workflow จะเปลี่ยน status เป็น `approved` ทำให้การยิงซ้ำได้ 409

**Q: ถ้า user คลิกลิงก์ตอน token หมดอายุ?**
A: 401 `errors.unauthorized` — frontend ควรมีปุ่ม "ขอลิงก์ใหม่" ที่กลับไปแจ้ง requester (out of scope ของ 2 APIs นี้)

**Q: เปลี่ยน approver ระหว่างทางได้ไหม?**
A: ส่ง `POST /:id/send-approval-mail` ใหม่ด้วย `approver_user_id` คนใหม่ — token เก่ายังใช้ได้จนกว่าจะหมดอายุหรือ workflow ออกจาก pending (ในรอบนี้ยังไม่มีกลไก revoke token ก่อนเวลา)
