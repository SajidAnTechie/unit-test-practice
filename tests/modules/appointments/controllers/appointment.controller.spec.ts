import { Response, NextFunction, Request } from 'express';
import sinon from 'sinon';
import * as appointmentService from '@/modules/appointments/services/appointment.service';
import {
  createAppointment,
  deleteAppointment,
  getAppointment,
  getUserCreatedAppointments,
  updateAppointment
} from '@/modules/appointments/controllers/appointment.controller';
import { HttpCode } from '@/common/exceptions/appError';
import { Appointment } from '@prisma/client';
import { RequestWithUser } from '@/common/interfaces/express.interface';
import { Result } from '@/common/core/Result';

describe('getUserCreatedAppointments', () => {
  let appointmentServiceStub: sinon.SinonStub;
  let reqWithUser: RequestWithUser;
  let res: Response;
  let next: NextFunction;
  const appointments: Appointment[] = [
    {
      id: '1',
      title: 'John Doe',
      date: new Date(),
      appointmentBy: 'Jane Doe',
      appointmentFor: 'John Doe',
      isConfirmed: true,
      purpose: 'Annual checkup',
      symptoms: '',
      isCancelled: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      title: 'Annual Physical Exam',
      date: new Date(),
      appointmentBy: 'Mary Smith',
      appointmentFor: 'John Smith',
      isConfirmed: true,
      purpose: 'Routine checkup',
      symptoms: '',
      isCancelled: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const payload = Result.ok(appointments);
  beforeEach(() => {
    appointmentServiceStub = sinon.stub(
      appointmentService,
      'getUserCreatedAppointments'
    );
    appointmentServiceStub.resolves(appointments);
    reqWithUser = {
      user: { id: 'test_user_id' }
    } as unknown as RequestWithUser;
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    } as unknown as Response;
    next = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  test('it should return user created appointments successfully', async () => {
    await getUserCreatedAppointments(reqWithUser, res, next);
    sinon.assert.calledWith(res.status, HttpCode.OK);
    sinon.assert.calledWith(res.json, payload);
  });
});

describe('createAppointment', () => {
  let req: Request;
  let reqWithUser: RequestWithUser;
  let res: Response;
  let next: NextFunction;
  let appointmentServiceStub: sinon.SinonStub;
  const appointment: Appointment = {
    id: '1',
    title: 'John Doe',
    date: new Date(),
    appointmentBy: 'Jane Doe',
    appointmentFor: 'John Doe',
    isConfirmed: true,
    purpose: 'Annual checkup',
    symptoms: '',
    isCancelled: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  const payload = Result.ok(appointment);

  beforeEach(() => {
    req = {
      body: {
        title: 'Test Appointment'
      }
    } as Request;

    reqWithUser = {
      user: {
        title: 'John Doe',
        date: new Date(),
        appointmentBy: 'Jane Doe',
        appointmentFor: 'John Doe',
        isConfirmed: true,
        purpose: 'Annual checkup'
      }
    } as unknown as RequestWithUser;

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    } as unknown as Response;

    next = sinon.stub() as NextFunction;

    appointmentServiceStub = sinon.stub(
      appointmentService,
      'createAppointment'
    );

    appointmentServiceStub.resolves(appointment);
  });

  afterEach(() => {
    sinon.restore();
  });

  test('it should return created appointment with appointment dto', async () => {
    await createAppointment(reqWithUser, res, next);
    sinon.assert.calledWith(res.status, HttpCode.CREATED);
    sinon.assert.calledWith(res.json, payload);
  });
});

describe('getAppointment', () => {
  let reqWithUser: RequestWithUser;
  let res: Response;
  let next: NextFunction;
  let appointmentServiceStub: sinon.SinonStub;
  const appointment: Appointment = {
    id: '1',
    title: 'John Doe',
    date: new Date(),
    appointmentBy: '5f6d8a6b0a6aef0012345678',
    appointmentFor: 'John Doe',
    isConfirmed: true,
    purpose: 'Annual checkup',
    symptoms: '',
    isCancelled: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  const payload = Result.ok(appointment);

  beforeEach(() => {
    reqWithUser = {
      params: { id: '1' },
      user: { id: '123' }
    } as unknown as RequestWithUser;
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    } as Response;

    next = sinon.stub();
    appointmentServiceStub = sinon.stub(appointmentService, 'getAppointment');

    appointmentServiceStub.resolves(appointment);
  });

  afterEach(() => {
    sinon.restore();
  });

  test('it should return appointment with valid user id and appointment id', async () => {
    await getAppointment(reqWithUser, res, next);
    sinon.assert.calledWith(res.status, HttpCode.OK);
    sinon.assert.calledWith(res.json, payload);
  });
});

describe('deleteAppointment', () => {
  let reqWithUser: RequestWithUser;
  let res: Response;
  let next: NextFunction;
  let deleteAppointmentStub: sinon.SinonStub;
  const appointmentId = '643fb6ba6f37cd81bb1879bd';
  const successMessage = `Appointment with Id ${appointmentId} deleted successfully`;
  const payload = Result.ok(successMessage);

  beforeEach(() => {
    reqWithUser = {
      params: { id: '1' },
      user: { id: '123' }
    } as unknown as RequestWithUser;
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    } as Response;
    next = sinon.stub() as NextFunction;
    deleteAppointmentStub = sinon.stub(appointmentService, 'deleteAppointment');
    deleteAppointmentStub.resolves(successMessage);
  });

  afterEach(() => {
    sinon.restore();
  });

  test('it should return success when valid id given', async () => {
    await deleteAppointment(reqWithUser, res, next);
    sinon.assert.calledWith(res.status, HttpCode.OK);
    sinon.assert.calledWith(res.json, payload);
  });
});

describe('updateAppointment', () => {
  let reqWithUser: RequestWithUser;
  let res: Response;
  let next: NextFunction;
  let updateAppointmentStub: sinon.SinonStub;
  const appointmentId = '643fb6ba6f37cd81bb1879bd';
  const successMessage = `Appointment with Id ${appointmentId} has been updated successfully.`;
  const payload = Result.ok(successMessage);

  beforeEach(() => {
    reqWithUser = {
      params: { id: '1' },
      user: { id: '123' }
    } as unknown as RequestWithUser;
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    } as unknown as Response;
    next = sinon.stub() as NextFunction;
    updateAppointmentStub = sinon.stub(appointmentService, 'updateAppointment');
    updateAppointmentStub.resolves(successMessage);
  });

  afterEach(() => {
    sinon.restore();
  });

  test('it should return success message when valid appointment id and payload', async () => {
    await updateAppointment(reqWithUser, res, next);
    sinon.assert.calledWith(res.status, HttpCode.OK);
    sinon.assert.calledWith(res.json, payload);
  });
});
