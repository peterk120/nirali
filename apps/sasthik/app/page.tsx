import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home - Nirali Sai Sasthik',
  description: 'Traditional Indian celebration experience',
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-serif text-brand-teal">Welcome to Nirali Sai Sasthik</h1>
    </div>
  );
}