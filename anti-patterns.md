# Anti-Patterns in Weak Prompts

## 1. "fix the code"

**Anti-pattern:** Too vague.

**Why it's a problem:** It gives Claude no context about which file or bug is
being referenced, no description of the actual failure, and no way to verify
success, so Claude either has to guess or ask a round of clarifying questions
before any real work can start.

**Rewritten prompt:**
> "In @server/src/services/todos.service.ts, `complete(id)` throws a raw `Error`
> instead of `NotFoundError` when the todo doesn't exist, so the route returns a
> 500 instead of a 404. Fix it to throw `NotFoundError('Todo', id)` like
> `getById` does, and confirm `npm test -w server` still passes."

## 2. "Rewrite the entire authentication system to use OAuth2 with Google, Apple, and GitHub providers, add rate limiting, implement refresh token rotation, add audit logging, and make sure all existing tests still pass"

**Anti-pattern:** Kitchen sink / overloaded.

**Why it's a problem:** It bundles several large, independent pieces of work
(three OAuth providers, rate limiting, refresh-token rotation, audit logging)
into a single prompt, so there's no way to review, test, or roll back one part
without touching all the others, and a single sprawling diff is nearly
impossible to review carefully.

**Rewritten prompt:**
> "Let's do this in stages. First: add Google OAuth2 login support alongside the
> existing auth flow in @server/src/services/auth.service.ts, following the
> pattern in [reference file]. Don't touch rate limiting, refresh tokens, or
> audit logging yet — we'll do those as separate follow-up tasks once this one
> is reviewed and tests pass."

## 3. "I was looking at the code and I think maybe there might be some issues with how we handle errors in some places, could you take a look and perhaps suggest improvements if you think that would be helpful?"

**Anti-pattern:** Hedge-filled / indirect.

**Why it's a problem:** The hedging ("maybe", "might be", "some places", "if you
think that would be helpful") never commits to a concrete file, a specific
symptom, or a decision that anything should actually change, so Claude can't
tell whether it's being asked to audit, fix, or just discuss, and where to look.

**Rewritten prompt:**
> "Review error handling in @server/src/routes/todos.routes.ts and
> @server/src/services/todos.service.ts. Specifically: are there any codepaths
> where a thrown error isn't one of the typed classes from lib/errors.ts? List
> what you find with file:line references before changing anything."
