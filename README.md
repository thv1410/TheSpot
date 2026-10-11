[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/UW3sqoI_)

# Project Name - TheSpot

## Overview

This repository represents the culminating project for CSCI 4300 – Web Programming at UGA.  
Our team collaboratively designed, developed, and deployed this full-stack web application using React + Next.js, Node.js and MongoDB.
Our project is option 2: 2 Athens Coffeehouse & Study Spot Finder. We made a website that allow user to view epic study spots
near UGA campus.

---

## Our Team - TheSpot Squad

| Member Name      | GitHub Username | Role                 |
| ---------------- | --------------- | -------------------- |
| Ryan Varghese    | RV37765         | Project Leader       |
| Tri Vo           | MASTERBUNN      | Project Manager      |
| Pritam Patel     | pvp24726        | Communication Leader |
| Million Yohannes | m-yguy          | GitHub Captain       |

---

## Project Features

- Authentication & Authorization\*\* (login/sign-up, protected routes)
- Middleware or Route Protection\*\* for authenticated users
- CRUD operations\*\* using MongoDB database and Google Maps API
- Responsive UI\*\* & dynamic navigation bar
- View Study Spots\*\* by browsing a list or map of study spots.
- Google Places Integration\*\* by fetching info from nearby study spots.

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
/status → WEEKLY_STATUS.md
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

## Future Improvements

- We would like to add a profile page to view all your favorite spots.

## Narrative of accomplishments, challenges, obstacles overcome, and any future direction with the project

- We accomplish many things over this project like learning how to use mongoDB and integrating it with our project. 
Other accomplishment are using external API and somehow get it working after numerous headache with Google. An obstace would be
the usage of Github as merge conflict are common and the git output is a massive wall of text, so one know what going on and 
there other weird git quirks that really screw up everyone, but git problems are just inevitable for group project. A future
direction would be to add more pages to the app like a setting page would be nice. 
