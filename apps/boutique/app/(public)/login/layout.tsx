import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - Boutique',
  description: 'Sign in to your account to access your personalized boutique shopping experience.'
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}