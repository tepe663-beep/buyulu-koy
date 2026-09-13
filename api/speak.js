export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, voiceId } = req.body;
  const FISH_API_KEY = 'sk-fish-bHCj5Oiy6cM6Y8v5hp14-5TrOxLDm74lDST3LG-Nzyc';

  try {
    const response = await fetch('https://fish.audio/api/v1/tts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FISH_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text,
        format: 'mp3_44100_128',
        model_id: voiceId
      })
    });

    if (!response.ok) {
      throw new Error(`Fish API error: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioBuffer.byteLength);
    res.send(Buffer.from(audioBuffer));
    
  } catch (error) {
    console.error('TTS Error:', error);
    res.status(500).json({ error: error.message });
  }
}
