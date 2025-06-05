export async function canMoveToNextQuestion(roomCode, currentIndex) {
  try {
    const response = await fetch(`https://drp-belgium.onrender.com/api/move-to-next-q/${roomCode}/${currentIndex}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      const err = await response.json();
      throw err;
    }
    const data = await response.json();
    console.log('Recieved from backend can move to next question:', data);
    return Boolean(data.canMove);
  }
  catch (err) {
    console.error('Error checking if can move to next question:', err);
    alert(err.error || 'Failed to check if can move to next question.');
    return false;
  }
} 