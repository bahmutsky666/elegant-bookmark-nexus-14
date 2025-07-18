import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookmarkCard } from "@/components/BookmarkCard";
import { AddBookmarkDialog } from "@/components/AddBookmarkDialog";
import { SearchAndFilter } from "@/components/SearchAndFilter";
import { useBookmarks } from "@/hooks/useBookmarks";
import { Plus, Upload, Download, Bookmark as BookmarkIcon, Star, Folder, BarChart3 } from "lucide-react";
import { Bookmark } from "@/types/bookmark";
import heroImage from "@/assets/hero-bookmarks.jpg";

const Index = () => {
  const {
    bookmarks,
    totalBookmarks,
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
  } = useBookmarks();

  const [editingBookmark, setEditingBookmark] = useState<Bookmark | undefined>();

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importBookmarks(file);
      e.target.value = ''; // Reset file input
    }
  };

  const handleSaveBookmark = (bookmarkData: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingBookmark) {
      updateBookmark(editingBookmark.id, bookmarkData);
      setEditingBookmark(undefined);
    } else {
      addBookmark(bookmarkData);
    }
  };

  const favoriteCount = bookmarks.filter(b => b.isFavorite).length;
  const folderCount = folders.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-alt to-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary-variant/5 to-transparent" />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <BookmarkIcon className="w-4 h-4" />
                Modern Bookmarks Manager
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-playfair font-semibold leading-tight">
                Organize your
                <span className="gradient-text block">digital life</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-md">
                Beautiful, intelligent bookmark management with smart organization, 
                instant search, and elegant design.
              </p>

              <div className="flex flex-wrap gap-3">
                <AddBookmarkDialog
                  folders={folders}
                  onSave={handleSaveBookmark}
                  trigger={
                    <Button size="lg" className="btn-primary">
                      <Plus className="w-5 h-5 mr-2" />
                      Add Bookmark
                    </Button>
                  }
                />
                
                <div className="flex gap-2">
                  <Button variant="outline" onClick={exportBookmarks}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  
                  <Button variant="outline" asChild>
                    <label className="cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      Import
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleFileImport}
                        className="hidden"
                      />
                    </label>
                  </Button>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary-variant/20 rounded-3xl blur-3xl" />
              <img
                src={heroImage}
                alt="Bookmarks Manager"
                className="relative rounded-2xl shadow-[var(--shadow-elegant)] animate-float"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center hover:shadow-[var(--shadow-hover)] transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
              <BookmarkIcon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-1">{totalBookmarks}</h3>
            <p className="text-muted-foreground">Total Bookmarks</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-[var(--shadow-hover)] transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-500/10 rounded-lg mb-4">
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
            <h3 className="text-2xl font-bold mb-1">{favoriteCount}</h3>
            <p className="text-muted-foreground">Favorites</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-[var(--shadow-hover)] transition-shadow">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500/10 rounded-lg mb-4">
              <Folder className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold mb-1">{folderCount}</h3>
            <p className="text-muted-foreground">Folders</p>
          </Card>
        </div>

        {/* Search and Filter */}
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filterBy={filterBy}
          onFilterChange={setFilterBy}
          selectedFolder={selectedFolder}
          onFolderSelect={setSelectedFolder}
          folders={folders}
          totalBookmarks={totalBookmarks}
          filteredCount={bookmarks.length}
        />

        {/* Bookmarks Grid */}
        <div className="mt-8">
          {bookmarks.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
                <BookmarkIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {totalBookmarks === 0 ? "No bookmarks yet" : "No bookmarks found"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {totalBookmarks === 0 
                  ? "Start building your digital library by adding your first bookmark."
                  : "Try adjusting your search or filter criteria."
                }
              </p>
              {totalBookmarks === 0 && (
                <AddBookmarkDialog
                  folders={folders}
                  onSave={handleSaveBookmark}
                  trigger={
                    <Button className="btn-primary">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Bookmark
                    </Button>
                  }
                />
              )}
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((bookmark, index) => (
                <div
                  key={bookmark.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <BookmarkCard
                    bookmark={bookmark}
                    onEdit={setEditingBookmark}
                    onDelete={deleteBookmark}
                    onToggleFavorite={toggleFavorite}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      {editingBookmark && (
        <AddBookmarkDialog
          bookmark={editingBookmark}
          folders={folders}
          onSave={handleSaveBookmark}
          trigger={<div />}
        />
      )}
    </div>
  );
};

export default Index;
