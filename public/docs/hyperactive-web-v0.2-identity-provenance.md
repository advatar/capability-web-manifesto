# Hyperactive Web Identity and Provenance Profile v0.2

## Internet-Draft Status

This document is an experimental project specification for UniversalInteractionKit.
It defines a proposed Hyperactive Web v0.2 profile for identity, contribution, and
verifiable provenance. It is not an IETF Standards Track document, does not claim
W3C consensus, and does not modify HTTP.

The Hyperactive Web v0.1 contract remains frozen and authoritative for v0.1 cards,
links, schemas, and fixtures. This profile is additive and explicitly does not make
v0.1 implementations non-conforming. It is a design target for independent review
and future conformance fixtures.

The key words **MUST**, **MUST NOT**, **REQUIRED**, **SHALL**, **SHALL NOT**,
**SHOULD**, **SHOULD NOT**, **RECOMMENDED**, **NOT RECOMMENDED**, **MAY**, and
**OPTIONAL** in this document are to be interpreted as described in BCP 14 when,
and only when, they appear in all capitals.

## Abstract

This document defines a portable provenance profile for Hyperactive Web resources
and interactions. A Provenance Statement binds an exact subject representation to
activities, human and non-human contributions, roles, delegation, derivation, and
typed evidence. A Signed Provenance Envelope carries the statement's proof and
optional transparency receipts. A consumer produces a local Verification Report
with independent results for content binding, signatures, identity, participation,
delegation, execution environment, chronology, transparency, and declared lineage.

The profile deliberately does not define a universal identity provider, a global
ledger, a binary “human-made” or “AI-made” verdict, or a legal conclusion about
authorship or ownership. It reuses Web Linking and PROV-AQ for discovery, W3C PROV
for semantics, C2PA/CAWG for media credentials, Verifiable Credentials for portable
claims, WebAuthn for relying-party ceremonies, and SCITT/COSE Receipts for
transparent statement registration.

## Table of Contents

