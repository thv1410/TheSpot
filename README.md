# TheSpot

## Overview
 
TheSpot is a full-stack web application that allows students to discover, evaluate, and bookmark optimal study environments and coffeehouses near campus.

---

## Our Team - TheSpot Squad

| Member Name      | GitHub Username | Role                 |
| ---------------- | --------------- | -------------------- |
| Ryan Varghese    | RV37765         | Project Leader       |
| Tri Vo           | thv1410         | Project Manager      |
| Pritam Patel     | pvp24726        | Communication Leader |
| Million Yohannes | m-yguy          | GitHub Captain       |

---

## Demo Walkthrough

📺 [Watch the Video Demonstration on YouTube](https://youtu.be/9iP0pAL5RZo)

---

## Project Features

- **Authentication & Authorization:** Login/sign-up and protected routes
- **Middleware & Route Protection:** Secures dashboard and user settings for authenticated sessions
- **CRUD Operations:** Manage study spot listings and reviews using MongoDB
- **Responsive UI:** Dynamic navigation and mobile-friendly layouts
- **Location Discovery:** Browse study spots by map view or categorized list
- **Google Places Integration:** Fetches real-time venue hours, coordinates, and details

---

## Repository Structure

```
/src
/app -> entry-point (page.tsx)
/api → Next.js App Router pages (frontend & API routes)
/components → list components
/models → Mongoose schemas / MongoDB models
/public → Static assets (images etc.)
/design → mockups.md
/styles -> css files
/config -> MongoDB connection
```

---

## Tech Stack

| Layer          | Technology                   |
| -------------- | ---------------------------- |
| Frontend       | React + Next.js (App Router) |
| Backend        | Next.js API Routes / Node.js |
| Database       | MongoDB + Mongoose           |
| Styling        | Custom CSS Modules           |
| Authentication | NextAuth.js                  |
| External API   | Google Maps API              |

---

## Run the development server

```
npm run dev
```

The project should now be running at:
http://localhost:3000

## API Endpoints 

| Method | Endpoint                        | Description                               |
| ------ | ------------------------------- | ----------------------------------------- |
| GET    | /api/location                   | Fetch all study spots                     |
| POST   | /api/location                   | Add a new study spot                      |
| PUT    | /api/location/[id]              | Update a spot (e.g., add a review)        |
| DELETE | /api/location/[id]              | Delete a spot by ID                       |
| GET    | /api/google?address=[userInput] | Fetch nearby spots from Google Places API |

## Database Models 

Model: User
| Field     | Type   | Description           |
| --------- | ------ | --------------------- |
| email     | String | Unique email          |
| password  | String | Hashed password       |
| createdAt | Date   | Timestamp of creation |

Model: Location
| Field       | Type                 | Description                                    |
| ----------- | -------------------- | ---------------------------------------------- |
| _id         | String               | Unique ID (Google Place ID or custom)          |
| name        | String               | Spot name                                      |
| address     | String               | Spot address                                   |
| hours       | String[] (optional)  | Opening hours                                  |
| type        | String[] (optional)  | Spot type(s), e.g., "library", "cafe"          |
| vibes       | String[] (optional)  | Spot vibes, e.g., "quiet", "cozy"              |
| description | String (optional)    | Spot description                               |
| image       | String (optional)    | Image URL or backup image                      |
| rating      | Number (optional)    | Average rating                                 |
| location    | Object (optional)    | GPS coordinates { lat: Number, lng: Number }   |
| reviews     | IReview[] (optional) | Array of reviews                               |
| createdAt   | Date                 | Timestamp of creation                          |

## Client Routes 

| Route    | Description |
| -------- | ----------- |
| `/`      | Splash page |
| `/login` | User login  |
| `/home`  | HomePage    |

## Engineering Highlights & Lessons Learned

### Key Accomplishments
- **Database Architecture with MongoDB:** Designed and integrated Mongoose schemas to handle dynamic location data, user reviews, and geospatial coordinates within Next.js API routes.
- **Third-Party API Integration:** Connected and synchronized the Google Places API to populate venue details, operational hours, and precise map coordinates alongside our internal database records.

### Technical Challenges & Solutions
- **External API Data Normalization:** Resolved data inconsistency issues and rate limits when integrating third-party map services by structuring resilient fallback schemas and parsing logic for incoming venue payloads.
- **Team Git Workflow & Conflict Resolution:** Overcame complex multi-branch merge conflicts across shared frontend components and API endpoints by enforcing feature-branch workflows, synchronized pulling, and code review prior to merging into `main`.

### Future Roadmap
- **User Profiles & Bookmarks:** Implement dedicated user dashboards to save favorite study spots, manage personal review histories, and configure custom notification settings.
- **Advanced Filtering:** Add dynamic filters for ambient noise levels, outlet availability, and real-time crowd metrics.
