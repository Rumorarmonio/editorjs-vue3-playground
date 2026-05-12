import type { EmbedBlockData } from '~~/editor/shared/blocks/standard-block-data'

interface EmbedServiceDefinition {
  service: string
  label: string
  width: number
  height: number
  createEmbedUrl(sourceUrl: URL): string | null
  isAllowedEmbedUrl(embedUrl: URL): boolean
  getAllowedEmbedUrl?(embedUrl: URL): string | null
}

export const supportedEmbedServices = [
  {
    service: 'youtube',
    label: 'YouTube',
    width: 580,
    height: 320,
    createEmbedUrl(sourceUrl) {
      const videoId = getYoutubeVideoId(sourceUrl)

      return videoId ? `https://www.youtube.com/embed/${videoId}` : null
    },
    isAllowedEmbedUrl(embedUrl) {
      return (
        embedUrl.protocol === 'https:' &&
        embedUrl.hostname === 'www.youtube.com' &&
        /^\/embed\/[a-zA-Z0-9_-]{11}$/.test(embedUrl.pathname)
      )
    },
  },
  {
    service: 'vimeo',
    label: 'Vimeo',
    width: 580,
    height: 320,
    createEmbedUrl(sourceUrl) {
      const videoId = getVimeoVideoId(sourceUrl)

      return videoId
        ? `https://player.vimeo.com/video/${videoId}?title=0&byline=0`
        : null
    },
    isAllowedEmbedUrl(embedUrl) {
      return (
        embedUrl.protocol === 'https:' &&
        embedUrl.hostname === 'player.vimeo.com' &&
        /^\/video\/\d+$/.test(embedUrl.pathname)
      )
    },
  },
  {
    service: 'coub',
    label: 'Coub',
    width: 580,
    height: 320,
    createEmbedUrl(sourceUrl) {
      const coubId = getCoubId(sourceUrl)

      return coubId ? `https://coub.com/embed/${coubId}` : null
    },
    isAllowedEmbedUrl(embedUrl) {
      return (
        embedUrl.protocol === 'https:' &&
        embedUrl.hostname === 'coub.com' &&
        /^\/embed\/[a-zA-Z0-9_-]+$/.test(embedUrl.pathname)
      )
    },
  },
  {
    service: 'rutube',
    label: 'Rutube',
    width: 720,
    height: 405,
    createEmbedUrl(sourceUrl) {
      const videoId = getRutubeVideoId(sourceUrl)

      return videoId ? `https://rutube.ru/play/embed/${videoId}` : null
    },
    isAllowedEmbedUrl(embedUrl) {
      return (
        embedUrl.protocol === 'https:' &&
        embedUrl.hostname === 'rutube.ru' &&
        /^\/play\/embed\/[a-f0-9]{32}$/i.test(embedUrl.pathname)
      )
    },
  },
  {
    service: 'vk',
    label: 'VK Video',
    width: 853,
    height: 480,
    createEmbedUrl(sourceUrl) {
      const videoParams = getVkVideoParams(sourceUrl)

      if (!videoParams) {
        return null
      }

      const embedUrl = new URL('https://vk.com/video_ext.php')

      embedUrl.searchParams.set('oid', videoParams.ownerId)
      embedUrl.searchParams.set('id', videoParams.videoId)

      if (videoParams.hash) {
        embedUrl.searchParams.set('hash', videoParams.hash)
      }

      embedUrl.searchParams.set('hd', videoParams.hd ?? '2')

      return embedUrl.toString()
    },
    isAllowedEmbedUrl(embedUrl) {
      return (
        embedUrl.protocol === 'https:' &&
        isVkVideoHostname(embedUrl.hostname) &&
        embedUrl.pathname === '/video_ext.php' &&
        isSignedInteger(embedUrl.searchParams.get('oid')) &&
        isPositiveInteger(embedUrl.searchParams.get('id')) &&
        isAllowedVkHash(embedUrl.searchParams.get('hash')) &&
        isAllowedVkHd(embedUrl.searchParams.get('hd'))
      )
    },
  },
  {
    service: 'twitch',
    label: 'Twitch',
    width: 640,
    height: 360,
    createEmbedUrl(sourceUrl) {
      const embedUrl = getTwitchEmbedUrl(sourceUrl)

      return embedUrl ? addTwitchParentParam(embedUrl).toString() : null
    },
    isAllowedEmbedUrl(embedUrl) {
      return Boolean(getTwitchEmbedUrl(embedUrl))
    },
    getAllowedEmbedUrl(embedUrl) {
      const twitchEmbedUrl = getTwitchEmbedUrl(embedUrl)

      return twitchEmbedUrl
        ? addTwitchParentParam(twitchEmbedUrl).toString()
        : null
    },
  },
] satisfies EmbedServiceDefinition[]

