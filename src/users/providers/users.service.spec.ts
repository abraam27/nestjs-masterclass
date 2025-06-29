import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersCreateManyService } from './users-create-many.service.service';
import { CreateUserProvider } from './create-user.provider';
import { FindOneUserByEmailProvider } from './find-one-user-by-email';
import { FindOneByGoogleIdProvider } from './find-one-by-google-id.provider';
import { CreateGoogleUserProvider } from './create-google-user.provider';
import { PaginationProvider } from 'src/common/pagination/providers/pagination-provider';
import { DataSource } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
describe('UsersService', () => {
    let service: UsersService;
    beforeEach(async () => {
        const mickCreateUserProvider: Partial<CreateUserProvider> = {
            createUser: (createUserDto: CreateUserDto) => {
                return Promise.resolve({
                    id: 1,
                    firstName: createUserDto.firstName,
                    lastName: createUserDto.lastName,
                    email: createUserDto.email,
                    password: createUserDto.password,
                })
            }
        }
        const module: TestingModule = await Test.createTestingModule({
            providers: [UsersService,
                { provide: DataSource, useValue: {} },
                {provide: getRepositoryToken(User), useValue: {}},
                { provide: UsersCreateManyService, useValue: {} },
                { provide: PaginationProvider, useValue: {} },
                { provide: CreateUserProvider, useValue: mickCreateUserProvider },
                { provide: FindOneUserByEmailProvider, useValue: {} },
                { provide: FindOneByGoogleIdProvider, useValue: {} },
                { provide: CreateGoogleUserProvider, useValue: {} },
            ]
        }).compile();

        service = module.get<UsersService>(UsersService);

    });

    it('UsersService should be defined', () => {
        expect(service).toBeDefined();      
    });  

    describe('createUser', () => {
        it('should be defined', () => {
            expect(service.createUser).toBeDefined();
        });
        it('should call createUser on createUserProvider', async () => {
            const createUserDto: CreateUserDto = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                password: 'password',
            };
            const user = await service.createUser(createUserDto);
            expect(user.firstName).toEqual("John");
        });
    });
});
