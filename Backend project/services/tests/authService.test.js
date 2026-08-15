const authService = require("../authService");
const db = require("../../config/db");

jest.mock("../../config/db");

describe("Auth Service", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });


    test("should register a new user", async () => {

        // First query: check existing email
        db.query
            .mockResolvedValueOnce([
                []
            ])
            // Second query: insert user
            .mockResolvedValueOnce([
                {
                    insertId: 20
                }
            ]);

        const userData = {
            name: "Test User",
            email: "test@gmail.com",
            password: "1234",
            role: "Student"
        };

        const result = await authService.registerUser(userData);

        expect(result).toEqual({
            id: 20,
            name: "Test User",
            email: "test@gmail.com",
            role: "Student"
        });

        expect(db.query).toHaveBeenCalledTimes(2);
    });


    test("should not register user with existing email", async () => {

        db.query.mockResolvedValueOnce([
            [
                {
                    id: 1,
                    email: "john@gmail.com"
                }
            ]
        ]);

        const userData = {
            name: "John",
            email: "john@gmail.com",
            password: "1234",
            role: "Student"
        };

        await expect(
            authService.registerUser(userData)
        ).rejects.toThrow("Email already exists");
    });


    test("should login user with correct credentials", async () => {

        const mockUser = {
            id: 1,
            name: "John",
            email: "john@gmail.com",
            password: "1234",
            role: "Admin"
        };

        db.query.mockResolvedValue([
            [mockUser]
        ]);

        const result = await authService.loginUser(
            "john@gmail.com",
            "1234"
        );

        expect(result).toEqual(mockUser);
    });


    test("should return undefined for invalid login", async () => {

        db.query.mockResolvedValue([
            []
        ]);

        const result = await authService.loginUser(
            "wrong@gmail.com",
            "wrongpassword"
        );

        expect(result).toBeUndefined();
    });

});