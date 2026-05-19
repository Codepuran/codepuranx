# Naming Cheatsheet

Source: `narhakobyan.github.io/awesome-nest-boilerplate/naming-cheatsheet.html`

## Core Rules

- Use English for variable, function, class, and file names.
- Pick one naming style per language/module and keep it consistent (`camelCase`, `PascalCase`, `snake_case`, etc.).
- Names should be `short`, `intuitive`, and `descriptive` (`S-I-D`).
- Avoid contractions when they reduce clarity.
- Do not repeat context already implied by the scope/name.
- Prefer names that reflect the expected result, not the intermediate check.
- Use singular names for single values and plural names for collections.

## Function Naming

Follow `prefix? + action + high_context + low_context?`.

Examples:

- `getUser`
- `getUserMessages`
- `handleClickOutside`
- `shouldDisplayMessage`

Context order matters:

- `shouldUpdateComponent` = you update a component
- `shouldComponentUpdate` = component updates itself

## Actions

- `get`: read or fetch data immediately; also fine for async fetches.
- `set`: assign a new value.
- `reset`: restore initial value/state.
- `remove`: take something out of a collection/location.
- `delete`: erase completely.
- `compose`: create new data from existing data.
- `handle`: process an event/callback.

`remove` vs `delete`:

- `add`/`remove` = destination exists.
- `create`/`delete` = destination is not the point; something is created or destroyed.

## Context

- A function name should name the domain it operates on.
- Omit redundant context when the scope already makes it obvious.
- Example: inside `MenuItem`, prefer `handleClick()` over `handleMenuItemClick()`.

## Prefixes

Use prefixes mainly for booleans and state boundaries:

- `is`: current characteristic/state.
- `has`: possession/existence.
- `should`: positive condition tied to an action.
- `min` / `max`: boundaries or limits.
- `prev` / `next`: previous/next state in a transition.

## Variable Examples

- Bad: `primerNombre`, `amigos`
- Good: `firstName`, `friends`
- Bad: `page_count`, `shouldUpdate` mixed together
- Good: keep one convention, e.g. `pageCount` + `shouldUpdate` or `page_count` + `should_update`
- Bad: `a`, `isPaginatable`, `shouldPaginatize`
- Good: `postCount`, `hasPagination`, `shouldPaginate`
- Bad: `onItmClk`
- Good: `onItemClick`
- Bad: `isEnabled` when the UI needs a disabled flag
- Good: `isDisabled`
- Bad: `friends = 'Bob'`, `friend = ['Bob', 'Tony']`
- Good: `friend = 'Bob'`, `friends = ['Bob', 'Tony']`

## Function Examples

- `getFruitCount()`
- `getUser(id)` for async fetches
- `setFruits(nextFruits)`
- `resetFruits()`
- `removeFilter(filterName, filters)`
- `deletePost(id)`
- `composePageUrl(pageName, pageId)`
- `handleLinkClick()`
- `getRecentPosts(posts)`
- `shouldUpdateUrl(url, expectedUrl)`
- `renderPosts(posts, minPosts, maxPosts)`
- `getPosts()` with `prevPosts` and `nextPosts`

## Project Bias

- Prefer the project’s existing conventions when they conflict with generic style advice.
- Keep naming readable for humans and stable for AI agents:
  - no slang
  - no abbreviations unless standard
  - no duplicate context
  - no mixed casing in the same scope

