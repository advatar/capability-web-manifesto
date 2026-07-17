# A Capability Layer for the Web

## Discussion brief for Tim Berners-Lee — Hyperactive Web v0.1

**Date:** 17 July 2026

**Status:** Project discussion draft; not a W3C or IETF specification

**Core reading time:** 8–10 minutes; presenter appendix follows

> **The question, not the claim:** Can existing Web architecture be used to
> make agent-invocable affordances portable across protocols while keeping
> authority, policy, consent, and provenance under the user's control?

This is a request for architectural criticism, not endorsement. The most useful
outcome would be knowing which parts should become a profile or extension of an
existing Web standard, which parts belong only in a user agent, and which parts
should be removed.

## One-minute opening

The Web already supports action. Forms, HTTP methods, scripts, APIs, and
hypermedia controls have always let people and software do more than retrieve
documents.

The narrower problem we are testing appears at the boundaries between today's
agent ecosystems. A2A advertises agent skills, MCP exposes tools, OpenAPI
describes HTTP APIs, and W3C Web of Things describes interaction affordances.
Each is useful. A user agent that wants to discover, compare, invoke, and audit
capabilities across those boundaries still needs project-specific glue and a
clear rule for whose policy is authoritative.

Our experiment publishes a small Service Card representation containing typed
hypermedia controls, which we call Capability Links. A link can bind an intent
and data schema to an existing protocol. Before following it, a locally
configured policy kernel controls the decision. A production consumer must
derive that decision rather than echo publisher metadata. If the interaction
can create an obligation, the runtime can require human approval and retain the
authorization and outcome as provenance.

We have a project specification, JSON Schemas, shared fixtures, and matching
Swift and TypeScript test results. We do **not** yet have a standard, a Linked
Data vocabulary, a Solid integration, or an independent implementation. The
design question is whether the smallest useful version should be a Web of
Things profile or JSON-LD context rather than a new representation.

## The proposal in one sentence

Publish agent-readable affordances at Web identifiers, bind them to existing
protocols, apply policy locally before invocation, and make consequential
interactions produce durable provenance.

```text
HTTPS URI
  ├── text/html representation for a person
  └── machine-readable capability representation
        └── typed affordance + protocol binding
              └── consumer-side trust, policy, and consent
                    └── existing HTTP / A2A / MCP / other protocol
                          └── result + authorization/provenance references
```

The project calls the machine-readable entry point a **Service Card** and its
typed controls **Capability Links**. These are working names, not a request to
replace established Web terminology.

## The concrete problem

The experiment targets four failure modes seen in agent integrations:

1. **Protocol islands.** Capability descriptions are bound to one tool, agent,
   API, or UI ecosystem, so composition requires bespoke adapters.
2. **Publisher claims confused with consumer trust.** A service can describe an
   action as safe, but only the consumer can decide whether it is safe for this
   user, context, and jurisdiction.
3. **Unsafe automation without a durable authorization boundary.** Agent flows
   can create obligations while losing the approval, payment, mandate, or input
   that authorized the action.
4. **Provider identity confused with capability identity.** Two providers may
   advertise the same declared interface, yet their locations and trust differ.

The proposal does not assume that a new protocol is the answer. It asks whether
a narrow common description and consumer behavior can reduce this glue while
remaining recognizably Web-shaped.

## What v0.1 actually contains

| Element | Project behavior | Status |
|---|---|---|
| Service Card | An absolute-URI-identified JSON document describing a node, profiles, and affordances | Implemented |
| Capability Link | Relation, target, binding method, input/output schemas, and publisher-declared risk metadata | Implemented |
| Consumer policy | A pluggable local kernel returns `allow`, `requireConfirmation`, or `deny`; its verdict controls invocation | Implemented, but the default kernel still relies on declared metadata and requires hardening |
| Contract digest | RFC 8785 canonicalization plus SHA-256 over five declared contract fields | Implemented |
| Provenance | Approval, payment, invocation, result, and surface artifacts retain parent links | Implemented in the runtime |
| Discovery | HTTPS content negotiation, HTML advertisement, well-known URLs, or optional registries | Specified; not yet demonstrated as a public deployment |
| Profiles | URI-identified extension documents; Human Profile is the first example | Implemented experimentally |
| Conformance | Shared valid, invalid, and digest fixtures consumed by Swift and TypeScript | Implemented |

