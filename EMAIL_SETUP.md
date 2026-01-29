# Email Bot Setup Guide

This guide will help you set up automatic email responses for waitlist signups using Resend.

## Step 1: Install Resend Package

Run this command in your project directory:

```bash
npm install resend
```

## Step 2: Create a Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

## Step 3: Get Your API Key

1. Log in to Resend
2. Go to **API Keys** in the dashboard
3. Click **Create API Key**
4. Give it a name (e.g., "UniLink Production")
5. Copy the API key (starts with `re_`)

## Step 4: Set Up Your Domain (Optional but Recommended)

For production, you should verify your own domain:

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `yourdomain.com`)
4. Add the DNS records provided by Resend to your domain's DNS settings
5. Wait for verification (usually takes a few minutes)

**For testing**, you can use `onboarding@resend.dev` without domain verification.

## Step 5: Configure Environment Variables

Add these to your `.env.local` file:

```env
# Resend API Key
RESEND_API_KEY=re_your_api_key_here

# Email sender address
# Use your verified domain or onboarding@resend.dev for testing
FROM_EMAIL=UniLink <noreply@yourdomain.com>

# Your site URL (for email links)
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Step 6: Test the Email Bot

1. Start your development server: `npm run dev`
2. Go to your waitlist form
3. Submit a test signup with your own email
4. Check your inbox for the welcome email!

## Email Features

- ✅ Automatic welcome email sent when someone joins the waitlist
- ✅ Personalized with their school and destination
- ✅ Professional HTML email template
- ✅ Non-blocking (won't fail if email service is down)

## Troubleshooting

### Email not sending?
- Check that `RESEND_API_KEY` is set correctly in `.env.local`
- Verify your `FROM_EMAIL` domain is verified in Resend
- Check the server logs for error messages
- Make sure you've restarted your dev server after adding env variables

### Using a test email?
- For testing, use `FROM_EMAIL=UniLink <onboarding@resend.dev>`
- This works without domain verification but has rate limits

## Resend Free Tier Limits

- 3,000 emails per month
- 100 emails per day
- Perfect for getting started!

## Need Help?

- Resend Docs: https://resend.com/docs
- Resend Support: support@resend.com
