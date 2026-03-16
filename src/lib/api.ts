/**
 * Centralized API client for Odda Store.
 * Consolidation of repeated fetch patterns for typed, reliable data access.
 */

// --- Categories ---

export async function fetchCategories() {
  const res = await fetch('/api/categories');
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function createCategory(data: Record<string, unknown>) {
  const res = await fetch('/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to create category');
  }
  return res.json();
}

export async function updateCategory(id: string, data: Record<string, unknown>) {
  const res = await fetch(`/api/categories/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to update category');
  }
  return res.json();
}

export async function deleteCategory(id: string) {
  const res = await fetch(`/api/categories/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to delete category');
  }
  return res.json();
}

// --- Users/Customers ---

export async function updateUser(id: string, data: Record<string, unknown>) {
  const res = await fetch(`/api/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to update user');
  }
  return res.json();
}

export async function deleteUser(id: string) {
  const res = await fetch(`/api/users/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to delete user');
  }
  return res.json();
}

// --- Settings ---

export async function fetchSettings() {
  const res = await fetch('/api/settings');
  if (!res.ok) throw new Error('Failed to fetch settings');
  return res.json();
}

export async function updateSettings(data: Record<string, unknown>) {
  const res = await fetch('/api/settings', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to update settings');
  }
  return res.json();
}
