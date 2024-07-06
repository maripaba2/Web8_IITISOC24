import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

export default function handler(req, res) {
  const { name } = req.body;

  const filePath = path.join(process.cwd(), 'python', 'Attendance.csv');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read attendance file' });
    }

    const nameList = data.split('\n').map(line => line.split(',')[0]);
    if (!nameList.includes(name)) {
      const now = new Date();
      const dateTimeString = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
      const newEntry = `${name},${dateTimeString}\n`;

      fs.appendFile(filePath, newEntry, (err) => {
        if (err) {
          return res.status(500).json({ error: 'Unable to mark attendance' });
        }

        res.status(200).json({ message: 'Attendance marked successfully' });
      });
    } else {
      res.status(200).json({ message: 'Attendance already marked' });
    }
  });
}
