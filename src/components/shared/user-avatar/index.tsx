'use client';

import { User as UserIcon } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { sizeClasses, iconSizeClasses } from './hooks';

interface UserAvatarProps {
  user?: null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function UserAvatar({ size = 'md', className }: UserAvatarProps) {
  return (
    <Avatar className={`${sizeClasses[size]} ${className || ''}`}>
      <AvatarFallback className="bg-muted text-muted-foreground">
        <UserIcon className={iconSizeClasses[size]} />
      </AvatarFallback>
    </Avatar>
  );
}
