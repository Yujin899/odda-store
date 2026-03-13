'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Save, 
  Loader2, 
  Plus, 
  Trash2, 
  Upload, 
  Image as ImageIcon,
  Link as LinkIcon,
  MessageSquare,
  Globe,
  Wallet,
  Truck,
  Instagram,
  Facebook,
  Phone,
  Type
} from 'lucide-react';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToastStore } from '@/store/useToastStore';

export function SettingsForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const { addToast } = useToastStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('storefront');

  // Form State
  const [formData, setFormData] = useState({
    announcements: initialData?.announcements || [],
    instapayNumber: initialData?.instapayNumber || '01126131495',
    shippingFee: initialData?.shippingFee || 0,
    whatsappNumber: initialData?.whatsappNumber || '',
    socialLinks: {
      facebook: initialData?.socialLinks?.facebook || '',
      instagram: initialData?.socialLinks?.instagram || '',
    },
    hero: {
      image: initialData?.hero?.image || '',
      heading: initialData?.hero?.heading || 'Browse premium instruments',
      buttonText: initialData?.hero?.buttonText || 'Shop Now',
      buttonLink: initialData?.hero?.buttonLink || '/products',
    }
  });

  const [uploadProgress, setUploadProgress] = useState(0);

  const handleAddAnnouncement = () => {
    setFormData(prev => ({
      ...prev,
      announcements: [...prev.announcements, '']
    }));
  };

  const handleRemoveAnnouncement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      announcements: prev.announcements.filter((_: any, i: number) => i !== index)
    }));
  };

  const handleAnnouncementChange = (index: number, value: string) => {
    setFormData(prev => {
      const newAnn = [...prev.announcements];
      newAnn[index] = value;
      return { ...prev, announcements: newAnn };
    });
  };

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(10);
    
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('folder', 'odda/hero');

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90));
    }, 200);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      });
      const data = await res.json();
      
      clearInterval(progressInterval);

      if (res.ok) {
        setUploadProgress(100);
        setTimeout(() => {
          setFormData(prev => ({
            ...prev,
            hero: { ...prev.hero, image: data.url }
          }));
          setIsUploading(false);
          setUploadProgress(0);
        }, 400);
      } else {
        setIsUploading(false);
        addToast({ title: 'Upload Failed', description: data.message || 'Failed to upload', type: 'error' });
      }
    } catch {
      clearInterval(progressInterval);
      setIsUploading(false);
      addToast({ title: 'Upload Failed', description: 'Error uploading image', type: 'error' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        addToast({ title: 'Success', description: 'Store settings updated', type: 'success' });
        router.refresh();
      } else {
        const data = await res.json();
        addToast({ title: 'Error', description: data.message || 'Failed to save settings', type: 'error' });
      }
    } catch {
      addToast({ title: 'Error', description: 'Fatal error saving settings', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between sticky top-0 bg-slate-50/80 backdrop-blur-sm py-4 z-10 border-b border-slate-200 -mx-4 px-4 sm:-mx-6 sm:px-6">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tighter text-(--navy)">Store Settings</h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Global configuration for your storefront</p>
        </div>
        <Button 
          type="submit" 
          disabled={isLoading || isUploading}
          className="bg-(--primary) hover:bg-(--primary)/90 text-white font-bold uppercase tracking-widest text-[10px] h-10 px-8 shadow-lg shadow-(--primary)/20 rounded-sm"
        >
          {isLoading ? <Loader2 className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white border rounded-sm p-1">
          <TabsTrigger value="storefront" className="text-[10px] font-black uppercase tracking-widest px-6 data-[state=active]:bg-slate-100">
            <Globe className="size-3 mr-2" />
            Storefront UI
          </TabsTrigger>
          <TabsTrigger value="checkout" className="text-[10px] font-black uppercase tracking-widest px-6 data-[state=active]:bg-slate-100">
            <Wallet className="size-3 mr-2" />
            Checkout & Fees
          </TabsTrigger>
        </TabsList>

        <TabsContent value="storefront" className="space-y-6 outline-none">
          {/* Announcements */}
          <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Announcement Bar</h3>
              <Button type="button" variant="outline" size="sm" onClick={handleAddAnnouncement} className="h-7 text-[9px] uppercase tracking-widest">
                <Plus className="size-3 mr-1" /> Add Message
              </Button>
            </div>
            
            <div className="space-y-3">
              {formData.announcements.map((text: string, idx: number) => (
                <div key={idx} className="flex gap-2">
                  <Input 
                    value={text} 
                    onChange={(e) => handleAnnouncementChange(idx, e.target.value)}
                    placeholder="e.g. Free shipping on all orders"
                    className="flex-1 rounded-sm text-sm"
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleRemoveAnnouncement(idx)}
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
              {formData.announcements.length === 0 && (
                <div className="py-8 text-center border-2 border-dashed rounded-sm border-slate-100 text-slate-300 text-[10px] font-bold uppercase tracking-widest">
                  No active announcements
                </div>
              )}
            </div>
          </div>

          {/* Minimalist Hero Section Settings */}
          <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm space-y-6">
             <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Minimalist Hero Section</h3>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Hero Image Upload */}
              <div className="space-y-4">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Hero Background Image</Label>
                <div className="relative group aspect-video rounded-sm overflow-hidden border-2 border-dashed border-slate-100 bg-slate-50 flex flex-col items-center justify-center transition-all hover:border-(--primary)/50">
                  {formData.hero.image ? (
                    <>
                      <Image src={formData.hero.image} alt="Hero Preview" fill className="object-cover transition-transform group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <div className="relative">
                            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleHeroUpload} />
                            <Button type="button" variant="secondary" size="sm" className="h-8 text-[9px] uppercase tracking-widest font-bold">
                              <Upload className="size-3 mr-2" /> Change Image
                            </Button>
                         </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-3 py-10">
                      <ImageIcon className="size-10 text-slate-200" />
                      <div className="relative">
                        <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleHeroUpload} />
                        <Button type="button" variant="outline" size="sm" className="h-8 text-[9px] uppercase tracking-widest font-bold">
                          <Upload className="size-3 mr-2" /> Upload Hero Image
                        </Button>
                      </div>
                    </div>
                  )}

                  {isUploading && (
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 text-center">
                      <Loader2 className="size-8 text-(--primary) animate-spin mb-4" />
                      <Progress value={uploadProgress} className="h-1 w-full max-w-[200px] mb-2" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-(--primary)">{uploadProgress}% Uploading...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Hero Text Settings */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <Type className="size-3" /> Heading Text
                  </Label>
                  <Input 
                    value={formData.hero.heading}
                    onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, heading: e.target.value } })}
                    placeholder="Enter main heading"
                    className="font-bold tracking-tight rounded-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Button Text</Label>
                    <Input 
                      value={formData.hero.buttonText}
                      onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, buttonText: e.target.value } })}
                      placeholder="e.g. Shop Now"
                      className="rounded-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Button Link</Label>
                    <Input 
                      value={formData.hero.buttonLink}
                      onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, buttonLink: e.target.value } })}
                      placeholder="/products"
                      className="rounded-sm"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-sm border border-slate-100 flex items-start gap-4">
                  <div className="size-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Globe className="size-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Premium Layout Applied</p>
                    <p className="text-[9px] text-slate-400 font-medium leading-relaxed uppercase">
                      The single-image hero creates a centered, high-impact first impression. Use a high-quality vertical or horizontal clinical photo for best results.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social & Brand Presence Section (Relocated) */}
          <div className="bg-white p-6 rounded-sm border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Brand Presence & Social</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <Phone className="size-3" /> WhatsApp Contact
                </Label>
                <Input 
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  placeholder="+20 123 456 7890"
                  className="rounded-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <Facebook className="size-3" /> Facebook URL
                </Label>
                <Input 
                  value={formData.socialLinks.facebook}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    socialLinks: { ...formData.socialLinks, facebook: e.target.value } 
                  })}
                  placeholder="https://facebook.com/oddastore"
                  className="rounded-sm font-mono text-xs"
                />
              </div>

              <div className="space-y-2 md:col-start-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <Instagram className="size-3" /> Instagram URL
                </Label>
                <Input 
                  value={formData.socialLinks.instagram}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    socialLinks: { ...formData.socialLinks, instagram: e.target.value } 
                  })}
                  placeholder="https://instagram.com/oddastore"
                  className="rounded-sm font-mono text-xs"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="checkout" className="space-y-6 outline-none">
          <div className="bg-white p-8 rounded-sm border border-slate-200 shadow-sm grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Phone className="size-4" />
                </div>
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">InstaPay Phone Number</Label>
              </div>
              <Input 
                value={formData.instapayNumber}
                onChange={(e) => setFormData({ ...formData, instapayNumber: e.target.value })}
                placeholder="01126131495"
                className="h-12 text-lg font-black tracking-tighter"
              />
              <p className="text-[9px] text-slate-400 uppercase font-medium">Used in Checkout payment step and Admin Order details.</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="size-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Truck className="size-4" />
                </div>
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Shipping Fee (EGP)</Label>
              </div>
              <Input 
                type="number"
                value={formData.shippingFee}
                onChange={(e) => setFormData({ ...formData, shippingFee: Number(e.target.value) })}
                className="h-12 text-lg font-black tracking-tighter"
              />
              <p className="text-[9px] text-slate-400 uppercase font-medium">Enter 0 for free shipping by default.</p>
            </div>
          </div>
        </TabsContent>

      </Tabs>
    </form>
  );
}
