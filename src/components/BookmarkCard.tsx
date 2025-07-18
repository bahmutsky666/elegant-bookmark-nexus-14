import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Edit, Trash2, Star, StarOff, Folder } from "lucide-react";
import { Bookmark } from "@/types/bookmark";

interface BookmarkCardProps {
  bookmark: Bookmark;
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const BookmarkCard = ({ bookmark, onEdit, onDelete, onToggleFavorite }: BookmarkCardProps) => {
  const [imageError, setImageError] = useState(false);

  const handleVisit = () => {
    window.open(bookmark.url, '_blank', 'noopener,noreferrer');
  };

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return null;
    }
  };

  return (
    <Card className="bookmark-card group cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="flex-shrink-0">
            {!imageError && getFaviconUrl(bookmark.url) ? (
              <img
                src={getFaviconUrl(bookmark.url)!}
                alt=""
                className="w-8 h-8 rounded"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-8 h-8 rounded bg-gradient-to-br from-primary/20 to-primary-variant/20 flex items-center justify-center">
                <ExternalLink className="w-4 h-4 text-primary" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {bookmark.title}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {bookmark.description || bookmark.url}
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(bookmark.id);
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {bookmark.isFavorite ? (
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
          ) : (
            <StarOff className="w-4 h-4 text-muted-foreground" />
          )}
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {bookmark.folder && (
            <Badge variant="secondary" className="text-xs">
              <Folder className="w-3 h-3 mr-1" />
              {bookmark.folder}
            </Badge>
          )}
          {bookmark.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleVisit();
            }}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(bookmark);
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(bookmark.id);
            }}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};