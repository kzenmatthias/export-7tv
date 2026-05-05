const ULID_RE = /[0-9A-HJKMNP-TV-Z]{26}/i

export function parseUserId(input) {
  if (typeof input !== 'string') return null
  const match = input.trim().match(ULID_RE)
  return match ? match[0].toUpperCase() : null
}

export function buildEmoteUrl(emoteId, size = '4x', ext = 'webp') {
  return `https://cdn.7tv.app/emote/${emoteId}/${size}.${ext}`
}

export async function fetchUser(id) {
  let response
  try {
    response = await fetch(`https://7tv.io/v3/users/${id}`)
  } catch (err) {
    throw new Error('Network error: could not reach 7tv.io')
  }
  if (response.status === 404) {
    throw new Error(`User not found (id: ${id})`)
  }
  if (!response.ok) {
    throw new Error(`7TV API returned ${response.status}`)
  }
  return response.json()
}

export function getConnections(user) {
  if (!user || !Array.isArray(user.connections)) return []
  return user.connections
    .filter(c => c && c.emote_set && Array.isArray(c.emote_set.emotes))
    .map(c => ({
      id: c.id,
      platform: c.platform,
      username: c.username || c.display_name || c.id,
      displayName: c.display_name || c.username || c.id,
      emoteSet: c.emote_set
    }))
}

export function normalizeEmotes(connection, size = '4x', ext = 'webp') {
  if (!connection || !connection.emoteSet) return []
  const emotes = connection.emoteSet.emotes || []
  return emotes.map(e => {
    const data = e.data || {}
    const owner = data.owner || null
    return {
      id: e.id,
      name: e.name,
      url: buildEmoteUrl(e.id, size, ext),
      animated: Boolean(data.animated),
      owner: owner ? (owner.display_name || owner.username || null) : null
    }
  })
}
