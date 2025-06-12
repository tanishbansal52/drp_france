
export async function incrementRoomsCurrentStatus(roomCode, new_status) {
  try {
    const response = await fetch(
      'https://drp-belgium.onrender.com/api/update-room-status/',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room_code: roomCode, status: new_status }),
      }
    )
    if (!response.ok) {
      const err = await response.json()
      throw err
    }
    const data = await response.json()
    console.log(`Updated room status for ${roomCode} from ${new_status-1} to ${new_status}`)
    return data
  } catch (err) {
    console.error('Error updating current room status:', err)
    alert(err.error || 'Failed to update current room status.')
    throw err
  }
}