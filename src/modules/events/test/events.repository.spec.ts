import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { LocationValidatorModule } from 'src/modules/travels/locationFormator/formator.module';
import { User, UserSchema } from 'src/modules/users/schemas/user.schema';
import { userStub } from 'src/modules/users/test/stubs/user.stubs';
import { UsersRepository } from 'src/modules/users/users.repository';
import { mongoConnectionMemory } from 'src/test/test.env';
import { EventsRepository } from '../events.repository';
import { EventSchema } from '../schemas/event.schema';

describe('EventsRepository', () => {
  let eventsRepository: EventsRepository;
  let userRepository: UsersRepository;

  beforeAll(async () => {
    const eventModel = mongoConnectionMemory.model(Event.name, EventSchema);
    const userModel = mongoConnectionMemory.model(User.name, UserSchema);

    const userModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(User.name),
          useValue: userModel,
        },
        UsersRepository,
      ],
    }).compile();

    userRepository = userModule.get<UsersRepository>(UsersRepository);

    const module: TestingModule = await Test.createTestingModule({
      imports: [LocationValidatorModule],
      providers: [EventsRepository, { provide: getModelToken(Event.name), useValue: eventModel }],
    }).compile();

    eventsRepository = module.get<EventsRepository>(EventsRepository);
  });

  let createdUser: User;

  beforeAll(async () => {
    // Create a user (we assume that the user repository works)
    createdUser = await userRepository.create(userStub());
  });

  it('should be defined', () => {
    expect(eventsRepository).toBeDefined();
  });

  it('should create an event', async () => {
    const event = await eventsRepository.createEvent(createdUser, {
      name: 'test',
      start_date: new Date(),
      end_date: new Date(),
    });
    expect(event).toBeDefined();
    expect(event.name).toBe('test');
    expect(event._id).toBeDefined();
  });
});
