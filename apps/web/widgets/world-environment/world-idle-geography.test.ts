import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const root = join(dir, '../..');
const geographyPath = join(dir, 'world-idle-geography.css');
const geographyCss = existsSync(geographyPath)
  ? readFileSync(geographyPath, 'utf8')
  : '';
const environmentSource = readFileSync(join(dir, 'world-environment.tsx'), 'utf8');
const plateSource = readFileSync(join(dir, 'environment-plate-layer.tsx'), 'utf8');
const livingCss = readFileSync(join(dir, 'world-living-presence.css'), 'utf8');
const presenceCss = readFileSync(join(dir, 'world-idle-presence.css'), 'utf8');
const constantsSource = readFileSync(
  join(dir, 'world-environment.constants.ts'),
  'utf8',
);
const assetsSource = readFileSync(
  join(root, 'shared/config/assets/aetheranime.assets.ts'),
  'utf8',
);
const sceneSource = readFileSync(join(dir, '../world-scene/world-scene.tsx'), 'utf8');
const kindSource = readFileSync(join(dir, '../world-kind/world-kind.tsx'), 'utf8');
const atmosphereSource = readFileSync(
  join(dir, '../atmosphere-layer/atmosphere-layer.tsx'),
  'utf8',
);
const publicEnv = join(
  root,
  'public/assets/aetheranime/worlds/aetheranime/environment',
);

const FAR_LANDSCAPE = 'aetheranime-world-far-landscape.webp';
const FAR_PORTRAIT = 'aetheranime-world-far-portrait.webp';
const MID_CONTINUATION = 'aetheranime-depth-midground-continuation-landscape.webp';

describe('TASK-058-E world idle geographic artwork', () => {
  test('far landscape, far portrait, and mid continuation are shipped locally', () => {
    assert.equal(existsSync(join(publicEnv, FAR_LANDSCAPE)), true);
    assert.equal(existsSync(join(publicEnv, FAR_PORTRAIT)), true);
    assert.equal(existsSync(join(publicEnv, MID_CONTINUATION)), true);
  });

  test('asset manifest registers the new geographic plates', () => {
    assert.match(assetsSource, /far:\s*\{/);
    assert.match(assetsSource, new RegExp(FAR_LANDSCAPE.replace(/\./g, '\\.')));
    assert.match(assetsSource, new RegExp(FAR_PORTRAIT.replace(/\./g, '\\.')));
    assert.match(
      assetsSource,
      /midgroundContinuation|midground-continuation/,
    );
    assert.match(
      assetsSource,
      new RegExp(MID_CONTINUATION.replace(/\./g, '\\.')),
    );
    // Existing identity plates remain.
    assert.match(assetsSource, /aetheranime-world-hero\.webp/);
    assert.match(assetsSource, /aetheranime-world-portrait\.webp/);
    assert.match(assetsSource, /aetheranime-depth-foreground-landscape\.webp/);
  });

  test('WorldEnvironment paints far → hero → mid continuation → sparse mid → foreground', () => {
    assert.match(
      environmentSource,
      /slot="world-environment-far"/,
    );
    assert.match(
      environmentSource,
      /slot="world-environment-image"/,
    );
    assert.match(
      environmentSource,
      /slot="world-environment-midground-continuation"/,
    );
    assert.match(
      environmentSource,
      /slot="world-environment-midground-architecture"/,
    );
    assert.match(
      environmentSource,
      /slot="world-environment-foreground-architecture"/,
    );

    const far = environmentSource.indexOf('slot="world-environment-far"');
    const hero = environmentSource.indexOf('slot="world-environment-image"');
    const midNew = environmentSource.indexOf(
      'slot="world-environment-midground-continuation"',
    );
    const midSparse = environmentSource.indexOf(
      'slot="world-environment-midground-architecture"',
    );
    const fore = environmentSource.indexOf(
      'slot="world-environment-foreground-architecture"',
    );
    assert.ok(far >= 0 && hero > far && midNew > hero);
    assert.ok(midSparse > midNew && fore > midSparse);
  });

  test('far and mid continuation stay static — no parallax transform amplitude', () => {
    assert.match(constantsSource, /WORLD_ENVIRONMENT_DEPTH_TRANSFORM/);
    // Far / continuation must not reuse midground/foreground parallax amplitude.
    const farBlock = environmentSource.slice(
      environmentSource.indexOf('slot="world-environment-far"'),
      environmentSource.indexOf('slot="world-environment-image"'),
    );
    assert.doesNotMatch(farBlock, /DEPTH_TRANSFORM\.midground/);
    assert.doesNotMatch(farBlock, /DEPTH_TRANSFORM\.foreground/);
    assert.doesNotMatch(farBlock, /DEPTH_TRANSFORM\.distance/);
  });

  test('idle geography stylesheet exists and gates World Idle only', () => {
    assert.equal(existsSync(geographyPath), true);
    assert.match(environmentSource, /world-idle-geography\.css/);
    assert.match(
      geographyCss,
      /\[data-slot='world-scene'\]:not\(\[data-world-anime\]\)/,
    );
    assert.doesNotMatch(geographyCss, /atmosphere-layer/);
    assert.doesNotMatch(atmosphereSource, /world-idle-geography/);
  });

  test('Home and Destination do not receive idle geographic expansion by default', () => {
    // New plates are inert unless idle world-scene enables them.
    assert.match(
      geographyCss,
      /\[data-slot='world-environment-far'\][\s\S]*?(opacity:\s*0|visibility:\s*hidden|display:\s*none)/,
    );
    assert.match(
      geographyCss,
      /\[data-slot='world-environment-midground-continuation'\][\s\S]*?(opacity:\s*0|visibility:\s*hidden|display:\s*none)/,
    );
    assert.match(
      geographyCss,
      /\[data-slot='world-scene'\]:not\(\[data-world-anime\]\)[\s\S]*?world-environment-far/,
    );
  });

  test('hero/far blend avoids hard rectangular inset cards', () => {
    assert.doesNotMatch(
      geographyCss,
      /world-environment-image\]\s*\{[^}]*inset:\s*[^;]*\d{2,}%/,
    );
    // Prefer soft reveal primitives over a second framed scene.
    assert.match(
      geographyCss,
      /mix-blend-mode|mask-image|webkit-mask/,
    );
  });

  test('portrait uses dedicated far portrait — not a landscape crop', () => {
    assert.match(environmentSource, /environment\.far\.portrait|far\.portrait/);
    assert.match(assetsSource, new RegExp(FAR_PORTRAIT.replace(/\./g, '\\.')));
    assert.doesNotMatch(
      geographyCss,
      /midground-continuation[\s\S]*orientation:\s*portrait[\s\S]*opacity:\s*[1-9]/,
    );
  });

  test('geographic expansion is static — no keyframes, will-change, or new compositor', () => {
    assert.doesNotMatch(geographyCss, /@keyframes/);
    assert.doesNotMatch(geographyCss, /will-change\s*:/);
    assert.doesNotMatch(geographyCss, /animation:/);
    assert.doesNotMatch(
      geographyCss,
      /requestAnimationFrame|WebGL|canvas|particle/i,
    );
    assert.doesNotMatch(environmentSource, /from 'three'|gsap|lenis/);
  });

  test('reduced motion must not remove the geographic stack', () => {
    assert.doesNotMatch(
      geographyCss,
      /prefers-reduced-motion[\s\S]*?world-environment-far[\s\S]*?(display:\s*none|opacity:\s*0)/,
    );
    assert.match(presenceCss, /prefers-reduced-motion:\s*reduce/);
  });

  test('TASK-046 compositor freeze and TASK-055 presence remain the idle breath owners', () => {
    assert.match(livingCss, /animation:\s*aether-living-light 19\.2s/);
    assert.match(livingCss, /inset:\s*18%\s*16%/);
    assert.match(presenceCss, /aether-idle-atmosphere/);
    assert.match(presenceCss, /aether-idle-light/);
    assert.doesNotMatch(geographyCss, /aether-living-light|aether-idle-light/);
  });

  test('protected World Idle contracts are not reopened', () => {
    assert.match(sceneSource, /WorldRealmCrossing/);
    assert.match(kindSource, /data-kind-landmarks/);
    assert.match(constantsSource, /WORLD_ENVIRONMENT_DEPTH_OVERSCAN/);
    assert.match(plateSource, /WORLD_ENVIRONMENT_DEPTH_OVERSCAN/);
    assert.doesNotMatch(environmentSource, /WORLD_REGION_REGISTRY/);
    assert.doesNotMatch(
      geographyCss,
      /world-kind|world-navigator|anime-destination|memory-horizon/,
    );
  });
});

