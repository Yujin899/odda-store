'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Image as ImageIcon,
  Check,
  Loader2,
  Upload,
  X
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToastStore } from '@/store/useToastStore';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: ''
  });

  const { addToast } = useToastStore();

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (res.ok) {
        setCategories(data.categories);
      } else {
        addToast({ title: 'Error', description: data.message || 'Failed to fetch categories', type: 'error' });
      }
    } catch {
      addToast({ title: 'Error', description: 'Error loading categories', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        image: category.image || ''
      });
      setIsSlugManuallyEdited(true);
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        image: ''
      });
      setIsSlugManuallyEdited(false);
    }
    setIsModalOpen(true);
  };

  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulated progress logic
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);

    const data = new FormData();
    data.append('file', file);
    data.append('folder', 'odda/categories');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data
      });
      const uploadData = await res.json();

      if (res.ok) {
        setUploadProgress(100);
        setTimeout(() => {
          setFormData({ ...formData, image: uploadData.url });
          setIsUploading(false);
          setUploadProgress(0);
        }, 500);
        addToast({ title: 'Success', description: 'Image uploaded successfully', type: 'success' });
      } else {
        clearInterval(interval);
        setIsUploading(false);
        setUploadProgress(0);
        addToast({ title: 'Error', description: uploadData.message || 'Upload failed', type: 'error' });
      }
    } catch {
      clearInterval(interval);
      setIsUploading(false);
      setUploadProgress(0);
      addToast({ title: 'Error', description: 'Fatal error uploading image', type: 'error' });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const url = editingCategory ? `/api/categories/${editingCategory._id}` : '/api/categories';
      const method = editingCategory ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        addToast({ 
          title: 'Success', 
          description: `Category ${editingCategory ? 'updated' : 'created'} successfully`, 
          type: 'success' 
        });
        setIsModalOpen(false);
        fetchCategories();
      } else {
        const data = await res.json();
        addToast({ title: 'Error', description: data.message || 'Failed to save category', type: 'error' });
      }
    } catch {
      addToast({ title: 'Error', description: 'Error saving category', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/categories/${deleteId}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        addToast({ title: 'Success', description: 'Category deleted successfully', type: 'success' });
        fetchCategories();
      } else {
        addToast({ title: 'Error', description: data.message || 'Failed to delete category', type: 'error' });
      }
    } catch {
      addToast({ title: 'Error', description: 'Error deleting category', type: 'error' });
    } finally {
      setDeleteId(null);
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tighter text-(--navy)">Categories</h1>
          <p className="text-sm text-slate-500 font-medium">Manage your store product categories</p>
        </div>
        <Button 
          onClick={() => openModal()}
          className="bg-(--primary) hover:bg-(--primary)/90 text-white font-bold uppercase tracking-widest text-xs h-11 px-6 shadow-lg shadow-(--primary)/20 rounded-sm"
        >
          <Plus className="size-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input 
              placeholder="Search categories..." 
              className="pl-10 h-10 border-slate-200 focus:border-(--primary) focus:ring-(--primary)/10 rounded-sm text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="hover:bg-transparent border-slate-100">
              <TableHead className="w-[80px] text-xs font-bold uppercase tracking-widest text-slate-500">Image</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-widest text-slate-500">Name</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-widest text-slate-500">Slug</TableHead>
              <TableHead className="hidden md:table-cell text-xs font-bold uppercase tracking-widest text-slate-500">Description</TableHead>
              <TableHead className="text-right text-xs font-bold uppercase tracking-widest text-slate-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-sm text-slate-500 italic">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    Loading categories...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-sm text-slate-500 italic">
                  No categories found.
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((category) => (
                <TableRow key={category._id} className="hover:bg-slate-50 transition-colors border-slate-50">
                  <TableCell>
                    <div className="size-10 rounded-sm overflow-hidden bg-slate-100 relative border border-slate-200 shadow-inner">
                      {category.image ? (
                        <Image 
                          src={category.image} 
                          alt={category.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center size-full">
                          <ImageIcon className="size-4 text-slate-400" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-(--navy)">{category.name}</TableCell>
                  <TableCell>
                    <code className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono uppercase tracking-tighter">
                      {category.slug}
                    </code>
                  </TableCell>
                  <TableCell className="hidden md:table-cell max-w-[200px] truncate text-sm text-slate-500">
                    {category.description || '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="size-8 p-0">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 rounded-sm overflow-hidden">
                        <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-slate-400">Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => openModal(category)}
                          className="text-xs font-medium focus:bg-slate-50 cursor-pointer"
                        >
                          <Pencil className="size-3 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-xs font-medium text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
                          onClick={() => setDeleteId(category._id)}
                        >
                          <Trash2 className="size-3 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-xl rounded-sm">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle className="font-black uppercase tracking-tighter text-xl">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </DialogTitle>
              <DialogDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Organize your products into logical collections
              </DialogDescription>
            </DialogHeader>

            <div className="py-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cat-name" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Category Name</Label>
                    <Input 
                      id="cat-name"
                      value={formData.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        const updates: any = { name };
                        if (!isSlugManuallyEdited) {
                          updates.slug = name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
                        }
                        setFormData({ ...formData, ...updates });
                      }}
                      placeholder="e.g. Dental Tools"
                      className="rounded-sm border-slate-200 focus:border-(--primary) text-sm"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cat-slug" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Slug (URL)</Label>
                    <Input 
                      id="cat-slug"
                      value={formData.slug}
                      onChange={(e) => {
                        setIsSlugManuallyEdited(true);
                        setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^\w-]+/g, '').replace(/ +/g, '-') });
                      }}
                      placeholder="dental-tools"
                      className="rounded-sm border-slate-200 focus:border-(--primary) text-xs font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Category Image</Label>
                  <div className={`relative group aspect-video rounded-sm overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center ${isUploading ? 'grayscale opacity-80' : ''}`}>
                    {formData.image && !isUploading ? (
                      <>
                        <Image src={formData.image} alt="Category" fill className="object-cover" />
                        <button 
                          type="button"
                          onClick={() => setFormData({ ...formData, image: '' })}
                          className="absolute top-2 right-2 size-6 bg-red-600 text-white rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="size-3" />
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center w-full px-8">
                        {isUploading ? (
                          <div className="w-full space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-(--primary) animate-pulse">Uploading...</span>
                              <span className="text-[10px] font-bold text-slate-400">{uploadProgress}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-(--primary) transition-all duration-300 rounded-full"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            <ImageIcon className="size-6 text-slate-300 mb-2" />
                            <div className="relative">
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageUpload}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                disabled={isUploading}
                              />
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                className="rounded-sm text-[9px] uppercase tracking-widest h-8"
                                disabled={isUploading}
                              >
                                <Upload className="size-3 mr-2" />
                                Upload Image
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cat-desc" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Description (Optional)</Label>
                <Textarea 
                  id="cat-desc"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tell customers about this category..."
                  className="rounded-sm min-h-[100px] border-slate-200 focus:border-(--primary) text-sm"
                />
              </div>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsModalOpen(false)}
                className="rounded-sm font-bold uppercase tracking-widest text-[10px] h-10 px-6 border-slate-200"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSaving || isUploading}
                className="bg-(--primary) hover:bg-(--primary)/90 text-white font-bold uppercase tracking-widest text-[10px] h-10 px-8 shadow-lg shadow-(--primary)/20 rounded-sm"
              >
                {isSaving ? <Loader2 className="size-4 animate-spin mr-2" /> : <Check className="size-4 mr-2" />}
                {editingCategory ? 'Update Category' : 'Create Category'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="rounded-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black uppercase tracking-tighter">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-medium">
              This action cannot be undone. This will permanently delete the category and remove its reference from all products.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-sm font-bold uppercase tracking-widest text-[10px]">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white rounded-sm font-bold uppercase tracking-widest text-[10px]"
            >
              Delete Category
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
