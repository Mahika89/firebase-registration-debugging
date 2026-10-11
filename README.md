# Registration race condition: defect reproduction and regression tests

This is an **independently written, simplified reconstruction** of a registration defect I encountered while working on the Hey, Blue! application. It is **not** the organization's original source code and uses no proprietary files or credentials.

## Context and diagnosis

The registration flow created an account with Firebase Authentication and then initiated asynchronous backend profile initialization through a Cloud Function. In the defective flow, the profile initialization promise was not awaited. Registration could therefore report success and navigate to the dashboard before the backend profile was ready. This made the issue intermittent, depending on execution timing.

## Fix

The corrected flow awaits profile initialization before returning success. If initialization fails, the error propagates instead of falsely reporting success. Production systems may additionally need compensating cleanup or retry logic if account creation succeeds but profile creation fails.

## Files

- `buggyRegistration.js`: simplified reproduction of the missing `await`
- `fixedRegistration.js`: corrected sequencing and error propagation
- `registration.test.js`: tests that reproduce the original timing defect and verify the corrected behavior

## Run

Requires Node.js 18 or newer. No Firebase project, secrets, dependencies, or network access are needed.

```bash
npm test
```

## Scope

This sample demonstrates the asynchronous sequencing issue using injected mock functions. It does not test real Firebase SDK behavior or claim to reproduce the full production environment.
