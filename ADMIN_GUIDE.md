# Let's Learn Dance Studio — Admin Guide

Welcome! This guide explains how to manage every part of your website from the admin panel. Everything you see on the public site — text, images, prices, teachers, gallery, testimonials — is controlled from here.

---

## 1. Logging in

1. Open your website URL and add `/admin` at the end. Example: `https://yoursite.com/admin`
2. Enter your admin **email** and **password**.
3. You'll land on the **Dashboard**.

If you ever forget your password, contact your developer to reset it.

---

## 2. Admin panel overview

The left sidebar has all the sections you can edit:

| Section | What it controls |
|---|---|
| **Dashboard** | Quick summary of your site |
| **Settings** | All page text, headings, images, contact info, brand name, social links |
| **Courses** | The dance classes you offer (Classes page) |
| **Pricing** | Membership / class price plans |
| **Gallery** | Photos shown on the site, grouped into 4 categories |
| **Advantages** | The "Ballet Classes" feature block on the home page |
| **Teachers** | The team of instructors shown on the Teachers page |
| **Testimonials** | Student reviews |
| **Achievements** | Milestones, competitions, Dance Deewane etc. |
| **Certificates** | Awards / recognitions grid |
| **Reels** | Short video links (managed here but not shown on landing page by default) |
| **Submissions** | Contact form + Free Trial booking requests from visitors |

---

## 3. Editing website text and images (Settings)

Click **Settings** in the sidebar. Fields are grouped into collapsible sections. Click a section heading (▸) to open it.

### Sections you'll find

- **Global / Business** — business name, tagline, phone, WhatsApp number, email, address, logo, map embed link, both brand wordmark lines ("Let's Learn" / "Dance Studio")
- **Hero (home page top)** — welcome eyebrow, main headline, italic subline, sub-text, CTA button label, hero video, and 4 collage images
- **About page** — heading, intro paragraphs, main photo, "Who We Are" eyebrow
- **Classes page** — page heading, eyebrow, intro, tab labels (Adult / Kids)
- **Pricing page** — heading, eyebrow, intro, plan button label
- **Gallery page** — heading, category tab labels (Studio / Competitions / Certificates / Events)
- **Teachers page** — heading, intro, hero image, "Join Our Team" CTA text & button, "Book a Class" button label in teacher modal
- **Contact page** — heading, form field labels, submit button, success message, contact card (name, title, photo, headline, body), schedule, map pin card
- **Instructor section** — name, title, bio, photo, Instagram link
- **Testimonials section** — eyebrow, heading, intro
- **Achievements section** — eyebrow, heading, intro
- **Certificates section** — eyebrow, heading, intro
- **Advantages section** — eyebrow, heading, subheading, pull-quote, quote author
- **Promo section** — eyebrow, headline, body, video, image, background numeral ("№79"), CTA label
- **Stats section** — eyebrow, three stats (Students / Experience / Dance Styles) with label + value + suffix each
- **Footer** — tagline, copyright override
- **Social** — Facebook, Instagram, Twitter, YouTube URLs
- **Slot Picker (booking popup)** — headings, submit button, success message

**How to edit text**
1. Open the section.
2. Type into the field.
3. Scroll to the bottom of the Settings page and click **Save**.
4. Refresh the public site — your change is live.

**How to change an image**
1. Click the **Upload** button next to any image field.
2. Pick a file from your computer (JPG or PNG, ideally under 2 MB).
3. Wait for the preview to appear.
4. Click **Save** at the bottom of the page.

> **Tip:** Larger images are compressed automatically, but for best speed use images that are already sized around 1600 px wide.

---

## 4. Managing Courses (dance classes)

Click **Courses** in the sidebar.

- **Add a class:** click **+ Add Course**, fill in the title, slug (a short URL-friendly name like `hip-hop`), description, choose category (Adult or Kids), upload an image, set a sort order (smaller = higher on the page), Save.
- **Edit a class:** click the pencil icon on any course row.
- **Delete:** click the trash icon.
- **Reorder:** change the `sortOrder` number.

---

## 5. Managing Pricing plans

Click **Pricing**.

- **Add a plan:** name (e.g. "Monthly"), price (number, no currency symbol), duration text (e.g. "per month"), optional savings text (e.g. "Save ₹500"), and a **Highlight** toggle to mark it as the featured plan.
- Sort order controls left-to-right position.

---

## 6. Managing Gallery

Click **Gallery**. Every photo has a **Category**:

