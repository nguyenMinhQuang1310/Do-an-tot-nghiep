# Dynamic Blog Management Feature

This plan outlines the steps completely migrating the static `blog-1, blog-2, blog-3` into a fully manageable dynamic Blog architecture within the Admin Dashboard. This will allow the store owners to write custom blog content mirroring the current beautiful layout without editing code.

## User Review Required
> [!IMPORTANT]
> The Blog layout will exactly mirror `blog-2.jsx`. The content model will support a Title, Date, Summary, Table of Contents, and multiple Sections. Each Section will have a Heading, Paragraph, and an optional Image. Let me know if you need to embed videos, multiple images per section, or rich text formatting (bold/italic) inside the paragraphs. 
> Secondly, I will remove the static blog-1, blog-2, and blog-3 files and migrate their contents manually into the system or you can recreate them later.

## Proposed Changes

---
### Backend API & Database

#### [NEW] [Blog.js](file:///c:/Users/Doan%20Nam/Documents/GitHub/flower-custom-aiii/backend/src/models/Blog.js)
New Mongoose Model `Blog`:
- `title` (String), `slug` (String, Unique)
- `coverImage` (String), `summary` (String), `date` (String/Date)
- `tableOfContents`: `[String]`
- `sections`: `[{ heading: String, paragraph: String, image: String }]`
- `showOnHome`: Boolean, default `true`
- `showOnStoryPage`: Boolean, default `true`

#### [NEW] [blogController.js](file:///c:/Users/Doan%20Nam/Documents/GitHub/flower-custom-aiii/backend/src/controllers/blogController.js)
Controller logic for `getBlogs`, `getBlogBySlug`, `createBlog`, `updateBlog`, `deleteBlog`.

#### [NEW] [blogRoutes.js](file:///c:/Users/Doan%20Nam/Documents/GitHub/flower-custom-aiii/backend/src/routes/blogRoutes.js)
Register API endpoints `/api/blogs` mapped to `blogController`. Public for GET, Admin-only for POST/PUT/DELETE.

#### [MODIFY] [server.js](file:///c:/Users/Doan%20Nam/Documents/GitHub/flower-custom-aiii/backend/src/server.js)
Import and mount `/api/blogs`.

---
### Frontend Admin & Routing

#### [MODIFY] [App.jsx](file:///c:/Users/Doan%20Nam/Documents/GitHub/flower-custom-aiii/frontend/src/App.jsx)
- Register `<Route path="/blog/:slug" element={<BlogDetail />} />`.
- Inject a `ScrollToTop` helper component globally inside the Router so whenever any link is clicked (e.g. "Đọc chi tiết"), the browser will jump reliably to the top of the new page.

#### [MODIFY] [AdminDashboard.jsx](file:///c:/Users/Doan%20Nam/Documents/GitHub/flower-custom-aiii/frontend/src/pages/AdminDashboard.jsx)
- Add a new tab: `blogs`.
- Build the blog management table (CRUD) and layout forms (Title, summary, Sections with Add/Remove buttons). Mirror the UI strategy used in the `stories` tab.

---
### Frontend View Components

#### [NEW] [blog-detail.jsx](file:///c:/Users/Doan%20Nam/Documents/GitHub/flower-custom-aiii/frontend/src/pages/legacy/blog-detail.jsx)
Create the dynamic Blog page. It will call `GET /api/blogs/:slug` and render the Exact UI layout of `blog-2.jsx` dynamically.

#### [MODIFY] [home.jsx](file:///c:/Users/Doan%20Nam/Documents/GitHub/flower-custom-aiii/frontend/src/pages/legacy/home.jsx)
Remove static blog posts mapped at the bottom. Fetch `GET /api/blogs` filtering for `showOnHome` and map them visually.

#### [MODIFY] [story.jsx](file:///c:/Users/Doan%20Nam/Documents/GitHub/flower-custom-aiii/frontend/src/pages/legacy/story.jsx)
Replace the static `overviewBlogs` array with a dynamic lookup filtering for `showOnStoryPage`. Add a "Xem thêm" (Load more) button to gradually expand the list.

## Open Questions
- Do you want me to automatically insert your current 3 blogs into the new Database via a migration script, or will you recreate them through the Admin panel later?

## Verification Plan
### Automated Tests
- Boot backend, Verify the new endpoints using terminal commands.
### Manual Verification
- Verify that `ScrollToTop` properly pushes viewport to the top.
- Validate adding a new Blog through the Admin Dashboard works seamlessly and looks perfect on both mobile/desktop.
