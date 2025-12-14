# Bellavista Care Home

This is the production application for Bellavista Care Home, built with React + Vite.

## EmailJS Setup for Tour Bookings

The tour booking form uses EmailJS to send emails without a backend server. To set it up:

1. **Sign up at [EmailJS](https://www.emailjs.com/)** - Create a free account

2. **Create an Email Service:**
   - Go to Email Services in your EmailJS dashboard
   - Add a new service (Gmail, Outlook, etc.)
   - Connect your email account

3. **Create an Email Template:**
   - Go to Email Templates
   - Create a new template with these variables:
     - `{{from_name}}` - Customer's full name
     - `{{from_email}}` - Customer's email
     - `{{phone}}` - Customer's phone number
     - `{{tour_date}}` - Requested tour date
     - `{{tour_time}}` - Requested tour time
     - `{{location}}` - Selected care home location
     - `{{notes}}` - Additional notes
   - Set the recipient email to: `bellavistacarehomegit@gmail.com`

4. **Environment Variables (Production Setup):**
   - Copy `.env.example` to `.env`
   - Fill in your actual EmailJS credentials:
     ```
     VITE_EMAILJS_SERVICE_ID=your_actual_service_id
     VITE_EMAILJS_TEMPLATE_ID=your_actual_template_id
     VITE_EMAILJS_PUBLIC_KEY=your_actual_public_key
     ```
   - **Important:** Never commit `.env` file to version control

### Security Considerations for Production:
- ✅ **Safe**: EmailJS handles email sending server-side
- ✅ **Rate Limited**: Prevents spam abuse
- ⚠️ **API Keys Visible**: Public key is meant to be public, but service/template IDs should be in env vars
- ⚠️ **No CAPTCHA**: Consider adding reCAPTCHA for production
- ⚠️ **Free Tier Limits**: EmailJS free tier has monthly limits (200 emails/month)

### Alternative Production Solutions:
For higher security/production needs, consider:
- Server-side email sending (Node.js/Express + Nodemailer)
- Email service providers (SendGrid, Mailgun, AWS SES)
- Form services (Netlify Forms, Formspree)

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Reproducing CSS cleanup (PurgeCSS)

We run PurgeCSS to remove unused selectors and keep the CSS footprint small. To re-run the cleanup locally:

```powershell
npx purgecss --config purgecss.config.cjs --css src/**/*.css --content index.html src/**/*.jsx src/**/*.html --output cleaned-css
```

The repository keeps the `purgecss.config.cjs` config and a `purge:css` npm script that points at it:

```powershell
npm run purge:css
```

Note: The generated folders `backup-css/`, `cleaned-css/`, and `purge-report/` are not tracked in git (they are ignored) and are used for local inspection and backups only.
