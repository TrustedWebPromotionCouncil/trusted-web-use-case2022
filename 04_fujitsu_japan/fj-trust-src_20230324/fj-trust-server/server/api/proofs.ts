import { PrismaClient } from '@prisma/client';
import { Router, Request, Response } from 'express';

const prisma = new PrismaClient();
const router = Router();

// GET /proofs
router.get('/', async (req: Request, res: Response) => {
    console.log('[get:/api/proofs/]')
    try {
        const proofs = await prisma.proof.findMany();
        res.json(proofs);
    } catch (e) {
        res.status(400).json(e);
    }
});

// POST /proofs
router.post('/', async (req: Request, res: Response) => {
    const { trustSealId, hashValue, proofHash, holderEmail, holderName, verifierEmail, verifierName, } = req.body;
    console.log('[post:/api/proofs/]{%j}', req.body)
    try {
        const proof = await prisma.proof.create({
            data: {
                trustSealId,
                hashValue,
                proofHash,
                holderEmail,
                holderName,
                verifierEmail,
                verifierName,
            },
        });
        res.json(proof);
    } catch (e) {
        res.status(400).json(e);
    }
});

// DELETE /proofs/:id
router.delete('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    console.log('[delete:/api/proofs/:%s]', id)
    try {
        const proof = await prisma.proof.delete({
            where: {
                id,
            },
        });
        res.json(proof);
    } catch (e) {
        res.status(400).json(e);
    }
});

router.get('/holder/:email', async (req: Request, res: Response) => {
    const holderEmail = req.params.email;
    console.log('[get:/api/proofs/holder/:%s]', holderEmail)
    try {
        const proofs = await prisma.proof.findMany({
            where: {
                holderEmail,
            }
        });
        res.json(proofs);
    } catch (e) {
        res.status(400).json(e);
    }
});

router.get('/verifier/:email', async (req: Request, res: Response) => {
    const verifierEmail = req.params.email;
    console.log('[get:/api/proofs/issuer/:%s]', verifierEmail)
    try {
        const proofs = await prisma.proof.findMany({
            where: {
                verifierEmail,
            }
        });
        res.json(proofs);
    } catch (e) {
        res.status(400).json(e);
    }
});

router.post('/verify', async (req: Request, res: Response) => {
    const { trustSealId, proofHash, } = req.body;
    console.log('[post:/api/proofs/]{%j}', req.body)
    try {
        const proofs = await prisma.proof.findMany({
            where: {
                trustSealId,
                proofHash,
            }
        });
        res.json(proofs);
    } catch (e) {
        res.status(400).json(e);
    }
});

export default router
