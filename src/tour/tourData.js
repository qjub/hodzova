// Načítanie, normalizácia a export "tour balíka".
//
// tour.json je jediný zdroj pravdy o prehliadke. Tento súbor ho len:
//  - načíta zo zadanej URL,
//  - odvodí base adresu (priečinok), voči ktorej sa prekladajú názvy obrázkov,
//  - znormalizuje do tvaru, s ktorým pracuje appka,
//  - a vie ho zase serializovať späť do čistého JSON (Export v EDIT režime).

/** Adresár, v ktorom leží tour.json (vrátane koncového "/"). */
export function dirOf(url) {
  const i = url.lastIndexOf('/');
  return i === -1 ? '' : url.slice(0, i + 1);
}

/** Z relatívneho názvu súboru spraví plnú URL voči base adresáru toura. */
export function resolveAsset(baseUrl, path) {
  if (!path) return path;
  if (/^(https?:)?\/\//.test(path) || path.startsWith('/') || path.startsWith('data:')) {
    return path; // už absolútne / externé
  }
  return baseUrl + path;
}

/** Zaokrúhlenie uhlov, nech je exportovaný JSON čitateľný. */
const r4 = (n) => Math.round(n * 1e4) / 1e4;

/** Načíta a znormalizuje tour. Vracia { data, baseUrl }. */
export async function loadTour(src) {
  const res = await fetch(src, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`Nepodarilo sa načítať ${src} (HTTP ${res.status})`);
  const raw = await res.json();
  return { data: normalizeTour(raw), baseUrl: dirOf(src) };
}

/** Doplní chýbajúce polia a zjednotí tvar dát. */
export function normalizeTour(raw) {
  const nodes = (raw.nodes || []).map((n) => ({
    id: n.id,
    name: n.name || n.id,
    panorama: n.panorama,
    thumbnail: n.thumbnail || undefined,
    sphereCorrection: n.sphereCorrection || undefined,
    links: (n.links || []).map((l) => ({
      nodeId: l.nodeId,
      yaw: Number(l.yaw) || 0,
      pitch: Number(l.pitch) || 0,
    })),
    markers: n.markers || undefined,
  }));

  const floorplan = raw.floorplan
    ? {
        image: raw.floorplan.image,
        rooms: (raw.floorplan.rooms || []).map((r) => ({
          nodeId: r.nodeId,
          x: Number(r.x) || 0, // 0..1 (pomer šírky)
          y: Number(r.y) || 0, // 0..1 (pomer výšky)
          label: r.label || undefined,
        })),
      }
    : null;

  return {
    name: raw.name || 'Prehliadka',
    startNodeId: raw.startNodeId || nodes[0]?.id || null,
    floorplan,
    nodes,
  };
}

/** Pripraví uzol do tvaru, ktorý žerie VirtualTourPlugin. */
export function toPsvNode(node, baseUrl) {
  return {
    id: node.id,
    name: node.name,
    // caption zámerne nenastavujeme — tooltip nad šípkou by inak vypísal názov 2×
    // (PSV skladá tooltip z name + caption). Názov miestnosti drží `name`.
    panorama: resolveAsset(baseUrl, node.panorama),
    thumbnail: node.thumbnail ? resolveAsset(baseUrl, node.thumbnail) : undefined,
    sphereCorrection: node.sphereCorrection,
    links: node.links.map((l) => ({
      nodeId: l.nodeId,
      position: { yaw: l.yaw, pitch: l.pitch },
    })),
    markers: node.markers,
  };
}

/** Čistý JSON na stiahnutie (Export). */
export function toExportJson(tour) {
  const out = {
    name: tour.name,
    startNodeId: tour.startNodeId,
    floorplan: tour.floorplan
      ? {
          image: tour.floorplan.image,
          rooms: tour.floorplan.rooms.map((r) => ({
            nodeId: r.nodeId,
            x: r4(r.x),
            y: r4(r.y),
            ...(r.label ? { label: r.label } : {}),
          })),
        }
      : null,
    nodes: tour.nodes.map((n) => ({
      id: n.id,
      name: n.name,
      panorama: n.panorama,
      ...(n.thumbnail ? { thumbnail: n.thumbnail } : {}),
      ...(n.sphereCorrection ? { sphereCorrection: n.sphereCorrection } : {}),
      links: n.links.map((l) => ({ nodeId: l.nodeId, yaw: r4(l.yaw), pitch: r4(l.pitch) })),
      ...(n.markers ? { markers: n.markers } : {}),
    })),
  };
  return JSON.stringify(out, null, 2);
}