The [normative project contract](HyperactiveWebV0.1.md) deliberately states that
it has no standards-body status. The
[conformance package](../Conformance/v0.1/README.md) can be used without reading
the Swift implementation.

## What is—and is not—new

Actions on the Web are not new. Neither are hypermedia controls, schemas,
protocol bindings, authorization, content negotiation, or provenance.

The experiment combines three narrower hypotheses:

1. **One consumer model across heterogeneous bindings.** A common affordance can
   dispatch through ordinary HTTP, OpenAPI, A2A, MCP, a local intent, or another
   adapter without pretending those protocols are identical.
2. **Provider-independent declared-contract matching.** A digest can group links
   whose selected contract fields are byte-for-byte equivalent after normative
   canonicalization, while leaving provider, location, price, and trust out of
   the digest.
3. **Consumer authority plus durable evidence.** The architecture lets a
   consuming user agent supply the authoritative policy and retain evidence for
   consequential actions. The default project policy is not yet an independent
   classifier and must be hardened before untrusted deployment.

The digest proves only equality of the selected canonical fields. It does not
prove semantic equivalence, provider trustworthiness, correct execution, or
result quality.

## Fit with Web architecture

The proposal should be judged against the architecture of the Web, not against
an imagined document-only Web. The W3C architecture already describes software
agents, standardized interactions, representations, safe and unsafe actions,
and extensible formats.

| Web principle or prior art | Where v0.1 aligns | Where v0.1 needs work |
|---|---|---|
| Global identification and representations | Cards have absolute URI identifiers; HTTPS discovery and content negotiation are defined | The project must demonstrate stable, dereferenceable public identifiers |
| Web Linking and hypermedia controls | Links carry a target, relation, and target metadata | Relation values are currently opaque strings rather than URI-identified semantics or registered link relations |
| HTTP safe/unsafe semantics | Read-only and side-effecting paths are separated; local policy gates unsafe actions | Risk labels need a formal mapping to HTTP safety and idempotency, and cannot be trusted when bindings are non-HTTP |
| Linked Data | Profiles use absolute URIs and unknown profiles are preserved | The representation is ordinary JSON, not yet JSON-LD; its links do not yet form a defined RDF graph |
| Extensibility | Profiles and metadata provide explicit extension points; unknown profiles survive forwarding | Closed core objects and extension behavior need review against Web-scale extensibility practice |
| W3C Web of Things | Service Cards, affordances, schemas, discovery, security metadata, and bindings have close analogues in Thing Descriptions | A mapping or WoT profile must be attempted before arguing for a separate vocabulary |
| Solid | Cards and provenance can be ordinary permissioned resources under user control | No Solid storage, WebID, WAC/ACP, or notification integration exists today |
| Ethical Web principles | Local control, human approval, transparency, and provenance are design goals | Threat modeling, accessibility, internationalization, privacy review, and governance remain incomplete |