1. [Scope and Design Principles](#1-scope-and-design-principles)
2. [Conventions and Terminology](#2-conventions-and-terminology)
3. [Protocol Model](#3-protocol-model)
4. [Provenance Statement](#4-provenance-statement)
5. [Identity and Contribution Model](#5-identity-and-contribution-model)
6. [Signed Provenance Envelope](#6-signed-provenance-envelope)
7. [Evidence and Verification](#7-evidence-and-verification)
8. [HTTP Discovery and Service Cards](#8-http-discovery-and-service-cards)
9. [Invocation and Retention](#9-invocation-and-retention)
10. [Privacy and Security](#10-privacy-and-security)
11. [Versioning and Conformance](#11-versioning-and-conformance)
12. [IANA Considerations](#12-iana-considerations)
13. [References](#13-references)
Appendix A. [Complete Example](#appendix-a-complete-example)

## 1. Scope and Design Principles

### 1.1. Scope

This profile applies to:

- Service Cards and Capability Links;
- input artifacts, prompts, credentials, and retrieved material;
- capability invocations, approvals, payments, and delegated tasks;
- generated, transformed, reviewed, approved, signed, and delivered results;
- models, agent builds, tools, devices, datasets, and execution environments;
- provenance and verification artifacts retained by a consuming user agent.

### 1.2. Principles

A conforming v0.2 profile implementation:

1. MUST bind evidence to an exact subject representation or defined commitment.
2. MUST distinguish the principal, publishing node, actor, executor, model, signer,
   credential issuer, recorder, and verifier roles.
3. MUST represent contributions and roles rather than a binary authorship label.
4. MUST distinguish `observed`, `declared`, `inferred`, and `signedOff` assertions.
5. MUST treat publisher claims as inputs to consumer policy, never as local proof.
6. MUST report missing, stripped, or incomplete provenance as unknown or
   indeterminate, not as evidence of human creation.
7. MUST preserve native evidence formats and their verification semantics.
8. SHOULD support pseudonymous identifiers, commitments, selective disclosure,
   redaction, and access-controlled evidence.
9. MUST NOT require a DID, legal identity, global blockchain, or particular issuer.

### 1.3. Non-goals

This profile does not establish:

- that content is true, original, lawful, high quality, or copyrightable;
- that a named human authored every part of an artifact;
- that a model was absent merely because no AI evidence is present;
- that a key holder is the same person as a real-world identity;
- that a valid signature makes the signed assertion accurate or complete;
- one universal trust score or global reputation ranking.

## 2. Conventions and Terminology

**Subject**: The resource or representation to which a statement applies.

**Provenance Statement**: A canonical JSON object describing a subject, activity,
contributions, lineage, assertions, and evidence references.

**Contribution**: A role-qualified association between an actor and an activity.

**Evidence Reference**: A typed, digest-bound pointer to a credential, attestation,
manifest, ceremony, observation, receipt, or other verification input.

**Signed Provenance Envelope**: A statement plus one or more signature proofs,
native evidence references, and optional transparency receipts.

**Verification Report**: A consumer-generated artifact recording independent check
results, policy, trust roots, verifier version, and unresolved gaps.

**Principal**: The human, organization, autonomous entity, or resource represented
by an identity claim.

**Node**: The publishing or operating system that exposes a Service Card or acts
on behalf of a principal.

**Actor**: A human or non-human agent associated with an activity under a role.

**Executor**: The concrete process, service deployment, device, tool, or runtime
that performed an activity.

**Model**: A model family, immutable model artifact, or provider-attested deployment.

**Recorder**: The software or hardware that observed events and constructed a claim.

**Claim generator**: The software or system that generated a provenance claim,
which is not necessarily the creator, actor, or signer.

**Declared lineage**: The parent entities and derivation relationships disclosed by
the statement. It is not a proof that undisclosed ancestors do not exist.

## 3. Protocol Model

The profile consists of five layers:

```text
subject commitment → provenance statement → signature/evidence → transparency
        ↑                    ↑                 ↑                 ↑
      bytes             activities         credentials       log/time/witness
        └─────────────────────────────── verification report ───────────────┘
```

1. The producer identifies a subject and commits to its exact bytes or canonical
   representation.
2. The recorder constructs a Provenance Statement describing activities and
   contributions.
3. An authorized signer signs the canonical statement bytes or their digest.
4. Native evidence is preserved and referenced by type, URI, and digest.
5. A transparency service MAY register the signed statement and issue an inclusion
   or consistency receipt.
6. The consumer validates the envelope and computes a Verification Report under
   local policy before making a consequential decision.

No publisher field grants permission by itself. A provenance declaration does not
replace authentication, authorization, consent, payment, risk evaluation, or
human participation gates.

## 4. Provenance Statement

### 4.1. Required shape

A Provenance Statement MUST be a UTF-8 JSON object with unique member names and
these members:

| Member | Requirement |
| --- | --- |
| `profile` | MUST be the absolute URI of the profile that defines the statement |
| `id` | MUST be a stable absolute URI or URN for the statement |
| `subject` | MUST identify one or more exact representations or commitments |
| `activity` | MUST identify the activity or bounded set of activities described |
| `contributions` | MUST be an array; each entry MUST have an actor and role |
| `lineage` | MUST be an array, possibly empty, of declared parent relations |
| `assertions` | MUST be an array, possibly empty, with an evidence basis |
| `evidence` | MUST be an array, possibly empty, of typed evidence references |

Unknown top-level members MUST be preserved by forwarding implementations. A
consumer MUST reject duplicate object member names and invalid commitments before
relying on a statement.

### 4.2. Subject

Each subject MUST contain:

- `id`: an absolute URI or URN;
- `mediaType`: the representation media type where applicable;
- `commitment`: an object containing `algorithm` and `digest`.

The commitment MUST cover exactly the bytes or canonical representation declared by
the profile. A URI identifies a resource; it does not prove that a later retrieval
has the same bytes. A profile SHOULD use SHA-256 or a stronger registered algorithm
and MUST identify algorithm agility explicitly.

### 4.3. Activity

An activity MUST contain an identifier and a type. It SHOULD contain `startedAt`,
`endedAt`, `used`, and `generated` members. `used` and `generated` references MUST
bind to subject commitments when they affect the stated result.

Activity types SHOULD use W3C PROV semantics where applicable, including capture,
generation, transformation, review, approval, signing, publication, invocation,
execution, recording, and delivery.

### 4.4. Assertions

Every assertion MUST contain:

- `predicate`;
- `value`;
- `basis`, whose value is `observed`, `declared`, `inferred`, or `signedOff`;
- `assertedBy`;
- `evidence`, unless the profile explicitly defines a self-contained assertion.

An `inferred` assertion MUST identify the method, implementation or model, version,
and confidence or threshold where meaningful. Detection results MUST remain
inferences and MUST NOT be serialized as definitive identity or authorship.

## 5. Identity and Contribution Model

### 5.1. Role separation

The following roles MUST remain distinguishable:

| Role | Meaning |
| --- | --- |
| `principal` | Human, organization, autonomous entity, or accountable subject |
| `node` | Publishing or operating system |
| `actor` | Participant associated with an activity |
| `executor` | Concrete process, service, device, or runtime |
| `model` | Model family, artifact, or deployment |
| `signer` | Key controller that signs a statement |
| `issuer` | Party that issues a credential or attestation |
| `recorder` | Source that observed or recorded an activity |
| `verifier` | Consumer that evaluates evidence under policy |

One entity MAY fill several roles. A delegate MUST NOT be represented as the
principal merely because it acted on the principal's behalf.

### 5.2. Contributions

Each contribution MUST contain:

- `actor`: an identity reference with `id` and `kind`;
- `role`: a stable role token or absolute role URI;
- `basis`: one of the four assertion bases;
- `evidence`: zero or more evidence identifiers.

The initial role vocabulary is `conceived`, `prompted`, `captured`, `generated`,
`edited`, `reviewed`, `approved`, `signed`, `published`, `executed`, `recorded`,
and `delivered`. Profiles MAY add roles but MUST NOT redefine their meaning.

An optional `actedOnBehalfOf` member MUST reference a mandate or delegation evidence
record. A mandate SHOULD bind principal, delegate, capability, audience, validity
interval, constraints, and replay protection.

### 5.3. AI and model identity

An AI contribution SHOULD identify, where available:

- provider and service URIs;
- model family and public version;
- immutable model artifact digest, or provider-signed opaque deployment identifier;
- agent software/build identity and policy or system-prompt commitment;
- invocation identifier, time, tools, retrieval inputs, and output commitment;
- parameters, seed, and input commitments where safe and meaningful;
- source-type and evidence basis.

A model supply-chain statement MAY use SLSA, in-toto, or SPDX. Model build lineage
MUST NOT be represented as though every training item were a direct per-output
ancestor unless that relation is specifically supportable.

## 6. Signed Provenance Envelope

### 6.1. Envelope shape

A Signed Provenance Envelope MUST contain `statement` and `proofs`. It MAY contain
`contentCredentials` and `transparencyReceipts`.

```json
{
  "statement": { "profile": "...", "id": "...", "subject": {}, "activity": {}, "contributions": [], "lineage": [], "assertions": [], "evidence": [] },
  "proofs": [{ "format": "COSE_Sign1", "keyId": "https://example.test/keys/1", "algorithm": "ES256", "statementDigest": "sha256:...", "signature": "..." }],
  "contentCredentials": [],
  "transparencyReceipts": []
}
```

The `statement` MUST be canonicalized using RFC 8785 JCS, encoded as UTF-8, and
hashed before signing. A proof MUST identify the statement digest, key identifier,
signature format, and algorithm. A profile MAY define native C2PA, VC Data
Integrity, JWS, or COSE proof handling; implementations MUST NOT claim that one
format has the semantics of another without verifying it natively.

The proof payload MUST bind the statement profile, statement identifier, statement
digest, signer key identifier, audience or context where applicable, and creation
time. Detached proofs MUST remain retrievable or exportable with the evidence bundle.

### 6.2. Native evidence

Native C2PA manifests, CAWG identity assertions, Verifiable Credentials, WebAuthn
ceremony records, device attestations, ARK evidence bundles, MadeMark sessions,
SLSA/in-toto statements, and SCITT/COSE receipts MUST be retained in their native
format. The envelope references them by identifier, URI, type, and digest; it does
not flatten their internal claims.

### 6.3. Transparency receipts

Transparency receipts MUST be generated after the signed statement exists and MUST
not be included in the bytes whose digest they certify. A receipt MAY prove inclusion
in a log view, consistency between log views, freshness, or another registered
verifiable-data-structure property. It MUST NOT be interpreted as proof that the
issuer's statement is true.

## 7. Evidence and Verification

### 7.1. Verification checks

A consumer MUST produce individual results for checks requested by local policy:

| Check | Proposition |
| --- | --- |
| `subjectBinding` | Supplied bytes match the subject commitment |
| `statementSignature` | An accepted key signed the statement bytes |
| `keyStatus` | The key was acceptable at the relevant time |
| `identityBinding` | An accepted issuer linked selected claims to an actor or signer |
| `participation` | A defined ceremony or recorder supports a contribution |
| `delegation` | A mandate covered delegate, scope, audience, and time |
| `environment` | Evidence supports the stated tool, device, model, or deployment |
| `chronology` | Time evidence covers the statement or log view |
| `transparency` | Inclusion and requested consistency checks pass |
| `lineageContinuity` | Every declared parent resolves and verifies |

Each result MUST be one of `pass`, `fail`, `indeterminate`, or `notChecked`. The
report MUST include the policy identifier, trust roots, verifier implementation,
verification time, evidence examined, and warnings.

There MUST NOT be a mandatory `isHumanMade`, `isAIMade`, or universal `verified`
result. A verifier MAY expose a policy-specific presentation such as “AI contribution
disclosed” or “human approval evidence present,” but it MUST retain the underlying
individual results.

### 7.2. Verification report

A Verification Report is a retained artifact distinct from the publisher's statement.
It MUST identify the verifier and policy that produced it. A verifier MUST NOT
republish its local result as though it were issuer evidence.

Passing checks establish only their defined propositions. In particular, signatures,
credentials, WebAuthn ceremonies, content commitments, transparency receipts, and
model attestations do not alone establish truth, legal authorship, ownership, intent,
or complete disclosure.

## 8. HTTP Discovery and Service Cards

### 8.1. Provenance discovery

A resource exposing provenance SHOULD advertise it with the PROV-AQ relation using
RFC 8288 Web Linking:

```http
Link: </provenance/portrait-4>; rel="http://www.w3.org/ns/prov#has_provenance"; type="application/vnd.capabilityweb.provenance+json"
```

An HTML representation MAY use the equivalent `<link>` element. A provenance
resource SHOULD support content negotiation for the signed JSON envelope, a PROV-O
JSON-LD projection, and a human-readable verification view.

The experimental media type is:

```text
application/vnd.capabilityweb.provenance+json
```

Its use is project-local and does not request IANA registration in this draft.

### 8.2. Service Card extension

A v0.2 Service Card MAY contain a `provenance` object with:

| Member | Meaning |
| --- | --- |
| `statement` | URI of the card's Provenance Statement or envelope |
| `produces` | Evidence profiles the node can produce |
| `accepts` | Evidence profiles the node can consume |
| `keyStatus` | URI or reference for signer-key status |
| `transparency` | Supported transparency or receipt profiles |
| `disclosure` | Supported public, private, committed, or selective modes |

Capability Links MAY contain the same object to declare evidence expectations for
inputs and outputs. These declarations MUST be advisory. A consumer MUST apply its
own minimum evidence and privacy policy.

### 8.3. HTTP integrity

Implementations SHOULD use RFC 9530 `Content-Digest` and MAY use RFC 9421 HTTP
Message Signatures for transport integrity. Transport signatures MUST NOT be
confused with durable artifact provenance; the signed message, context, and status
must be retained if they are later relied upon.

## 9. Invocation and Retention

Before a consequential invocation, a consumer SHOULD retain or reference:

- the retrieved Service Card and selected Capability Link;
- the exact capability contract address;
- request and input commitments;
- local policy decision, approval, payment, and mandate artifacts;
- actor, node, executor, model, and tool identities;
- the response or result commitment;
- the parent artifact identifiers and provenance statement;
- the resulting Verification Report.

The provider's `declaredRisk`, `requiresConfirmation`, or provenance declaration
MUST NOT lower local policy requirements. Side-effecting operations MUST bind
replay defenses, audience, authorization, and idempotency where applicable.

Existing v0.1 parent links MAY be projected into typed PROV `used`, `wasGeneratedBy`,
`wasDerivedFrom`, `wasAssociatedWith`, and `actedOnBehalfOf` relations. Existing
approval, payment, usage-grant, workflow, and fulfillment artifacts remain valid
evidence references.

## 10. Privacy and Security

Public statements SHOULD contain the minimum information needed for the use case.
Implementations SHOULD keep names, prompts, file paths, private inputs, and raw
credentials out of public transparency logs. They SHOULD support pseudonymous or
pairwise identifiers, salted commitments, selective disclosure, access-controlled
evidence, and redacted projections with their own provenance.

Consent, withholding, correction, dispute, key rotation, supersession, and deletion
of private evidence SHOULD be represented as events. Deleting private evidence can
make a public commitment indeterminate; it MUST NOT be represented as if an append-
only log had been rewritten.

Implementations MUST defend against forged claims, key compromise, delegation
laundering, replay, context splicing, model aliasing, provenance stripping, log
equivocation, detector false positives, canonicalization confusion, and colluding
recorders. High-assurance deployments SHOULD use independent transparency witnesses
or trust domains.

Consumers MUST treat statements, credentials, manifests, schemas, status responses,
and referenced evidence as untrusted input. They MUST bound size, nesting, schema
complexity, remote dereferencing, and parser resource use.

## 11. Versioning and Conformance

The profile identifier is:

```text
https://hyperactive.network/profiles/provenance/v0.2-draft
```

An implementation MAY claim these conformance classes:

| Claim | Requirement |
| --- | --- |
| v0.2 Statement Producer | Emits valid statements, commitments, roles, assertions, and evidence references |
| v0.2 Envelope Producer | Produces verifiable signed envelopes and preserves native evidence |
| v0.2 Consumer | Validates statements, signatures, evidence references, and local policy results |
| v0.2 Verification Reporter | Emits the required per-proposition statuses and policy context |
| v0.2 HTTP Profile | Implements PROV-AQ discovery, media type negotiation, and Service Card metadata |
| v0.2 Transparency Profile | Verifies supported inclusion, consistency, freshness, or witness receipts |

Every claimed class MUST pass future shared fixtures without modifying them. A
conformance result is not evidence of public discovery, identity trust, complete
lineage, correct fulfillment, legal authorship, privacy compliance, or standards-
body conformance.

Required core fields, role semantics, signed-byte rules, commitment algorithms,
verification statuses, or evidence-binding rules MUST NOT change within v0.2-draft.
Incompatible changes require a new profile version.

## 12. IANA Considerations

This document requests no IANA actions. The media type, profile URI, role tokens,
and relation usage are experimental project values. A future standards submission
would need to decide whether to register, replace, or map them to existing Web of
Things, JSON-LD, or other registered vocabularies.

## 13. References

### 13.1. Normative references

- [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119), Key words for use in RFCs.
- [RFC 8174](https://www.rfc-editor.org/rfc/rfc8174), Uppercase vs. lowercase.
- [RFC 8288](https://www.rfc-editor.org/rfc/rfc8288), Web Linking.
- [RFC 8785](https://www.rfc-editor.org/rfc/rfc8785), JSON Canonicalization Scheme.
- [RFC 9530](https://www.rfc-editor.org/rfc/rfc9530), Digest Fields.
- [JSON Schema](https://json-schema.org/draft/2020-12/json-schema-core), Draft 2020-12 Core.

### 13.2. Informative references

- [W3C PROV](https://www.w3.org/TR/prov-overview/), provenance model and access.
- [W3C VC Data Model 2.0](https://www.w3.org/TR/vc-data-model/).
- [W3C VC Data Integrity](https://www.w3.org/TR/vc-data-integrity/).
- [W3C WebAuthn Level 3](https://www.w3.org/TR/webauthn-3/).
- [C2PA Content Credentials 2.4](https://spec.c2pa.org/specifications/specifications/2.4/specs/ContentCredentials.html).
- [CAWG Identity Assertion 1.2](https://cawg.io/identity/1.2/).
- [RFC 9421](https://www.rfc-editor.org/rfc/rfc9421), HTTP Message Signatures.
- [RFC 9942](https://www.rfc-editor.org/rfc/rfc9942), COSE Receipts.
- [RFC 9943](https://www.rfc-editor.org/rfc/rfc9943), SCITT architecture.
- [SLSA provenance](https://slsa.dev/spec/v1.2/provenance).
- [SPDX](https://spdx.github.io/spdx-spec/v3.0.1/scope/).
- [Hyperactive Web v0.1 contract](HyperactiveWebV0.1.md).
- [Verifiable Identity and Provenance research note](VerifiableIdentityAndProvenance.md).

## Appendix A. Complete Example

The following shortened envelope illustrates a human and an AI agent contributing
under distinct roles. The ellipses are placeholders and are not valid fixture data.

```json
{
  "statement": {
    "profile": "https://hyperactive.network/profiles/provenance/v0.2-draft",
    "id": "urn:uuid:statement-42",
    "subject": {
      "id": "https://studio.example/works/portrait-4",
      "mediaType": "image/png",
      "commitment": { "algorithm": "sha-256", "digest": "..." }
    },
    "activity": {
      "id": "urn:uuid:activity-42",
      "type": "generated-and-edited",
      "used": [{ "id": "urn:uuid:prompt-42", "relation": "prompt", "commitment": { "algorithm": "sha-256", "digest": "..." } }]
    },
    "contributions": [
      { "actor": { "id": "https://alice.example/id", "kind": "human" }, "role": "prompted", "basis": "signedOff", "evidence": ["urn:evidence:webauthn-42"] },
      { "actor": { "id": "https://studio.example/agent/illustrator", "kind": "softwareAgent" }, "role": "generated", "basis": "observed", "actedOnBehalfOf": "https://alice.example/id", "evidence": ["urn:evidence:model-attestation-42"] },
      { "actor": { "id": "https://alice.example/id", "kind": "human" }, "role": "edited", "basis": "observed", "evidence": ["urn:evidence:session-42"] }
    ],
    "lineage": [],
    "assertions": [{ "predicate": "digitalSourceType", "value": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia", "basis": "observed", "assertedBy": "https://studio.example/agent/illustrator", "evidence": ["urn:evidence:model-attestation-42"] }],
    "evidence": [{ "id": "urn:evidence:session-42", "type": "MadeMarkCreativeSession", "digest": "sha256:..." }]
  },
  "proofs": [{ "format": "COSE_Sign1", "keyId": "https://alice.example/keys/signing", "algorithm": "ES256", "statementDigest": "sha256:...", "signature": "..." }],
  "transparencyReceipts": [{ "profile": "https://www.rfc-editor.org/rfc/rfc9943", "href": "https://log.example/receipts/42", "digest": "sha256:..." }]
}
```
