import { rateLimit } from 'express-rate-limit'
export const rateLimmiter = rateLimit({
	windowMs: 60000, 
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  message: "limit reached",
	standardHeaders: 'draft-8', 
	legacyHeaders: false,
	ipv6Subnet: 56, 

})