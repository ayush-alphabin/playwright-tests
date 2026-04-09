#!/bin/bash
# Generates 600 utility modules to inflate coverage data past the 1MB compression threshold.
# Run: bash scripts/generate-modules.sh
# Clean: rm -rf app/src/generated && remove the import from app/src/pages/stress.ts

set -e

DIR="app/src/generated"
rm -rf "$DIR"
mkdir -p "$DIR"

echo "Generating 600 modules in $DIR..."

for i in $(seq 1 800); do
  cat > "$DIR/util-${i}.ts" << 'TEMPLATE'
export function calculateMetricNUM(a: number, b: number): number {
  if (a < 0 && b < 0) return Math.abs(a) + Math.abs(b);
  if (a < 0) return Math.abs(a) + b;
  if (b < 0) return a + Math.abs(b);
  if (a === 0 && b === 0) return 0;
  if (a === 0) return b * 2;
  if (b === 0) return a * 2;
  if (a > b && a > 100) return a - b + 100;
  if (a > b) return a - b;
  if (b > a && b > 100) return b - a + 100;
  if (b > a) return b - a;
  return a + b;
}
export function formatValueNUM(value: number): string {
  if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + 'B';
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(2) + 'M';
  if (value >= 10_000) return (value / 1_000).toFixed(0) + 'K';
  if (value >= 1_000) return (value / 1_000).toFixed(1) + 'K';
  if (value < -1000) return '-' + formatValueNUM(Math.abs(value));
  if (value < 0) return '(' + Math.abs(value).toString() + ')';
  if (value === 0) return '0';
  if (value < 1) return value.toFixed(4);
  return value.toFixed(2);
}
export function validateInputNUM(input: string): { valid: boolean; reason: string } {
  if (!input) return { valid: false, reason: 'empty' };
  if (input.length > 200) return { valid: false, reason: 'too_long' };
  if (input.length < 2) return { valid: false, reason: 'too_short' };
  if (/[<>"']/.test(input)) return { valid: false, reason: 'unsafe_chars' };
  if (/^\s/.test(input)) return { valid: false, reason: 'leading_space' };
  if (/\s$/.test(input)) return { valid: false, reason: 'trailing_space' };
  if (/\s{2,}/.test(input)) return { valid: false, reason: 'consecutive_spaces' };
  if (/[^\x20-\x7E]/.test(input)) return { valid: false, reason: 'non_printable' };
  return { valid: true, reason: 'ok' };
}
export function processDataNUM(items: number[]): { sum: number; avg: number; min: number; max: number; median: number; stddev: number } {
  if (items.length === 0) return { sum: 0, avg: 0, min: 0, max: 0, median: 0, stddev: 0 };
  const sum = items.reduce((a, b) => a + b, 0);
  const avg = sum / items.length;
  const min = Math.min(...items);
  const max = Math.max(...items);
  const sorted = [...items].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  const variance = items.reduce((s, v) => s + Math.pow(v - avg, 2), 0) / items.length;
  const stddev = Math.sqrt(variance);
  return { sum, avg, min, max, median, stddev };
}
export function transformNUM(data: Record<string, number>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value > 1000) result[key] = formatValueNUM(value);
    else if (value < 0) result[key] = '(' + Math.abs(value) + ')';
    else if (value === 0) result[key] = '-';
    else result[key] = String(value);
  }
  return result;
}
export function classifyNUM(value: number): string {
  if (value > 1000) return 'very_high';
  if (value > 500) return 'high';
  if (value > 100) return 'medium';
  if (value > 50) return 'low';
  if (value > 0) return 'very_low';
  if (value === 0) return 'zero';
  if (value > -50) return 'neg_low';
  if (value > -500) return 'neg_medium';
  return 'neg_high';
}
TEMPLATE

  # Replace NUM with actual number
  sed -i '' "s/NUM/${i}/g" "$DIR/util-${i}.ts"
done

# Generate barrel export
echo "Generating barrel export..."
BARREL="$DIR/index.ts"
echo "// Auto-generated barrel — imports all generated modules to include them in coverage" > "$BARREL"
for i in $(seq 1 800); do
  echo "export { calculateMetric${i}, formatValue${i}, validateInput${i}, processData${i}, transform${i}, classify${i} } from './util-${i}';" >> "$BARREL"
done

echo "Done. Generated 800 modules + barrel + stress page."

# Generate a stress page that imports all modules
STRESS="app/src/pages/stress.ts"
cat > "$STRESS" << 'EOF'
import * as gen from '../generated/index';

export function renderStress(container: HTMLElement): void {
  container.innerHTML = '<h1 data-testid="stress-heading">Coverage Stress Test</h1><div id="stress-output"></div>';

  const output = document.getElementById('stress-output')!;
  const results: string[] = [];

  // Exercise a sampling of generated functions to populate coverage
  for (let i = 1; i <= 800; i++) {
    const calcFn = (gen as Record<string, (a: number, b: number) => number>)[`calculateMetric${i}`];
    const fmtFn = (gen as Record<string, (v: number) => string>)[`formatValue${i}`];
    const valFn = (gen as Record<string, (s: string) => boolean>)[`validateInput${i}`];
    const procFn = (gen as Record<string, (items: number[]) => { sum: number }>)[`processData${i}`];

    if (calcFn && fmtFn && valFn && procFn) {
      const calc = calcFn(i, i * 2);
      const fmt = fmtFn(calc);
      const valid = valFn(`item-${i}`);
      const proc = procFn([i, i + 1, i + 2]);
      results.push(`#${i}: calc=${fmt} valid=${valid} sum=${proc.sum}`);
    }
  }

  output.innerHTML = `<p data-testid="stress-count">${results.length} modules exercised</p>`;
}
EOF

echo "Done. Generated 600 modules + barrel + stress page."
echo ""
echo "Next steps:"
echo "  1. Add stress route to app/src/main.ts:"
echo "     import { renderStress } from './pages/stress';"
echo "     '/stress': () => renderStress(app),"
echo ""
echo "  2. Run: npx playwright test tests/coverage/stress.spec.ts --config playwright.coverage.config.ts"