describe('TASK-064 mobile portrait geographic bands', () => {
  test('portrait keeps mid-continuation inert — no landscape plate on tall viewports', () => {
    assert.match(
      geographyCss,
      /orientation:\s*portrait[\s\S]*?world-environment-midground-continuation[\s\S]*?opacity:\s*0/,
    );
  });

  test('portrait differentiates far / sparse-mid / foreground crops as static bands', () => {
    // Far basin reads lower in frame so the world continues past UI chrome.
    assert.match(
      geographyCss,
      /orientation:\s*portrait[\s\S]*?world-environment-far[\s\S]*?object-position:\s*50%\s*7[0-9]%/,
    );
    // Sparse mid becomes the portrait middle band (continuation stays landscape-only).
    assert.match(
      geographyCss,
      /orientation:\s*portrait[\s\S]*?world-environment-midground-architecture[\s\S]*?object-position:/,
    );
    assert.match(
      geographyCss,
      /orientation:\s*portrait[\s\S]*?world-environment-midground-architecture[\s\S]*?opacity:\s*0\.(3[5-9]|4[0-5])/,
    );
    // Foreground anchors nearer the traveller.
    assert.match(
      geographyCss,
      /orientation:\s*portrait[\s\S]*?world-environment-foreground-architecture[\s\S]*?object-position:\s*50%\s*9[0-9]%/,
    );
  });

  test('narrow portrait deepens overscan without new assets, mist, or will-change', () => {
    assert.match(
      geographyCss,
      /orientation:\s*portrait\)\s*and\s*\(max-width:\s*639px\)[\s\S]*?world-environment-far/,
    );
    assert.doesNotMatch(geographyCss, /@keyframes|will-change\s*:|animation:/);
    assert.doesNotMatch(
      geographyCss,
      /aetheranime-depth-midground-continuation.*portrait|new-art|canvas|WebGL/i,
    );
  });
});
