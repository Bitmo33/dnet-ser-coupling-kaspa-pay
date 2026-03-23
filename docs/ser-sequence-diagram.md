# SER Sequence Diagram

This document illustrates a simplified transaction sequence for the
SER (Settlement–Exchange–Record) coupling model.

In this reference flow, a digital payment event is treated as a coupled
transaction lifecycle in which settlement, exchange, and record generation
are linked under a common transaction identifier (TxID).

## Sequence Overview

```mermaid
sequenceDiagram
    participant U as User
    participant S as Settlement
    participant E as Exchange
    participant R as Record

    U->>S: Initiate payment request
    S->>S: Create settlement context
    S->>E: Pass settlement reference
    E->>E: Resolve exchange result
    E->>R: Pass exchange output
    R->>R: Generate compliance-ready record
    R-->>U: Return final transaction record
