export interface Bookmark {
  id: string;
  title: string;
  url: string;
  description?: string;
  folder?: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookmarkFolder {
  id: string;
  name: string;
  color?: string;
  bookmarkCount: number;
}

export type SortOption = 'title' | 'date' | 'folder';
export type FilterOption = 'all' | 'favorites' | 'folder';