# API.md

Watchtower backend API reference.

Base URL:

```text
http://localhost:3000
```

## Health / Status

- `GET /health`
- `GET /api/status`

## Mint / Burn

- `POST /api/mint`

```json
{
  "amount": 1000000,
  "destination": "WalletPubkey"
}
```

- `POST /api/burn`

```json
{
  "amount": 250000,
  "source": "WalletPubkey"
}
```

- `GET /api/supply`
- `GET /api/holders?minBalance=1000`

## Minter Management

- `GET /api/minters`
- `POST /api/minters/add`

```json
{
  "address": "WalletPubkey"
}
```

- `POST /api/minters/remove`

```json
{
  "address": "WalletPubkey"
}
```

## Compliance

- `POST /api/compliance/blacklist`

```json
{
  "address": "WalletPubkey",
  "reason": "Sanctions match"
}
```

- `POST /api/compliance/blacklist/remove`

```json
{
  "address": "WalletPubkey"
}
```

- `GET /api/compliance/blacklist`
- `GET /api/compliance/audit-log?action=BLACKLIST_ADD`

## Audit Aggregation

- `GET /api/audit-log`
- `GET /api/audit-log?action=mint`

Response includes mint/burn stream and compliance stream.
