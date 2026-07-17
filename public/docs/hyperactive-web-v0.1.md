# Hyperactive Web Service Card and Capability Link Contract v0.1

## Status

This document is the normative v0.1 wire contract published by the
UniversalInteractionKit project. It is an implementation specification, not a
claim of IETF, W3C, or other standards-body status.

For the standards-facing architectural assessment—including overlap with W3C
Web of Things, Linked Data/Solid alignment, and v0.1 design choices that should
be reconsidered—see
[A Capability Layer for the Web](TimBernersLeeBriefing.md). v0.1 remains a
frozen project experiment so its fixtures are reproducible; the briefing does
not imply that its custom digest key, composed URI schemes, relation vocabulary,
or JSON representation are final Web designs.

The machine-readable schemas and implementation-independent fixtures live in
[`Conformance/v0.1`](../Conformance/v0.1). A conforming implementation does not
need to read Swift or TypeScript source.

The fixtures cover wire validation and contract-digest reproduction. They do
not certify public discovery deployment, independent safety classification,
provider trust, correct fulfillment, privacy, accessibility, or standards
conformance beyond this project contract.

The key words **MUST**, **MUST NOT**, **REQUIRED**, **SHALL**, **SHALL NOT**,
**SHOULD**, **SHOULD NOT**, **RECOMMENDED**, **NOT RECOMMENDED**, **MAY**, and
**OPTIONAL** are to be interpreted as described by BCP 14 when they appear in
all capitals.

## 1. Scope

This contract standardizes the representation shared by every Hyperactive Web
profile and transport:

```text
principal → represented through a node → publishes a Service Card
Service Card → applies zero or more profiles → contains Capability Links
Capability Link → offered in context as an Affordance → rendered on a Surface
```

It defines:

- Service Card, Capability Link, Node Identity, and Principal wire shapes;
- the profile extension mechanism and the Human Profile binding;
- protocol-address and adapter-method agreement;
- location-independent contract addresses;
- discovery and media-type behavior;
- declared-versus-enforced trust boundaries;
- validation and conformance requirements.

It does not replace A2A, MCP, A2UI, OpenAPI, x401, x402, or x403. Those are
protocol substrates reached by the shared Capability Link primitive.

## 2. Representation rules

All v0.1 documents:

1. **MUST** be encoded as UTF-8 JSON.
2. **MUST** satisfy I-JSON constraints: unique property names, Unicode strings,
   finite IEEE-754 binary64 numbers, and no `NaN` or infinities.
3. **MUST** carry `schemaVersion: "0.1"` at the Service Card root.
4. **MUST** satisfy the published JSON Schema and the semantic invariants in
   this document.
5. **MUST NOT** attach undeclared fields to closed core objects. Extensibility
   belongs in `metadata` or a declared profile document.

Unknown `metadata` members **MUST** be preserved by a forwarding intermediary.
An implementation that cannot preserve an unknown profile document **MUST NOT**
rewrite or re-sign the card as though it had preserved it.

## 3. Service Card

Media type:

```text
application/vnd.capabilityweb.service-card+json
```

Schema: [`service-card.schema.json`](../Conformance/v0.1/schemas/service-card.schema.json)

The Service Card is the discoverable document that describes a node and its
capabilities. These identities are deliberately separate:

| Field | Meaning |
|---|---|
| `id` | Absolute URI identifying the card document |
| `identity` | Optional declared identity of the publishing/operating node |
| `subject` | Optional accountable principal represented by that node |

Conflating these fields is non-conforming. A principal can rotate node keys,
change providers, or publish multiple cards without changing principal identity.

### 3.1 Core fields

| Field | Requirement |
|---|---|
| `schemaVersion` | **MUST** equal `0.1` |
| `id` | **MUST** be an absolute URI |
| `name` | **MUST** be a non-empty human-readable name |
| `description` | **MUST** be present; MAY be empty |
| `provider` | **MUST** identify the provider in provider-local terms |
| `serviceURI` | **MUST** use `scheme://` or `proto+transport://` syntax |
| `adapterID` | **MUST** identify the adapter used by this runtime binding |
| `supportedProtocols` | **MUST** contain unique protocol identifiers |
| `authRequired` | **MUST** declare whether initial access requires authorization |
| `identity` | MAY carry an unverified publisher identity claim |
| `subject` | MAY carry an accountable Principal |
| `profiles` | **MUST** contain unique absolute profile URIs |
| `profileData` | **MUST** map each declared profile URI to one object |
| `capabilities` | **MUST** contain Capability Links; MAY be empty |
| `metadata` | **MUST** be an object; MAY contain extension data |

