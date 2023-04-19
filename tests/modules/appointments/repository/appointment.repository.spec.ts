import { 
  createAppointment, 
  deleteAppointmentById, 
  getAppointmentById, 
  getAppointmentsByUserId, 
  updateAppointmentById 
}  from "@modules/appointments/repository/appointment.repository";
import { Appointment } from "@prisma/client";
import { prismaMock } from "../../../prismaTestSetup";

describe("Create Appointment", ()=> {
  const createAppointmentMock = prismaMock.appointment.create;
  const payload = {
    id: "1",
    title: "John Doe",
    date: new Date(),
    appointmentBy: "Jane Doe",
    appointmentFor: "John Doe",
    isConfirmed: true,
    purpose: "Annual checkup",
    symptoms: "",
    isCancelled: false,
    createdAt: new Date(),
    updatedAt: new Date()
  } as Appointment

  it("should call appointment create function with parameters", async()=> {
    //arrange
    createAppointmentMock.mockResolvedValue(payload)
    //act
    await createAppointment(payload);
    //assert
    expect(createAppointmentMock).toBeCalledTimes(1);
    expect(createAppointmentMock).toHaveBeenCalledWith({ data: payload })
  });

  it("should return created appointment json body", async()=> {
    //arrange
    createAppointmentMock.mockResolvedValue(payload);
    //act
    const appointment = await createAppointment(payload);
    //assert
    expect(appointment).toStrictEqual(payload);
  });
});

describe("Get appointment by appointment id", ()=> {
  it("should return an appointment with given valid appointment id", async()=> {
    //arrange
    const appointmentId = '643fb6ba6f37cd81bb1879bd'
    const payload = {
      id: appointmentId,
      title: "John Doe",
      date: new Date(),
      appointmentBy: "Jane Doe",
      appointmentFor: "John Doe",
      isConfirmed: true,
      purpose: "Annual checkup",
      symptoms: "",
      isCancelled: false,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Appointment
    prismaMock.appointment.findUnique.mockResolvedValue(payload);
    //act
    const appointment = await getAppointmentById(appointmentId);
    //assert
    expect(appointment).toStrictEqual(payload);
  });
});

describe("Get appointments by user id", ()=> {
  it("should return appointments with given valid user id", async()=> {
    //arrange
    const appointmentIdOne = '643fb6ba6f37cd81bb1879bd';
    const appointmentIdTwo = '612ac9ea2c974d001f123456'
    const userId = '5f6d8a6b0a6aef0012345678';
    const payload = [
      {
      id: appointmentIdOne,
      title: "John Doe",
      date: new Date(),
      appointmentBy: "Jane Doe",
      appointmentFor: "John Doe",
      isConfirmed: true,
      purpose: "Annual checkup",
      symptoms: "",
      isCancelled: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: appointmentIdTwo,
      title: "Annual Physical Exam",
      date: new Date(),
      appointmentBy: "Mary Smith",
      appointmentFor: "John Smith",
      isConfirmed: true,
      purpose: "Routine checkup",
      symptoms: "",
      isCancelled: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }    
  ] as Appointment[]
    prismaMock.appointment.findMany.mockResolvedValue(payload);
    //act
    const appointment = await getAppointmentsByUserId(userId, 10, 1, 'title', 'asc');
    //assert
    expect(appointment).toStrictEqual(payload);
  });
});

describe("Update appointments by appointment id", ()=> {
  it("should return updated appointments counts with given valid appointment id", async()=> {
    //arrange
    const appointmentId = '643fb6ba6f37cd81bb1879bd'
    const payload = {
      id: appointmentId,
      title: "John Doe",
      date: new Date(),
      appointmentBy: "Jane Doe",
      appointmentFor: "John Doe",
      isConfirmed: true,
      purpose: "Annual checkup",
      symptoms: "",
      isCancelled: false,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Appointment
    const updatedBatchRecords = {
      count: 10
    }
    prismaMock.appointment.updateMany.mockResolvedValue(updatedBatchRecords);
    //act
    const appointment = await updateAppointmentById(appointmentId, payload);
    //assert
    expect(appointment).toStrictEqual(updatedBatchRecords);
  });
});

describe("Delete appointments by appointment and user id", ()=> {
  it("should return deleted appointments counts with given valid appointment and user id", async()=> {
    //arrange
    const appointmentId = '643fb6ba6f37cd81bb1879bd';
    const userId = '5f6d8a6b0a6aef0012345678';
    const deletedAppointmentRecordsCount = {
      count: 10
    }
    prismaMock.appointment.deleteMany.mockResolvedValue(deletedAppointmentRecordsCount);
    //act
    const appointment = await deleteAppointmentById(appointmentId, userId);
    //assert
    expect(appointment).toStrictEqual(deletedAppointmentRecordsCount);
  });
});