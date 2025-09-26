'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { User as UserIcon, Mail, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (!user) {
    // This can happen briefly while redirecting.
    // Or if a user navigates here directly without being logged in.
    return (
      <div className="text-center">
        <p>You must be logged in to view this page.</p>
        <Button onClick={() => router.push('/login')} className="mt-4">
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary">
            <AvatarImage src={user.photoURL || undefined} />
            <AvatarFallback className="text-4xl">
              {user.displayName ? user.displayName[0].toUpperCase() : <UserIcon size={40} />}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl">{user.displayName || 'User'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-center gap-4 p-3 bg-muted rounded-md">
                <Mail className="w-6 h-6 text-muted-foreground" />
                <span className="text-lg">{user.email}</span>
            </div>
            <div className="text-center pt-4">
                <Button onClick={handleLogout} variant="destructive">
                    <LogOut className="mr-2 h-5 w-5" />
                    Log Out
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