- **Studio Photos** — day-to-day studio life
- **Competitions** — event & competition photos
- **Certificates** — certificate photos
- **Events** — workshops, performances, etc.

The public Gallery page shows tabs so visitors can filter. Empty categories show "Coming soon".

- **Add photos:** click **+ Add**, upload, pick category, add optional caption, Save.
- **Delete:** trash icon.
- **Reorder within a category:** adjust `sortOrder`.

---

## 7. Managing Teachers

Click **Teachers**.

- **Add a teacher:** name, specialty (e.g. "Ballet", "Contemporary"), photo, bio (write multiple paragraphs by pressing Enter twice between them), optional quote + quote author (only ONE teacher can be the "featured" middle teacher — the one whose Quote field is filled will appear as the featured card with the pull-quote layout).
- **Edit / Delete:** icons on the row.

The public site automatically arranges teachers as:
- First 2 → small cards (top row)
- Teacher with a quote → featured centered card
- Remaining teachers → small cards (bottom rows)

Clicking **KNOW MORE** on the public page opens a detail modal with the full bio.

---

## 8. Managing Testimonials

Click **Testimonials**.

- **Add:** student name, role (e.g. "Ballet Student, 3 years"), quote text, optional photo, optional rating (1–5).
- Sort order controls the display order.

---

## 9. Managing Achievements

Click **Achievements**.

- **Add:** title (e.g. "Featured on Dance Deewane"), description, optional year, optional image.
- Sort order controls display order.

---

## 10. Managing Certificates

Same pattern: title, description, image, sort order.

---

## 11. Managing Advantages ("Ballet Classes" block)

Click **Advantages**.

The home page shows the top 2 advantages as the overlapping polaroids in the "Ballet Classes / That will Make You Advance" section. Add title, description (supports paragraphs), image, sort order.

The pull-quote and its author for this section are edited in **Settings → Advantages section**.

---

## 12. Viewing form submissions

Click **Submissions**.

You'll see everyone who booked a free trial via the "Book Free Trial" popup or the Contact page form. Each entry shows name, phone, age, style/message, and time received.

You can delete old entries.

> **Tip:** Save these entries to a spreadsheet weekly if you want a permanent record.

---

## 13. Common tasks — quick reference

| I want to… | Go to |
|---|---|
| Change the phone number shown everywhere | Settings → Global / Business |
| Change the WhatsApp button number | Settings → Global / Business |
| Update the hero heading "Learn Dance with Confidence" | Settings → Hero |
| Replace the 4 hero photos | Settings → Hero (Hero Collage 1–4) |
| Change the studio address | Settings → Global / Business (`location` field) |
| Add a new dance class | Courses |
| Change class prices | Pricing |
| Add photos from a recent competition | Gallery → set category "Competitions" |
| Add a new instructor | Teachers |
| Add a student review | Testimonials |
| Highlight a Dance Deewane feature | Achievements |
| Change Instagram link | Settings → Social |
| Change the "Book Free Trial" button label | Settings → Global (`navCtaLabel`) |
| Change map location on Contact page | Settings → Global (`mapEmbed` — paste a Google Maps embed URL) |
| See who booked a trial | Submissions |

---

## 14. Best practices

- **Save often.** Each admin page has its own Save button — click it before switching sections.
- **Test after editing.** Open a new tab, visit the public site, hard-refresh (Ctrl+Shift+R or Cmd+Shift+R) to see changes.
- **Image sizes.** Keep photos under 2 MB. Landscape 1600×1000 px works well for gallery and hero. Square 800×800 px works for teacher photos.
- **Text length.** Very long headlines wrap awkwardly. Aim for headings under ~40 characters.
- **Don't delete Settings fields empty** unless intentional — the site falls back to a sensible default, but empty critical fields (business name, phone) will show blanks.

---

## 15. Troubleshooting

**Change didn't appear on the site**
- Did you click **Save** at the bottom of the section?
- Refresh the public page with Ctrl+Shift+R (hard refresh).
- If still stuck, clear browser cache.

**Image upload failed**
- File may be too large (keep under 5 MB).
- File must be JPG, PNG, or WebP.
- Check your internet connection.

**Admin login not working**
- Make sure you're using the exact email + password.
- Contact your developer to reset.

**"Free Trial" popup shows old content**
- Edit under Settings → Slot Picker section.

---

## 16. Support

For anything you can't fix from the admin panel — new pages, layout changes, or technical problems — contact your developer.

Enjoy your new site! 🌸

