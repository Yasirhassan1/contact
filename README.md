Contact Management System (Secure Full-Stack CRUD)A robust, full-stack application for managing contacts, built with a focus on security, performance, and scalable architecture.
This project demonstrates a secure communication bridge between a Next.js frontend and an Express.js backend.
Key FeaturesFull CRUD Functionality: Create, Read, Update, and Delete contacts.
1. Real-time Search: Integrated with Debouncing to optimize API calls and enhance UX.
2. .Server-Side Proxy: All API requests are proxied through Next.js Route Handlers to keep the backend infrastructure invisible to the client.
3. Responsive Design: Fully deployed and optimized for all device sizes.

🛡️ Security ArchitectureThis application implements "Defense in Depth" to ensure data integrity and prevent unauthorized access.
1. Architectural Protection (The Proxy)Instead of the browser communicating directly with the Express API, it talks to a Next.js Server-Side Route.
2. 2 Benefit: The Backend URL is never exposed in the browser's Network tab.Benefit: Protects against direct URL manipulation.
3. 2. Header-Based AuthenticationA custom API Protector Middleware ensures that only our authorized frontend can communicate with the backend.
   3. Requests must carry a secret x-api-key in the header.Unauthorized direct access returns a 403 Forbidden status.
4. Production-Grade MiddlewaresHelmet.js: Sets various HTTP headers to protect against XSS, Clickjacking, and other common vulnerabilities.
5. CORS: Strict "Origin" filtering to ensure only the deployed frontend can request data.
6. Express Rate Limit: Prevents DDoS attacks and brute-force attempts by limiting requests per window of time.
7. Data Sanitization: Ensures incoming JSON payloads are safe and formatted.

🛠️ Tech StackComponentTechnologyFrontendNext.js (App Router), Axios, ReactBackendNode.js, 
Express.jsDatabaseMongoDB (via Mongoose)DeploymentVercel (Frontend & Backend)SecurityHelmet, CORS, Rate-Limit, API-Key Auth
⚙️ Environment VariablesTo run this project locally, you must create a .env file in both the frontend and backend folders 
with the following keys:Backend:PORT, MONGO_URI, API_SECRET_KEY, FRONTEND_URLFrontend:NEXT_PUBLIC_API_URL, API_SECRET_KEY (Private)

📈 OptimizationDebouncing: Implemented on the search input to reduce server load by preventing an API call on every single keystroke.Next.js Image/Font Optimization: Used for high Core Web Vitals scores.5
