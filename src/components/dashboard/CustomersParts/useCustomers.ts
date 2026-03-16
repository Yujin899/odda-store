'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useToastStore } from '@/store/useToastStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';
import { updateUser, deleteUser } from '@/lib/api';

interface UserRow {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  isBlocked: boolean;
  image?: string;
  createdAt: string;
}

export function useCustomers(initialUsers: UserRow[]) {
  const router = useRouter();
  const { data: session } = useSession();
  const { addToast } = useToastStore();
  const { language } = useLanguageStore();
  const dict = getDictionary(language);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Modal states
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form states
  const [editFormData, setEditFormData] = useState({ name: '', email: '', role: 'customer' as 'customer' | 'admin' });
  const [newPassword, setNewPassword] = useState('');

  const filteredUsers = initialUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    setIsProcessing(true);
    try {
      await updateUser(selectedUser._id, editFormData);
      addToast({ title: dict.toasts.success, description: dict.toasts.userUpdated, type: 'success' });
      setIsEditModalOpen(false);
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      addToast({ title: dict.toasts.error, description: message || dict.toasts.userUpdateError, type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !newPassword) return;

    setIsProcessing(true);
    try {
      await updateUser(selectedUser._id, { password: newPassword });
      addToast({ title: dict.toasts.success, description: dict.toasts.passwordReset, type: 'success' });
      setIsPasswordModalOpen(false);
      setNewPassword('');
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      addToast({ title: dict.toasts.error, description: message || dict.toasts.passwordResetError, type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleBlock = async () => {
    if (!selectedUser) return;

    setIsProcessing(true);
    try {
      await updateUser(selectedUser._id, { isBlocked: !selectedUser.isBlocked });
      addToast({ 
        title: dict.toasts.success, 
        description: selectedUser.isBlocked ? dict.toasts.userUnblocked : dict.toasts.userBlocked, 
        type: 'success' 
      });
      setIsBlockModalOpen(false);
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      addToast({ title: dict.toasts.error, description: message || dict.toasts.userToggleBlockError, type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setIsProcessing(true);
    try {
      await deleteUser(selectedUser._id);
      addToast({ title: dict.toasts.success, description: dict.toasts.userDeleted, type: 'success' });
      setIsDeleteModalOpen(false);
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      addToast({ title: dict.toasts.error, description: message || dict.toasts.userDeleteError, type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  const openEditModal = (user: UserRow) => {
    setSelectedUser(user);
    setEditFormData({ name: user.name, email: user.email, role: user.role });
    setIsEditModalOpen(true);
  };

  const openPasswordModal = (user: UserRow) => {
    setSelectedUser(user);
    setIsPasswordModalOpen(true);
  };

  const openBlockModal = (user: UserRow) => {
    setSelectedUser(user);
    setIsBlockModalOpen(true);
  };

  const openDeleteModal = (user: UserRow) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  return {
    filteredUsers,
    searchTerm,
    setSearchTerm,
    isProcessing,
    selectedUser,
    isEditModalOpen,
    setIsEditModalOpen,
    isPasswordModalOpen,
    setIsPasswordModalOpen,
    isBlockModalOpen,
    setIsBlockModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    editFormData,
    setEditFormData,
    newPassword,
    setNewPassword,
    handleUpdateUser,
    handleResetPassword,
    handleToggleBlock,
    handleDeleteUser,
    openEditModal,
    openPasswordModal,
    openBlockModal,
    openDeleteModal,
    session,
    dict,
    language
  };
}
