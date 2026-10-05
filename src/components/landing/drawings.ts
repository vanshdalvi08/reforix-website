/**
 * Illustrative drawings for the projects gallery, generated as SVG markup.
 * They match the demo plant in the hero. Replace with the client's real sheets when available.
 *
 * Classes map to line types in landing.css: e outline, q equipment, p process, s steam,
 * w cooling water, a instrument air, d drain, g grid, m dimension. `fd` marks parts that fade
 * in after the line-drawing animation instead of being drawn.
 */

/** Plot plan: the skid seen from above, 13 px per metre. */
export function plotPlanSvg(): string {
  const px = (x: number) => +(380 + x * 13).toFixed(1);
  const pz = (z: number) => +(215 + z * 13).toFixed(1);
  const rect = (a: number, b: number, c: number, d: number, cls: string) =>
    `<rect class="${cls}" x="${px(a)}" y="${pz(b)}" width="${(px(c) - px(a)).toFixed(1)}" height="${(pz(d) - pz(b)).toFixed(1)}"/>`;
  const line = (a: number, b: number, c: number, d: number, cls: string) =>
    `<path class="${cls}" d="M${px(a)} ${pz(b)}L${px(c)} ${pz(d)}"/>`;
  const tag = (x: number, z: number, text: string) =>
    `<text class="k" x="${px(x)}" y="${pz(z) + 4}" text-anchor="middle">${text}</text>`;

  const columnsX = [-14, -5, 4, 13];
  const columnsZ = [-9, -1];
  let h = "";
  columnsX.forEach((x, i) => {
    h += `<path class="g fd" d="M${px(x)} ${pz(-12)}V${pz(10)}"/><circle class="m" cx="${px(x)}" cy="${pz(-12.8)}" r="11"/>${tag(x, -12.8, "ABCD".charAt(i))}`;
  });
  columnsZ.forEach((z, i) => {
    h += `<path class="g fd" d="M${px(-16.5)} ${pz(z)}H${px(15)}"/><circle class="m" cx="${px(-17.3)}" cy="${pz(z)}" r="11"/>${tag(-17.3, z, String(i + 1))}`;
  });
  h += rect(-14, -9, 13, -1, "e");
  for (const x of columnsX)
    for (const z of columnsZ) h += `<rect class="e" x="${px(x) - 3.5}" y="${pz(z) - 3.5}" width="7" height="7"/>`;
  h += `<circle class="q" cx="${px(-9)}" cy="${pz(5)}" r="39"/><circle class="q" cx="${px(-2)}" cy="${pz(5)}" r="28.6"/>`;
  h += rect(1.5, 3.4, 12.5, 6.6, "q") + rect(11.1, 4.8, 16.1, 7.2, "q");
  h += line(-9, -4, 12.6, -4, "p") + line(-9, -4, -9, 5, "p") + line(3, -4, 3, 5, "p") + line(12.6, -4, 12.6, 6, "p");
  h += line(-14, -5.5, 6, -5.5, "s") + line(-2, -5.5, -2, 5, "s");
  h += line(-12, -7.2, 12, -7.2, "w") + line(10.5, -7.2, 10.5, 8.5, "w");
  h += line(-12, -1, 8, -1, "d") + line(8, -1, 8, 3.2, "d");
  h += `<path class="a fd" d="M${px(-6)} ${pz(-2.5)}H${px(10)}M${px(-5.1)} ${pz(-2.5)}V${pz(5.8)}"/>`;
  h += tag(-9, 5, "V-101") + tag(-2, 5, "V-102") + tag(7, 5, "E-101") + tag(13.6, 6, "P-101");
  h += `<path class="m" d="M${px(-14)} ${pz(10)}V${pz(11.4)}M${px(13)} ${pz(10)}V${pz(11.4)}M${px(-14)} ${pz(10.9)}H${px(13)}"/>`;
  h += `<text class="k" x="${px(-0.5)}" y="${pz(10.9) - 6}" text-anchor="middle">13 500</text>`;
  h += `<circle class="m" cx="690" cy="70" r="22"/><path class="e" d="M690 56V84M684 66L690 56L696 66"/><text class="k" x="690" y="106" text-anchor="middle">N</text>`;
  return h;
}

/** Piping isometric for one spool, with weld numbers, cut lengths and a spool table. */
export function isometricSvg(): string {
  const scale = 38;
  const ox = 230;
  const oy = 150;
  const P = (x: number, y: number, z: number): [number, number] => [
    ox + (x - z) * 0.866 * scale,
    oy + (x + z) * 0.5 * scale - y * scale,
  ];
  const at = (p: [number, number]) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
  const route: [number, number, number][] = [
    [0, 0, 0],
    [6, 0, 0],
    [6, 5, 0],
    [6, 5, 4],
    [10, 5, 4],
    [10, 2, 4],
  ];
  const points = route.map(([x, y, z]) => P(x, y, z));

  let h = `<path class="p" d="M${points.map(at).join("L")}"/>`;
  h += `<path class="e" d="M${at(P(0, -1, -1.2))}L${at(P(0, 1, -1.2))}M${at(P(0, -1, 1.2))}L${at(P(0, 1, 1.2))}"/>`;
  h += `<path class="e" d="M${at(P(10, 2, 3))}L${at(P(10, 2, 5))}"/>`;
  points.forEach((q, i) => {
    h += `<circle class="e" cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="7"/><text class="k" x="${(q[0] + 11).toFixed(1)}" y="${(q[1] - 9).toFixed(1)}">W${i + 1}</text>`;
  });
  const cut = (p: [number, number], dx: number, dy: number, text: string) =>
    `<text class="cp" x="${(p[0] + dx).toFixed(1)}" y="${(p[1] + dy).toFixed(1)}">${text}</text>`;
  h += cut(P(3, 0, 0), -34, 34, "3 000");
  h += cut(P(6, 2.5, 0), 16, 4, "2 500");
  h += cut(P(6, 5, 2), 8, -16, "2 000");
  h += cut(P(8, 5, 4), -6, -16, "2 000");
  h += cut(P(10, 3.5, 4), 16, 4, "1 500");
  h +=
    `<rect class="e" x="560" y="40" width="170" height="104"/><path class="m" d="M560 66H730M560 92H730M560 118H730M648 66V144"/>` +
    `<text class="k" x="570" y="58">Spool 01</text><text class="k" x="570" y="84">Line</text><text class="cp" x="656" y="84">6"-P-1001</text>` +
    `<text class="k" x="570" y="110">Welds</text><text class="k" x="656" y="110">6 shop</text><text class="k" x="570" y="136">Cut</text><text class="k" x="656" y="136">9 000 mm</text>`;
  return h;
}
