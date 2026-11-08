# Property Kickstart Contact Us — staging handover (8 November 2026)

## Scope and status
Mobile-first Contact Us root and dedicated 404 page. This is a **source candidate, not a verified live release**. Approved first soulful dog and transparent supplied logo. Coral #d46a54, navy #24435c are sampled from the supplied logo; confirm with brand governance. Do not change other sites' 404 pages.

## Contents
- index.html: Contact Us form, Netlify Forms detection-ready
- 404.html: approved first dog, five navigation options, independent fallback and broken-link report
- enquiry-received.html / report-received.html: distinct success destinations
- assets/site.css, lost-dog.webp, property-kickstart-logo-transparent.png
- netlify.toml: publish directory and headers

## Blockers before staging/production
1. Confirm dedicated GitHub repository and Netlify site. Do not publish into the Hub or Investor Analyser site.
2. Verify every recovery destination against the PK Public URL Register. Survey is **not** the Investor Assessment. The 'Arrange a conversation' link is an email fallback pending verified booking URL.
3. Replace the placeholder privacy notice link with the verified canonical privacy notice; confirm retention, processor and lawful basis.
4. Netlify Forms submission detection, notifications, spam/rate-limiting and server-side validation need live configuration/testing. HTML required/minlength validation is not sufficient security validation.
5. Configure reliable inbox notification to hello@PropertyKickstart.co.uk and sender acknowledgement through a verified provider. Netlify Forms alone does not establish sender acknowledgements.
6. Verify missing-route returns HTTP 404 and does not redirect to the unavailable contact page; test both forms and confirmation pages.
7. Validate mobile 320/375/390px, real iPhone, screen reader, keyboard, contrast, image and logo transparency, slow networks.
8. Obtain staging preview approval and complete architecture/release gates before production.
9. Set Netlify custom domain contact.propertykickstart.co.uk, verify actual CNAME/TXT values in dashboard, configure Namecheap DNS and HTTPS.
10. Register pages in HTML Pages Registry, canonical URL in PK Public URL Register, release evidence in ACT-907. Only then change governed newsletter footer.

## Important implementation limitations
Netlify Forms uses static HTML form detection; these forms are only provisioned when Netlify detects them at deploy. Feedback captures the missing URL, available referrer and timestamp through client-side script. JavaScript-disabled visitors can still submit an optional comment, but automatic metadata will be blank. Form success pages are not evidence that email notifications were delivered. No credentials or personal information are included in source.