export const supportedEmbedServiceLabels = supportedEmbedServices
  .map((service) => service.label)
  .join(', ')

export function createEmbedDataFromSource(
  value: string,
): EmbedBlockData | null {
  const source = value.trim()

  if (!source) {
    return null
  }

  try {
    const sourceUrl = new URL(source)

    for (const service of supportedEmbedServices) {
      const embed = service.createEmbedUrl(sourceUrl)

      if (!embed) {
        continue
      }

      return {
        service: service.service,
        source,
        embed,
        width: service.width,
        height: service.height,
        caption: '',
      }
    }
  } catch {
    return null
  }

  return null
}

export function getAllowedEmbedIframeUrl(
  data: EmbedBlockData,
): string | null {
  const service = supportedEmbedServices.find(
    (item) => item.service === data.service,
  )

  if (!service) {
    return null
  }

  try {
    const embedUrl = new URL(data.embed)

    if (service.getAllowedEmbedUrl) {
      return service.getAllowedEmbedUrl(embedUrl)
    }

    return service.isAllowedEmbedUrl(embedUrl) ? embedUrl.toString() : null
  } catch {
    return null
  }
}

export function getEmbedServiceLabel(serviceName: string): string {
  return (
    supportedEmbedServices.find((service) => service.service === serviceName)
      ?.label ?? serviceName
  )
}

function getYoutubeVideoId(sourceUrl: URL): string | null {
  if (sourceUrl.hostname === 'youtu.be') {
    return normalizeYoutubeVideoId(sourceUrl.pathname.slice(1))
  }

  if (!isHostnameOrSubdomain(sourceUrl.hostname, 'youtube.com')) {
    return null
  }

  const watchId = sourceUrl.searchParams.get('v')

  if (watchId) {
    return normalizeYoutubeVideoId(watchId)
  }

  const pathMatch = sourceUrl.pathname.match(
    /^\/(?:embed|live|shorts|v)\/([a-zA-Z0-9_-]{11})/,
  )

  return pathMatch?.[1] ? normalizeYoutubeVideoId(pathMatch[1]) : null
}

function normalizeYoutubeVideoId(value: string): string | null {
  const [videoId = ''] = value.split(/[?&/]/)

  return /^[a-zA-Z0-9_-]{11}$/.test(videoId) ? videoId : null
}

function getVimeoVideoId(sourceUrl: URL): string | null {
  if (sourceUrl.hostname === 'player.vimeo.com') {
    const pathMatch = sourceUrl.pathname.match(/^\/video\/(\d+)/)

    return pathMatch?.[1] ?? null
  }

  if (!isHostnameOrSubdomain(sourceUrl.hostname, 'vimeo.com')) {
    return null
  }

  const pathMatch = sourceUrl.pathname.match(/^\/(?:.*\/)?(\d+)/)

  return pathMatch?.[1] ?? null
}

function getCoubId(sourceUrl: URL): string | null {
  if (
    sourceUrl.hostname !== 'coub.com' &&
    sourceUrl.hostname !== 'www.coub.com'
  ) {
    return null
  }

  const pathMatch = sourceUrl.pathname.match(
    /^\/(?:view|embed)\/([a-zA-Z0-9_-]+)/,
  )

  return pathMatch?.[1] ?? null
}

