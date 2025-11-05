# MileApp Tasks

This application is a **Task Management** built with a monorepo architecture that separates the **Backend (Express.js)** and **Frontend (Nuxt.js)**. Both have been deployed separately and connected.

---

## Demo & Repository

* **Frontend (Netlify):** [https://mileapptasks.netlify.app](https://mileapptasks.netlify.app)
* **Backend (Railway):** [https://mileapp-tasks-production.up.railway.app](https://mileapp-tasks-production.up.railway.app)
* **Repository:** [https://github.com/gentahape/mileapp-tasks](https://github.com/gentahape/mileapp-tasks)

---

## Tech Stack

| Category | Technology | Reason |
| :--- | :--- | :--- |
| **Backend** | Express.js & Mongoose | A lightweight and fast framework for REST APIs. |
| **Frontend** | Nuxt.js | Vue.js framework for SSR and folder structuring. |
| **Database** | MongoDB | NoSQL database for efficient dynamic schema flexibility to handle unstructured data. |
| **Styling** | Tailwind CSS | Utility-first framework for fast and responsive UI. |
| **Testing** | Jest, Supertest, MongoDB Memory Server | For isolated and comprehensive API unit testing. |
| **Development** | Docker & Docker Compose | For a consistent and isolated development environment. |
| **Deployment** | **Railway** (Backend + DB) & **Netlify** (Frontend) | Modern GitOps workflow for automated deployment. |

---

## 1. What I Build?

I built a fullstack web application with two main parts:

### Backend (Express.js)
Production-ready REST API that includes:
* **Mock Authentication:** `POST /login` endpoint that generates a mock token (`crypto`) without checking the database.
* **Protected Routes:** All `/tasks` endpoints are protected by middleware that verifies Bearer Tokens.
* **Full CRUD Tasks:** `POST`, `GET`, `PUT`, and `DELETE` functionality for task data.
* **Advanced Querying:** The `GET /tasks` endpoint is fully supported:
  * **Filtering** base on `status`.
  * **Sorting** base on any fields, example: `createdAt:desc`.
  * **Pagination** base on `page` and `limit`.
  * **Meta Information** which returns total items, total pages, etc.
* **Validation:** Use `express-validator` to validate all incoming input and return a clear `400 Bad Request` error.
* **Unit Tests:** Full test coverage for all endpoints using Jest & Supertest.

### Frontend (Nuxt.js)
Server-Side Rendered (SSR) Single Page Application (SPA) that includes:
* **Token-based Auth Flow:** Login Page that calls API, saves token to Cookie (`useCookie`), and manages login state globally.
* **Protected Routes:** Using global middleware (`auth.global.ts`) to automatically redirect non-logged-in users from the `/tasks` page to `/login`.
* **Full CRUD UI:** Clean user interface for:
    * **Create** new task via separate form.
    * **Read** tasks in a paginated list.
    * **Update** existing tasks.
    * **Delete** task with confirmation.
* **Dynamic UI:** The UI is fully connected to the API, including:
    * Dropdown for Filtering.
    * Dropdown for Sorting.
    * Pagination button Next & Previous.

---

## 2. Design Decisions

Some of the major architectural decisions I made:

1.  **Monorepo Architecture (`/server`, `/client`)**: I separate the Backend and Frontend into their own folders. This keeps the code clean and allows them to be deployed as two separate services (Railway & Netlify), which is a modern pattern.
2.  **Docker for Development or Production**: Using `docker-compose` for local development or Production environments. This solves the “it’s running on my machine” problem and ensures the database, backend, and frontend are seamlessly connected.
3.  **Composable (`useTasks`, `useApiFetch`)**: Rather than spreading the API logic across every Vue page, I abstracted it with:
    * `useAuthToken`: Single source of truth (`useCookie`) for managing tokens.
    * `useApiFetch`: A custom `useFetch` wrapper that automatically injects an auth token into every API request.
    * `useTasks`: Composables handle all the business logic making my page components very clean.
4.  **API Separation (Controller/Routes)**: On the Express side, I strictly separate the logic: 
    * `routes/` for definition of URL. 
    * `controllers/` for running logic.
    * `middleware/` for validation & authentication. 
    * `models/` for definition of DB schema.

---

## 3. Strengths of my module

* **Efficient (Performance):**
    * **Frontend:** Nuxt applications are rendered server-side (`useAsyncData`), so loading times are very fast and page refreshes don't cause data flicker.
    * **Backend:** All heavy-duty queries (filters, sorts, pagination) are handled by the MongoDB database, not the Express server. The API simply sends queries and returns the results.
* **Strong and Secure (Robust):**
    * **Backend:** The API is protected by auth middleware and validation middleware at each relevant endpoint. Errors are handled with `try...catch` and the appropriate status code.
    * **Frontend:** Secure login flow by storing it in cookies. Routes are protected by middleware. API calls handle confirmations and errors.
* **Easy to Manage (Maintainable):**
    * With the separation of logic (Composables in Nuxt, Controllers in Express), finding bugs or adding new features becomes very easy.

---

## 4. Rationale Database Indexes

I created multiple Compound Indexes, not just an index on a single field. The main reason was to optimize `GET /tasks` queries that support filtering and sorting.

My main indexes are:
```javascript
db.tasks.createIndex({ "userId": 1, "status": 1, "createdAt": -1 })
```

## 5. How to Run Project

This project is fully managed by Docker to ensure a consistent environment.

### 1. Environment Configuration
The First, you need to create your own `.env` configuration file.

1.  Copy the provided `.env.example` file:
    ```bash
    cp .env.example .env
    ```

2.  Open the newly created `.env` file and set the variables in it according to your local needs.

### 2. Running the Application
You can run the application in development or production mode.

#### Development Mode
This mode enables hot-reload for both frontend (Nuxt) and backend (Express/Nodemon).

```bash
docker-compose -f docker-compose.dev.yml up --build
```

Once running, the application will be available at:

* Frontend (Nuxt): http://localhost:3000 / Your host & specific port.
* Backend (Express): http://localhost:3001 / Your host & specific port.

#### Production Mode
This mode will build an optimized production image and run it.

```bash
docker-compose -f docker-compose.prod.yml up --build -d
```
*The -d (detached) flag will run the container in the background.

### Running Unit Tests (Backend)
To run API unit tests, make sure your development container is running, then run:
```bash
docker-compose -f docker-compose.(dev/prod).yml se exec server npm test
```