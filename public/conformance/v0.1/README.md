# Hyperactive Web v0.1 Conformance Package

This directory is the implementation-independent companion to the normative
[`Hyperactive Web v0.1 contract`](../../Docs/HyperactiveWebV0.1.md).

These fixtures prove conformance only to the project's frozen v0.1 wire rules.
They do not establish W3C/IETF status, semantic equivalence between providers,
runtime safety, or correct fulfillment. See the
[`standards-review briefing`](../../Docs/TimBernersLeeBriefing.md) for the Web
architecture assessment and proposed next experiments.

## Contents

```text
schemas/                 JSON Schema Draft 2020-12 wire shapes
fixtures/manifest.json   shared test manifest
fixtures/valid/          conforming Service Cards
fixtures/invalid/        structurally decodable cards with semantic violations
fixtures/contract/       RFC 8785 canonicalization and SHA-256 vectors
```

The JSON Schemas validate shape. The fixture manifest also names cross-field
semantic violations that a schema cannot fully express.

## Running the reference implementations

From the package root:

```sh
swift test --filter ConformanceTests
cd Web
npm test -- --run src/__tests__/conformance.test.ts
```

Both suites read these same files. A third-party implementation should consume
`fixtures/manifest.json` directly and reproduce every expected result without
editing the fixtures.

## Adding a fixture

1. Add the JSON document under `valid`, `invalid`, or `contract`.
2. Add it to `fixtures/manifest.json`.
3. For invalid cards, provide stable `expectedCodes` describing each normative
   invariant under test.
4. For contract vectors, compute the contract subset defined by §7 of the spec,
   canonicalize it with RFC 8785 JCS, and publish the canonical JSON, digest, and
   address.
5. Run both reference suites.

Fixture documents are specification assets. Changes to an existing expectation
require the same review as a normative contract change.
