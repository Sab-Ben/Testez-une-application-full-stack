import { Session } from '../../src/app/features/sessions/interfaces/session.interface';
import { SessionInformation } from '../../src/app/interfaces/sessionInformation.interface';
import { Teacher } from '../../src/app/interfaces/teacher.interface';
import { User } from "../../src/app/interfaces/user.interface";


export const userMock: User = {
  id: 1,
  email: 'mock@test.com',
  lastName: 'Test',
  firstName: 'Toto',
  admin: false,
  password: '15973',
  createdAt: new Date(),
};

export const userSession: SessionInformation = {
  token: 'token',
  type: 'Bearer',
  id: 1,
  username: 'admin',
  firstName: 'admin',
  lastName: 'admin',
  admin: true,
};

export const teacherMock: Teacher = {
  id: 1,
  lastName: 'Ben',
  firstName: 'Sab',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const sessions: Session[] = [
  {
    id: 1,
    name: 'Session 1',
    description: 'Lorem ipsum dolor sit amet. ' +
        'Est incidunt omnis aut tenetur quasi ut ullam autem qui sunt iure. ' +
        'sed impedit quia id fuga galisum. Eum rerum doloribus quo ' +
        'dolorem culpa est rerum voluptas aut voluptas temporibus aut dolorem minima?',
    date: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    teacher_id: 1,
    users: [1, 2, 3],
  },
  {
    id: 2,
    name: 'Session 2',
    description: 'Lorem ipsum dolor sit amet. ' +
        'Non dicta assumenda qui nobis itaque id nostrum illum sit ' +
        'omnis excepturi id earum quidem aut assumenda provident rem laborum adipisci. ' +
        'Sed numquam sunt aut rerum atque qui dolorem voluptatibus non autem labore ' +
        'At laudantium tempore aut eius atque sed deserunt animi.',
    date: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    teacher_id: 1,
    users: [1, 2, 4],
  },
];
