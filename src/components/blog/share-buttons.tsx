'use client';

import { useState } from 'react';
import { Facebook, Twitter, Linkedin, MessageCircle, Link2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
  variant?: 'default' | 'compact';
}

export function ShareButtons({ 
  url, 
  title, 
  description = '', 
  className = '',
  variant = 'default'
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  // Ensure we have the full URL
  const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
  
  // Encode text for URLs
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const encodedUrl = encodeURIComponent(fullUrl);

  // Social media share URLs
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  };

  // Handle copy to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = fullUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Handle social media sharing
  const handleShare = (platform: keyof typeof shareUrls) => {
    const shareUrl = shareUrls[platform];
    
    // Open in new window with appropriate dimensions
    const windowFeatures = platform === 'whatsapp' 
      ? 'width=600,height=400,scrollbars=yes,resizable=yes'
      : 'width=600,height=400,scrollbars=yes,resizable=yes';
    
    window.open(shareUrl, '_blank', windowFeatures);
  };

  const shareButtons = [
    {
      name: 'Facebook',
      icon: Facebook,
      onClick: () => handleShare('facebook'),
      className: 'hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200',
      ariaLabel: 'Compartir en Facebook',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      onClick: () => handleShare('twitter'),
      className: 'hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200',
      ariaLabel: 'Compartir en Twitter',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      onClick: () => handleShare('linkedin'),
      className: 'hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200',
      ariaLabel: 'Compartir en LinkedIn',
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      onClick: () => handleShare('whatsapp'),
      className: 'hover:bg-green-50 hover:text-green-600 hover:border-green-200',
      ariaLabel: 'Compartir en WhatsApp',
    },
  ];

  if (variant === 'compact') {
    return (
      <TooltipProvider>
        <div className={cn('flex items-center gap-2', className)}>
          <span className="text-sm text-muted-foreground mr-2">Compartir:</span>
          
          {shareButtons.map((button) => {
            const Icon = button.icon;
            return (
              <Tooltip key={button.name}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={button.onClick}
                    className={cn('h-8 w-8 p-0', button.className)}
                    aria-label={button.ariaLabel}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{button.ariaLabel}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className={cn(
                  'h-8 w-8 p-0 transition-colors',
                  copied 
                    ? 'bg-green-50 text-green-600 border-green-200' 
                    : 'hover:bg-gray-50 hover:text-gray-600 hover:border-gray-200'
                )}
                aria-label="Copiar enlace"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Link2 className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{copied ? 'Enlace copiado' : 'Copiar enlace'}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Compartir artículo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Social Media Buttons */}
        <div className="grid grid-cols-2 gap-2">
          {shareButtons.map((button) => {
            const Icon = button.icon;
            return (
              <Button
                key={button.name}
                variant="outline"
                onClick={button.onClick}
                className={cn('justify-start gap-2', button.className)}
                aria-label={button.ariaLabel}
              >
                <Icon className="h-4 w-4" />
                {button.name}
              </Button>
            );
          })}
        </div>

        {/* Copy Link Button */}
        <Button
          variant="outline"
          onClick={handleCopyLink}
          className={cn(
            'w-full justify-start gap-2 transition-colors',
            copied 
              ? 'bg-green-50 text-green-600 border-green-200' 
              : 'hover:bg-gray-50'
          )}
          aria-label="Copiar enlace del artículo"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              ¡Enlace copiado!
            </>
          ) : (
            <>
              <Link2 className="h-4 w-4" />
              Copiar enlace
            </>
          )}
        </Button>

        {/* URL Display */}
        <div className="mt-3 p-2 bg-muted rounded text-xs text-muted-foreground break-all">
          {fullUrl}
        </div>
      </CardContent>
    </Card>
  );
}