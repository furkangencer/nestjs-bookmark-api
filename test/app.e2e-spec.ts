import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { prisma } from '@prisma/client';
import * as pactum from 'pactum';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto';

describe('App (e2e)', () => {
  const port = process.env.PORT || 3333;
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await app.listen(port);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();

    pactum.request.setBaseUrl(`http://localhost:${port}`);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'test@test.com',
      password: 'test123test',
    };
    describe('Signup', () => {
      it('should throw an error if email is empty', async () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });

      it('should throw an error if password is empty', async () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });

      it('should throw an error if body is empty', async () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });

      it('should throw an error if password is too short', async () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ email: dto.email, password: 'test' })
          .expectStatus(400);
      });

      it('should throw an error if email is not an email', async () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ email: 'test', password: dto.password })
          .expectStatus(400);
      });

      it('should signup a user', async () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });

      it('should throw an error if email is taken', async () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(403);
      });
    });

    describe('Signin', () => {
      it('should throw an error if email is empty', async () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });

      it('should throw an error if password is empty', async () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });

      it('should throw an error if body is empty', async () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });

      it('should throw an error if password is too short', async () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ email: dto.email, password: 'test' })
          .expectStatus(400);
      });

      it('should throw an error if email is not an email', async () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ email: 'test', password: dto.password })
          .expectStatus(400);
      });

      it('should signin a user', async () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('accessToken', 'accessToken');
        // .inspect()
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', async () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: `Bearer $S{accessToken}`,
          })
          .expectStatus(200);
      });

      it('should throw error if no accessToken is provided', async () => {
        return pactum.spec().get('/users/me').expectStatus(401);
      });

      it('should throw error if no user is found for provided accessToken', async () => {
        return pactum.spec().get('/users/me').expectStatus(401);
      });
    });

    describe('Edit user', () => {
      const dto: EditUserDto = {
        email: 'john@doe.com',
        firstName: 'John',
      };
      it('should edit user', async () => {
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: `Bearer $S{accessToken}`,
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.email)
          .expectBodyContains(dto.firstName);
      });
    });
  });

  // describe('Bookmark', () => {
  //   describe('Get bookmarks', () => {});

  //   describe('Get bookmark by id', () => {});

  //   describe('Create bookmark', () => {});

  //   describe('Edit bookmark by id', () => {});

  //   describe('Delete bookmark by id', () => {});
  // });
});
