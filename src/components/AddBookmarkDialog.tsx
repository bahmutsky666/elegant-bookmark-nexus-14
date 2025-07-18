import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Star, StarOff } from "lucide-react";
import { Bookmark } from "@/types/bookmark";

interface AddBookmarkDialogProps {
  bookmark?: Bookmark;
  folders: string[];
  onSave: (bookmark: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'>) => void;
  trigger?: React.ReactNode;
}

export const AddBookmarkDialog = ({ bookmark, folders, onSave, trigger }: AddBookmarkDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [folder, setFolder] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (bookmark) {
      setTitle(bookmark.title);
      setUrl(bookmark.url);
      setDescription(bookmark.description || "");
      setFolder(bookmark.folder || "");
      setTags(bookmark.tags);
      setIsFavorite(bookmark.isFavorite);
    } else {
      resetForm();
    }
  }, [bookmark, open]);

  const resetForm = () => {
    setTitle("");
    setUrl("");
    setDescription("");
    setFolder("");
    setTags([]);
    setNewTag("");
    setIsFavorite(false);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !url.trim()) return;

    onSave({
      title: title.trim(),
      url: url.trim(),
      description: description.trim() || undefined,
      folder: folder.trim() || undefined,
      tags,
      isFavorite,
    });

    setOpen(false);
    if (!bookmark) resetForm();
  };

  const fetchUrlMetadata = async () => {
    if (!url.trim()) return;
    
    try {
      // In a real app, you'd use a backend service to fetch metadata
      // For now, we'll just extract the domain as title if title is empty
      if (!title.trim()) {
        const domain = new URL(url).hostname.replace('www.', '');
        setTitle(domain);
      }
    } catch {
      // Invalid URL, ignore
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Bookmark
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="gradient-text">
            {bookmark ? 'Edit Bookmark' : 'Add New Bookmark'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL *</Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={fetchUrlMetadata}
              placeholder="https://example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Bookmark title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the bookmark"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="folder">Folder</Label>
            <Input
              id="folder"
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              placeholder="Folder name"
              list="folders"
            />
            <datalist id="folders">
              {folders.map((f) => (
                <option key={f} value={f} />
              ))}
            </datalist>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add tag"
                className="flex-1"
              />
              <Button type="button" onClick={handleAddTag} size="sm" variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsFavorite(!isFavorite)}
              className="flex items-center gap-2"
            >
              {isFavorite ? (
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
              ) : (
                <StarOff className="w-4 h-4" />
              )}
              {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            </Button>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="btn-primary flex-1">
              {bookmark ? 'Update' : 'Save'} Bookmark
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};