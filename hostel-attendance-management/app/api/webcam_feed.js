import { exec } from 'child_process';
import path from 'path';

export default function handler(req, res) {
  const scriptPath = path.join(process.cwd(), 'python', 'webcam_feed.py');

  const process = exec(`python ${scriptPath}`);

  process.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  process.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  process.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });

  res.status(200).json({ message: 'Webcam feed started' });
}
