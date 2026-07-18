# Hyperactive Web Service Cards and Capability Links

## Internet-Draft Status

This document is an experimental project specification for the UniversalInteractionKit
project. It is written in Internet-Draft style to make the proposal reviewable as an
HTTP-layered protocol. It is not an IETF Standards Track document, does not claim IETF
consensus, and does not modify HTTP.

This draft describes the Hyperactive Web v0.1 contract. The frozen, implementation-
independent schemas and conformance fixtures remain authoritative for v0.1 wire
validation. If this draft and those fixtures disagree, the discrepancy is a review
finding to resolve before the draft is called a compatible restatement.

The key words **MUST**, **MUST NOT**, **REQUIRED**, **SHALL**, **SHALL NOT**,
**SHOULD**, **SHOULD NOT**, **RECOMMENDED**, **NOT RECOMMENDED**, **MAY**, and
**OPTIONAL** in this document are to be interpreted as described in BCP 14 when, and
only when, they appear in all capitals.

## Abstract

This document specifies an experimental HTTP-layered representation for discovering
and invoking capabilities offered by people, organizations, agents, devices, and
services. A Service Card is a JSON representation of a node, its accountable subject,
profiles, and capability links. A Capability Link is a typed hypermedia control that
binds an intent and schemas to an existing protocol or adapter.

The protocol deliberately keeps the consuming user agent authoritative for identity
verification, authorization, consent, risk, payment, and execution policy. Publisher
declarations are inputs to policy, not permission to bypass it. Contract addresses
provide location-independent matching for an exact declared capability contract, while
retained provenance records what was actually verified, approved, invoked, and fulfilled.

## Table of Contents

