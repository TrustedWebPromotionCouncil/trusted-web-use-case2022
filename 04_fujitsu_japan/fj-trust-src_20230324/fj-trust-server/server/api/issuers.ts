import { PrismaClient } from '@prisma/client';
import { Router, Request, Response } from 'express';

const prisma = new PrismaClient();
const router = Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

// GET /issuers
router.get('/', async (req: Request, res: Response) => {
    console.log('[get:/api/issuers/]')
    try {
        const issuers = await prisma.issuer.findMany();
        return res.json(issuers);

    } catch (e) {
        return res.status(400).json(e);
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    console.log('[get:/api/issuers/:id]' + id)
    try {
        const issuer = await prisma.issuer.findUnique({
            where: {
                id,
            },
        })
        res.json(issuer);
    } catch (e) {
        res.status(400).json(e);
    }
});

// POST /issuers
router.post('/', async (req: Request, res: Response) => {
    const { email, password, name, description } = req.body;
    console.log('[post:/api/issuers/]{%j}', req.body)
    const hassedPassword = bcrypt.hashSync(password, saltRounds)
    try {
        const issuer = await prisma.issuer.create({
            data: {
                email,
                password: hassedPassword,
                name,
                description
            },
        });
        res.json(issuer);
    } catch (e) {
        res.status(400).json(e);
    }
});

// PUT /issuers/:id
router.put('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { email, name, description, } = req.body;
    console.log('[put:/api/issuers:id]{%j}', req.body)
    try {
        const issuer = await prisma.issuer.update({
            where: {
                id,
            },
            data: {
                email,
                name,
                description,
            },
        });
        res.json(issuer);
    } catch (e) {
        res.status(400).json(e);
    }
});

// PATCH /issuers/:id
router.patch('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { email, name, description, } = req.body;
    console.log('[patch:/api/issuers:id]{%j}', req.body)
    try {
        const issuer = await prisma.issuer.update({
            where: {
                id,
            },
            data: {
                email,
                name,
                description,
            },
        });
        res.json(issuer);
    } catch (e) {
        res.status(400).json(e);
    }
});

// DELETE /issuers/:id
router.delete('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    console.log('[delete:/api/issuers/:id]' + id)
    try {
        const issuer = await prisma.issuer.delete({
            where: {
                id,
            },
        });
        res.json(issuer);
    } catch (e) {
        res.status(400).json(e);
    }
});

// GET /issuer/:id
router.get('/email/:email', async (req: Request, res: Response) => {
    const email = req.params.email;
    console.log('[get:/api/issuer/email/%s]', email)
    try {
        const issuer = await prisma.issuer.findUnique({
            where: {
                email,
            },
        })
        res.json(issuer);
    } catch (e) {
        res.status(400).json(e);
    }
});

export default router
