# Com Expo

Com Expo is a community reporting platform built to expose scam companies, fake job offers, and suspicious businesses before more people get harmed. Users can publish reports, attach evidence, discuss cases publicly, and upvote or downvote contributions.

## What It Does

- Public landing page for the platform
- User registration and login with Appwrite Auth
- Create, edit, and browse question-style scam reports
- Rich text report body with optional image attachments
- Tag-based organization and search
- Answer threads for follow-up discussion
- Voting system for questions and answers
- Reputation tracking tied to community activity
- User profile pages for questions, answers, and votes
- Pagination for the questions feed

## Tech Stack

- Next.js 16 with the App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Appwrite and Node Appwrite
- Zustand for client auth state
- shadcn/ui style components and custom animated UI pieces

## Main Routes

- `/` - landing page
- `/questions` - all reports/questions
- `/questions/ask` - create a new report
- `/questions/[quesId]/[quesName]` - single report page
- `/questions/[quesId]/[quesName]/edit` - edit report
- `/login` - sign in
- `/register` - create account
- `/users/[userId]/[userSlug]` - user profile
- `/users/[userId]/[userSlug]/questions` - user questions
- `/users/[userId]/[userSlug]/answers` - user answers
- `/users/[userId]/[userSlug]/votes` - user votes

## Project Structure

```text
src/
  app/                  Next.js routes, layouts, and API handlers
  components/           Reusable UI and feature components
  models/               Appwrite client/server configuration and model names
  store/                Zustand auth store
  utils/                Utility helpers like slug and time formatting
public/                 Static assets
```

## Environment Variables

Create a `.env` file in the project root with these values:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=
NEXT_PUBLIC_APPWRITE_PROJECT_ID=
NEXT_PUBLIC_APPWRITE_API_KEY=
```

## Appwrite Requirements

This project expects an Appwrite setup with:

- A project connected to the values above
- A database with id `main-stackflow`
- Collections:
  - `questions`
  - `answers`
  - `comments`
  - `votes`
- A storage bucket with id `question-attachments`

You will also need the matching document attributes and permissions configured in Appwrite for auth, questions, answers, voting, and attachments to work correctly.

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## API Endpoints

- `POST /api/answer` - create an answer
- `DELETE /api/answer` - delete an answer
- `POST /api/vote` - add, change, or remove a vote

## Notes

- Authentication state is persisted on the client with Zustand.
- Question creation supports optional image uploads.
- Reputation is updated when users post answers or receive votes.
- The current repository still includes some internal naming around `Riverflow` and `stackflow` from earlier development.

## Future Improvements

- Add a clear Appwrite schema export or setup guide
- Add role-based moderation tools
- Add reporting workflows for abusive or duplicate posts
- Add tests for API routes and core user flows
- Add deployment instructions

## License

Add your preferred license here before publishing publicly.
