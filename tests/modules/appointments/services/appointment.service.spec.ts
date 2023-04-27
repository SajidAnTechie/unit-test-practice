import { AppError } from '@/common/exceptions/appError';
import {
  createAppointment,
  deleteAppointmentById,
  getAppointmentById,
  getAppointmentsByUserId,
  updateAppointmentById
} from '@modules/appointments/repository/appointment.repository';
import * as AppointmentService from '@modules/appointments/services/appointment.service';
import { Appointment } from '@prisma/client';

jest.mock('@modules/appointments/repository/appointment.repository', () => {
  return {
    createAppointment: jest.fn(),
    deleteAppointmentById: jest.fn(),
    getAppointmentById: jest.fn(),
    getAppointmentsByUserId: jest.fn(),
    updateAppointmentById: jest.fn()
  };
});

describe('Create Appointment', () => {
  //arrange
  const createAppointmentDto = {
    title: 'John Doe',
    date: new Date(),
    appointmentBy: 'Jane Doe',
    appointmentFor: 'John Doe',
    isConfirmed: true,
    purpose: 'Annual checkup'
  };
  const payload: Appointment = {
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
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return created appointment json body', async () => {
    //arrange
    (
      createAppointment as jest.MockedFunction<typeof createAppointment>
    ).mockResolvedValue(Promise.resolve(payload));
    //act
    const appointment = await AppointmentService.createAppointment(
      createAppointmentDto
    );
    //assert
    expect(createAppointment).toHaveBeenCalled();
    expect(createAppointment).toHaveBeenCalledWith(createAppointmentDto);
    expect(appointment).toStrictEqual(payload);
  });

  it('should return bad request when appointment is null', async () => {
    (
      createAppointment as jest.MockedFunction<typeof createAppointment>
    ).mockResolvedValue(null as any);

    await expect(() =>
      AppointmentService.createAppointment(createAppointmentDto)
    ).rejects.toThrow();
    await expect(() =>
      AppointmentService.createAppointment(createAppointmentDto)
    ).rejects.toThrow(
      AppError.badRequest(`Error while creating the appointment.`)
    );
  });
});

describe('Get appointments by user id', () => {
  const appointmentIdOne = '643fb6ba6f37cd81bb1879bd';
  const appointmentIdTwo = '612ac9ea2c974d001f123456';
  const userId = '5f6d8a6b0a6aef0012345678';
  const payload: Appointment[] = [
    {
      id: appointmentIdOne,
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
      id: appointmentIdTwo,
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
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return appointments with given valid user id', async () => {
    (
      getAppointmentsByUserId as jest.MockedFunction<
        typeof getAppointmentsByUserId
      >
    ).mockResolvedValue(Promise.resolve(payload));

    const appointments = await AppointmentService.getUserCreatedAppointments({
      userId
    });
    expect(getAppointmentsByUserId).toHaveBeenCalled();
    expect(getAppointmentsByUserId).toHaveBeenCalledWith(
      userId,
      10,
      1,
      'id',
      'asc'
    );
    expect(appointments).toStrictEqual(payload);
  });

  it('should return bad request when appointment is null', async () => {
    (
      getAppointmentsByUserId as jest.MockedFunction<
        typeof getAppointmentsByUserId
      >
    ).mockResolvedValue(null as any);

    await expect(() =>
      AppointmentService.getUserCreatedAppointments({ userId })
    ).rejects.toThrow();
    await expect(() =>
      AppointmentService.getUserCreatedAppointments({ userId })
    ).rejects.toThrow(
      AppError.badRequest(`Error while fetching the appointments`)
    );
  });
});

describe('Get appointment by appointment id', () => {
  //arrange
  const appointmentId = '643fb6ba6f37cd81bb1879bd';
  const userId = '5f6d8a6b0a6aef0012345678';
  const payload: Appointment = {
    id: appointmentId,
    title: 'John Doe',
    date: new Date(),
    appointmentBy: userId,
    appointmentFor: 'John Doe',
    isConfirmed: true,
    purpose: 'Annual checkup',
    symptoms: '',
    isCancelled: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an appointment with given valid appointment id', async () => {
    (
      getAppointmentById as jest.MockedFunction<typeof getAppointmentById>
    ).mockResolvedValue(Promise.resolve(payload));

    const appointment = await AppointmentService.getAppointment(
      appointmentId,
      userId
    );
    expect(getAppointmentById).toHaveBeenCalled();
    expect(appointment).toStrictEqual(payload);
  });

  it('should return bad request when appointment is null', async () => {
    (
      getAppointmentById as jest.MockedFunction<typeof getAppointmentById>
    ).mockResolvedValue(null as any);

    await expect(() =>
      AppointmentService.getAppointment(appointmentId, userId)
    ).rejects.toThrow();
    await expect(() =>
      AppointmentService.getAppointment(appointmentId, userId)
    ).rejects.toThrow(
      AppError.notFound(
        `Appointment with Id ${appointmentId} could not be found.`
      )
    );
  });
});

