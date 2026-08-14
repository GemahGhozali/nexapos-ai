export function filterRouteGroupFromSegments(segments: string[]) {
  return segments.filter((segment) => !/^\(.*\)$/.test(segment));
}
