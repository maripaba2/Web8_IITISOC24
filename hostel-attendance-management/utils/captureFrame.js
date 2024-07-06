export async function captureFrame() {
    // Placeholder function to fetch the frame from the backend
    const response = await fetch('http://localhost:8000/frame');
    if (response.ok) {
      const frame = await response.blob();
      return frame;
    }
    throw new Error('Failed to fetch frame');
  }
  