'use client';

import { CustomersTable } from './CustomersParts/CustomersTable';
import { EditUserDialog } from './CustomersParts/EditUserDialog';
import { ResetPasswordDialog } from './CustomersParts/ResetPasswordDialog';
import { BlockUserDialog } from './CustomersParts/BlockUserDialog';
import { DeleteUserDialog } from './CustomersParts/DeleteUserDialog';
import { useCustomers } from './CustomersParts/useCustomers';

interface UserRow {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  isBlocked: boolean;
  image?: string;
  createdAt: string;
}

interface CustomersManagerProps {
  users: UserRow[];
}

export function CustomersManager({ users }: CustomersManagerProps) {
  const {
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
  } = useCustomers(users);

  return (
    <div className="space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">{dict.dashboard.customersPage.title}</h1>
        <p className="text-muted-foreground">
          {dict.dashboard.customersPage.subtitle}
        </p>
      </div>

      <CustomersTable 
        users={filteredUsers}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onEdit={openEditModal}
        onResetPassword={openPasswordModal}
        onToggleBlock={openBlockModal}
        onDelete={openDeleteModal}
        currentUserId={session?.user?.id}
        dict={dict}
        language={language}
      />

      <EditUserDialog 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={handleUpdateUser}
        isProcessing={isProcessing}
        editFormData={editFormData}
        setEditFormData={setEditFormData}
        dict={dict}
        language={language}
      />

      <ResetPasswordDialog 
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onConfirm={handleResetPassword}
        isProcessing={isProcessing}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        dict={dict}
        language={language}
      />

      <BlockUserDialog 
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        onConfirm={handleToggleBlock}
        isProcessing={isProcessing}
        isBlocked={!!selectedUser?.isBlocked}
        dict={dict}
        language={language}
      />

      <DeleteUserDialog 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteUser}
        isProcessing={isProcessing}
        dict={dict}
        language={language}
      />
    </div>
  );
}
