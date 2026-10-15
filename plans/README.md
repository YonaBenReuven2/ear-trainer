# Session plans

Each file here is one plan the app offers. `index.json` lists which files to load.

A plan runs as a series of blocks. At every block the app asks before it changes
anything; nothing is applied until you say so.

```json
{
  "id": "daily-12",            // unique, stable; used to remember your choice
  "name": "Daily 12 minutes",  // shown in the picker
  "note": "One line about when to use it.",
  "blocks": [ ... ]
}
```

A block:

| Field   | Values | Meaning |
|---------|--------|---------|
| `mins`  | 1–60 | how long the block runs |
| `mode`  | `match`, `identify`, `produce`, `both` | Match the pitch / Identify only / Sing a named degree / Hear → sing → name |
| `level` | `keep`, `"0"`–`"3"` | tonic triad, pentatonic, full scale, wide range |
| `key`   | `keep`, `fixed`, `session`, `"10"`, `"8"`, `"5"`, `"3"`, `"2"`, `"1"` | how often the key changes — a number means every N questions |
| `cad`   | `keep`, `classic`, `mixed` | cadence style |
| `hide`  | `keep`, `on`, `off` | hide the note names while singing |
| `label` | text | the block's name, shown in the prompt and the timer |
| `note`  | text | a line of guidance, shown in the prompt |

`keep` means "leave that setting as it is", so a block only changes what it
names.

## Editing

Edit these files for plans you want to keep and share — they load for every
device that opens the app.

You can also edit any plan inside the app without touching the repo. The first
edit copies that plan into your browser's storage and the app uses your version,
marked *edited*, with a **Revert to repo copy** button. When a local edit has
proved itself, press **Copy JSON** in the app and paste it back into the file
here, so it becomes the shared version.

Plans you create in the app (**New plan**, **Duplicate**) live only in that
browser until you copy them into a file here and add the filename to
`index.json`.
