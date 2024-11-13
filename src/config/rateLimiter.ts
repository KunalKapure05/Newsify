import { rateLimit } from 'express-rate-limit'

const limiter = rateLimit({
	windowMs: 60* 60 * 1000, // 1 hour
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 1 hour).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	
})

export default limiter