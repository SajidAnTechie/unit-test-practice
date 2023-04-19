import { 
    getExistingUser, 
    createUser, 
    fetchUser
  }  from "@modules/users/repository/user.repository";
import { User } from "@prisma/client";
import { prismaMock } from "../../../prismaTestSetup";

describe("Get a user by email", ()=> {
    it("should return user json body", async()=> {
        const email = "johndoe@example.com"
        const payload = {
            id: "12345",
            firstName: "John",
            lastName: "Doe",
            password: "1234",
            address: "123 Main Street",
            phoneNumber: "+1 (555) 555-5555",
            email: email,
            isActive: true,
            isVerified: false,
            createdAt: new Date(),
            updatedAt: new Date()
        } as User
        prismaMock.user.findUnique.mockResolvedValue(payload);
        const user = await getExistingUser(email);
        expect(user).toStrictEqual(payload)
    })
});

describe("Create a user", ()=> {
    it("should return created user json body", async()=> {
        const payload = {
            id: "12345",
            firstName: "John",
            lastName: "Doe",
            password: "1234",
            address: "123 Main Street",
            phoneNumber: "+1 (555) 555-5555",
            email:  "johndoe@example.com",
            isActive: true,
            isVerified: false,
            createdAt: new Date(),
            updatedAt: new Date()
        } as User
        prismaMock.user.create.mockResolvedValue(payload);
        const user = await createUser(payload);
        expect(user).toStrictEqual(payload)
    })
});

describe("Get users", ()=> {
    it("should return users json body", async()=> {
    const payload = 
    [
        {
            id: "12345",
            firstName: "John",
            lastName: "Doe",
            password: "1234",
            address: "123 Main Street",
            phoneNumber: "+1 (555) 555-5555",
            email:  "johndoe@example.com",
            isActive: true,
            isVerified: false,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: "98765",
            firstName: "Jane",
            lastName: "Smith",
            password: "abcd",
            address: "456 Elm Street",
            phoneNumber: "+1 (555) 123-4567",
            email: "jane.smith@example.com",
            isActive: true,
            isVerified: false,
            createdAt: new Date(),
            updatedAt: new Date()
          }
          
    ] as User[]
        prismaMock.user.findMany.mockResolvedValue(payload);
        const users = await fetchUser();
        expect(users).toStrictEqual(payload)
    })
});