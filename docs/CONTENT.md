# Content guide for the website team

For the NGO staff who keep the Rudhirsetu Seva Sanstha website up to date. You do not need any technical knowledge. Everything below is done in **Sanity Studio**, the editing tool for the site.

- Studio: **https://rudhirsetu.sanity.studio** (log in with the username and password your administrator gave you).
- A printable, step-by-step version of the basics is available on the live site at `/help.html` (the file is `public/help.html` in the repository, "Content Management Guide v1.0, March 2026"). This document is the fuller reference. It was checked against the website code on 2026-10-07; if the two ever disagree, trust this one and tell the developer so the help page can be updated.
- Developers: how the site fetches and caches this content is described in [ARCHITECTURE.md](./ARCHITECTURE.md#4-data-flow-and-caching).

## 1. The basics

1. **Always press Publish.** A change that is saved but not published (a draft) is invisible on the website.
2. **Changes appear quickly.** The site is connected to Studio by a webhook, so after you publish, the affected pages refresh and the next visitor sees the change, normally within seconds.
3. **If the webhook is down, there is still a safety net:** every page, including individual event pages (`/event/...`), refreshes on its own within about 5 minutes. If a page still shows old details 10 minutes after you published, tell the developer.
4. Some things cannot be changed in Studio. See [section 8](#8-what-you-cannot-change-in-studio).

| What you changed | Where it shows up | Normally visible after |
| --- | --- | --- |
| An event | Home, Camps list, that event's own page, link previews | Seconds, at most about 5 minutes |
| A gallery photo | Gallery page; Home and Gallery slideshow if featured | Seconds, at most about 5 minutes |
| Donation settings | Donations page | Seconds, at most about 5 minutes |
| Contact settings | Contact page, Home, footer of every page | Seconds, at most about 5 minutes |
| Social media settings | Social page, footer of every page | Seconds, at most about 5 minutes |

Link previews (WhatsApp, Facebook, LinkedIn and so on) are cached by those apps for days. After changing an event, an old preview can keep showing in chats that already had the link.

## 2. What appears where

| Content type in Studio | Where visitors see it |
| --- | --- |
| **Events** | Home page, "Where you can help": up to 3 cards (on phones only the first is shown), upcoming events first (soonest first), then the most recent past events to fill the gaps. **Camps page**: every event in two lists, "Upcoming and ongoing" and "Past events and camps", 6 per page. **Event page** (`/event/<id>`): the full details. The event's photo and title are also used in link previews. |
| **Gallery images** | **Gallery page**: a grid of all non-featured photos with category filters, 16 per page, plus a slideshow of featured photos at the top. **Home page**: the same slideshow ("Moments that matter"), shown only if at least one photo is featured. |
| **Donation settings** | **Donations page**: the UPI payment card (QR code, UPI ID, "Pay with your UPI app" button on phones), the bank transfer card, and the Section 80G tax benefit section. |
| **Contact settings** | **Contact page** (details, 24/7 emergency card, map), **Home page** ("Get involved" block and map), and the **footer** of every page (phone, email, address). |
| **Social media settings** | **Social page** (one tile per link) and the **footer** icons on every page. |

## 3. Events

Studio: **Events, Create new Event.** An event has the fields below. (Field names in the second column are the names used by the website; Studio may word its labels slightly differently.)

| Field | Name on the site | What to enter | Notes |
| --- | --- | --- | --- |
| Title | `title` | Name of the event, for example "Blood Donation Camp \| City Hall, Pune". | Cards show 2 lines at most. Put the main name first and the venue or date after a separator (` \| `, ` — `, ` · `): link-preview images use only the part before the separator (when it is at least 14 characters), because the date and venue are printed separately. The link-preview image can only draw English (Latin) letters, so a title written only in Hindi or Marathi shows up there as "Rudhirsetu event"; keep an English name in the title. The page itself shows any language. |
| Date | `date` | Start date and time. | Always shown in **India time (IST)**, including the time of day, so enter the real start time. Used for sorting. |
| Location | `location` | Venue and town. | Shown on cards and on the event page. Visitors can tap it to open a Google Maps search, so make it specific. |
| Expected Participants | `expectedParticipants` | Optional text, for example `200` or `150+ donors`. | Upcoming events show it followed by "expected"; past events show it as written. Update it after the event with the real figure. |
| Is Upcoming | `isUpcoming` | Switch **on** for future events, **off** for past ones. | **This is a manual switch.** The website does not look at the date. After an event ends, turn it off, otherwise it stays in "Upcoming and ongoing". |
| Short description | `shortDesc` | One or two sentences. | Used as the intro line on the event page, as the "About" text if the full description is empty, in link previews and when someone shares the event. Aim for 160 characters or fewer. |
| Description | `desc` | The full details: agenda, what to bring, who to contact. | Plain text. Line breaks are kept; bold, links and lists are not supported. |
| Image | `image` | The main picture or poster. | See the image rules below. Fill in the **alternative text**. |
| Gallery | `gallery` | Extra photos of the event. | Shown as an "Event gallery" grid with a full-screen viewer. Give each photo alternative text and, if you like, a caption. |

Whether Short description, Image and Gallery are mandatory is set in Studio; the site copes if they are missing (no image means a simple card, no description means an empty "About" section is hidden).

**Event image rules.** The site checks the shape of the main image:

- **Landscape photo or banner** (wider than about 3:2): shown at the top of the event page as a wide 16:9 banner, so the top and bottom may be trimmed. Upload at least **1600 px wide**.
- **Portrait or squarish poster** (narrower than about 3:2): shown **whole**, beside the event details, so nothing is cropped. Upload at least **1200 px wide**.
- On **event cards** (Home and Camps) every main image is cropped to a wide 16:9 strip. In Studio, set the **hotspot** (the focus circle on the image) over the part that must stay visible, such as the poster's headline; the website centres the crop on it.

**Typical life of an event**

1. Create the event with **Is Upcoming** on. Check title, date and time, venue. Publish.
2. After the event: open it, switch **Is Upcoming** off, update **Expected Participants** with the real number, add event photos to **Gallery**, and publish again.
3. Old events stay on the Camps page under "Past events and camps". Delete an event only if it should disappear completely (visitors with the old link will see "Event not found").

**Before you publish an event, check:** the date and time are in the future for upcoming events; the venue is complete; the image is large enough and has alternative text; **Is Upcoming** is set correctly.

## 4. Gallery images

Studio: **Gallery Images, Create new Gallery Image.**

| Field | Name on the site | What to enter | Notes |
| --- | --- | --- | --- |
| Title | `title` | Optional short name. | Shown as a caption on hover in the grid, and in the viewer and the slideshow. |
| Description | `description` | Optional sentence about the photo. | Shown in the slideshow and the full-screen viewer. |
| Category | `category` | Choose one: `blood-donation`, `eye-care`, `cancer-awareness`, `thalassemia-support`. | Visitors filter the gallery by category. A photo without a category appears under "Other". The filter buttons only list categories that have photos. |
| Is Featured | `isFeatured` | Switch on to put the photo in the slideshow. | A featured photo appears **in the slideshow only**, not in the grid below it. |
| Image | `image` | The photo. | Fill in the **alternative text** (a short description of what the photo shows) for screen-reader users. |

**Slideshow behaviour (featured photos).** It appears on the Home page and at the top of the Gallery page. It advances every 8 seconds while visible (it stops when the visitor hovers, focuses it, or has asked their device for reduced motion) and has arrows, dots and swipe. There is no ordering control, so you cannot rearrange the slides; keep the number of featured photos modest (around 5 to 8).

**Image rules**

- **Featured photos: upload at least 1600 px wide**, preferably landscape (3:2 or wider). On desktop the slideshow is a very wide **21:9** strip and on phones a tall **7:9** frame, and the photo is centre-cropped to fill it, so keep the important subject in the middle and avoid photos with people at the very edges.
- **Regular gallery photos:** any shape works (the grid keeps each photo's own proportions). Upload at least **1600 px on the long edge**: the full-screen viewer shows them at up to 1600 px.
- Titles and descriptions are optional, but alternative text is not: please always fill it in.

## 5. Donation settings

Studio: **Donation Settings** (there is only one; you edit it, you do not create new ones). The labels in the first column of the table are derived from the website's field names, so the on/off switches and the 80G fields may be worded a little differently in Studio.

| Field | Name on the site | What to enter | What the website does |
| --- | --- | --- | --- |
| Is UPI Enabled | `isUpiEnabled` | Switch on to show UPI. | The whole **UPI payment card is hidden** unless this is on and there is a QR code or a UPI ID. |
| UPI ID | `upiId` | For example `name@bank`. | Shown with a Copy button. On phones and tablets a "Pay with your UPI app" button opens the visitor's UPI app with this ID filled in. |
| QR Code Image | `qrCodeImage` | The UPI QR code. | Shown inside the UPI card (rendered at up to 576 px wide). Fill in alternative text. |
| Is Bank Enabled | `isBankEnabled` | Switch on to show bank details. | When off (or when all four bank fields are empty) the Bank transfer card stays on the page but says **"Bank transfer is temporarily unavailable"**. |
| Account Name | `accountName` | Name on the bank account. | Bank card; also used as the payee name in the UPI app link. |
| Account Number | `accountNumber` | Bank account number. | Bank card, with a Copy button. |
| IFSC Code | `ifscCode` | Bank IFSC code. | Bank card, with a Copy button. |
| Bank and Branch | `bankAndBranch` | Bank name and branch. | Bank card. |
| Is Section 80G Enabled | `isSection80GEnabled` | Switch on once 80G tax receipts are available. | When on, the "Tax benefits" section says donations are eligible for deduction and shows the number and percentage below. When off, the section stays on the page but only says tax information is being updated. |
| Section 80G Number | `section80GNumber` | The registration number. | Shown only when 80G is enabled and the field is filled in. |
| Tax Deduction Percentage | `taxDeductionPercentage` | A number such as `50`. | Shown as "50% of donation amount" when 80G is enabled. A value of 0 or empty hides it. |

If **UPI is switched off or incomplete**, the page shows a note that UPI is temporarily unavailable and points donors to bank transfer. If the settings cannot be loaded at all, the same fallbacks are shown.

**QR code image:** a clean, high-contrast, **square** image of at least **600 by 600 px** (PNG or JPEG), with its white border (quiet zone) left intact and no cropping, so phone cameras scan it reliably. Test it with a phone before publishing.

**Double-check every number before you publish.** A wrong account number or IFSC code sends donors' money to the wrong place. Ask a second person to read the values aloud against the bank's records.

## 6. Contact settings

Studio: **Contact Settings** (a single document).

| Field | Name on the site | What to enter | What the website does |
| --- | --- | --- | --- |
| Address | `address` | Full office address (line breaks are kept on the Contact page). | Contact page ("Visit us", links to Google Maps), Home page, footer. |
| Phone Number | `phone` | The contact number, with country code, for example `+91 98765 43210`. | A tap-to-call link on the Contact page, Home page and footer, **and it is advertised as the 24/7 emergency line** ("Need blood urgently? 24/7 support"). Use a number that someone answers around the clock. |
| Email | `email` | Contact email address. | Tap-to-email links on the Contact page, Home page and footer, and the "Email us" button. |
| Google Maps URL | `googleMapsUrl` | The **embed** link for your location. | Draws the map on the Contact page and the Home page. |

**Getting the Google Maps URL right (the most common mistake).** Use the **embed** link, not the normal Share link.

1. Open Google Maps in a browser and search for the exact location.
2. Click **Share**, then the **Embed a map** tab (not "Send a link").
3. Copy **only the address inside `src="..."`**: it starts with `https://www.google.com/maps/embed?` and ends before the closing quote. Do not paste the whole `<iframe ...>` tag.
4. Paste it into **Google Maps URL** and publish.

The website only accepts Google Maps embed links, as a safety measure. Anything else (a short `maps.app.goo.gl` link, a plain Share link, another website) will **not** show a map: the Contact page says "Map not available" and the Home page says "Map unavailable".

Each field is shown only if it has a value. If a field is empty the corresponding line or button disappears.

## 7. Social media settings

Studio: **Social Media Settings** (a single document).

| Field | Name on the site | What to enter | What the website does |
| --- | --- | --- | --- |
| Instagram URL | `instagramUrl` | Full link to the profile. | One tile on the Social page and an icon in the footer. |
| Facebook URL | `facebookUrl` | Full link to the page. | Same. |
| YouTube URL | `youtubeUrl` | Full link to the channel. | Same. |
| LinkedIn URL | `linkedinUrl` | Full link to the page. | Same. |
| Description | `description` | One or two friendly sentences inviting people to follow. | Shown under the "Follow our journey" heading on the Social page. If empty, a default sentence is used. |

Copy each link from the browser's address bar of that profile (for example `https://www.instagram.com/rudhirsetu`). Leave a field empty to hide that platform; with no links at all, the page says the channels are on their way. Always paste the full link starting with `https://`. Only `http` and `https` links work; the Social page tolerates a bare address such as `instagram.com/rudhirsetu`, but the footer icons do not, so a bare address would break the footer link. There are exactly these four platforms; adding another (for example X) needs a developer.

## 8. What you cannot change in Studio

These are written into the website itself and need a developer:

- The **numbers** on the Home page (blood camps per year, lives impacted, eye checkups, women reached, "years of service" starts from 2010) and in the hero.
- The **focus areas** text on the Home page, the "Where your donation goes" list on the Donations page, and general page headings and descriptions.
- The order of events (soonest first, newest first for past events) and of photos.
- Adding a new page, a new category, or a new social platform.

## 9. Image checklist

| Where | Minimum size | Shape | Alternative text |
| --- | --- | --- | --- |
| Event main image (landscape banner) | 1600 px wide | Landscape; shown as 16:9 on the page and on cards | Yes |
| Event main image (poster) | 1200 px wide | Portrait or square; shown whole on the page, cropped to 16:9 on cards (set the hotspot) | Yes |
| Event gallery photo | 1600 px on the long edge | Any; thumbnails are squares cropped around the hotspot, the viewer shows the whole photo | Yes, plus an optional caption |
| Featured gallery photo | 1600 px wide | Landscape, 3:2 or wider; centre-cropped to 21:9 (desktop) or 7:9 (phones) | Yes |
| Regular gallery photo | 1600 px on the long edge | Any | Yes |
| UPI QR code | 600 by 600 px | Square, with a white border | Yes |

General rules: use clear, well-lit, high-quality photos; keep each file under **5 MB** (the website shrinks images automatically for visitors, so the original size never slows the site down); use JPEG or PNG; never upload photos of people who have not agreed to be photographed; and always choose the right category.

## 10. Regular upkeep

- Every month: check that the phone number, email, address and map are still correct, that the donation details match the bank's records, and that the social links work.
- After every event: switch **Is Upcoming** off, update the participant number and add photos.
- Remove outdated gallery photos and keep the featured slideshow fresh.

## 11. If something looks wrong

| Problem | What to check |
| --- | --- |
| I published but the page still shows the old version | Press refresh. Wait a minute or two. Confirm you pressed **Publish** (not just saved). If an **event page** is still old after a few minutes, tell the developer: event pages depend on the automatic update. |
| An event is still under "Upcoming" after it ended | Switch **Is Upcoming** off and publish again. |
| A photo is missing from the gallery grid | It may be marked **Featured** (featured photos are in the slideshow only), or it was not published. |
| The map is missing | The Google Maps URL is not an embed link; see [section 6](#6-contact-settings). |
| The UPI card has disappeared | **Is UPI Enabled** is off, or both the QR code and UPI ID are empty. |
| The image on an event card is cut off in an odd place | Set the hotspot on the image in Studio over the important part and publish. |
| A link preview in WhatsApp shows old information | The app cached it. Re-share the link after a few days, or ask the developer to refresh it with the platform's debugger. |

Need help? Contact the website administrator and send a screenshot of any message you see.
