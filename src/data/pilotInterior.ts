/** Visual study traced from the reference; normalized coordinates, not architectural dimensions. */
export type FurnitureKind = 'bed' | 'single-bed' | 'wardrobe' | 'nightstand' | 'sofa' | 'dining' | 'console' | 'kitchen' | 'vanity' | 'toilet' | 'shower' | 'suite-shower' | 'laundry'
export const pilotInterior = {
  furniture: [
    { kind: 'bed', x: 123, z: 92, rotation: 0 },
    { kind: 'nightstand', x: 88, z: 61, rotation: 0 }, { kind: 'nightstand', x: 158, z: 61, rotation: 0 },
    { kind: 'wardrobe', x: 205, z: 90, rotation: 0 },
    { kind: 'single-bed', x: 256, z: 68, rotation: -Math.PI / 2 },
    { kind: 'single-bed', x: 240, z: 157, rotation: 0 },
    { kind: 'single-bed', x: 460, z: 68, rotation: -Math.PI / 2 },
    { kind: 'single-bed', x: 511, z: 157, rotation: 0 },
    { kind: 'sofa', x: 665, z: 22, rotation: 0 },
    { kind: 'dining', x: 590, z: 70, rotation: 0 },
    { kind: 'console', x: 685, z: 115, rotation: 0 },
    { kind: 'kitchen', x: 626, z: 182, rotation: 0 },
    // Central bathroom: wet zone at the left; dry fixtures share the right wall.
    { kind: 'shower', x: 348, z: 97, rotation: 0 },
    { kind: 'vanity', x: 397, z: 65, rotation: 0 },
    { kind: 'toilet', x: 397, z: 97, rotation: 0 },
    // Narrow bathroom: fixtures face the circulation and stay against the left wall.
    { kind: 'vanity', x: 17, z: 21, rotation: Math.PI / 2 },
    { kind: 'toilet', x: 17, z: 66, rotation: Math.PI / 2 },
    { kind: 'suite-shower', x: 32, z: 108, rotation: 0 },
    { kind: 'laundry', x: 745, z: 181, rotation: 0 },
  ] as { kind: FurnitureKind; x: number; z: number; rotation: number }[],
  floors: [
    { rect: [4, 4, 994, 196], material: 'stone' },
    { rect: [64, 50, 213, 131], material: 'oak' },
    { rect: [222, 55, 326, 192], material: 'oak' },
    { rect: [427, 55, 531, 192], material: 'oak' },
    { rect: [8, 123, 213, 192], material: 'gravel' },
    { rect: [334, 113, 419, 192], material: 'gravel' },
    { rect: [782, 122, 990, 192], material: 'grass' },
    { rect: [778, 8, 990, 118], material: 'paver' },
  ] as { rect: [number, number, number, number]; material: 'stone' | 'oak' | 'gravel' | 'grass' | 'paver' }[],
  doors: [[60, 43, 60, 74], [293, 51, 325, 51], [386, 51, 416, 51], [498, 51, 531, 51], [715, 129, 715, 160]],
  roomViews: [
    { label: 'Casa inteira', x: 500, z: 100, distance: 40 },
    { label: 'Suíte', x: 130, z: 94, distance: 8 },
    { label: 'Quartos', x: 430, z: 123, distance: 12 },
    { label: 'Sala e cozinha', x: 620, z: 100, distance: 13 },
    { label: 'Banheiros', x: 370, z: 82, distance: 6.5 },
    { label: 'Banheiro da suíte', x: 32, z: 61, distance: 7.6 },
  ],
}

