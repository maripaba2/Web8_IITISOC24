import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const framePath = path.join(process.cwd(), 'python', 'debug_frame.jpg');
  if (fs.existsSync(framePath)) {
    const frame = fs.readFileSync(framePath);
    res.setHeader('Content-Type', 'image/jpeg');
    res.send(frame);
  } else {
    res.status(404).json({ message: 'Frame not found' });
  }
}
