export function bytesToMegabytes(bytes: number, round?: boolean): number {
  const megabytes = bytes / (1024 * 1024)
  if (round) return Math.round(megabytes * 100) / 100
  return megabytes
}

export function stringToSlug(string: string): string {
  return string
    .toLowerCase()
    .replace(/[^\w -]+/g, "")
    .replace(/ +/g, "-")
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
