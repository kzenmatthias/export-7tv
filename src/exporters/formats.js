const HEADERS = ['name', 'url', 'animated', 'owner', 'id']

function csvEscape(value) {
  const s = value === null || value === undefined ? '' : String(value)
  if (/[",\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

function htmlEscape(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function mdEscape(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ')
}

export function toPlainText(emotes) {
  const lines = [HEADERS.join('\t')]
  for (const e of emotes) {
    lines.push([e.name, e.url, e.animated, e.owner ?? '', e.id].join('\t'))
  }
  return lines.join('\n')
}

export function toCsv(emotes) {
  const lines = [HEADERS.map(csvEscape).join(',')]
  for (const e of emotes) {
    lines.push([e.name, e.url, e.animated, e.owner ?? '', e.id].map(csvEscape).join(','))
  }
  return lines.join('\r\n')
}

export function toJson(emotes) {
  return JSON.stringify(emotes, null, 2)
}

export function toMarkdownTable(emotes) {
  const lines = [
    '| Name | Link | Animated | Owner | ID |',
    '| --- | --- | --- | --- | --- |'
  ]
  for (const e of emotes) {
    lines.push(
      `| ${mdEscape(e.name)} | ${e.url} | ${e.animated ? 'yes' : 'no'} | ${mdEscape(e.owner ?? '')} | ${e.id} |`
    )
  }
  return lines.join('\n')
}

export function toMarkdownImages(emotes) {
  return emotes.map(e => `![${mdEscape(e.name)}](${e.url})`).join('\n')
}

export function toHtmlGallery(emotes) {
  const items = emotes.map(e => {
    const name = htmlEscape(e.name)
    const url = htmlEscape(e.url)
    return `  <figure>\n    <img src="${url}" alt="${name}" loading="lazy" />\n    <figcaption>${name}</figcaption>\n  </figure>`
  }).join('\n')
  return `<div class="emote-gallery">\n${items}\n</div>`
}

export function toBbcode(emotes) {
  return emotes.map(e => `[img]${e.url}[/img] ${e.name}`).join('\n')
}

export const FORMATS = [
  { id: 'txt', labelKey: 'format.txt', ext: 'txt', mime: 'text/plain', build: toPlainText },
  { id: 'csv', labelKey: 'format.csv', ext: 'csv', mime: 'text/csv', build: toCsv },
  { id: 'json', labelKey: 'format.json', ext: 'json', mime: 'application/json', build: toJson },
  { id: 'md-table', labelKey: 'format.mdTable', ext: 'md', mime: 'text/markdown', build: toMarkdownTable },
  { id: 'md-images', labelKey: 'format.mdImages', ext: 'md', mime: 'text/markdown', build: toMarkdownImages },
  { id: 'html', labelKey: 'format.html', ext: 'html', mime: 'text/html', build: toHtmlGallery },
  { id: 'bbcode', labelKey: 'format.bbcode', ext: 'txt', mime: 'text/plain', build: toBbcode }
]
