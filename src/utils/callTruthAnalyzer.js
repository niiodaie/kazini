export async function callTruthAnalyzer(message) {
  const response = await fetch('https://xferwohdxzqyqvvjnkfv.functions.supabase.co/truth-analyzer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // No auth header needed for dev — remove in prod
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to analyze truth');
  }

  return await response.json(); // { verdict: ..., score: ... }
}
