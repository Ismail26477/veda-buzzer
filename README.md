# Veda Office Connect

Employee management system with MongoDB integration, deployed on Vercel.

## Features

- Employee directory with search
- Add/Delete employees
- Real-time status tracking
- Admin dashboard
- MongoDB Atlas database

## Tech Stack

- **Frontend:** React + Vite + TypeScript
- **UI:** Shadcn/ui + Tailwind CSS
- **Backend:** Vercel Serverless Functions
- **Database:** MongoDB Atlas

## Quick Start

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
MONGODB_URI=mongodb+srv://ismail:ismail123@cluster0.t63ghmf.mongodb.net/veda-office?retryWrites=true&w=majority
```

3. Run development server:
```bash
npm run dev
```

4. Open [http://localhost:8080](http://localhost:8080)

### Deploy to Vercel

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions.

Quick deploy:
1. Push to GitHub
2. Import to Vercel
3. Add `MONGODB_URI` environment variable
4. Deploy!

## Project Structure

```
├── api/              # Serverless API routes
├── src/
│   ├── components/   # React components
│   ├── hooks/        # Custom hooks
│   └── pages/        # Page components
└── public/           # Static assets
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |

## License

MIT
