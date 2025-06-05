export async function canMoveToNextQuestion(roomCode, currentIndex) {
  try {
    const res = await fetch(
      `https://drp-belgium.onrender.com/api/move-to-next-q/${roomCode}/${currentIndex}`,
      { method: 'GET', headers: { 'Content-Type': 'application/json' } }
    );

    // parse JSON exactly once
    const data = await res.json();         
    console.log('Backend ↔ can_move payload:', data);

    if (!res.ok) {
      // server-side error
      throw new Error(data.error || `HTTP ${res.status}`);
    }

    // data can have snake_case or camelCase
    const flag = typeof data.can_move !== 'undefined'
      ? data.can_move
      : data.canMove;

    // coerce to boolean
    return Boolean(flag);

  } catch (err) {
    console.error('Error in canMoveToNextQuestion:', err);
    return false;  // fail-closed
  }
}