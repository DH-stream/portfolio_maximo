import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (file) => readFile(new URL(`../${file}`, import.meta.url), 'utf8');

test('startsidan positionerar Max mot logistik, processförbättring och automation', async () => {
  const html = await read('index.html');
  assert.match(html, /Transportplanerare/i);
  assert.match(html, /Processförbättring/i);
  assert.match(html, /Automation/i);
  assert.doesNotMatch(html, /skalbara molnlösningar|AI-integrationer/i);
});

test('projektsidan lyfter de relevanta projekten och utelämnar Fillguard', async () => {
  const html = await read('projects.html');
  assert.match(html, /A-kod Automation/i);
  assert.match(html, /Click Notes/i);
  assert.match(html, /Hem-Listan/i);
  assert.match(html, /Homeboard/i);
  assert.doesNotMatch(html, /Fillguard|FillingGrade/i);
});

test('CV-sidan använder uppdaterad Link-tidslinje och exponerar inte full hemadress eller telefonnummer', async () => {
  const html = await read('cv.html');
  assert.match(html, /Interim Warehouse[^<]*Operations Manager/i);
  assert.match(html, /2023/);
  assert.match(html, /Warehouse[^<]*Operations Supervisor/i);
  assert.match(html, /2022/);
  assert.doesNotMatch(html, /Stationsgatan 3/i);
  assert.doesNotMatch(html, /072-225 22 60/);
});
