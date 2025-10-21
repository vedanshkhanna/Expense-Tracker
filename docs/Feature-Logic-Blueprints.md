🧠 Feature Logic Blueprints This document defines the internal logic, data structures, and behavior for key features in the gamified solo expense tracker.

💸 Expense & Income Entry Data Model:

id: unique identifier

type: "expense" or "income"

amount: number

category: string

date: string (YYYY-MM-DD)

notes: optional string

recurring: boolean

Logic:

Validate amount and date

Save to local storage or Firebase

Update dashboard totals and charts

📊 Budget Tracking Data Model:

category: string

limit: number

spent: number

Logic:

On each new expense:

Add to spent for that category

Check against limit

Trigger alert if spent ≥ 80% of limit

Animate progress bar color:

Green: under 80%

Yellow: 80–99%

Red: 100% or more

🕹️ XP & Level System Data Model:

xp: number

level: number

badges: list of strings

Logic:

Earn XP for:

Logging entries (+10 XP)

Staying under budget (+50 XP)

Completing challenges (+100 XP)

Level up every 500 XP

Trigger animation and sound on level-up

🔁 Recurring Entries Data Model:

id: unique identifier

type: "expense" or "income"

amount: number

category: string

frequency: "monthly", "weekly", etc.

nextDate: string (YYYY-MM-DD)

Logic:

On app launch or daily check:

If nextDate is today, auto-add entry

Update nextDate to next cycle

Show toast: “₹500 Subscription added automatically”

📅 Calendar View Logic:

Map entries to calendar days

Show daily spend as heatmap or bubble size

Tap day to view entries

🧠 Smart Insights Logic:

Compare current vs previous month/category

Generate tips like:

“You spent 40% more on snacks this week”

“Try setting a ₹1000 limit for Food next month”

Trigger insights on dashboard or monthly summary

📤 Export Feature Logic:

Convert entries to CSV or PDF

Include:

Summary totals

Category breakdown

Optional charts

Trigger download or share option

🧾 Receipt Scanner Logic:

Use camera + OCR to extract:

Amount

Date

Merchant name

Autofill entry form

Require user permission before activation

🗣️ Voice Commands Logic:

Use Web Speech API or Flutter plugin

Recognize commands like:

“Add ₹500 to Travel”

“Show October expenses”

Require user to enable in Settings

Always confirm before executing sensitive actions