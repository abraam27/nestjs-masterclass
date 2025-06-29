import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserProvider } from './create-user.provider';
import { DataSource, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { MailService } from 'src/mail/providers/mail.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { BadRequestException } from '@nestjs/common';
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = (): MockRepository => ({
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
});

describe('CreateUserProvider', () => {
    let provider: CreateUserProvider;
    let usersRepository: MockRepository
    const user: User = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password',
    };
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CreateUserProvider,
                { provide: DataSource, useValue: {} },
                { provide: getRepositoryToken(User), useValue: createMockRepository() },
                { provide: HashingProvider, useValue: { hashPassword: jest.fn(() => 'password') } },
                { provide: MailService, useValue: { sendUserWelcomeMail: jest.fn(() => Promise.resolve()) } },
            ]
        }).compile();

        provider = module.get<CreateUserProvider>(CreateUserProvider);
        usersRepository = module.get(getRepositoryToken(User));

    });
    it('CreateUserProvider should be defined', () => {
        expect(provider).toBeDefined();
    });
    describe('createUser', () => {
        describe('when user does not exist', () => {
            it('should create user', async () => {
                usersRepository.findOne.mockResolvedValue(null);
                usersRepository.create.mockReturnValue(user);
                usersRepository.save.mockResolvedValue(user);
                const newUser = await provider.createUser(user);
                expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { email: user.email } });
                expect(usersRepository.create).toHaveBeenCalledWith(user);
                expect(usersRepository.save).toHaveBeenCalledWith(user);
                // expect(newUser).toEqual(user);
            });
        });
        describe('when user exists', () => {
            it('should throw BadRequestException', async () => {
                usersRepository.findOne.mockResolvedValue(user.email);
                usersRepository.create.mockReturnValue(user);
                usersRepository.save.mockResolvedValue(user); 
                try {
                    await provider.createUser(user);
                } catch (error) {
                    expect(error).toBeInstanceOf(BadRequestException);
                }
            });
        });
    });
});
