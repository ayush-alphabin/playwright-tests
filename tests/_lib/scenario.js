// Deterministic scenario harness for the variations.spec.js suite.
//
// Outcome of every variation test is a pure function of (branch, run, test_name).
// This lets us pre-compute expected L5 snapshot values and compare to actual.
//
// Required env vars at run time:
//   TESTDINO_BRANCH  — must match `git branch --show-current`; fail-fast on mismatch
//   TESTDINO_RUN     — 1, 2, 3, … (which run-of-this-branch are we executing)

const { execSync } = require('node:child_process');

let cachedBranch = null;

function assertBranch() {
  if (cachedBranch !== null) return cachedBranch;
  const expected = process.env.TESTDINO_BRANCH;
  if (!expected) {
    throw new Error('TESTDINO_BRANCH env var is required');
  }
  let actual;
  try {
    actual = execSync('git branch --show-current', { stdio: ['ignore', 'pipe', 'pipe'] })
      .toString()
      .trim();
  } catch (err) {
    throw new Error(`failed to read git branch: ${err.message}`);
  }
  if (actual !== expected) {
    throw new Error(
      `branch mismatch: TESTDINO_BRANCH=${expected} but git is on ${actual}`
    );
  }
  cachedBranch = actual;
  return actual;
}

function runNumber() {
  const v = Number(process.env.TESTDINO_RUN || '1');
  if (!Number.isInteger(v) || v < 1) {
    throw new Error(`TESTDINO_RUN must be a positive integer, got ${process.env.TESTDINO_RUN}`);
  }
  return v;
}

// 32-bit FNV-1a hash — small, fast, deterministic across Node versions.
function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

// xorshift32 seeded from (branch, run, testKey) → float in [0, 1).
// Same inputs → same output across machines / Node versions.
function seededRand(testKey) {
  const seed = fnv1a(`${assertBranch()}|${runNumber()}|${testKey}`);
  let s = seed === 0 ? 1 : seed; // xorshift on 0 is degenerate
  s ^= s << 13; s >>>= 0;
  s ^= s >>> 17; s >>>= 0;
  s ^= s << 5;  s >>>= 0;
  return s / 0x100000000;
}

module.exports = { assertBranch, runNumber, seededRand };
