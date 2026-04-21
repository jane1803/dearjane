export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // 1. API 키가 제대로 로드되는지 확인
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API Key is missing in environment variables' });
  }

  const { messages, system } = req.body;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        // 2. 모델명 확인: 'claude-3-5-sonnet-20241022' 등 현재 사용 가능한 모델명인지 확인
        model: 'claude-3-5-sonnet-20241022', 
        max_tokens: 800,
        system: system || "You are a helpful assistant.", // 시스템 프롬프트가 없을 경우 대비
        messages: messages
      })
    });

    const data = await response.json();
    
    // 3. API 응답 에러 처리
    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
