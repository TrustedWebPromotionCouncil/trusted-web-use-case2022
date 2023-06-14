import { PrismaClient } from '@prisma/client';
import { Router, Request, Response } from 'express';

const prisma = new PrismaClient();
const router = Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

// GET /verifiers
router.get('/', async (req: Request, res: Response) => {
    console.log('[get:/api/verifiers/]')
    try {
        const verifiers = await prisma.verifier.findMany();
        res.json(verifiers);

    } catch (e) {
        res.status(400).json(e);
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    console.log('[get:/api/verifiers/:id]' + id)
    try {
        const verifier = await prisma.verifier.findUnique({
            where: {
                id,
            },
        })
        res.json(verifier);
    } catch (e) {
        res.status(400).json(e);
    }
});

// POST /verifiers
router.post('/', async (req: Request, res: Response) => {
    const { email, password, name, description } = req.body;
    console.log('[post:/api/verifiers/]{%j}', req.body)
    const hassedPassword = bcrypt.hashSync(password, saltRounds)
    try {
        const verifier = await prisma.verifier.create({
            data: {
                email,
                password: hassedPassword,
                name,
                description
            },
        });
        res.json(verifier);
    } catch (e) {
        res.status(400).json(e);
    }
});

// PUT /verifiers/:id
router.put('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { email, name, description, } = req.body;
    console.log('[put:/api/verifiers:id]{%j}', req.body)
    try {
        const verifier = await prisma.verifier.update({
            where: {
                id,
            },
            data: {
                email,
                name,
                description,
            },
        });
        res.json(verifier);
    } catch (e) {
        res.status(400).json(e);
    }
});

// PATCH /verifiers/:id
router.patch('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { email, name, description, } = req.body;
    console.log('[patch:/api/verifiers:id]{%j}', req.body)
    try {
        const verifier = await prisma.verifier.update({
            where: {
                id,
            },
            data: {
                email,
                name,
                description,
            },
        });
        res.json(verifier);
    } catch (e) {
        res.status(400).json(e);
    }
});

// DELETE /verifiers/:id
router.delete('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    console.log('[delete:/api/verifiers/:id]' + id)
    try {
        const verifier = await prisma.verifier.delete({
            where: {
                id,
            },
        });
        res.json(verifier);
    } catch (e) {
        res.status(400).json(e);
    }
});

export default router
