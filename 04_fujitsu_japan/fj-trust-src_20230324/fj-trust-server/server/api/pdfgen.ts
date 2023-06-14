import { Router, Request, Response } from 'express';
import { Template, BLANK_PDF, generate } from "@pdfme/generator";
import fs from 'fs';
import path, { resolve } from 'path';
import crypto from 'crypto'

const router = Router();

router.post('/', async (req: Request, res: Response) => {
    console.log('[/api/pdfgen]:%j', req.body)
    const font = {
        TanukiMagic: {
            data: fs.readFileSync('assets/TanukiMagic.ttf'),
            fallback: true,
        },
    }
    const template: Template = {
        basePdf: BLANK_PDF,
        schemas: [
            {
                generatedAt: {
                    type: 'text',
                    position: { x: 30, y: 15 },
                    width: 100,
                    height: 10,
                },
                holderNameField: {
                    type: 'text',
                    position: { x: 30, y: 30 },
                    width: 100,
                    height: 10,
                },
                verifierFields: {
                    type: 'text',
                    position: { x: 30, y: 45 },
                    width: 100,
                    height: 10,
                },
                targetUrl: {
                    type: 'qrcode',
                    position: { x: 55, y: 100 },
                    width: 100,
                    height: 100,
                }
            }
        ]
    }
    const yyyymmdd = new Intl.DateTimeFormat(
        undefined,
        {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }
    )

    const generatedAt = `Date: ${yyyymmdd.format(new Date())}`
    const holderNameField = `From: ${req.body.holderName}`
    const verifierFields = `To: ${req.body.verifierName}`
    const pdfFileName = `${Date.now()}_${req.body.holderName}_${req.body.verifierName}.pdf`
    const inputs = [{ generatedAt: generatedAt, holderNameField: holderNameField, verifierFields: verifierFields, targetUrl: req.body.targetUrl }];
    generate({ template, inputs, options: { font } }).then((pdf) => {
        const generatePdf = path.join(__dirname, pdfFileName)
        fs.writeFileSync(generatePdf, pdf);
        var file = fs.createReadStream(generatePdf)
        var buffer = fs.readFileSync(generatePdf)
        const hash = crypto.createHash('sha256').update(buffer).digest('hex')
        console.log('buffer=%s', hash)
        var stat = fs.statSync(generatePdf)
        // res.setHeader('Content-Disposition', 'inline; filename=' + hash + '.pdf')
        res.setHeader('Content-Disposition', 'attachment; filename=' + hash + '.pdf')
        res.setHeader('Content-Length', stat.size)
        res.setHeader('Content-Type', 'application/pdf')
        // res.send(buffer)
        file.pipe(res)
    })
});

export default router
