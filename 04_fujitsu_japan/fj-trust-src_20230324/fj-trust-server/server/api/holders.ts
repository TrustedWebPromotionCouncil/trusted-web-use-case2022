import { PrismaClient } from '@prisma/client';
import { Router, Request, Response } from 'express';

const prisma = new PrismaClient();
const router = Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

// GET /holders
router.get('/', async (req: Request, res: Response) => {
    console.log('[get:/api/holders/]')
    try {
        const holders = await prisma.holder.findMany();
        res.json(holders);
    } catch (e) {
        res.status(400).json(e);
    }
});

// GET /holders/:id
router.get('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    console.log('[get:/api/holders/:id]' + id)
    try {
        const holder = await prisma.holder.findUnique({
            where: {
                id,
            },
        })
        res.json(holder);
    } catch (e) {
        res.status(400).json(e);
    }
});

// POST /holders
router.post('/', async (req: Request, res: Response) => {
    const { email, name, password, description } = req.body;
    console.log('[post:/api/holders/]{%j}', req.body)
    const hassedPassword = bcrypt.hashSync(password, saltRounds)
    try {
        const holder = await prisma.holder.create({
            data: {
                email,
                password: hassedPassword,
                name,
                description,
            },
        });
        res.json(holder);
    } catch (e) {
        res.status(400).json(e);
    }
});

// PUT /holders/:id
router.put('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { email, name, description } = req.body;
    console.log('[put:/api/holders:id]{%j}', req.body)
    try {
        const holder = await prisma.holder.update({
            where: {
                id,
            },
            data: {
                email,
                name,
                description,
            },
        });
        res.json(holder);
    } catch (e) {
        res.status(400).json(e);
    }
});

// PATCH /holders/:id
router.patch('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { email, name, description } = req.body;
    console.log('[patch:/api/holders:id]{%j}', req.body)
    try {
        const holder = await prisma.holder.update({
            where: {
                id,
            },
            data: {
                email,
                name,
                description,
            },
        });
        res.json(holder);
    } catch (e) {
        res.status(400).json(e);
    }
});

// DELETE /holders/:id
router.delete('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    console.log('[delete:/api/holders/:id]' + id)
    try {
        const holder = await prisma.holder.delete({
            where: {
                id,
            },
        });
        res.json(holder);
    } catch (e) {
        res.status(400).json(e);
    }
});

// GET /holders/:id
router.get('/email/:email', async (req: Request, res: Response) => {
    const email = req.params.email;
    console.log('[get:/api/holders/email/%s]', email)
    try {
        const holder = await prisma.holder.findUnique({
            where: {
                email,
            },
        })
        res.json(holder);
    } catch (e) {
        res.status(400).json(e);
    }
});

export default router
