await fetch('https://your-backend-domain/api/email/send-confirmation', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: user.email,
    name: `${user.firstName} ${user.lastName}`,
    confirmUrl: 'https://kazini.app/confirm?token=123abc', // generate securely
  }),
});
