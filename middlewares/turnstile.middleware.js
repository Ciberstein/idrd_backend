const catchAsync = require('../utils/catchAsync.util');
const AppError = require('../utils/app.error.util');

exports.verify = catchAsync(async (req, _, next) => {
  const token = req.body.captcha_token;

  if (!token) return next(new AppError('Verificación CAPTCHA requerida', 400));

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: token,
    }),
  });

  const data = await res.json();
  if (!data.success) return next(new AppError('Verificación CAPTCHA fallida', 400));

  next();
});
