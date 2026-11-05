import AuthModal from './AuthModal';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      <AuthModal
        open
        onClose={() => {
          if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
        }}
        onAuth={() => {
          if (typeof window !== 'undefined') {
            window.location.href = '/dashboard';
          }
        }}
      />
    </div>
  );
}
