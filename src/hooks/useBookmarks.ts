import { useState, useEffect, useMemo } from "react";
import { Bookmark, SortOption, FilterOption } from "@/types/bookmark";
import { useToast } from "@/hooks/use-toast";

// Mock data for demo
const mockBookmarks: Bookmark[] = [
  {
    id: "1",
    title: "GitHub",
    url: "https://github.com",
    description: "The world's leading software development platform",
    folder: "Development",
    tags: ["coding", "git", "development"],
    isFavorite: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "Dribbble",
    url: "https://dribbble.com",
    description: "Discover the world's top designers & creatives",
    folder: "Design",
    tags: ["design", "inspiration", "ui"],
    isFavorite: false,
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-14"),
  },
  {
    id: "3",
    title: "React Documentation",
    url: "https://react.dev",
    description: "The library for web and native user interfaces",
    folder: "Development",
    tags: ["react", "javascript", "frontend"],
    isFavorite: true,
    createdAt: new Date("2024-01-13"),
    updatedAt: new Date("2024-01-13"),
  },
  {
    id: "4",
    title: "Figma",
    url: "https://figma.com",
    description: "The collaborative interface design tool",
    folder: "Design",
    tags: ["design", "prototyping", "collaboration"],
    isFavorite: false,
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-12"),
  },
  {
    id: "5",
    title: "Stack Overflow",
    url: "https://stackoverflow.com",
    description: "Where developers learn, share, & build careers",
    folder: "Development",
    tags: ["programming", "help", "community"],
    isFavorite: false,
    createdAt: new Date("2024-01-11"),
    updatedAt: new Date("2024-01-11"),
  },
];

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const { toast } = useToast();

  // Load bookmarks from localStorage or use mock data
  useEffect(() => {
    const saved = localStorage.getItem("bookmarks");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const bookmarksWithDates = parsed.map((bookmark: any) => ({
          ...bookmark,
          createdAt: new Date(bookmark.createdAt),
          updatedAt: new Date(bookmark.updatedAt),
        }));
        setBookmarks(bookmarksWithDates);
      } catch {
        setBookmarks(mockBookmarks);
      }
    } else {
      setBookmarks(mockBookmarks);
    }
  }, []);

  // Save bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Get unique folders
  const folders = useMemo(() => {
    const folderSet = new Set<string>();
    bookmarks.forEach((bookmark) => {
      if (bookmark.folder) folderSet.add(bookmark.folder);
    });
    return Array.from(folderSet).sort();
  }, [bookmarks]);

  // Filter and sort bookmarks
  const filteredBookmarks = useMemo(() => {
    let filtered = bookmarks.filter((bookmark) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          bookmark.title.toLowerCase().includes(query) ||
          bookmark.description?.toLowerCase().includes(query) ||
          bookmark.url.toLowerCase().includes(query) ||
          bookmark.tags.some(tag => tag.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Favorites filter
      if (filterBy === "favorites" && !bookmark.isFavorite) return false;

      // Folder filter
      if (selectedFolder && bookmark.folder !== selectedFolder) return false;

      return true;
    });

    // Sort bookmarks
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "folder":
          const folderA = a.folder || "";
          const folderB = b.folder || "";
          if (folderA === folderB) {
            return a.title.localeCompare(b.title);
          }
          return folderA.localeCompare(folderB);
        case "date":
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });

    return filtered;
  }, [bookmarks, searchQuery, sortBy, filterBy, selectedFolder]);

  const addBookmark = (bookmarkData: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBookmark: Bookmark = {
      ...bookmarkData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setBookmarks(prev => [newBookmark, ...prev]);
    toast({
      title: "Bookmark added",
      description: "Your bookmark has been saved successfully.",
    });
  };

  const updateBookmark = (id: string, bookmarkData: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'>) => {
    setBookmarks(prev => prev.map(bookmark => 
      bookmark.id === id 
        ? { ...bookmark, ...bookmarkData, updatedAt: new Date() }
        : bookmark
    ));
    toast({
      title: "Bookmark updated",
      description: "Your changes have been saved.",
    });
  };

  const deleteBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id));
    toast({
      title: "Bookmark deleted",
      description: "The bookmark has been removed.",
    });
  };

  const toggleFavorite = (id: string) => {
    setBookmarks(prev => prev.map(bookmark => 
      bookmark.id === id 
        ? { ...bookmark, isFavorite: !bookmark.isFavorite, updatedAt: new Date() }
        : bookmark
    ));
  };

  const importBookmarks = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        // Simple JSON import - in a real app, you'd support browser bookmark formats
        const imported = JSON.parse(content);
        const importedBookmarks = imported.map((item: any, index: number) => ({
          id: `imported-${Date.now()}-${index}`,
          title: item.title || item.name || "Imported Bookmark",
          url: item.url || item.href,
          description: item.description,
          folder: item.folder,
          tags: item.tags || [],
          isFavorite: item.isFavorite || false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));

        setBookmarks(prev => [...importedBookmarks, ...prev]);
        toast({
          title: "Import successful",
          description: `Imported ${importedBookmarks.length} bookmarks.`,
        });
      } catch {
        toast({
          title: "Import failed",
          description: "Could not parse the bookmark file.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const exportBookmarks = () => {
    const dataStr = JSON.stringify(bookmarks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bookmarks-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export successful",
      description: "Your bookmarks have been downloaded.",
    });
  };

  return {
    bookmarks: filteredBookmarks,
    totalBookmarks: bookmarks.length,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filterBy,
    setFilterBy,
    selectedFolder,
    setSelectedFolder,
    folders,
    addBookmark,
    updateBookmark,
    deleteBookmark,
    toggleFavorite,
    importBookmarks,
    exportBookmarks,
  };
};