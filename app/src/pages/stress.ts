import * as gen from '../generated/index';

export function renderStress(container: HTMLElement): void {
  container.innerHTML = '<h1 data-testid="stress-heading">Coverage Stress Test</h1><div id="stress-output"></div>';

  const output = document.getElementById('stress-output')!;
  const results: string[] = [];

  for (let i = 1; i <= 800; i++) {
    const calcFn = (gen as Record<string, (a: number, b: number) => number>)[`calculateMetric${i}`];
    const fmtFn = (gen as Record<string, (v: number) => string>)[`formatValue${i}`];
    const valFn = (gen as Record<string, (s: string) => { valid: boolean; reason: string }>)[`validateInput${i}`];
    const procFn = (gen as Record<string, (items: number[]) => { sum: number }>)[`processData${i}`];
    const transFn = (gen as Record<string, (d: Record<string, number>) => Record<string, string>>)[`transform${i}`];
    const classFn = (gen as Record<string, (v: number) => string>)[`classify${i}`];

    if (calcFn && fmtFn && valFn && procFn && transFn && classFn) {
      const calc = calcFn(i, i * 2);
      const fmt = fmtFn(calc);
      const valid = valFn(`item-${i}`);
      const proc = procFn([i, i + 1, i + 2]);
      const trans = transFn({ a: i, b: i * 10 });
      const cls = classFn(i);
      results.push(`#${i}: ${fmt} ${valid.reason} ${proc.sum} ${cls} ${JSON.stringify(trans)}`);
    }
  }

  output.innerHTML = `<p data-testid="stress-count">${results.length} modules exercised</p>`;
}
