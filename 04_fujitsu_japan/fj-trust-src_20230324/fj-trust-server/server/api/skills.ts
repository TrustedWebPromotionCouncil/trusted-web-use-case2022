import { PrismaClient } from '@prisma/client';
import { Router, Request, Response } from 'express';

const prisma = new PrismaClient();
const router = Router();

// GET /skills
router.get('/', async (req: Request, res: Response) => {
    console.log('[get:/api/skills/]')
    try {
        const skills = await prisma.skill.findMany();
        res.json(skills);
    } catch (e) {
        res.status(400).json(e);
    }
});

// GET /skills/:id
router.get('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    console.log('[get:/api/skills/:id]' + id)
    try {
        const skill = await prisma.skill.findUnique({
            where: {
                id,
            },
        })
        res.json(skill);
    } catch (e) {
        res.status(400).json(e);
    }
});

// POST /skills
router.post('/', async (req: Request, res: Response) => {
    const { name, level, description, holderEmail, holderName } = req.body;
    console.log('[post:/api/skills/]{%j}', req.body)
    try {
        const skill = await prisma.skill.create({
            data: {
                name,
                level,
                description,
                holderEmail,
                holderName,
            },
        });
        res.json(skill);
    } catch (e) {
        res.status(400).json(e);
    }
});

// PUT /skills/:id
router.put('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { name, level, description } = req.body;
    console.log('[put:/api/skills:id]{%j}', req.body)
    try {
        const skill = await prisma.skill.update({
            where: {
                id,
            },
            data: {
                name,
                level,
                description,
            },
        });
        res.json(skill);
    } catch (e) {
        res.status(400).json(e);
    }
});


// PATCH /skills/:id
router.patch('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { name, level, description } = req.body;
    console.log('[patch:/api/skills/:id]' + id + '/'+ req.body)
    try {
        const skill = await prisma.skill.update({
            where: {
                id,
            },
            data: {
                name,
                level,
                description,
            },
        });
        res.json(skill);
    } catch (e) {
        res.status(400).json(e);
    }
});

// DELETE /skills/:id
router.delete('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    console.log('[delete:/api/skills/:id]' + id)
    try {
        const skill = await prisma.skill.delete({
            where: {
                id,
            },
        });
        res.json(skill);
    } catch (e) {
        res.status(400).json(e);
    }
});

// GET /skills/holder:email
router.get('/holder/:email', async (req: Request, res: Response) => {
    const holderEmail = req.params.email;
    console.log('[get:/api/skills/holder/%s]', holderEmail)
    try {
        const skill = await prisma.skill.findMany({
            where: {
                holderEmail,
            },
        })
        res.json(skill);
    } catch (e) {
        res.status(400).json(e);
    }
});

// // GET /skills:email
// router.get('/email/:email', async (req: Request, res: Response) => {
//     const email = req.params.email;
//     console.log('[get:/api/skills/email/%s]', email)
//     try {
//         const skill = await prisma.skill.findMany({
//             where: {
//                 holder: {
//                     email: {
//                         equals: email
//                     }
//                 }
//             },
//         })
//         res.json(skill);
//     } catch (e) {
//         res.status(400).json(e);
//     }
// });

export default router
