# Draft: x403 terms and grants as ODRL policies

Status: informative draft accompanying [draft-hyperactive-web-00](draft-hyperactive-web-00.md) and the [x403 overview](https://hyperactive.network/x403). Uses ODRL 2.2 JSON-LD
(`http://www.w3.org/ns/odrl.jsonld`). Items marked **(check)** need confirming against the ODRL
vocabulary and the AI vocabulary draft before publishing.

## The idea

x403 keeps its own envelope (`CAPABILITY-REQUIRED` / `-INVOCATION` / `-RESPONSE`, nonce,
signatures) and stops inventing a licence format:

- the `grant` gate in the 403 offer carries an **ODRL `Offer`**: what the requester may and may
  not do with what leaves the origin, and the duties attached;
- the signed `grant` in the 200 response is an **ODRL `Agreement`**: the same rules, now naming
  the verified requester as `assignee`, with the agreed limits.

x401 (proof) and x402 (payment) stay as their own gates. ODRL refers to them: the payment
fulfils the `compensate` duty, and the proof establishes who the `assignee` is.

## 1. In the 403 offer: the `grant` gate as an ODRL Offer

Replaces the page's current ad-hoc terms (`scope`, `training`, `attribution`).

```json
{
  "scheme": "grant",
  "terms": {
    "@context": [
      "http://www.w3.org/ns/odrl.jsonld",
      { "aivocab": "https://w3c.github.io/odrl/ai-vocab/#",
        "x403": "https://hyperactive.network/ns/x403#" }
    ],
    "@type": "Offer",
    "uid": "https://knowledge.example.com/policies/q2-answers/offer-1",
    "profile": [
      "https://w3c.github.io/odrl/ai-vocab/",
      "https://hyperactive.network/profiles/x403/v0.1"
    ],
    "assigner": "https://knowledge.example.com",
    "permission": [{
      "target": "https://knowledge.example.com/gate/q2/answers",
      "action": ["display", "x403:cache"],
      "constraint": [{
        "leftOperand": "elapsedTime",
        "operator": "lteq",
        "rightOperand": { "@value": "P30D", "@type": "xsd:duration" }
      }],
      "duty": [
        { "action": "attribute" },
        {
          "action": [{
            "rdf:value": { "@id": "odrl:compensate" },
            "refinement": [{
              "leftOperand": "payAmount",
              "operator": "eq",
              "rightOperand": { "@value": "0.05", "@type": "xsd:decimal" },
              "unit": "https://www.wikidata.org/wiki/Q4917"
            }]
          }],
          "x403:fulfilledBy": "x402"
        }
      ]
    }],
    "prohibition": [{
      "target": "https://knowledge.example.com/gate/q2/answers",
      "action": ["aivocab:ai-training", "distribute"]
    }]
  }
}
```

Reading it: you may display the answer and cache it for up to 30 days, provided you attribute the
source and pay 0.05 USD per answer (settled through the x402 gate); you may not use it for AI
training or redistribute it.

## 2. In the 200 response: the signed grant as an ODRL Agreement

```json
{
  "@context": [
    "http://www.w3.org/ns/odrl.jsonld",
    { "aivocab": "https://w3c.github.io/odrl/ai-vocab/#",
      "x403": "https://hyperactive.network/ns/x403#" }
  ],
  "@type": "Agreement",
  "uid": "https://knowledge.example.com/grants/7f3c9a",
  "profile": [
    "https://w3c.github.io/odrl/ai-vocab/",
    "https://hyperactive.network/profiles/x403/v0.1"
  ],
  "x403:basedOn": "https://knowledge.example.com/policies/q2-answers/offer-1",
  "x403:nonce": "d8kQz2L7SQ…",
  "assigner": "https://knowledge.example.com",
  "assignee": "did:web:analyst.example",
  "permission": [{
    "target": "https://knowledge.example.com/gate/q2/answers/9b41",
    "action": ["display", "x403:cache"],
    "constraint": [{
      "leftOperand": "dateTime",
      "operator": "lteq",
      "rightOperand": { "@value": "2026-11-27T12:00:00Z", "@type": "xsd:dateTime" }
    }],
    "duty": [{ "action": "attribute" }]
  }],
  "prohibition": [{
    "target": "https://knowledge.example.com/gate/q2/answers/9b41",
    "action": ["aivocab:ai-training", "distribute"]
  }]
}
```

Differences from the Offer, as ODRL intends:

- `assignee` is the party the x401 presentation identified (here a DID; a WebID or a pairwise
  identifier works the same way). Selective disclosure means the assignee can be pseudonymous.
- The `compensate` duty is gone because it was fulfilled; the x402 receipt in
  `CAPABILITY-RESPONSE` records that.
- The relative 30-day limit becomes an absolute `dateTime`, and the `target` names the specific
  answer, so the grant can be checked later without the offer.
- x403 signs the Agreement inside its own envelope, so ODRL needs no signature format.

## 3. What x403 needs from ODRL, and gaps

| Need | ODRL 2.2 | Note |
|---|---|---|
| Offer at request time, Agreement as outcome | `Offer`, `Agreement` policy types | Fits directly |
| Allowed / forbidden uses | `permission`, `prohibition`; `display`, `distribute` | Core vocabulary |
| No AI training | `ai-training` | AI vocabulary profile, early draft **(check)** namespace and term IRI |
| Attribution | `attribute` duty | Core vocabulary |
| Price | `compensate` duty with `payAmount` refinement and `unit` | Core vocabulary; linking a duty to the payment that fulfilled it is not defined, hence `x403:fulfilledBy` |
| Caching | no core action | `x403:cache` in an x403 profile **(check)** whether `reproduce` or a profile action is the better fit |
| Who the assignee is | `assignee` as an IRI | How a credential proof establishes the assignee is not defined: the charter's planned VC binding |
| Offer-to-agreement exchange over HTTP | not defined | The charter's "Architecture and Protocols" deliverable |

The last three rows are what the charter comment asks the Working Group to cover.
