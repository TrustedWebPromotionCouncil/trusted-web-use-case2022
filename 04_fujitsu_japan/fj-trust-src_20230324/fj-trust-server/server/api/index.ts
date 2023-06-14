import express from 'express';
import holders from './holders';
import issuers from './issuers';
import verifiers from './verifiers';
import skills from './skills';
import credentials from './credentials';
import proofs from './proofs';
import pdfgen from './pdfgen';
import idyxdev from './idyxdev';
import auth from './auth';

const app = express()

const port = 5000;
app.listen(port, () => console.log(`API listening on port ${port}!`));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/holders', holders);
app.use('/api/issuers', issuers);
app.use('/api/verifiers', verifiers);
app.use('/api/skills', skills);
app.use('/api/credentials', credentials);
app.use('/api/proofs', proofs);
app.use('/api/pdfgen', pdfgen);
app.use('/api/auth', auth);
app.use('/api', idyxdev)

export default app