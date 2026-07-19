# Identity and Provenance: an ordinary Web example

This is the shortest way to review the proposed Hyperactive Web v0.2 profile:
start with an ordinary HTTPS resource, follow a standard Web link, inspect the
evidence, and verify only the claims that the evidence supports.

The example is intentionally modest. It does not require a new HTTP method, a
new browser, a global identity provider, or a blockchain.

## 1. Retrieve an ordinary resource

```http
GET /works/portrait-4 HTTP/1.1
Host: studio.example
Accept: image/png

HTTP/1.1 200 OK
Content-Type: image/png
Content-Digest: sha-256=:mEWX5Vx2kL0...:
Link: </works/portrait-4/provenance>;
      rel="http://www.w3.org/ns/prov#has_provenance";
      type="application/vnd.capabilityweb.provenance+json"
```

This is ordinary HTTP plus [RFC 8288 Web Linking](https://www.rfc-editor.org/rfc/rfc8288)
and the W3C PROV-AQ relation. The resource remains a normal image. A browser may
ignore the link; a provenance-aware consumer can follow it.

## 2. Follow the provenance link

```http
GET /works/portrait-4/provenance HTTP/1.1
Host: studio.example
Accept: application/vnd.capabilityweb.provenance+json

HTTP/1.1 200 OK
Content-Type: application/vnd.capabilityweb.provenance+json
Content-Digest: sha-256=:statement-digest...:
```

The response contains a signed statement envelope. The important fact is not the
presence of a “human” or “AI” badge, but the separately attributable contributions:

```json
{
  "statement": {
    "profile": "https://hyperactive.network/profiles/provenance/v0.2-draft",
    "id": "https://studio.example/statements/portrait-4",
    "subject": {
      "id": "https://studio.example/works/portrait-4",
      "mediaType": "image/png",
      "commitment": { "algorithm": "sha-256", "digest": "..." }
    },
    "activity": {
      "id": "https://studio.example/activities/portrait-4",
      "type": "generated-and-edited",
      "used": [{
        "id": "https://studio.example/inputs/prompt-4",
        "relation": "prompt",
        "commitment": { "algorithm": "sha-256", "digest": "..." }
      }]
    },
    "contributions": [
      {
        "actor": { "id": "https://alice.example/id", "kind": "human" },
        "role": "prompted",
        "basis": "signedOff",
        "evidence": ["https://studio.example/evidence/webauthn-42"]
      },
      {
        "actor": { "id": "https://studio.example/agents/illustrator", "kind": "softwareAgent" },
        "role": "generated",
        "basis": "observed",
        "actedOnBehalfOf": "https://alice.example/id",
        "model": {
          "provider": "https://models.example",
          "family": "illustrator-pro",
          "version": "2026-07-03",
          "deploymentAttestation": "https://models.example/attestations/93"
        },
        "evidence": ["https://studio.example/evidence/invocation-94"]
      },
      {
        "actor": { "id": "https://alice.example/id", "kind": "human" },
        "role": "edited",
        "basis": "observed",
        "evidence": ["https://studio.example/evidence/session-95"]
      },
      {
        "actor": { "id": "https://alice.example/id", "kind": "human" },
        "role": "approved",
        "basis": "signedOff",
        "evidence": ["https://studio.example/evidence/webauthn-96"]
      }
    ],
    "lineage": [],
    "assertions": [{
      "predicate": "digitalSourceType",
      "value": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia",
      "basis": "observed",
      "assertedBy": "https://studio.example/agents/illustrator",
      "evidence": ["https://models.example/attestations/93"]
    }],
    "evidence": [
      {
        "id": "https://studio.example/evidence/session-95",
        "type": "MadeMarkCreativeSession",
        "digest": "sha256:..."
      }
    ]
  },
  "proofs": [{
    "format": "COSE_Sign1",
    "keyId": "https://studio.example/keys/signing-1",
    "algorithm": "ES256",
    "statementDigest": "sha256:...",
    "signature": "..."
  }],
  "contentCredentials": [{
    "format": "C2PA",
    "href": "https://studio.example/works/portrait-4.c2pa"
  }],
  "transparencyReceipts": [{
    "profile": "https://www.rfc-editor.org/rfc/rfc9943",
    "href": "https://log.example/receipts/88931",
    "digest": "sha256:..."
  }]
}
```

## 3. What maps to existing standards

| Example element | Existing standard | What it contributes |
| --- | --- | --- |
| `Link: ... has_provenance` | [PROV-AQ](https://www.w3.org/TR/prov-aq/) + [RFC 8288](https://www.rfc-editor.org/rfc/rfc8288) | Discoverability through ordinary Web resources |
| `subject`, `activity`, `used`, `lineage` | [W3C PROV](https://www.w3.org/TR/prov-overview/) | Portable semantics for entities, activities, agents, and derivation |
| `contentCredentials` | [C2PA](https://spec.c2pa.org/specifications/specifications/2.4/specs/ContentCredentials.html) + [CAWG](https://cawg.io/identity/1.2/) | Signed media history and actor assertions |
| actor credential evidence | [Verifiable Credentials](https://www.w3.org/TR/vc-data-model/) | Portable identity and qualification claims |
| `webauthn-42` | [WebAuthn](https://www.w3.org/TR/webauthn-3/) | A relying-party user-presence or user-verification ceremony |
| `proofs` | [COSE](https://www.rfc-editor.org/rfc/rfc9052) or VC Data Integrity | Signature over defined statement bytes |
| `transparencyReceipts` | [SCITT](https://www.rfc-editor.org/rfc/rfc9943) and [COSE Receipts](https://www.rfc-editor.org/rfc/rfc9942) | Inclusion, consistency, and transparency evidence |
| model attestation | [SLSA](https://slsa.dev/spec/v1.2/provenance), [in-toto](https://in-toto.io/), or SPDX | Build and supply-chain identity for software/models |

The Hyperactive Web contribution is the composition: a common Web-facing envelope
that links these artifacts and lets a consuming user agent apply local policy.
It does not replace any of the underlying standards.

## 4. What the verifier can prove

A verifier may produce a report like this:

```json
{
  "verifier": "https://browser.example/verifiers/provenance/2",
  "policy": "https://browser.example/policies/creative-work/1",
  "results": {
    "subjectBinding": "pass",
    "statementSignature": "pass",
    "keyStatus": "pass",
    "identityBinding": "indeterminate",
    "participation": "pass",
    "delegation": "pass",
    "environment": "indeterminate",
    "chronology": "pass",
    "transparency": "pass",
    "lineageContinuity": "pass"
  },
  "warnings": [
    "The credential binds the signing key to a pseudonymous identifier, not a verified legal name.",
    "The model provider attested the deployment identifier; model weights were not independently inspected.",
    "Declared lineage is complete for the supplied bundle but cannot prove undisclosed inputs do not exist."
  ]
}
```

This can establish that:

- the supplied image matches the committed bytes;
- the statement was signed by the identified key;
- the key was acceptable under the verifier's status policy;
- the recorded human approval ceremony occurred at the relying party;
- the agent acted under the referenced delegation;
- the statement was included in the supplied transparency view;
- the disclosed model contribution is bound to the recorded deployment claim.

It cannot establish that:

- Alice authored every pixel or had no undisclosed collaborator;
- the content is true, original, lawful, or copyrightable;
- the signing key was personally controlled by Alice at every moment;
- the model produced the result exactly as claimed if the execution environment
  was not independently attested;
- the work is “human-made” merely because AI evidence is absent.

That boundary is the point. A missing claim becomes `indeterminate`, not a false
positive for human authorship.

## 5. Review question

The proposal is asking a Web architecture question:

> Can identity, contribution, and provenance become discoverable, linkable, and
> independently verifiable Web resources while authority remains local and
> privacy remains under the participant's control?

The desired review outcome is criticism of this composition and its boundaries,
not endorsement of a new parallel Web.

See the [formal v0.2 profile](HyperactiveWebV0.2IdentityProvenance.md) and the
[longer research note](VerifiableIdentityAndProvenance.md) for the full model.
