import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home - Nirali Sai Tamilsmakeover',
  description: 'Indian beauty and makeover experience',
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-serif text-brand-plum">Welcome to Nirali Sai Tamilsmakeover</h1>
    </div>
  );
}