1. [Introduction](#1-introduction)
2. [Conventions and Terminology](#2-conventions-and-terminology)
3. [Protocol Model](#3-protocol-model)
4. [HTTP Resource and Representation Semantics](#4-http-resource-and-representation-semantics)
5. [Service Cards](#5-service-cards)
6. [Principals and Node Identity](#6-principals-and-node-identity)
7. [Capability Links](#7-capability-links)
8. [Discovery and Content Negotiation](#8-discovery-and-content-negotiation)
9. [Invocation and Policy Gates](#9-invocation-and-policy-gates)
10. [Contract Addresses](#10-contract-addresses)
11. [Profiles and Extensions](#11-profiles-and-extensions)
12. [Versioning and Conformance](#12-versioning-and-conformance)
13. [Security and Privacy Considerations](#13-security-and-privacy-considerations)
14. [IANA Considerations](#14-iana-considerations)
15. [References](#15-references)
Appendix A. [Complete Example](#appendix-a-complete-example)

## 1. Introduction

HTTP already provides a uniform interface for identifying resources, transferring
representations, and following links to interactions. Agent and tool protocols add
useful invocation mechanisms, but commonly describe discovery, schemas, protocol
bindings, identity, and policy in incompatible envelopes.

The Hyperactive Web proposal defines a small common representation at that boundary:

```text
principal -> node -> Service Card -> Capability Link -> existing protocol
```

The proposal does not replace hyperlinks, HTML forms, HTTP methods, A2A, MCP, OpenAPI,
A2UI, x401, x402, or x403. A Capability Link is a machine-readable declaration of a
possible interaction. The target protocol remains responsible for carrying out that
interaction.

This document is deliberately narrower than the project's broader research narrative.
It specifies the wire and HTTP-facing behavior that can be tested against the v0.1
schemas and fixtures.

## 2. Conventions and Terminology

### 2.1. Core terms

**Service Card**: A JSON representation describing a node, its provider, optional
accountable subject, supported protocols, profiles, and capability links.

**Capability Link**: A typed hypermedia control containing a relation, target, input
schema, optional output schema, protocol method, adapter identifier, and publisher-
declared policy metadata.

**Principal**: The accountable entity represented by a node. A principal can be a
human, organization, or autonomous entity. A principal is not a network endpoint.

**Node**: The publishing or operating system that exposes a Service Card. A node may
act on behalf of a principal and may rotate its own operational identity.

**Affordance**: A Capability Link offered in a particular application state, possibly
with inputs already bound. An affordance is a runtime presentation of a link, not a
new wire identity.

**Contract address**: A `capability:sha256:` name derived from the exact declared
contract material of a Capability Link. It identifies an agreement about declarations,
not a provider, resource location, or fulfillment result.

### 2.2. Normative sources

The v0.1 wire contract is defined by:

- [`HyperactiveWebV0.1.md`](HyperactiveWebV0.1.md);
- the JSON Schemas in [`../Conformance/v0.1/schemas`](../Conformance/v0.1/schemas);
- the shared fixture manifest and fixtures in
  [`../Conformance/v0.1/fixtures`](../Conformance/v0.1/fixtures).

## 3. Protocol Model

A conforming deployment has a producer, a consumer, and zero or more protocol
adapters. The producer publishes a representation. The consumer retrieves and validates
it, applies local policy, selects a link, and dispatches to the link's declared method
and adapter. The resulting exchange may be synchronous or may create an asynchronous
task in the bound protocol.

The consumer remains authoritative at every consequential boundary:

1. it validates the representation and its semantic invariants;
2. it verifies identity claims against a local trust anchor;
3. it evaluates declared risk against local policy;
4. it obtains confirmation, credentials, payment, or human participation when required;
5. it retains the relevant approval, invocation, result, and provenance artifacts.

No publisher field grants permission by itself. In particular, `declaredRisk` and
`requiresConfirmation` are declarations and MUST NOT be treated as an execution
authorization.

## 4. HTTP Resource and Representation Semantics

### 4.1. Resource model

A Service Card is a representation of a resource identified by its `id` field. The
`id` MUST be an absolute URI. The URI identifies the card document; it does not
necessarily identify the node, provider, or accountable principal.

Capability Link `href` values identify targets or protocol entry points. A composed
URI such as `a2a+https://example.test/agent` indicates a protocol binding and an
underlying transport. A bare `https://` URI does not, by itself, select an adapter
method.

### 4.2. Representation requirements

Service Cards and Capability Link documents:

- MUST be UTF-8 JSON;
- MUST satisfy the I-JSON constraints;
- MUST use unique object member names;
- MUST carry `schemaVersion: "0.1"` at the Service Card root;
- MUST satisfy the applicable published JSON Schema and semantic invariants;
- MUST NOT add undeclared members to closed core objects;
- MUST preserve unknown `metadata` members when forwarding a representation.

The Service Card media type is:

```text
application/vnd.capabilityweb.service-card+json
```

The Capability Link media type is:

```text
application/vnd.capabilityweb.capability-link+json
```

These are project media types. Their use does not imply registration with IANA.

### 4.3. Methods and safety

Discovery uses `GET` and MAY use `HEAD`. Capability Link `method` is an application
binding selector, not an HTTP method override. The v0.1 values are:

| Link method | Binding meaning |
| --- | --- |
| `delegate` | Delegate to an A2A agent or equivalent agent task |
| `invoke` | Invoke an MCP, x403, or equivalent capability |
| `call` | Call an OpenAPI or ordinary HTTP operation |
| `open` | Open a local or application intent |
| `read` | Read a resource or artifact |

An implementation MUST preserve the safety and idempotency semantics of the bound
protocol. It MUST NOT infer that a link is safe merely because its publisher declares
`readOnly`.

### 4.4. Caching and validation

Service Cards are representations and MAY be cached according to ordinary HTTP cache
semantics. A producer SHOULD provide validators such as `ETag` or `Last-Modified`
when cards are stable enough for revalidation. A consumer MUST revalidate a cached
card when local policy requires current identity, availability, price, risk, or
authorization information.

Contract addresses MAY be used as exact-declaration cache or provider-selection keys.
They MUST NOT be used as proof that a cached fulfillment remains valid, authorized,
available, or safe.

## 5. Service Cards

The Service Card root object MUST contain the following v0.1 fields:

| Field | Requirement |
| --- | --- |
| `schemaVersion` | MUST equal `0.1` |
| `id` | MUST be an absolute URI |
| `name` | MUST be non-empty |
| `description` | MUST be present |
| `provider` | MUST identify the provider in provider-local terms |
| `serviceURI` | MUST use `scheme://` or `proto+transport://` syntax |
| `adapterID` | MUST identify the runtime adapter binding |
| `supportedProtocols` | MUST contain unique protocol identifiers |
| `authRequired` | MUST declare whether initial access requires authorization |
| `profiles` | MUST contain unique absolute profile URIs |
| `profileData` | MUST contain one object for each declared profile |
| `capabilities` | MUST contain zero or more Capability Links |
| `metadata` | MUST be an object |

`identity`, when present, is the node's declared identity. `subject`, when present,
is the accountable principal. These fields MUST NOT be conflated.

## 6. Principals and Node Identity

### 6.1. Principals

`Principal.kind` MUST be `human`, `organization`, or `autonomous`. `Principal.id`
MUST be an absolute URI and MUST NOT require a particular identity system. An alias is
a claim of control over a name; it is not, by itself, a professional credential or
authority proof.

### 6.2. Node identity

The v0.1 identity schemes are `dns-id` and the transitional `node-key` shim. A
published identity is a claim, not a verification result:

- a publisher MUST emit `verified: false`;
- a consumer MUST ignore a received assertion of local verification;
- a consumer MUST verify the claim against its own trust anchor before treating it as
  verified;
- a consumer MUST NOT republish local verification as provider evidence.

Identity verification proves, at most, control of the relevant identity anchor. It
does not prove profile claims, professional credentials, authority, or successful
capability fulfillment.

## 7. Capability Links

A Capability Link MUST contain `rel`, `title`, `href`, `method`, `adapterID`,
`capabilityID`, `inputSchema`, `declaredRisk`, `requiresConfirmation`,
`preferredSurface`, and `metadata`. `outputSchema` is optional.

Within a Service Card, the tuple `(method, adapterID, capabilityID)` MUST be unique.
`rel` MUST be non-empty and whitespace-free. `href` MUST use `scheme://` or
`proto+transport://` syntax.

Recognized protocol prefixes MUST agree with the binding method:

| Prefix | Required method |
| --- | --- |
| `a2a` | `delegate` |
| `mcp`, `x403` | `invoke` |
| `openapi`, `http` | `call` |
| `intent`, `app` | `open` |
| `resource`, `artifact` | `read` |

Unknown protocol prefixes MAY be carried. Adapter selection for them is
implementation-specific until a future contract defines it.

## 8. Discovery and Content Negotiation

A producer SHOULD support at least one of these discovery paths:

1. content negotiation at an ordinary HTTPS URL;
2. an HTML link with relation `capability-card`;
3. `/.well-known/agent-card.json` when the node also participates in A2A;
4. a registry entry resolving to the canonical card URL.

An ordinary HTTP exchange can therefore be:

```http
GET /travel HTTP/1.1
Host: travel.example
Accept: application/vnd.capabilityweb.service-card+json

HTTP/1.1 200 OK
Content-Type: application/vnd.capabilityweb.service-card+json
Vary: Accept
ETag: "card-v0.1-42"

{ "schemaVersion": "0.1", "id": "https://travel.example/travel", "...": "..." }
```

A server performing content negotiation MUST emit `Vary: Accept`. A consumer SHOULD
send an explicit `Accept` value and MUST reject a representation that is not a
supported media type unless it is using an explicitly configured compatibility mode.

An HTML publisher MAY advertise a card as follows:

```html
<link rel="capability-card"
      type="application/vnd.capabilityweb.service-card+json"
      href="/.well-known/agent-card.json">
```

Discovery does not authorize invocation. The consumer still validates and evaluates
the returned card.

## 9. Invocation and Policy Gates

The v0.1 contract does not define a new invocation transport. After selecting a link,
the consumer dispatches through the adapter named by `adapterID` and uses the method
binding described by the link.

Before a side-effecting invocation, the consumer MUST apply local policy. Depending
on the link and local context, that policy MAY require:

- node or principal identity verification;
- user confirmation;
- a credential or delegated mandate;
- human participation;
- payment or a usage grant;
- an idempotency key or replay defense;
- a current representation or authorization check.

The provider's declaration is advisory input. A provider MUST NOT lower the consumer's
local safety requirements by marking an operation read-only or by setting
`requiresConfirmation` to `false`.

### 9.1. HTTP status mapping

The implementation SHOULD use existing HTTP semantics:

| Situation | Typical response |
| --- | --- |
| Malformed or semantically invalid request | `400 Bad Request` |
| Missing or invalid authentication | `401 Unauthorized` |
| Payment required | `402 Payment Required` |
| Authenticated but not permitted, or a failed policy gate | `403 Forbidden` |
| Target capability not found | `404 Not Found` |
| Method/binding not supported | `405 Method Not Allowed` or a bound-protocol error |
| Accepted asynchronous work | `202 Accepted` |
| Successful representation | `200 OK` |

This proposal does not mint a new status code for human participation. A provider MAY
return `202 Accepted` while its task is working, or use the bound protocol's input-
required state when the client must act. Problem details and protocol-native challenge
objects remain the responsibility of the applicable binding.

For payment and identity, x402 and x401 payloads remain native to those protocols.
x403 is a composition envelope and MUST NOT silently redefine their proof or payment
semantics.

## 10. Contract Addresses

A contract address has the form:

```text
capability:sha256:<64 lowercase hexadecimal characters>
```

The address is computed from exactly these Capability Link members:

```json
{
  "declaredRisk": "readOnly",
  "inputSchema": {},
  "outputSchema": {},
  "rel": "example.read",
  "requiresConfirmation": false
}
```

`outputSchema` MUST be omitted when it is absent from the link. `title`, `href`,
`method`, `adapterID`, `capabilityID`, `preferredSurface`, and `metadata` MUST NOT
enter contract identity.

The contract material MUST be canonicalized using RFC 8785 JCS, encoded as UTF-8,
hashed with SHA-256, and rendered in lowercase hexadecimal. A consumer MUST recompute
the address before trusting it as the identity of supplied contract material.

The address establishes exact agreement about selected declarations. It does not
establish provider trust, semantic equivalence, availability, safety, authorization,
or fulfillment.

## 11. Profiles and Extensions

A profile adds domain semantics without copying the core protocol stack:

1. its identifier MUST be a stable absolute URI;
2. it MUST appear once in `profiles` and once as a `profileData` key;
3. its document MUST be a JSON object;
4. it MUST NOT redefine Capability Link identity, risk, adapter dispatch, publisher
   identity, or provenance semantics;
5. new profile fields MUST remain inside that profile document.

Unknown profiles MUST be retained and MAY be ignored semantically. An implementation
that cannot preserve an unknown profile document MUST NOT rewrite or re-sign the card
as though it had preserved it.

The Human Profile is identified by:

```text
https://hyperactive.network/profiles/human/v0.1
```

For a Human Profile card, `subject` and the profile subject MUST be structurally
equal, the subject kind MUST be `human`, and each profile offer relation MUST match a
Capability Link relation. Human participation is not a requester-satisfiable x403
gate; authorship roles MUST distinguish preparation, review, approval, signing, and
delivery.

## 12. Versioning and Conformance

`0.1` identifies the complete contract. Additive profile documents and optional
metadata do not change the core version. A required core field, enum, contract-address
input, or semantic invariant requires a new contract version.

Consumers MUST reject unsupported versions as conforming input, although they MAY
decode legacy cards for migration. Producers MUST NOT label a payload `0.1` when it
violates the v0.1 contract.

An implementation MAY claim one or more conformance classes:

| Claim | Requirement |
| --- | --- |
| v0.1 Producer | Schema-valid cards and all valid/invalid fixture expectations |
| v0.1 Consumer | Shape/invariant validation, extension preservation, local trust policy |
| v0.1 Contract Addressing | Every canonical string, digest, and address vector |
| v0.1 Human Profile | Human Profile schema and cross-field invariants |

Every claimed class MUST pass the shared fixtures without modifying them. The fixture
package is implementation-independent and is not evidence of public discovery,
provider trust, correct fulfillment, privacy, accessibility, or standards-body
conformance.

## 13. Security and Privacy Considerations

A valid JSON Schema is not evidence that a publisher, principal, credential, price, or
result is trustworthy. Consumers MUST treat cards and all referenced schemas,
profiles, and metadata as untrusted input.

Consumers MUST bound document size, nesting depth, schema complexity, and remote
reference resolution. They MUST NOT automatically dereference arbitrary profile or
schema URLs from privileged network contexts. Implementations SHOULD isolate parsing,
validation, adapter dispatch, and credential/payment operations.

Public profiles SHOULD disclose coarse capabilities and availability rather than
private schedules, presence, contact details, credentials, or protected corpora.
Capability links MAY reveal sensitive intent, so providers and registries SHOULD
minimize indexing and logging of private offers.

Side effects require authoritative local policy, suitable authorization, replay
protection, and retained provenance. A retained provenance record MUST be protected
with the same care as the underlying request, credentials, payment evidence, and
personal data. Retention systems SHOULD support deletion, redaction, access control,
and an auditable distinction between original evidence and derived graph or search
indexes.

Contract addresses are not signatures. A consumer MUST verify the source and integrity
of a card and MUST NOT treat a matching digest as proof that two providers are honest
or that their implementations have equivalent behavior.

Unknown extensions MUST NOT silently weaken core validation or local policy.

## 14. IANA Considerations

This document has no IANA actions.

The media types and link relation used here are project-level experimental values. A
future standards submission would need to decide whether to register them, replace
them with existing Web of Things or other registered vocabulary, or define a profile
instead. No new URI scheme, HTTP method, status code, authentication scheme, or HTTP
field is requested by this draft.

## 15. References

### 15.1. Normative References

- [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119), Key words for use in RFCs to
  Indicate Requirement Levels.
- [RFC 8174](https://www.rfc-editor.org/rfc/rfc8174), Ambiguity of Uppercase vs
  Lowercase in RFC 2119 Key Words.
- [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110), HTTP Semantics.
- [RFC 7493](https://www.rfc-editor.org/rfc/rfc7493), The I-JSON Message Format.
- [RFC 8259](https://www.rfc-editor.org/rfc/rfc8259), The JavaScript Object
  Notation (JSON) Data Interchange Format.
- [RFC 8785](https://www.rfc-editor.org/rfc/rfc8785), JSON Canonicalization Scheme.
- [JSON Schema](https://json-schema.org/draft/2020-12/json-schema-core), Draft
  2020-12 Core.

### 15.2. Informative References

- [Hyperactive Web v0.1 contract](HyperactiveWebV0.1.md).
- [Hyperactive Web research narrative](HyperactiveWeb.md).
- [Standards-review briefing](TimBernersLeeBriefing.md).
- [v0.1 conformance package](../Conformance/v0.1/README.md).
- [A2A](https://a2a-protocol.org/), Agent2Agent protocol.
- [MCP](https://modelcontextprotocol.io/), Model Context Protocol.
- [W3C Web of Things](https://www.w3.org/WoT/), Web of Things architecture and
  Thing Description prior art.

## Appendix A. Complete Example

The following is a shortened Service Card representation. The full wire examples and
semantic test cases are in the v0.1 fixture package.

```http
GET /travel HTTP/1.1
Host: travel.example
Accept: application/vnd.capabilityweb.service-card+json

HTTP/1.1 200 OK
Content-Type: application/vnd.capabilityweb.service-card+json
Vary: Accept

{
  "schemaVersion": "0.1",
  "id": "https://travel.example/travel",
  "name": "Travel agent",
  "description": "Searches refundable hotels.",
  "provider": "travel.example",
  "serviceURI": "a2a+https://travel.example/agent",
  "adapterID": "travel-a2a",
  "supportedProtocols": ["a2a"],
  "authRequired": false,
  "profiles": [],
  "profileData": {},
  "capabilities": [{
    "rel": "hotel.search",
    "title": "Search hotels",
    "href": "a2a+https://travel.example/agent/search",
    "method": "delegate",
    "adapterID": "travel-a2a",
    "capabilityID": "hotel.search",
    "inputSchema": {"type": "object"},
    "declaredRisk": "readOnly",
    "requiresConfirmation": false,
    "preferredSurface": "dynamicUI",
    "metadata": {}
  }],
  "metadata": {}
}
```

A consumer MAY then dispatch the selected link through A2A. The Service Card does not
define the A2A task format; it defines how the capability is discovered, selected,
and governed before that task is created.
