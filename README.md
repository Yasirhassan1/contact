Contact Management System 
A robust, full-stack application for managing contacts, engineered with an enterprise-grade focus on security, data integrity, and scalable architecture.
🛡️ Enhanced Security ArchitectureThis application implements a "Defense in Depth" strategy, moving beyond basic local storage to industry-standard security protocols.
1. Advanced Authentication & Session ManagementHttpOnly JWT Cookies:
   Utilizes jsonwebtoken for stateless authentication, with tokens stored in HttpOnly cookies via cookie-parser.
   This effectively eliminates XSS (Cross-Site Scripting) risks by making tokens inaccessible to client-side JavaScript.
2. Bcrypt Hashing:
   Implements bcrypt for one-way salt-and-pepper password hashing, ensuring user credentials remain secure even in the event of a database compromise.
3. Automatic Session Logic:
   Engineered with precise maxAge and SameSite cookie attributes to maintain secure cross-origin sessions between the Next.js frontend and Express backend.
4. Strict Data Validation & SanitizationZod Schema Validation:
    Every incoming request is strictly parsed and validated using zod. This prevents "Mass Assignment" vulnerabilities and ensures the database only receives clean, typed      data.Mongoose Data Integrity: Leverages mongoose schemas to enforce strict data structures and relational integrity between users and their private contact lists.
5. Production-Grade Infrastructure ProtectionHelmet.js & CORS:
   Configured helmet to set secure HTTP headers (CSP, HSTS) and used cors with strict origin filtering to prevent unauthorized cross-domain requests.Express Rate Limit: Protections against brute-force and DoS attacks by throttling requests on sensitive endpoints like Login and Sign-up.
6. Architectural Proxy:
   All browser traffic is routed through Next.js Route Handlers, acting as a server-side proxy that keeps the physical Backend URL completely invisible to the client-side Network tab.
🛠️ Tech Stack & Dependencies Component TechnologyKey Libraries Frontend Next.js (App Router) Axios, React, Lucide-React Backend Node.js, Express.js, jsonwebtoken, bcrypt Database MongoDB, mongoose, ValidationSchema-based zod Security Multi-Layered helmet, cookie-parser, express-rate-limit

⚙️ Environment ConfigurationTo run this project locally, create a .env file in both directories:Backend:PORT, MONGO_URI, JWT_SECRET, FRONTEND_URL, API_SECRET_KEYFrontend:NEXT_PUBLIC_API_URL, API_SECRET_KEY (Server-side only)📈 Optimization HighlightsDebouncing: Search inputs are debounced to minimize server load and optimize API consumption.Zod Parsing: Reduced server-side errors by catching malformed data before it reaches the controller logic.Secure Handshake: Configured Axios with withCredentials: true to enable seamless, secure transmission of HttpOnly cookies in a cross-origin environment

Live Demo: https://contact-3k4v.vercel.app/
