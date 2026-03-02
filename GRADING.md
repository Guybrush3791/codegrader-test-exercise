# Code Review: 5.3 / 10

The student has built a working solution that fetches todo data, filters incomplete items, and displays the first five on the page. The core logic is correct, but the code leans heavily on terse, type-based naming and lacks structural decomposition. There are also a few subtle robustness issues worth addressing as the student grows.

## Project Metrics

### naming
**3/10**

Variable names like `x`, `r`, `arr`, and `j` describe position or type rather than purpose. The one comment on line 1 is vague and doesn't add meaning beyond what the code already implies. Adopting intention-revealing names is the single biggest readability upgrade available here.

### structure
**3/10**

All logic lives inside a single chained `.then` callback with no decomposition. Fetching, filtering, slicing, rendering — these are four distinct responsibilities that could each be a named function. Keeping everything inline makes it harder to test, reuse, or read any one part in isolation.

### logic
**5/10**

The filtering and rendering loops are logically correct for the happy path. However, the loose equality check `== false` instead of `=== false` is a subtle hazard, and there is no guard if fewer than 5 incomplete items exist — the loop on line 17 would silently render `undefined` into the page. Edge cases are not considered.

### completeness
**10/10**

All three assignment requirements are addressed: fetch from the correct URL (complete), filter where completed is false (complete), display the first 5 incomplete titles on the page (complete). Full marks for coverage.

## index.html

The HTML file is clean and correctly structured. The main opportunity here is choosing a more descriptive element ID. As a general rule, an ID should answer 'what lives here?' for anyone who hasn't read the JavaScript.

### naming
**6/10**

The HTML element IDs and tags are semantically reasonable. `output` as an ID is a little generic — something like `todo-list` would communicate intent — but this is a minor issue in a small file.

- ⚠️ `8~8`: The id `output` describes a role (something outputs here) rather than a domain concept. What is actually being output? A name like `todo-list` or `incomplete-todos` would tell a future reader what to expect inside this element without needing to read the JavaScript.

### structure
**8/10**

The HTML structure is clean and minimal — a `<div>` target for JavaScript output and a script tag at the bottom of the body, which is the correct loading order. Nothing is over-engineered.

- ✅ `9~9`: Placing the `<script>` tag just before `</body>` is exactly right — it ensures the DOM is ready before the script runs. This is a solid habit to keep.

### logic
**8/10**

No logic lives in the HTML, which is appropriate. The file does its one job — structure — correctly.

### completeness
**10/10**

The HTML provides the required output container and script reference. Fully supports the assignment.

## script.js

The logic works and the assignment is complete — that matters. The next growth area is naming: every variable name here describes a container rather than its contents, which forces a reader to trace the code to understand it. Start with renaming `x`, `r`, `arr`, and the callback parameters, then consider how extracting named functions for filtering and rendering would make the overall flow self-documenting.

### naming
**2/10**

Every name in this file describes shape or position rather than meaning: `x` is a URL, `r` is a response, `arr` is a list of incomplete titles, `j` is a loop index into that list. A reader has to mentally execute the code to understand what each variable holds.

- ⚠️ `2~2`: `x` tells us nothing about what it stores. What is this string? It's the endpoint URL for todos. A name like `TODOS_API_URL` or `todosUrl` communicates that immediately. Constants in JavaScript are often written in `UPPER_SNAKE_CASE` to signal they won't change.
- ⚠️ `5~5`: `r` is the HTTP response object. Naming the parameter `response` costs nothing and makes the callback's intent obvious. The same applies to `data` on line 8 — `todos` would be more precise since that's exactly what the API returns.
- ⚠️ `9~9`: `arr` describes the data structure, not the content. What is in this array? Titles of incomplete todos. A name like `incompleteTitles` makes the filtering logic on line 12 much easier to follow without needing to trace where it's built.
- ⚠️ `1~1`: The comment 'get data and show it' summarizes the entire file without adding insight. Comments are most useful when they explain *why* something is done a certain way, not *what* is happening — the code itself should show what. Consider whether this comment earns its place.

### structure
**3/10**

All logic — fetching, filtering, slicing, and rendering — is collapsed into a single `.then` callback. There is no decomposition into named functions. Each of those four steps is a distinct responsibility that could be extracted and named, making the code easier to read, test, and reuse independently.

- ⚠️ `9~14`: The filtering loop is doing a specific, reusable job: extract titles from incomplete todos. What would it look like if this were a function called `getIncompleteTitles(todos)`? That function could be tested on its own and reused elsewhere. Think about whether each block of logic could be named and extracted.
- ⚠️ `16~21`: The rendering block (lines 16–21) is another self-contained responsibility: take a list of titles and display them. If this were a function called `renderTitles(titles)`, the top-level `.then` would read almost like a plain-English description of the program's steps. How would that change the readability of the overall flow?
- 🔴 `4~22`: The `fetch` call and its chain handle everything from network request to DOM update with no error handling. What happens if the network request fails? `.catch` can be chained after `.then` to handle that case — leaving it out means errors fail silently.

### logic
**5/10**

The core logic correctly filters and renders, which shows solid understanding of the problem. However, the loose equality `== false` and the unguarded loop index introduce subtle bugs that could surface with real data.

- ⚠️ `11~11`: `== false` uses loose equality, which means JavaScript will coerce types before comparing. For instance, `0 == false` is `true`. Since `completed` is always a boolean in this API, it works here — but using `=== false` makes the type expectation explicit and avoids surprises if the data ever changes. Alternatively, `!data[i].completed` is idiomatic JavaScript for this check. Why might being explicit about types matter as programs grow?
- 🔴 `17~19`: The loop on line 17 always runs exactly 5 times regardless of how many items are in `arr`. If `arr` has fewer than 5 entries (which is possible — imagine an API returning only 3 incomplete items), `arr[j]` will be `undefined` and you'll render `<p>undefined</p>` into the page. What condition could you add to the loop, or what array method could replace the loop entirely, to protect against this?

### completeness
**10/10**

All three requirements are met: the correct URL is fetched, items are filtered by `completed === false`, and the first 5 titles are displayed. The assignment is fully addressed.

- ✅ `4~22`: The solution correctly hits all three requirements from the assignment spec. The pipeline from fetch → filter → slice → render maps directly to what was asked. This is a strong foundation to refactor from.

## Next Steps

The highest-impact habit to build right now is intention-revealing naming — before writing a variable or function, ask 'what does this represent in the problem domain?' rather than 'what type or shape is it?' Supporting that, practice decomposing even small programs into named functions where each function has one clearly stated job; this file would benefit from at least three: one to fetch, one to filter, one to render. To manage edge cases, get in the habit of asking 'what happens if this list is shorter than I expect?' before finalizing any loop — JavaScript's `Array.prototype.slice(0, 5)` is one tool that handles both normal and short arrays gracefully. These habits compound quickly and will make your code readable to others — and to your future self.
