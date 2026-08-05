# Subscription Hub

Project

Build a modern, responsive web application called SubTrack.

SubTrack is a Monthly Subscription & Recurring Bill Organizer designed to help users manage all recurring payments from a single dashboard.

This is an academic Customer Interface Design and Development project. Prioritize excellent UI/UX and realistic interactions over backend functionality.

Requirements

Create a frontend-only website.

Do NOT implement:

Authentication

Backend APIs

Database

Payment gateways

Real notifications

AI

Server logic

Use static JSON or mock data throughout.

Everything should feel real while remaining entirely client-side.

Design Style

Modern SaaS dashboard.

Design inspiration:

Linear

Stripe Dashboard

Notion

Vercel

Apple Human Interface

Theme:

Light mode

Minimal

Lots of whitespace

Rounded cards

Soft shadows

Clean typography

Blue primary accent

Responsive layout

Pages

1. Landing Page

Hero Section

Headline:

Manage Every Subscription in One Place.

Subtitle:

Track OTT subscriptions, utility bills, SaaS tools, memberships, and recurring expenses effortlessly.

Buttons:

Get Started

View Demo

Sections:

Features

Dashboard Preview

Why SubTrack

Footer

2. Dashboard

Display mock statistics.

Cards:

Monthly Spending

₹4,215

Active Subscriptions

14

Upcoming Renewals

5

Potential Savings

₹900

Health Score

78/100

Charts:

Monthly spending line chart

Spending by category donut chart

Upcoming Renewals

Example:

Netflix

25 June

₹649

Spotify

28 June

₹119

Electricity Bill

30 June

₹1250

Recent Insights

Display static cards:

"Netflix hasn't been used for 60 days."

"You have two music subscriptions."

"Entertainment accounts for 45% of spending."

3. My Subscriptions

Grid or table.

Each card contains:

Logo

Subscription Name

Category

Amount

Billing Cycle

Renewal Date

Status

Actions:

Edit

Delete

Search bar

Category filters

Mock subscriptions:

Netflix

Spotify

Amazon Prime

Google One

YouTube Premium

Electricity Bill

Internet

Gym Membership

Adobe Creative Cloud

Microsoft 365

4. Add Subscription

Simple form.

Fields:

Subscription Name

Category

Amount

Billing Cycle

Renewal Date

Payment Source

Status

Logo Upload (UI only)

Buttons:

Save

Cancel

When Save is clicked:

Store data in browser localStorage only.

No backend.

5. Calendar

Monthly calendar.

Highlight renewal dates.

Clicking a date opens a modal showing subscriptions due.

Mock only.

6. Analytics

Charts:

Monthly spending trend

Category breakdown

Yearly projection

Top spending categories

Cards:

Average Monthly Spend

Highest Category

Potential Savings

Yearly Subscription Cost

Use Chart.js.

7. Insights

Display recommendation cards.

Examples:

Cancel unused subscriptions.

Renew before next week.

Entertainment spending exceeds your budget.

You may save ₹900/month.

These are predefined.

No AI.

8. Profile

Simple profile page.

Display:

Name

Email

Theme Toggle

Notification Preferences

Currency

Save button.

Preferences stored in localStorage.

Navigation

Sidebar

Dashboard

Subscriptions

Calendar

Analytics

Insights

Profile

Top Navigation

Search

Notifications icon

Profile avatar

Components

Reusable:

Stat Card

Subscription Card

Insight Card

Chart Card

Modal

Toast Notification

Buttons

Badges

Functionality

Everything works using:

Mock JSON

localStorage

React state

No backend.

No authentication.

No API requests.

Tech Stack

React

TypeScript

Vite

Tailwind CSS

shadcn/ui

Chart.js

React Router

Lucide Icons

Code Quality

Use clean reusable components.

Organize by:

src/
  components/
  pages/
  hooks/
  data/
  types/
  utils/

Use TypeScript interfaces.

Keep the project modular and easy to extend later with a real backend.

Goal

The website should look like a professional SaaS product that could later evolve into a full-stack application. The focus is on demonstrating excellent customer interface design, intuitive navigation, responsive layouts, and polished user experience rather than backend implementation. Use realistic sample data and localStorage so the application is fully interactive while remaining entirely frontend-based.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/68ac0065-d97d-4852-9c97-bded044f7377).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
