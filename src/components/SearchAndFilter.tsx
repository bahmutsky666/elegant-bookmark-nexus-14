import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Star, Folder, SortAsc, X } from "lucide-react";
import { SortOption, FilterOption } from "@/types/bookmark";

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  filterBy: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
  selectedFolder: string | null;
  onFolderSelect: (folder: string | null) => void;
  folders: string[];
  totalBookmarks: number;
  filteredCount: number;
}

export const SearchAndFilter = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  filterBy,
  onFilterChange,
  selectedFolder,
  onFolderSelect,
  folders,
  totalBookmarks,
  filteredCount,
}: SearchAndFilterProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const hasActiveFilters = filterBy !== 'all' || selectedFolder !== null;

  const clearFilters = () => {
    onFilterChange('all');
    onFolderSelect(null);
    onSearchChange('');
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search bookmarks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>

          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-40">
              <SortAsc className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Sort by Title</SelectItem>
              <SelectItem value="date">Sort by Date</SelectItem>
              <SelectItem value="folder">Sort by Folder</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Clear filters
          </Button>
        )}

        <div className="text-sm text-muted-foreground ml-auto">
          {filteredCount === totalBookmarks ? (
            `${totalBookmarks} bookmarks`
          ) : (
            `${filteredCount} of ${totalBookmarks} bookmarks`
          )}
        </div>
      </div>

      {/* Filter Options */}
      {isFilterOpen && (
        <div className="bg-background-alt rounded-lg p-4 border animate-fade-in">
          <div className="space-y-3">
            {/* Quick Filters */}
            <div>
              <label className="text-sm font-medium mb-2 block">Quick Filters</label>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={filterBy === 'all' ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => onFilterChange('all')}
                >
                  All Bookmarks
                </Badge>
                <Badge
                  variant={filterBy === 'favorites' ? 'default' : 'outline'}
                  className="cursor-pointer flex items-center gap-1"
                  onClick={() => onFilterChange('favorites')}
                >
                  <Star className="w-3 h-3" />
                  Favorites
                </Badge>
              </div>
            </div>

            {/* Folder Filter */}
            {folders.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-2 block">Folders</label>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={selectedFolder === null ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => onFolderSelect(null)}
                  >
                    All Folders
                  </Badge>
                  {folders.map((folder) => (
                    <Badge
                      key={folder}
                      variant={selectedFolder === folder ? 'default' : 'outline'}
                      className="cursor-pointer flex items-center gap-1"
                      onClick={() => onFolderSelect(folder)}
                    >
                      <Folder className="w-3 h-3" />
                      {folder}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};