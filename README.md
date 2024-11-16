# Church Management System

A modern web application for managing church activities, members, and offerings built with Next.js 13 and Firebase.

## Screenshots

![Dashboard new](https://user-images.githubusercontent.com/55434969/220678219-e534bfdd-4db8-442e-850e-aea491a2af5e.png)
![Members - Add Members](https://user-images.githubusercontent.com/55434969/220678173-d0669040-01a1-439f-98f1-fc2b42822393.png)
![Members - View Member](https://user-images.githubusercontent.com/55434969/220678191-f593b879-c26f-4452-83f9-2b2af6802141.png)
![Project - Add Contribution](https://user-images.githubusercontent.com/55434969/220678196-9f97b4b0-25bd-4947-8d78-efd7097ad34b.png)
![Project - View project](https://user-images.githubusercontent.com/55434969/220678204-27262e57-3540-4b5c-aa7c-16c1de669ac2.png)
![Welcome](https://user-images.githubusercontent.com/55434969/220678215-6c790a60-bca3-4bfd-8f29-4df3d1c9507b.png)

## Features

- 📊 Dashboard with key metrics and analytics
- 👥 Member management system
- 💰 Offering and contribution tracking
- 📱 Responsive design
- 🔐 Secure authentication with Firebase
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

- [Next.js 13](https://nextjs.org/) - React framework
- [Firebase](https://firebase.google.com/) - Backend and Authentication
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## Prerequisites

Before you begin, ensure you have:
- Node.js 16.8 or later
- A Firebase project set up
- Git installed on your machine

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/CliffordWilsonK/church-management-system.git
cd church-management-system
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add your Firebase configuration:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/              # App router pages
├── components/       # Reusable components
├── lib/             # Utility functions and Firebase setup
├── types/           # TypeScript type definitions
└── styles/          # Global styles
```

## Deploy on Vercel

This project can be easily deployed using Vercel. Follow these steps:

1. First, push your code to a GitHub repository

2. Visit [Vercel](https://vercel.com) and sign up or log in with your GitHub account

3. Click on "New Project" and select your repository

4. Configure your Environment Variables:
   - Go to Project Settings > Environment Variables
   - Add all necessary environment variables from your `.env` file
   - Make sure to add Firebase configuration variables:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
     NEXT_PUBLIC_FIREBASE_PROJECT_ID
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
     NEXT_PUBLIC_FIREBASE_APP_ID
     ```

5. Click "Deploy" and wait for the build to complete

Your application will be automatically deployed and you'll receive a production URL. Vercel will automatically redeploy when you push changes to your repository.

### Custom Domain (Optional)

To add a custom domain:

1. Go to your project settings in Vercel
2. Navigate to the "Domains" section
3. Add your domain and follow the DNS configuration instructions

For more detailed deployment instructions, check out the [Vercel deployment documentation](https://nextjs.org/docs/deployment).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