function getRutubeVideoId(sourceUrl: URL): string | null {
  if (sourceUrl.hostname !== 'rutube.ru') {
    return null
  }

  const pathMatch = sourceUrl.pathname.match(
    /^\/(?:video|play\/embed)\/([a-f0-9]{32})\/?$/i,
  )

  return pathMatch?.[1] ?? null
}

interface VkVideoParams {
  ownerId: string
  videoId: string
  hash?: string
  hd?: string
}

function getVkVideoParams(sourceUrl: URL): VkVideoParams | null {
  if (!isVkVideoHostname(sourceUrl.hostname)) {
    return null
  }

  if (sourceUrl.pathname === '/video_ext.php') {
    const ownerId = sourceUrl.searchParams.get('oid')
    const videoId = sourceUrl.searchParams.get('id')

    if (!isSignedInteger(ownerId) || !isPositiveInteger(videoId)) {
      return null
    }

    const hash = sourceUrl.searchParams.get('hash') ?? undefined
    const hd = sourceUrl.searchParams.get('hd') ?? undefined

    if (!isAllowedVkHash(hash) || !isAllowedVkHd(hd)) {
      return null
    }

    return {
      ownerId,
      videoId,
      hash,
      hd,
    }
  }

  const pathMatch = sourceUrl.pathname.match(/^\/video(-?\d+)_(\d+)$/)

  if (!pathMatch?.[1] || !pathMatch[2]) {
    return null
  }

  return {
    ownerId: pathMatch[1],
    videoId: pathMatch[2],
  }
}

function isVkVideoHostname(hostname: string): boolean {
  return (
    hostname === 'vk.com' ||
    hostname === 'vk.ru' ||
    hostname === 'vkvideo.ru'
  )
}

function getTwitchEmbedUrl(sourceUrl: URL): URL | null {
  const twitchVideoId = getTwitchVideoId(sourceUrl)

  if (twitchVideoId) {
    const embedUrl = new URL('https://player.twitch.tv/')

    embedUrl.searchParams.set('video', `v${twitchVideoId}`)
    copyBooleanSearchParam(sourceUrl, embedUrl, 'autoplay')
    copyBooleanSearchParam(sourceUrl, embedUrl, 'muted')

    return embedUrl
  }

  const twitchChannel = getTwitchChannel(sourceUrl)

  if (twitchChannel) {
    const embedUrl = new URL('https://player.twitch.tv/')

    embedUrl.searchParams.set('channel', twitchChannel)
    copyBooleanSearchParam(sourceUrl, embedUrl, 'autoplay')
    copyBooleanSearchParam(sourceUrl, embedUrl, 'muted')

    return embedUrl
  }

  const twitchCollection = getTwitchCollection(sourceUrl)

  if (twitchCollection) {
    const embedUrl = new URL('https://player.twitch.tv/')

    embedUrl.searchParams.set('collection', twitchCollection)
    copyBooleanSearchParam(sourceUrl, embedUrl, 'autoplay')
    copyBooleanSearchParam(sourceUrl, embedUrl, 'muted')

    return embedUrl
  }

  const twitchClip = getTwitchClipSlug(sourceUrl)

  if (twitchClip) {
    const embedUrl = new URL('https://clips.twitch.tv/embed')

    embedUrl.searchParams.set('clip', twitchClip)
    copyBooleanSearchParam(sourceUrl, embedUrl, 'autoplay')
    copyBooleanSearchParam(sourceUrl, embedUrl, 'muted')

    return embedUrl
  }

  return null
}

function getTwitchVideoId(sourceUrl: URL): string | null {
  if (sourceUrl.hostname === 'player.twitch.tv') {
    return normalizeTwitchVideoId(sourceUrl.searchParams.get('video'))
  }

  if (!isHostnameOrSubdomain(sourceUrl.hostname, 'twitch.tv')) {
    return null
  }

  const pathMatch = sourceUrl.pathname.match(/^\/videos\/(v?\d+)\/?$/)

  return pathMatch?.[1] ? normalizeTwitchVideoId(pathMatch[1]) : null
}

