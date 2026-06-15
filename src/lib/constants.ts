export const STORAGE_KEYS = {} as const;

export const EDITOR = {
  MAX_CODE_SIZE_BYTES: 100 * 1024, // 100KB
  DEFAULT_CODE: `// Welcome to Algopatterns!
// Edit the code below and press play
// Learn more at strudel.cc/learn

// tempo
setCpm(108/4)

// drums
$: stack(
  cat(
    s("bd").bank("tr808").beat("0,7,8", 16),
    s("bd").bank("tr808").beat("0,2,7,8,14", 16),
  ),

  s("sd:8").bank("tr808").beat("4,12", 16),
  s("hh*8").bank("tr808").gain(0.3),
)

// chords
$: note("<[0,3,7] [0,4,7]>".add("<b2 g2 b2 a2>")).room(.5).sustain(0.2).sound("gm_acoustic_guitar_nylon")`,
} as const;
