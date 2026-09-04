# Week 8 CI/CD with GitHub Actions

## Student information

- Name: นายธนกฤต ชูเชิด
- Student ID: 66025694
- Repository: [faryporza/w8-cicd-66025694](https://github.com/faryporza/w8-cicd-66025694)

## Project overview

This repository contains a small Express application and an automated CI pipeline for Lab 8 of **225381 Application Development with Cloud Platform**.

The application provides:

- `GET /` → `Hello, Cloud Student! CI/CD is working.`
- `GET /health` → JSON health status
- Automated tests for the greeting endpoint, health endpoint and 404 behavior

## Run locally

Requirements: Node.js 20.x and npm.

```bash
npm install
npm test
npm start
```

Open <http://localhost:3000> after starting the server. Stop it with `Ctrl+C`.

## CI workflow

The workflow in [`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on:

- pushes to `main`
- pull requests targeting `main`

Each run checks out the commit, sets up Node.js 20, installs the locked dependencies with `npm ci`, and runs `npm test`. The workflow uses `contents: read` permission because the test job does not need write access.

## Green → Red → Green evidence

| Run | Commit | Result | Evidence |
| --- | --- | --- | --- |
| 1 | `feat: setup Node.js app, tests and CI workflow` | Green / Success | [Workflow Run #1](https://github.com/faryporza/w8-cicd-66025694/actions/runs/33857060156) |
| 2 | `Experiment: intentionally break greeting test` | Red / Failure | [Workflow Run #2](https://github.com/faryporza/w8-cicd-66025694/actions/runs/33857905926) |
| 3 | `Fix greeting test after failure experiment` | Green / Success | [Workflow Run #3](https://github.com/faryporza/w8-cicd-66025694/actions/runs/33863375362) |

### Failure diagnosis

The failed job was `test` and the failed step was `Run tests`. The test expected `Hello, Nina! This test should fail.`, but the application returned `Hello, Cloud Student! CI/CD is working.`. Jest reported `expect(received).toBe(expected)`, returned a non-zero exit code, and stopped later steps. The next commit restored the correct expected value and produced the recovery green run.

## Exit Ticket

1. **ส่วนใดคือ Continuous Integration?** ทุกครั้งที่ push หรือเปิด pull request ระบบจะ checkout code ติดตั้ง dependency และรัน automated tests โดยอัตโนมัติ นี่คือการรวมและตรวจสอบ code อย่างสม่ำเสมอ
2. **มี Continuous Delivery หรือ Continuous Deployment หรือไม่?** ยังไม่มี เพราะ workflow นี้ตรวจสอบและทดสอบ code เท่านั้น ยังไม่ได้ส่ง artifact ไป staging หรือ production
3. **Green pipeline ยืนยันอะไรได้บ้าง?** ยืนยันว่า steps ที่กำหนดและ tests ผ่านใน commit นั้น แต่ไม่ได้ยืนยัน production behavior, performance หรือ security ทั้งหมด
4. **ทำไมต้องสร้าง red pipeline?** เพื่อพิสูจน์ว่า quality gate ตรวจพบ regression และหยุด code ที่ผิดก่อนจะผ่านกระบวนการถัดไป
5. **ควรเพิ่ม stage ใดหาก test ผ่านแต่ app ใช้งานจริงไม่ได้?** เพิ่ม integration/end-to-end tests, deployment smoke test และ health-check หลัง deploy

## Lab Reflection

ก่อนทำแล็บ ผมเข้าใจว่า CI/CD เป็นเพียงคำสั่งที่ช่วย deploy code อัตโนมัติ หลังจากทำกิจกรรมนี้ ผมเห็นชัดว่า CI เริ่มตั้งแต่การ push code และใช้ automated test เป็น quality gate ก่อนให้การเปลี่ยนแปลงเดินหน้าต่อ สิ่งที่เห็นชัดที่สุดคือ pipeline สามารถเปลี่ยนจาก green เป็น red เมื่อ expected value ไม่ตรงกับ actual value และกลับมา green ได้หลังแก้สาเหตุ Step ที่สำคัญที่สุดคือ `Run tests` เพราะเป็นจุดที่ระบบตัดสินจากพฤติกรรมของ application ไม่ใช่เพียงตรวจว่าไฟล์มีอยู่ครบ ปัญหาครั้งนี้วิเคราะห์โดยเปิด log หา step แรกที่เป็นสีแดง เปรียบเทียบ expected กับ actual แล้วรัน `npm test` ซ้ำบนเครื่อง การทดลองนี้ทำให้เข้าใจว่า green run ยืนยันเฉพาะ checks ที่เรากำหนด ไม่ได้แปลว่า production ปลอดปัญหาทั้งหมด ลำดับถัดไปที่ผมต้องการเพิ่มคือ deployment smoke test ที่เรียก `/health` หลัง deploy เพื่อยืนยันว่า service เริ่มทำงานและตอบกลับได้จริง

## Security checklist

- No password, token, API key, private key or `.env` file is committed.
- `node_modules/` and logs are excluded by `.gitignore`.
- CI uses `npm ci` with the committed `package-lock.json`.
- Workflow permissions are limited to `contents: read`.
