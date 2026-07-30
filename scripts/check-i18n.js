#!/usr/bin/env node
/**
 * Checks that constants/locales/{en,ru,uz}/translation.json all define the
 * same set of keys. Run: node scripts/check-i18n.js (or `npm run i18n:check`).
 * Exits with a non-zero code if any language is missing a key that exists
 * in another, so it can be wired into CI later if desired.
 */
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const LANGS = ['uz', 'ru', 'en']
const LOCALES_DIR = join(__dirname, '..', 'constants', 'locales')

function loadKeys(lang) {
  const path = join(LOCALES_DIR, lang, 'translation.json')
  const raw = readFileSync(path, 'utf-8')
  const data = JSON.parse(raw)
  return { data, keys: new Set(Object.keys(data)) }
}

function main() {
  const perLang = {}
  for (const lang of LANGS) {
    perLang[lang] = loadKeys(lang)
  }

  const allKeys = new Set()
  for (const lang of LANGS) {
    for (const key of perLang[lang].keys) allKeys.add(key)
  }

  const missing = {}
  for (const lang of LANGS) missing[lang] = []

  const emptyValues = {}
  for (const lang of LANGS) emptyValues[lang] = []

  for (const key of allKeys) {
    for (const lang of LANGS) {
      if (!perLang[lang].keys.has(key)) {
        missing[lang].push(key)
      } else {
        const val = perLang[lang].data[key]
        if (val === '' || val === null || val === undefined) {
          emptyValues[lang].push(key)
        }
      }
    }
  }

  let hasProblems = false

  console.log(`Checked ${allKeys.size} unique keys across [${LANGS.join(', ')}]\n`)

  for (const lang of LANGS) {
    console.log(`${lang}: ${perLang[lang].keys.size} keys`)
  }
  console.log('')

  for (const lang of LANGS) {
    if (missing[lang].length > 0) {
      hasProblems = true
      console.log(`\n[MISSING] ${lang} is missing ${missing[lang].length} key(s) present in other languages:`)
      for (const key of missing[lang].sort()) {
        console.log(`  - ${key}`)
      }
    }
  }

  for (const lang of LANGS) {
    if (emptyValues[lang].length > 0) {
      hasProblems = true
      console.log(`\n[EMPTY] ${lang} has ${emptyValues[lang].length} key(s) with an empty/null value:`)
      for (const key of emptyValues[lang].sort()) {
        console.log(`  - ${key}`)
      }
    }
  }

  if (!hasProblems) {
    console.log('\nAll good — every key is present and non-empty in all languages.')
    process.exit(0)
  } else {
    console.log('\ni18n check failed — see above.')
    process.exit(1)
  }
}

main()
