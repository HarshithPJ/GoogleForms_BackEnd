import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Ping endpoint
app.get('/ping', (req: Request, res: Response) => {
    res.send(true);
});

// Submit endpoint
app.post('/submit', (req: Request, res: Response) => {
    const { name, email, phone, github_link, stopwatch_time } = req.body;

    const submission = { name, email, phone, github_link, stopwatch_time };
    const data = JSON.parse(fs.readFileSync('./src/db.json', 'utf-8'));
    data.submissions.push(submission);
    fs.writeFileSync('./src/db.json', JSON.stringify(data, null, 2));

    res.status(201).send({ message: 'Submission received' });
});

// Read endpoint
app.get('/read', (req: Request, res: Response) => {
    const index = parseInt(req.query.index as string, 10);
    const data = JSON.parse(fs.readFileSync('./src/db.json', 'utf-8'));

    if (index >= 0 && index < data.submissions.length) {
        res.status(200).send(data.submissions);
    } else {
        res.status(404).send({ message: 'Submission not found' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
