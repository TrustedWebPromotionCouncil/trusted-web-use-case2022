import { PrismaClient } from '@prisma/client';
import { Router, Request, Response } from 'express';

const prisma = new PrismaClient();
const router = Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const SECRET_KEY = "20221012kgupovsecret"

router.post("/login", async (req: Request, res: Response) => {
    const { agentId, email, password } = req.body
    console.log('[post:/api/auth/login]{%j}', req.body)
    if (agentId == 'kangaku_students') {
        try {
            const holder = await prisma.holder.findUnique({
                where: {
                    email,
                },
            })
            const compared = await bcrypt.compare(password, holder?.password)
            console.log('compared:' + compared)
            if (compared) {
                const payload = {
                    agentId: 'kangaku_students',
                    id: holder?.id,
                    email: holder?.email,
                    name: holder?.name,
                };
                const token = jwt.sign(payload, SECRET_KEY)
                res.json({ token });
            } else {
                res.status(401).json('password incorrect');
            }
        } catch (e) {
            res.status(400).json(e);
        }
    } else if (agentId == 'kangaku') {
        try {
            const issuer = await prisma.issuer.findUnique({
                where: {
                    email,
                },
            })
            const compared = await bcrypt.compare(password, issuer?.password)
            console.log('compared:' + compared)
            if (compared) {
                const payload = {
                    agentId: 'kangaku',
                    id: issuer?.id,
                    email: issuer?.email,
                    name: issuer?.name,
                };
                const token = jwt.sign(payload, SECRET_KEY)
                res.json({ token });
            } else {
                res.status(401).json('password incorrect');
            }
        } catch (e) {
            res.status(400).json(e);
        }
    } else if (agentId == 'kangaku_verifier') {
        try {
            const verifier = await prisma.verifier.findUnique({
                where: {
                    email,
                },
            })
            const compared = await bcrypt.compare(password, verifier?.password)
            console.log('compared:' + compared)
            if (compared) {
                const payload = {
                    agentId: 'kangaku_verifier',
                    id: verifier?.id,
                    email: verifier?.email,
                    name: verifier?.name,
                };
                const token = jwt.sign(payload, SECRET_KEY)
                res.json({ token });
            } else {
                res.status(403).json('password incorrect');
            }
        } catch (e) {
            res.status(400).json(e);
        }
    }
})

router.get("/user", async (req: Request, res: Response) => {
    const headers = req.headers;
    console.log(headers)
    const bearToken: any = req.headers["authorization"];
    const bearer = bearToken.split(' ')
    const token = bearer[1]

    jwt.verify(token, SECRET_KEY, (error: any, user: any) => {
        if (error) {
            return res.sendStatus(403);
        } else {
            return res.json({ user });
        }
    })
})

export default router;
