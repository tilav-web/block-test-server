<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# Blok Test API

Bu API Subject, Test va Option modellarini boshqarish uchun yaratilgan. Modellar o'rtasida bog'lanishlar va cascade deletion qo'llab-quvvatlanadi.

## Authentication va Authorization

### Foydalanuvchi Turlari
- **STUDENT** - Faqat ma'lumotlarni o'qish huquqiga ega
- **ADMIN** - Barcha amallarni bajarish huquqiga ega

### Huquqlar
- **O'qish amallari (GET)** - Login qilgan barcha foydalanuvchilar
- **Yozish amallari (POST, PATCH, DELETE)** - Faqat ADMIN rolidagi foydalanuvchilar

## Modellar va Bog'lanishlar

### Subject
- **Asosiy model** - barcha testlar subject ga bog'langan
- Subject o'chirilganda, unga bog'langan barcha testlar va ularning optionlari ham o'chiriladi

### Test
- Subject ga bog'langan
- Bir nechta optionlarga ega
- Test o'chirilganda, unga bog'langan barcha optionlar ham o'chiriladi

### Option
- Test ga bog'langan
- Har bir test bir nechta optionlarga ega
- Bitta option to'g'ri javob sifatida belgilangan

## API Endpoints

### Authentication
Avval tizimga kirish kerak:
```bash
POST /auth/login
{
  "email": "user@example.com",
  "password": "password"
}
```

### Subject Endpoints

#### POST /subjects (ADMIN only)
Yangi subject yaratish
```json
{
  "name": "Matematika"
}
```

#### GET /subjects (Login required)
Barcha subjectlarni olish

#### GET /subjects/:id (Login required)
Bitta subjectni ID bo'yicha olish

#### PATCH /subjects/:id (ADMIN only)
Subjectni yangilash
```json
{
  "name": "Yangi Matematika"
}
```

#### DELETE /subjects/:id (ADMIN only)
Subjectni o'chirish (cascade deletion bilan)

### Test Endpoints

#### POST /tests (ADMIN only)
Yangi test yaratish
```json
{
  "subject": "64f1a2b3c4d5e6f7g8h9i0j1",
  "question": "2 + 2 = ?",
  "type": "text",
  "options": ["64f1a2b3c4d5e6f7g8h9i0j2", "64f1a2b3c4d5e6f7g8h9i0j3", "64f1a2b3c4d5e6f7g8h9i0j4"],
  "correctOptionId": "64f1a2b3c4d5e6f7g8h9i0j2"
}
```

#### GET /tests (Login required)
Barcha testlarni olish (populated)

#### GET /tests/subject/:subjectId (Login required)
Ma'lum subject ga bog'langan testlarni olish

#### GET /tests/:id (Login required)
Bitta testni ID bo'yicha olish

#### PATCH /tests/:id (ADMIN only)
Testni yangilash

#### DELETE /tests/:id (ADMIN only)
Testni o'chirish (cascade deletion bilan)

### Option Endpoints

#### POST /options (ADMIN only)
Yangi option yaratish
```json
{
  "type": "text",
  "test": "64f1a2b3c4d5e6f7g8h9i0j1",
  "value": "4"
}
```

#### GET /options (Login required)
Barcha optionlarni olish

#### GET /options/test/:testId (Login required)
Ma'lum test ga bog'langan optionlarni olish

#### GET /options/:id (Login required)
Bitta optionni ID bo'yicha olish

#### PATCH /options/:id (ADMIN only)
Optionni yangilash

#### DELETE /options/:id (ADMIN only)
Optionni o'chirish

## Cascade Deletion

### Subject o'chirilganda:
1. Subject ga bog'langan barcha testlar o'chiriladi
2. Bu testlarga bog'langan barcha optionlar o'chiriladi

### Test o'chirilganda:
1. Test ga bog'langan barcha optionlar o'chiriladi

## Test Types
- `text` - matnli savol
- `file` - fayl bilan savol
- `url` - URL bilan savol

## Option Types
- `text` - matnli javob
- `file` - fayl bilan javob
- `url` - URL bilan javob

## O'rnatish

```bash
npm install
npm run start:dev
```

## Muhim Eslatmalar

1. **Authentication** - Barcha endpointlar uchun login qilish talab qilinadi
2. **Authorization** - Yozish amallari uchun ADMIN roli talab qilinadi
3. Subject yaratishdan oldin test yaratish mumkin emas
4. Test yaratishdan oldin optionlar yaratilishi kerak
5. Test yaratishda `correctOptionId` mavjud option ID si bo'lishi kerak
6. Cascade deletion avtomatik ishlaydi

## Xatolik Xabarlari

- `401 Unauthorized` - Login qilmagan yoki token yaroqsiz
- `403 Forbidden` - Yetarli huquqlar yo'q (ADMIN emas)
- `404 Not Found` - Ma'lumot topilmadi