describe('Update appointments by appointment id', () => {
  const appointmentId = '643fb6ba6f37cd81bb1879bd';
  const successMessage = `Appointment with Id ${appointmentId} has been updated successfully.`;
  const payload: Appointment = {
    id: appointmentId,
    title: 'John Doe',
    date: new Date(new Date().getTime() + 50 * 60 * 1000),
    appointmentBy: 'Jane Doe',
    appointmentFor: 'John Doe',
    isConfirmed: true,
    purpose: 'Annual checkup',
    symptoms: '',
    isCancelled: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  const updatedRecordsCount = {
    count: 10
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return updated appointments counts with given valid appointment id', async () => {
    (
      getAppointmentById as jest.MockedFunction<typeof getAppointmentById>
    ).mockResolvedValue(Promise.resolve(payload));

    (
      updateAppointmentById as jest.MockedFunction<typeof updateAppointmentById>
    ).mockResolvedValue(Promise.resolve(updatedRecordsCount));

    const msg = await AppointmentService.updateAppointment(
      appointmentId,
      payload
    );
    expect(getAppointmentById).toHaveBeenCalled();
    expect(getAppointmentById).toHaveBeenCalledWith(appointmentId);
    expect(updateAppointmentById).toHaveBeenCalled();
    expect(msg).toContain(successMessage);
  });

  it('should return bad request when appointment not found', async () => {
    (
      getAppointmentById as jest.MockedFunction<typeof getAppointmentById>
    ).mockResolvedValue(null as any);

    await expect(() =>
      AppointmentService.updateAppointment(appointmentId, payload)
    ).rejects.toThrow();
    await expect(() =>
      AppointmentService.updateAppointment(appointmentId, payload)
    ).rejects.toThrow(
      AppError.notFound(
        `Appointment with Id ${appointmentId} could not be found.`
      )
    );
  });

  it('should return bad request when unable to update an appointment', async () => {
    (
      getAppointmentById as jest.MockedFunction<typeof getAppointmentById>
    ).mockResolvedValue(Promise.resolve(payload));

    (
      updateAppointmentById as jest.MockedFunction<typeof updateAppointmentById>
    ).mockResolvedValue(null as any);

    await expect(() =>
      AppointmentService.updateAppointment(appointmentId, payload)
    ).rejects.toThrow();
    await expect(() =>
      AppointmentService.updateAppointment(appointmentId, payload)
    ).rejects.toThrow(
      AppError.badRequest(
        `Error while updating appointment with ID ${appointmentId}.`
      )
    );
  });
});

describe('Update appointment', () => {
  const appointmentId = '643fb6ba6f37cd81bb1879bd';
  const userId = '5f6d8a6b0a6aef0012345678';
  const successMessage = `Appointment with Id ${appointmentId} deleted successfully`;
  const deletedAppointmentRecordsCount = {
    count: 10
  };
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return deleted appointments counts with given valid appointment and user id', async () => {
    (
      deleteAppointmentById as jest.MockedFunction<typeof deleteAppointmentById>
    ).mockResolvedValue(Promise.resolve(deletedAppointmentRecordsCount));

    const msg = await AppointmentService.deleteAppointment(
      appointmentId,
      userId
    );
    expect(deleteAppointmentById).toHaveBeenCalled();
    expect(msg).toContain(successMessage);
  });

  it('should return bad request when appointment not found', async () => {
    (
      getAppointmentById as jest.MockedFunction<typeof getAppointmentById>
    ).mockResolvedValue(null as any);

    await expect(() =>
      AppointmentService.deleteAppointment(appointmentId, userId)
    ).rejects.toThrow();
    await expect(() =>
      AppointmentService.deleteAppointment(appointmentId, userId)
    ).rejects.toThrow(
      AppError.notFound(
        `There is no appointments available with Id ${appointmentId}. Please check the appointment Id.`
      )
    );
  });
});