The primary references for this comparison are the
[Architecture of the World Wide Web](https://www.w3.org/TR/webarch/),
[Web Linking](https://www.rfc-editor.org/rfc/rfc8288.html),
[HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html),
[Linked Data design note](https://www.w3.org/DesignIssues/LinkedData.html),
[JSON-LD 1.1](https://www.w3.org/TR/json-ld11/),
[WoT Architecture 1.1](https://www.w3.org/TR/wot-architecture11/), and
[WoT Thing Description 1.1](https://www.w3.org/TR/wot-thing-description11/).

## The strongest existing foundation: Web of Things

W3C Web of Things already provides the closest architectural shape:

- a machine-readable description as a Web entry point;
- properties, actions, events, and navigation as interaction affordances;
- input and output data schemas;
- hypermedia controls and protocol bindings;
- security metadata, discovery, profiles, and JSON-LD extensibility.

The important question is therefore not “why invent a Capability Link?” It is:

> Can the project-specific requirements—agent-protocol bindings,
> consumer-authoritative policy, human/organizational principals, declared
> contract digests, and retained authorization provenance—be expressed as a
> WoT Thing Description profile or context extension?

That mapping is a required experiment before any broader standardization
proposal. If the mapping preserves the useful behavior, the project should use
the established vocabulary. If it fails, the delta should be documented term
by term instead of asserted at the category level.

## Relationship to Solid

Solid and this experiment address different layers.

- **Solid** provides permissioned, interoperable access to resources in storage
  controlled through Web identifiers, HTTP, identity, and access-control
  policies.
- **This experiment** describes invocable affordances and consumer behavior
  before and after an action.

A plausible integration would store a person's private card, mandates,
approvals, receipts, and provenance as resources in a Solid storage. A public
card could reveal only coarse capabilities and an authenticated affordance for
requesting more. This is a hypothesis, not implemented behavior. The current
[Solid Protocol 0.11](https://solidproject.org/TR/protocol) is a W3C Community
Group Report, not a W3C Standard, and the briefing should preserve that status
distinction.

## Design changes already indicated by this review

The v0.1 fixtures are useful as a frozen experiment, but they should not be
treated as the final Web shape. A subsequent revision should test these changes:

1. **Use dereferenceable HTTPS identifiers as the public names.** Treat
   `capability:sha256:…` as an experimental integrity/deduplication key, not the
   primary Web identifier.
2. **Keep ordinary HTTP targets ordinary where possible.** Move protocol-binding
   semantics into typed metadata rather than relying on unregistered composed
   URI schemes such as `a2a+https`.
3. **Define link semantics with URIs.** Permit URI-identified relation types and
   document whether any short names are aliases for stable vocabulary terms.
4. **Publish a JSON-LD context or WoT mapping.** Test whether current JSON can be
   given interoperable semantics without breaking plain-JSON consumers.
5. **Harden the default policy.** Do not auto-authorize from publisher-declared
   risk; derive a conservative verdict from locally trusted binding semantics
   and context.
6. **Map risk to protocol semantics.** Separate HTTP safety, idempotency,
   reversibility, financial/legal obligation, privacy impact, and local policy;
   one risk enum cannot carry all of them.
7. **Make multilingual and accessible labels first-class.** A single `title`
   string is not sufficient for a Web-scale affordance.
8. **Run W3C-style self-review.** Complete security/privacy, accessibility,
   internationalization, and societal-impact reviews before proposing a venue.

These are design candidates, not retroactive changes to the published v0.1
fixture expectations.

## The specific ask

We would value guidance on four decisions:

1. Is a WoT Thing Description profile/context the right starting point, or is a
   different existing Web abstraction a better fit?
2. Should the public capability identifier always be an HTTPS URI, with the
   contract digest represented only as integrity metadata?
3. Which parts belong in a shared representation, and which must remain private
   policy or provenance inside the user's agent or Solid storage?
4. What evidence and review would be necessary before taking this beyond a
   project experiment, and where should that discussion occur?

# Presenter appendix

## Five-minute evidence demo

The demo should show interoperability and failure handling, not a polished UI.

### 1. Show one human-readable fixture

```sh
jq . Conformance/v0.1/fixtures/valid/human-profile-service-card.json
```

Point out the separate card, node identity, accountable principal, profile, and
affordance fields. Do not imply that the identity claim is already verified.

### 2. Show provider-independent declared-contract matching

```sh
jq . Conformance/v0.1/fixtures/contract/search-hotels.json
```

Two providers have different endpoints and adapter identifiers, but the same
canonical selected fields and therefore the same digest. Say “exact declared
contract match,” not “same behavior.”

### 3. Run both conformance implementations

```sh
swift test --filter ConformanceTests
cd Web
npm test -- --run src/__tests__/conformance.test.ts
```

Both implementations consume the same checked-in valid, invalid, and digest
fixtures.

### 4. Show that publisher trust claims are rejected

```sh
jq . Conformance/v0.1/fixtures/invalid/preverified-identity.json
```

The consumer rejects a publisher that tries to serialize local verification as
evidence. Then show the invalid-fixture tests passing.

### 5. Show local policy and provider selection

```sh
swift test --filter CapabilityWebTests/testResolveAndFollowByContractAddressRoutesToAnyProvider
swift test --filter CapabilityWebTests/testHighRiskAffordanceGatesUntilApproved
```

End with the limitation: these are two language implementations maintained in
one project, not yet an independent third-party interoperability result.

## A falsifiable pilot

A credible next step is a small pilot, not a naming campaign.

1. Publish two cards on independent HTTPS origins, each with HTML and machine
   representations.
2. Describe one read-only and one obligation-creating action.
3. Produce a WoT Thing Description mapping and record any semantics that do not
   round-trip.
4. Add a JSON-LD context and verify that plain-JSON consumers remain compatible.
5. Ask an unaffiliated implementer to build either a producer or consumer from
   the prose, schemas, and fixtures alone.
6. Replace the declaration-driven default policy, then demonstrate that a
   malicious “safe” declaration cannot bypass consumer policy and that no unsafe
   action occurs without retained authorization.
7. Store one mandate and receipt in user-controlled Solid storage, or document
   precisely why the Solid model is insufficient.

The proposal has earned further work only if the pilot reduces bespoke
integration without weakening URI ownership, protocol semantics, user control,
privacy, or independent implementation.

## Hard questions and candid answers

### “Why isn't this just Web of Things?”

It may be a WoT profile or context extension. The current project began from
agent protocols rather than WoT and did not perform that mapping soon enough.
The next design gate is to try the mapping and retain only a demonstrated delta.

### “Why isn't this an ordinary Web form?”

Forms are foundational hypermedia controls and must remain part of the model.
The experiment adds machine-readable schemas, heterogeneous protocol bindings,
consumer-side agent policy, and provenance behavior. If those can be expressed
as existing forms plus established vocabularies, a new control is unnecessary.

### “Why invent a URI scheme?”

That is an unresolved v0.1 choice. A non-dereferenceable digest can be useful as
an integrity or deduplication key, but it should not displace an HTTPS Web
identifier. Unregistered composed schemes also reduce generic client behavior.

### “Does the digest prove two capabilities mean the same thing?”

No. It proves only that five selected fields have the same canonical bytes.
Schema equivalence, real-world semantics, provider quality, and fulfillment all
remain outside the proof.

### “Why not use JSON-LD and URI relations now?”

The project optimized v0.1 for strict cross-language JSON fixtures. That was
useful for implementation but insufficient for a Web-scale vocabulary. JSON-LD
and URI-defined relations are now explicit design requirements for the next
experiment.

### “Does a registry centralize discovery?”

It must not be required. HTTPS lookup, content negotiation, links, well-known
discovery, and crawlable descriptions should work without a central registry.
Registries can be optional indexes with plural operators.

### “Can publishers mark unsafe actions as safe?”

They can make the claim. A custom local policy kernel can override it, but the
current default kernel still uses declared risk and confirmation metadata. That
default is not suitable for untrusted deployment and must fail closed or derive
safety from locally trusted protocol semantics before the project can claim the
publisher cannot bypass policy.

### “What prevents agents from exposing or exploiting people?”

Not enough yet. The Human Profile separates a person from their operational
node and prohibits serialized local verification, but selective disclosure,
private capabilities, revocable mandates, accessibility, abuse analysis, and a
complete privacy threat model remain required work.

### “Who governs the vocabulary?”

Today, this repository does, which is not a standards governance model. Any
interoperable vocabulary would need open issue tracking, multistakeholder use
cases, royalty-free terms, independent implementations, and an appropriate
community or standards venue.

### “Is this Web4?”

“Web4” is project shorthand and should not be used as a technical or standards
claim. The proposal is a capability-description and consumer-policy experiment
on the existing Web.

## Eight-minute talk track

| Time | Point |
|---|---|
| 0:00–1:00 | Use the one-minute opening. Acknowledge forms, HTTP actions, hypermedia, WoT, and Solid immediately. |
| 1:00–2:00 | Show the four integration failure modes. Avoid ecosystem hype. |
| 2:00–3:15 | Walk through Service Card → affordance → local policy → existing binding → provenance. |
| 3:15–4:15 | State the three hypotheses and the exact limits of the contract digest. |
| 4:15–5:30 | Explain the WoT overlap and ask whether this should become a WoT profile/context. |
| 5:30–6:30 | Show the shared fixtures and one rejected trust claim. |
| 6:30–7:15 | Name the gaps: HTTPS identifiers, JSON-LD, URI relations, threat review, accessibility, independent implementation. |
| 7:15–8:00 | Make the four-part ask. Stop and listen. |

## Speaker guardrails

Say:

- “experimental project contract”;
- “typed hypermedia control”;
- “consumer-authoritative policy”;
- “exact declared-contract digest”;
- “candidate WoT profile or context extension”;
- “one Web, existing protocols.”

Do not say:

- “the Web was only documents”;
- “hyperlinks cannot act”;
- “successor to the hyperlink”;
- “HTML of doing”;
- “new Web standard” or “Web4 standard”;
- “the digest proves semantic equivalence”;
- “verified identity” when showing a publisher claim;
- “decentralized” without naming the identifier, discovery, and governance
  mechanism that makes it so.

## Evidence and current limitations

| Evidence | Current result |
|---|---|
| Project wire contract | Published as v0.1 with explicit non-standards status |
| Machine-readable schemas | Five JSON Schema Draft 2020-12 schemas |
| Shared corpus | Three valid cards, eight semantic-invalid cards, and a two-provider digest vector |
| Implementations | Swift and TypeScript canonicalizers/validators maintained by this project |
| Automated verification | 115 Swift tests and 22 Web tests currently pass |
| Independent implementation | Not yet |
| Public multi-origin deployment | Not yet |
| JSON-LD/WoT mapping | Not yet |
| Solid integration | Not yet |
| Formal security/privacy/accessibility/i18n review | Not yet |

## Primary references

- W3C, [Architecture of the World Wide Web, Volume One](https://www.w3.org/TR/webarch/).
- Tim Berners-Lee, [Linked Data — Design Issues](https://www.w3.org/DesignIssues/LinkedData.html) (personal design note, not a standard).
- IETF, [RFC 8288: Web Linking](https://www.rfc-editor.org/rfc/rfc8288.html).
- IETF, [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html).
- W3C, [JSON-LD 1.1](https://www.w3.org/TR/json-ld11/).
- W3C, [Web of Things Architecture 1.1](https://www.w3.org/TR/wot-architecture11/).
- W3C, [Web of Things Thing Description 1.1](https://www.w3.org/TR/wot-thing-description11/).
- Solid Community Group, [Solid Protocol 0.11](https://solidproject.org/TR/protocol).
- W3C, [Ethical Web Principles](https://www.w3.org/TR/ethical-web-principles/).
- W3C, [Privacy Principles](https://www.w3.org/TR/privacy-principles/).
- A2A Project, [A2A Protocol specification](https://a2a-protocol.org/latest/specification/).
- Model Context Protocol, [MCP specification](https://modelcontextprotocol.io/specification/latest).
