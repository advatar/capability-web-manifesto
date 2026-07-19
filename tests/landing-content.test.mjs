import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (path) => readFileSync(resolve(projectRoot, path), "utf8");

const home = read("src/routes/index.tsx");
const root = read("src/routes/__root.tsx");
const styles = read("src/styles.css");

test("the public narrative does not regress to replacement-Web claims", () => {
  const publicSurface = `${home}\n${root}`;
  const bannedClaims = [
    /\bWeb4\b/i,
    /quiet library/i,
    /\bold web\b/i,
    /hyperlink grew up/i,
    /successor to (?:the )?hyperlink/i,
  ];

  for (const claim of bannedClaims) {
    assert.doesNotMatch(publicSurface, claim);
  }

  assert.match(home, /does not replace\s+hyperlinks, browsers, HTTP/i);
  assert.match(publicSurface, /not a W3C or IETF specification/i);
  assert.match(home, /publisher-declared risk/i);
});

test("primary calls to action resolve to real routes or project resources", () => {
  assert.doesNotMatch(home, /PlaceholderButton/);
  assert.match(home, /to="\/demo"/);
  assert.match(home, /\/docs\/tim-berners-lee-briefing\.md/);
  assert.match(home, /\/docs\/hyperactive-web-v0\.1\.md/);
  assert.match(home, /\/docs\/draft-hyperactive-web-00\.md/);
  assert.match(home, /\/docs\/hyperactive-web-v0\.2-identity-provenance\.md/);
  assert.match(home, /\/docs\/identity-provenance-briefing\.md/);
  assert.match(home, /\/conformance\/v0\.1\/fixtures\/manifest\.json/);
  assert.match(root, /\["RFC draft", RFC_DRAFT\]/);
  assert.match(root, /\["Identity \+ provenance v0\.2", V02_PROFILE\]/);
  assert.match(root, /\["HTTP provenance example", IDENTITY_BRIEFING\]/);

  const navigationTargets = [...root.matchAll(/href: "\/#([a-z-]+)"/g)].map((match) => match[1]);
  const sectionTargets = new Set([...home.matchAll(/id="([a-z-]+)"/g)].map((match) => match[1]));
  for (const target of navigationTargets) {
    assert.ok(sectionTargets.has(target), `missing landing section #${target}`);
  }
});

test("public evidence assets are complete and internally consistent", () => {
  const briefing = read("public/docs/tim-berners-lee-briefing.md");
  const contract = read("public/docs/hyperactive-web-v0.1.md");
  const rfcDraft = read("public/docs/draft-hyperactive-web-00.md");
  const v02Profile = read("public/docs/hyperactive-web-v0.2-identity-provenance.md");
  const identityBriefing = read("public/docs/identity-provenance-briefing.md");
  const fixtureRoot = resolve(projectRoot, "public/conformance/v0.1/fixtures");
  const manifest = JSON.parse(read("public/conformance/v0.1/fixtures/manifest.json"));

  assert.match(briefing, /^# A Capability Layer for the Web/m);
  assert.match(contract, /^# Hyperactive Web .* Contract v0\.1/m);
  assert.match(rfcDraft, /^# Hyperactive Web Service Cards and Capability Links/m);
  assert.match(v02Profile, /^# Hyperactive Web Identity and Provenance Profile v0\.2/m);
  assert.match(identityBriefing, /^# Identity and Provenance: an ordinary Web example/m);
  assert.equal(manifest.schemaVersion, "0.1");
  assert.equal(
    manifest.valid.length + manifest.invalid.length + manifest.contractVectors.length,
    12,
  );

  for (const fixture of [...manifest.valid, ...manifest.invalid, ...manifest.contractVectors]) {
    assert.ok(existsSync(resolve(fixtureRoot, fixture.path)), `missing fixture ${fixture.path}`);
  }

  const parentRoot = resolve(projectRoot, "..");
  const parentBriefing = resolve(parentRoot, "Docs/TimBernersLeeBriefing.md");
  const parentContract = resolve(parentRoot, "Docs/HyperactiveWebV0.1.md");
  const parentRfcDraft = resolve(parentRoot, "Docs/draft-hyperactive-web-00.md");
  const parentV02Profile = resolve(parentRoot, "Docs/HyperactiveWebV0.2IdentityProvenance.md");
  const parentIdentityBriefing = resolve(parentRoot, "Docs/IdentityProvenanceBriefing.md");
  if (existsSync(parentBriefing) && existsSync(parentContract) && existsSync(parentRfcDraft) && existsSync(parentV02Profile) && existsSync(parentIdentityBriefing)) {
    assert.equal(briefing, readFileSync(parentBriefing, "utf8"));
    assert.equal(contract, readFileSync(parentContract, "utf8"));
    assert.equal(rfcDraft, readFileSync(parentRfcDraft, "utf8"));
    assert.equal(v02Profile, readFileSync(parentV02Profile, "utf8"));
    assert.equal(identityBriefing, readFileSync(parentIdentityBriefing, "utf8"));
  }
});

test("the landing surface carries evidence, lineage, and open design gates", () => {
  for (const requiredText of [
    "Implemented in v0.1",
    "Open design gates",
    "Web Architecture",
    "Linked Data",
    "Web of Things",
    "Solid",
    "HTTP + Web Linking",
    "Ethical Web Principles",
    "Proposed in v0.2",
    "Contribution graphs distinguish human, agent, model",
    "Identity + provenance",
    "Not a badge. A chain of evidence.",
  ]) {
    assert.ok(home.includes(requiredText), `missing ${requiredText}`);
  }

  assert.match(home, /exact\s+declaration equality—not\s+semantic equivalence or provider trust/i);
  assert.match(home, /criticism, not endorsement/i);
});

test("global shell exposes mobile navigation and accessibility safeguards", () => {
  assert.match(root, /href="#page-content"/);
  assert.match(root, /aria-label="Primary"/);
  assert.match(root, /overflow-x-auto/);
  assert.match(root, /focus-visible:ring-2/);
  assert.match(styles, /prefers-reduced-motion/);
  assert.match(styles, /prefers-contrast: more/);

  assert.equal((root.match(/name: "description"/g) ?? []).length, 1);
  assert.equal((root.match(/property: "og:description"/g) ?? []).length, 1);
});
