
export async function incrementRoomsCurrentStatus(roomCode, status) {
  try {
    const response = await fetch(
      'https://drp-belgium.onrender.com/api/update-room-status/',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room_code: roomCode, status }),
      }
    )
    if (!response.ok) {
      const err = await response.json()
      throw err
    }
    const data = await response.json()
    console.log('Current room status incremented by 1:', data)
    return data
  } catch (err) {
    console.error('Error updating current room status:', err)
    alert(err.error || 'Failed to update current room status.')
    throw err
  }
}