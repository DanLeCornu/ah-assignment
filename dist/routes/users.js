"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const user_schema_1 = require("../schemas/user.schema");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
exports.userRouter = router;
const prisma = new client_1.PrismaClient();
// CREATE USER
router.post("/", async (req, res) => {
    try {
        const _a = user_schema_1.createUserSchema.parse(req.body), { categories } = _a, data = __rest(_a, ["categories"]);
        const user = await prisma.user.create({
            data: Object.assign(Object.assign({}, data), { categories: {
                    connectOrCreate: categories.map((categoryCode) => ({
                        where: { code: categoryCode },
                        create: { code: categoryCode },
                    })),
                } }),
        });
        res.status(201).json(user);
    }
    catch (error) {
        // VALIDATION ERROR
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({
                error: "Validation error",
                details: error.errors,
            });
            return;
        }
        // ELSE, GENERAL SERVER ERROR
        res.status(500).json({
            error: "Internal server error",
        });
    }
});
// GET ALL USERS
router.get("/", async (_req, res) => {
    try {
        const users = await prisma.user.findMany({ include: { categories: true } });
        // Format the response to simplify categories
        const formattedUsers = users.map((user) => (Object.assign(Object.assign({}, user), { categories: user.categories.map((category) => category.code) })));
        res.json({ users: formattedUsers });
    }
    catch (_error) {
        res.status(500).json({
            error: "Internal server error",
        });
    }
});