`profiles` and the keys of `profileData` **MUST** be exactly the same set. An
unknown profile URI is not an error: consumers **MUST** retain it and MAY ignore
its semantics. A profile document **MUST** be a JSON object.

Within one card, the tuple `(method, adapterID, capabilityID)` **MUST** be unique.

## 4. Principal

Schema: [`principal.schema.json`](../Conformance/v0.1/schemas/principal.schema.json)

A Principal is accountable; it is not a network endpoint.

- `kind` **MUST** be `human`, `organization`, or `autonomous`.
- `id` **MUST** be an absolute URI and **MUST NOT** be interpreted as requiring
  one identity system. HTTPS URLs, DIDs, and other absolute URI schemes are
  permitted.
- `identity`, when present, is a principal-controlled anchor distinct from the
  publishing node's `ServiceCard.identity`.
- aliases are claims of control over names, not professional assurances.

## 5. Node Identity

Schema: [`node-identity.schema.json`](../Conformance/v0.1/schemas/node-identity.schema.json)

`scheme` is `dns-id` or the transitional `node-key` shim. The identity in a
published card is a claim, not a verification result:

- a publisher **MUST** emit `verified: false`;
- a consumer **MUST** ignore any received assertion of local verification;
- the consumer **MUST** verify the claim against its own trust anchor before
  treating it as verified;
- locally verified state **MUST NOT** be re-published as provider evidence.

Identity verification does not prove the truth of profile claims, professional
credentials, authority, or the fulfillment of a capability.

## 6. Capability Link

Media type:

```text
application/vnd.capabilityweb.capability-link+json
```

Schema: [`capability-link.schema.json`](../Conformance/v0.1/schemas/capability-link.schema.json)

A Capability Link is a typed, policy-aware pointer to behavior.

| Field | Requirement |
|---|---|
| `rel` | **MUST** be a non-empty, whitespace-free intent/relation |
| `title` | **MUST** be a non-empty human-readable label |
| `href` | **MUST** use `scheme://` or `proto+transport://` syntax |
| `method` | **MUST** be `delegate`, `invoke`, `call`, `open`, or `read` |
| `adapterID` | **MUST** identify the provider-local adapter |
| `capabilityID` | **MUST** identify the provider-local operation |
| `inputSchema` | **MUST** be a JSON Schema object |
| `outputSchema` | MAY be a JSON Schema object |
| `declaredRisk` | **MUST** use a v0.1 risk value |
| `requiresConfirmation` | **MUST** be a boolean provider declaration |
| `preferredSurface` | **MUST** use a v0.1 surface value |
| `metadata` | **MUST** be an object |

### 6.1 Protocol and method mapping

A recognized composed protocol prefix **MUST** agree with `method`:

| Prefix | Method |
|---|---|
| `a2a` | `delegate` |
| `mcp`, `x403` | `invoke` |
| `openapi`, `http` | `call` |
| `intent`, `app` | `open` |
| `resource`, `artifact` | `read` |

A bare transport URI such as `https://…` does not imply a method. Unknown
protocol prefixes MAY be carried, but their adapter selection is implementation
specific until standardized.

### 6.2 Declared and enforced policy

`declaredRisk` and `requiresConfirmation` are provider claims. A consumer:

1. **MUST NOT** execute solely because the provider declared an operation safe;
2. **MUST** derive an authoritative local policy verdict;
3. **MUST** retain approval before a locally gated action executes;
4. **MUST NOT** fan out or cache side-effecting capabilities as though they were
   read-only merely because a provider mislabeled them.

The declared fields remain in the contract address because a provider changing
its stated risk promise changes the contract it advertises.

## 7. Contract addresses

A contract address names *what is promised*, independently of provider and
location:

```text
capability:sha256:<lowercase-hex-digest>
```

The syntax is a name, not a network authority, so `capability://…` is invalid.

### 7.1 Contract material

Construct a JSON object containing exactly:

```json
{
  "declaredRisk": "readOnly",
  "inputSchema": {},
  "outputSchema": {},
  "rel": "example.read",
  "requiresConfirmation": false
}
```

`outputSchema` **MUST** be omitted when the Capability Link omits it. The
following fields **MUST NOT** enter contract identity:

```text
title · href · method · adapterID · capabilityID · preferredSurface · metadata
```

This exclusion lets multiple transports and providers fulfill the same contract.

### 7.2 Canonicalization and hashing

1. Contract material **MUST** satisfy I-JSON.
2. It **MUST** be canonicalized using RFC 8785 JCS.
3. The canonical string **MUST** be encoded as UTF-8.
4. The bytes **MUST** be hashed with SHA-256.
5. The digest **MUST** use 64 lowercase hexadecimal characters.
6. The address **MUST** be `capability:sha256:` followed by that digest.

