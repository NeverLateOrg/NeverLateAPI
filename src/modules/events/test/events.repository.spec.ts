import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { GoogleModule } from 'src/modules/google/google.module';
import { UserSchema } from 'src/modules/users/schemas/user.schema';
import { userStub } from 'src/modules/users/test/stubs/user.stubs';
import { UsersRepository } from 'src/modules/users/users.repository';
import { mongoConnectionMemory } from 'src/test/test.env';
import { EventsRepository } from '../events.repository';
import { EventSchema, Event } from '../schemas/event.schema';
import { EventsService } from '../events.service';
import { User } from '../../users/schemas/user.schema';

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
      imports: [GoogleModule],
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
    const event = await eventsRepository.createLocalEvent(createdUser, {
      name: 'test',
      start_date: new Date(),
      end_date: new Date(),
    });
    expect(event).toBeDefined();
    expect(event.name).toBe('test');
    expect(event._id).toBeDefined();
  });

  it('should update the event and return the updated event', async () => {
    // Arrange
    const event = await eventsRepository.createLocalEvent(createdUser, {
      name: 'test',
      start_date: new Date(),
      end_date: new Date(),
    });

    const updatedEvent = {
      name: 'updated',
    };
    // make an update of event
    const updated = await eventsRepository.updateEvent(createdUser, event._id, updatedEvent);

    expect(updated.name).toStrictEqual('updated');
    expect(updated._id).toStrictEqual(event._id);
    expect(updated.start_date).toStrictEqual(event.start_date);
    expect(updated.end_date).toStrictEqual(event.end_date);
  });

  describe('getUserEvents', () => {
    it('should return an array of events for the given user', async () => {
      // Arrange
      const event1 = await eventsRepository.createLocalEvent(createdUser, {
        name: 'event1',
        start_date: new Date(),
        end_date: new Date(),
      });
      const event2 = await eventsRepository.createLocalEvent(createdUser, {
        name: 'event2',
        start_date: new Date(),
        end_date: new Date(),
      });
      const events = [event1, event2];

      const result = await eventsRepository.getUserEvents(createdUser);
      return result === events;
    });

    it('should return an empty array if no events are found for the given user', async () => {
      // Arrange
      jest.spyOn(eventsRepository, 'find').mockResolvedValueOnce([]);

      // Act
      const result = await eventsRepository.getUserEvents(createdUser);

      // Assert
      expect(eventsRepository.find).toHaveBeenCalledWith({ user: createdUser._id });
      expect(result).toEqual([]);
    });

    // Add more test cases to cover edge cases and potential errors
  });

  describe('EventService', () => {
    let eventService: EventsService;
    let mockEventModel: any;

    beforeEach(async () => {
      mockEventModel = {
        find: jest.fn(),
      };
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    // todo : to fix
    describe('getPreviousEventsOfEvent', () => {
      it('should return an empty array if there are no previous events', async () => {
        const mockUser = new User({
          email: 'test@test.com',
          firstName: 'John',
          lastName: 'Doe',
          passwordHash: 'password',
        });

        const mockEvent = new Event({
          user: mockUser,
          start_date: new Date('2022-04-20T14:00:00.000Z'),
          end_date: new Date('2022-04-20T15:00:00.000Z'),
        });
        jest.spyOn(mockEventModel, 'find').mockReturnValueOnce({
          sort: jest.fn().mockReturnValueOnce({
            limit: jest.fn().mockResolvedValueOnce([]),
          }),
        });

        const result = await eventService.getPreviousEventsOfEvent(mockEvent);

        expect(result).toEqual([]);
      });

      it('should return an array of events that occur before the given event', async () => {
        const mockUser = new User({
          email: 'test@test.com',
          firstName: 'John',
          lastName: 'Doe',
          passwordHash: 'password',
        });

        const mockEvent = new Event({
          user: mockUser,
          start_date: new Date('2022-04-20T14:00:00.000Z'),
          end_date: new Date('2022-04-20T15:00:00.000Z'),
        });

        const mockPrevEvent = new Event({
          user: mockUser,
          start_date: new Date('2022-04-19T14:00:00.000Z'),
          end_date: new Date('2022-04-19T15:00:00.000Z'),
        });
        jest.spyOn(mockEventModel, 'find').mockReturnValueOnce({
          sort: jest.fn().mockReturnValueOnce({
            limit: jest.fn().mockResolvedValueOnce([mockPrevEvent]),
          }),
        } as any);

        jest.spyOn(eventService, 'getSimultaneousEventsOfEvent').mockResolvedValueOnce([]);

        const result = await eventService.getPreviousEventsOfEvent(mockEvent);
        expect(result).toEqual([mockPrevEvent]);
      });

      it('should not return the given event in the array', async () => {
        const user = new User({
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          passwordHash: 'password123',
        });
        const mockEvent = new Event({
          user,
          start_date: new Date('2022-04-20T14:00:00.000Z'),
          end_date: new Date('2022-04-20T15:00:00.000Z'),
        });
        const mockPrevEvent = new Event({
          user,
          start_date: new Date('2022-04-19T14:00:00.000Z'),
          end_date: new Date('2022-04-19T15:00:00.000Z'),
        });
        jest.spyOn(mockEventModel, 'find').mockReturnValueOnce({
          sort: jest.fn().mockReturnValueOnce({
            limit: jest.fn().mockResolvedValueOnce([mockPrevEvent, mockEvent]),
          }),
        } as any);

        const result = await eventService.getPreviousEventsOfEvent(mockEvent);
        expect(result).not.toContain(mockEvent);
      });
      // write more tests here for different cases
    });

    describe('getNextEventsOfEvent', () => {
      it('should return the next event if there is one', async () => {
        const mockEvent = new Event({
          user: new User({
            email: 'test@test.com',
            firstName: 'John',
            lastName: 'Doe',
            passwordHash: 'testpasswordhash',
          }),
          start_date: new Date('2022-04-20T14:00:00.000Z'),
          end_date: new Date('2022-04-20T15:00:00.000Z'),
        });
        const mockNextEvent = new Event({
          user: new User({
            email: 'test@test.com',
            firstName: 'John',
            lastName: 'Doe',
            passwordHash: 'testpasswordhash',
          }),
          start_date: new Date('2022-04-20T15:00:00.000Z'),
          end_date: new Date('2022-04-20T16:00:00.000Z'),
        });
        jest.spyOn(mockEventModel, 'find').mockReturnValueOnce({
          sort: jest.fn().mockReturnValueOnce({
            limit: jest.fn().mockResolvedValueOnce([mockNextEvent]),
          }),
        });
        jest.spyOn(eventService, 'getSimultaneousEventsOfEvent').mockResolvedValueOnce([]);
        const result = await eventService.getNextEventsOfEvent(mockEvent);
        expect(result).toEqual([mockNextEvent]);
      });
      it('should return an empty array if the given event is the first event', async () => {
        const mockUser = new User({
          email: 'test@test.com',
          firstName: 'John',
          lastName: 'Doe',
          passwordHash: 'password',
        });

        const mockEvent = new Event({
          user: mockUser,
          start_date: new Date('2022-04-20T14:00:00.000Z'),
          end_date: new Date('2022-04-20T15:00:00.000Z'),
        });

        jest.spyOn(mockEventModel, 'find').mockReturnValueOnce({
          sort: jest.fn().mockReturnValueOnce({
            limit: jest.fn().mockResolvedValueOnce([]),
          }),
        } as any);

        const previousEvents = await eventService.getPreviousEventsOfEvent(mockEvent);

        expect(previousEvents).toEqual([]);
      });
    });

    describe('getSimultaneousEventsOfEvent', () => {
      it('should return an array of simultaneous events', async () => {
        const user = new User({
          email: 'test@test.com',
          firstName: 'John',
          lastName: 'Doe',
          passwordHash: 'password',
        });

        const event1 = new Event({
          user,
          start_date: new Date('2022-04-20T12:00:00.000Z'),
          end_date: new Date('2022-04-20T13:00:00.000Z'),
        });
        const event2 = new Event({
          user,
          start_date: new Date('2022-04-20T12:30:00.000Z'),
          end_date: new Date('2022-04-20T13:30:00.000Z'),
        });
        const event3 = new Event({
          user,
          start_date: new Date('2022-04-20T13:30:00.000Z'),
          end_date: new Date('2022-04-20T14:30:00.000Z'),
        });
        const event4 = new Event({
          user,
          start_date: new Date('2022-04-20T14:00:00.000Z'),
          end_date: new Date('2022-04-20T15:00:00.000Z'),
        });

        jest.spyOn(mockEventModel, 'find').mockReturnValueOnce({
          sort: jest.fn().mockReturnValueOnce({
            limit: jest.fn().mockResolvedValueOnce([event1, event2, event3, event4]),
          }),
        } as any);

        const simultaneousEvents = await eventService.getSimultaneousEventsOfEvent(event2);

        expect(simultaneousEvents).toEqual([event1, event2, event3]);
      });

      it('should return an empty array if there are no simultaneous events', async () => {
        const user = new User({
          email: 'test@test.com',
          firstName: 'John',
          lastName: 'Doe',
          passwordHash: 'password',
        });

        const event = new Event({
          user,
          start_date: new Date('2022-04-20T12:00:00.000Z'),
          end_date: new Date('2022-04-20T13:00:00.000Z'),
        });

        jest.spyOn(mockEventModel, 'find').mockReturnValueOnce({
          sort: jest.fn().mockReturnValueOnce({
            limit: jest.fn().mockResolvedValueOnce([event]),
          }),
        } as any);

        const simultaneousEvents = await eventService.getSimultaneousEventsOfEvent(event);

        expect(simultaneousEvents).toEqual([]);
      });
    });
  });
});