function getTwitchChannel(sourceUrl: URL): string | null {
  if (sourceUrl.hostname === 'player.twitch.tv') {
    return normalizeTwitchChannel(sourceUrl.searchParams.get('channel'))
  }

  if (!isTwitchWatchHostname(sourceUrl.hostname)) {
    return null
  }

  const pathMatch = sourceUrl.pathname.match(/^\/([a-zA-Z0-9_]{4,25})\/?$/)
  const channel = pathMatch?.[1] ?? null

  if (!channel || isReservedTwitchPath(channel)) {
    return null
  }

  return normalizeTwitchChannel(channel)
}

function getTwitchCollection(sourceUrl: URL): string | null {
  if (sourceUrl.hostname !== 'player.twitch.tv') {
    return null
  }

  const collection = sourceUrl.searchParams.get('collection')

  return collection && /^[a-zA-Z0-9_-]+$/.test(collection) ? collection : null
}

function getTwitchClipSlug(sourceUrl: URL): string | null {
  if (sourceUrl.hostname === 'clips.twitch.tv') {
    if (sourceUrl.pathname === '/embed') {
      return normalizeTwitchClipSlug(sourceUrl.searchParams.get('clip'))
    }

    return normalizeTwitchClipSlug(sourceUrl.pathname.slice(1))
  }

  if (!isTwitchWatchHostname(sourceUrl.hostname)) {
    return null
  }

  const pathMatch = sourceUrl.pathname.match(
    /^\/(?:[a-zA-Z0-9_]{4,25}\/)?clip\/([a-zA-Z0-9_-]+)\/?$/,
  )

  return pathMatch?.[1] ? normalizeTwitchClipSlug(pathMatch[1]) : null
}

function addTwitchParentParam(embedUrl: URL): URL {
  const parent = getTwitchParentValue()
  const nextEmbedUrl = new URL(embedUrl)

  nextEmbedUrl.searchParams.delete('parent')

  if (parent) {
    nextEmbedUrl.searchParams.set('parent', parent)
  }

  return nextEmbedUrl
}

function getTwitchParentValue(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  return window.location.hostname || null
}

function copyBooleanSearchParam(
  sourceUrl: URL,
  targetUrl: URL,
  paramName: string,
): void {
  const value = sourceUrl.searchParams.get(paramName)

  if (value === 'true' || value === 'false') {
    targetUrl.searchParams.set(paramName, value)
  }
}

function normalizeTwitchVideoId(value: string | null): string | null {
  if (!value) {
    return null
  }

  const videoId = value.startsWith('v') ? value.slice(1) : value

  return /^\d+$/.test(videoId) ? videoId : null
}

function normalizeTwitchChannel(value: string | null): string | null {
  return value && /^[a-zA-Z0-9_]{4,25}$/.test(value) ? value : null
}

function normalizeTwitchClipSlug(value: string | null): string | null {
  return value && /^[a-zA-Z0-9_-]+$/.test(value) ? value : null
}

function isTwitchWatchHostname(hostname: string): boolean {
  return hostname === 'twitch.tv' || hostname === 'www.twitch.tv'
}

function isReservedTwitchPath(path: string): boolean {
  return [
    'directory',
    'downloads',
    'inventory',
    'jobs',
    'p',
    'settings',
    'subscriptions',
    'turbo',
    'videos',
    'wallet',
  ].includes(path.toLowerCase())
}

function isSignedInteger(value: string | null | undefined): value is string {
  return typeof value === 'string' && /^-?\d+$/.test(value)
}

function isPositiveInteger(value: string | null | undefined): value is string {
  return typeof value === 'string' && /^\d+$/.test(value)
}

function isAllowedVkHash(value: string | null | undefined): boolean {
  return value === undefined || value === null || /^[a-zA-Z0-9_-]+$/.test(value)
}

function isAllowedVkHd(value: string | null | undefined): boolean {
  return value === undefined || value === null || /^[0-9]$/.test(value)
}

function isHostnameOrSubdomain(hostname: string, domain: string): boolean {
  return hostname === domain || hostname.endsWith(`.${domain}`)
}