A received or cached address **MUST** be recomputed before it is trusted as the
identity of supplied contract material. The address proves agreement about the
contract, not that fulfillment occurred. Fulfillment proof remains a retained
provenance receipt.

The normative vectors are in [`fixtures/contract`](../Conformance/v0.1/fixtures/contract).

## 8. Profiles

A profile adds domain semantics without copying the core protocol stack.

1. A profile **MUST** have a stable absolute URI.
2. Its URI **MUST** appear once in `profiles` and once as a `profileData` key.
3. Its document **MUST** be a JSON object.
4. It **MUST NOT** redefine Capability Link identity, risk, adapter dispatch,
   publisher identity, or provenance semantics.
5. Profile-specific offers **SHOULD** refer to core capabilities by `rel`.
6. New profile fields **MUST** remain inside that profile's document.

This rule is the extension path for HumanCard, OrganizationCard, AgentCard
projections, devices, services, and future principal kinds.

### 8.1 Human Profile

Profile URI:

```text
https://hyperactive.network/profiles/human/v0.1
```

Schema: [`human-profile.schema.json`](../Conformance/v0.1/schemas/human-profile.schema.json)

In addition to its schema:

- the Service Card **MUST** carry `subject`;
- the card subject and Human Profile subject **MUST** be structurally equal;
- the subject kind **MUST** be `human`;
- every Human Profile offer `rel` **MUST** match a Capability Link `rel`;
- a human commitment is provider-side participation and **MUST NOT** be modeled
  as a requester-satisfiable x403 gate;
- authorship roles **MUST** distinguish preparation, review, approval, signing,
  and delivery rather than impersonating the human principal.

## 9. Discovery

A server SHOULD support one or more of:

1. content negotiation at an ordinary HTTPS URL;
2. HTML advertisement with link relation `capability-card`;
3. `/.well-known/agent-card.json` when the node also participates in A2A;
4. a registry entry that resolves to the canonical card URL.

Example:

```http
GET /travel HTTP/1.1
Accept: application/vnd.capabilityweb.service-card+json
```

```html
<link rel="capability-card"
      type="application/vnd.capabilityweb.service-card+json"
      href="/.well-known/agent-card.json">
```

Servers performing content negotiation **MUST** emit `Vary: Accept`. HTTPS is
the default transport; this specification does not create a new network stack.

## 10. Versioning and compatibility

- `0.1` identifies this complete contract, not an individual implementation.
- Additive profile documents do not change the core version.
- Adding an optional metadata member does not change the core version.
- Adding or changing a required core field, enum value, contract-address input,
  or semantic invariant requires a new contract version.
- Consumers **MUST** reject unsupported versions as conforming input, though
  they MAY decode legacy cards for migration.
- A producer **MUST NOT** label a payload `0.1` when it violates v0.1.

## 11. Conformance

An implementation can claim these independently:

| Claim | Requirement |
|---|---|
| **v0.1 Producer** | Emits schema-valid cards and passes all valid/invalid fixture expectations |
| **v0.1 Consumer** | Validates shape and semantic invariants, preserves extensions, and enforces local trust decisions |
| **v0.1 Contract Addressing** | Reproduces every canonical string, digest, and address vector exactly |
| **v0.1 Human Profile** | Satisfies the Human Profile schema and cross-field invariants |

Every claimed class **MUST** pass the shared fixtures without modifying them.
Implementation-specific tests MAY add stricter local policy, but **MUST NOT**
reinterpret a fixture expected to be valid as wire-invalid.

## 12. Security and privacy considerations

- A valid schema is not evidence that a publisher, principal, credential, price,
  or result is trustworthy.
- Consumers **MUST** bound document size, nesting, schema complexity, and remote
  reference resolution before processing untrusted cards.
- Consumers **MUST NOT** automatically dereference arbitrary profile or schema
  URLs in privileged network contexts.
- Public profiles **SHOULD** disclose coarse capability and availability, not
  private schedules, presence, contact details, credentials, or corpora.
- Side effects require idempotency, authoritative local policy, and retained
  authorization/provenance appropriate to the risk.
- Unknown extensions **MUST NOT** silently weaken core validation.

## 13. Normative references

- [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119) and
  [RFC 8174](https://www.rfc-editor.org/rfc/rfc8174), requirement language.
- [RFC 7493](https://www.rfc-editor.org/rfc/rfc7493), I-JSON.
- [RFC 8259](https://www.rfc-editor.org/rfc/rfc8259), JSON.
- [RFC 8785](https://www.rfc-editor.org/rfc/rfc8785), JSON Canonicalization Scheme.
- [JSON Schema Draft 2020-12](https://json-schema.org/draft/2020-12/json-schema-core).
