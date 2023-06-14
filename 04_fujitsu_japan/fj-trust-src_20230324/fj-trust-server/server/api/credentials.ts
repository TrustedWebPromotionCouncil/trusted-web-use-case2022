import { PrismaClient } from '@prisma/client';
import { Router, Request, Response } from 'express';

const prisma = new PrismaClient();
const router = Router();

// GET /credentials
router.get('/', async (req: Request, res: Response) => {
    console.log('[get:/api/credentials/]')
    try {
        const credentials = await prisma.credential.findMany();
        res.json(credentials);
    } catch (e) {
        res.status(400).json(e);
    }
});

// GET /credentials/:id
router.get('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    console.log('[get:/api/credentials/:id]' + id)
    try {
        const credential = await prisma.credential.findUnique({
            where: {
                id,
            },
        });
        res.json(credential);
    } catch (e) {
        res.status(400).json(e);
    }
});

// POST /credentials/:id
router.post('/', async (req: Request, res: Response) => {
    const { name, holderName, holderEmail, selfLevel, selfDescription, issuerEmail, issuerName } = req.body;
    console.log('[post:/api/credentials/]{%j}', req.body)
    try {
        const credential = await prisma.credential.create({
            data: {
                name,
                holderEmail,
                holderName,
                selfLevel,
                selfDescription,
                issuerEmail,
                issuerName,
            },
        });
        res.json(credential);
    } catch (e) {
        res.status(400).json(e);
    }
});

// PUT /credentials/:id
router.put('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { level, description, certified } = req.body;
    console.log('[put:/api/credentials:id]{%j}', req.body)
    try {
        const credential = await prisma.credential.update({
            where: {
                id,
            },
            data: {
                level,
                description,
                certified,
            },
        });
        res.json(credential);
    } catch (e) {
        res.status(400).json(e);
    }
});

// PATCH /credentials/:id
router.patch('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { level, description, certified } = req.body;
    console.log('[patch:/api/credentials:id]' + id + '/'+ req.body)
    try {
        const credential = await prisma.credential.update({
            where: {
                id,
            },
            data: {
                level,
                description,
                certified,
            },
        });
        res.json(credential);
    } catch (e) {
        res.status(400).json(e);
    }
});

// DELETE /credentials/:id
router.delete('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    console.log('[delete:/api/credentials/:id]' + id)
    try {
        const credential = await prisma.credential.delete({
            where: {
                id,
            },
        });
        res.json(credential);
    } catch (e) {
        res.status(400).json(e);
    }
});

// GET /credentials/issuer:email
router.get('/issuer/:email', async (req: Request, res: Response) => {
    const issuerEmail = req.params.email;
    console.log('[get:/api/credentials/issuer/:%s]', issuerEmail)
    try {
        const credential = await prisma.credential.findMany({
            where: {
                issuerEmail,
            },
        });
        res.json(credential);
    } catch (e) {
        res.status(400).json(e);
    }
});

export default router
