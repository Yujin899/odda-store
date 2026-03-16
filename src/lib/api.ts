/**
 * Centralized API client for Odda Store.
 * Consolidation of repeated fetch patterns for typed, reliable data access.
 */

// --- Categories ---

/**
 * Fetches all categories from the /api/categories endpoint.
 * @returns {Promise<Category[]>} Array of category objects
 */
export async function fetchCategories() {
  const res = await fetch('/api/categories');
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

/**
 * Creates a new category.
 * @param data - Category data to be sent to POST /api/categories
 * @returns The newly created category object
 */
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

/**
 * Updates an existing category by ID.
 * @param id - The unique ID of the category to update
 * @param data - Updated category fields
 * @returns The updated category object
 */
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

/**
 * Deletes a category by ID.
 * @param id - The unique ID of the category to delete
 * @returns Success confirmation
 */
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

/**
 * Updates a user's details (e.g., status, role).
 * @param id - The unique ID of the user to update
 * @param data - Updated user fields
 * @returns The updated user object
 */
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

/**
 * Deletes a user by ID.
 * @param id - The unique ID of the user to delete
 * @returns Success confirmation
 */
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

/**
 * Fetches the global store settings.
 * @returns {Promise<StoreSettings>} Global settings document
 */
export async function fetchSettings() {
  const res = await fetch('/api/settings');
  if (!res.ok) throw new Error('Failed to fetch settings');
  return res.json();
}

/**
 * Updates the global store settings.
 * @param data - Updated settings fields
 * @returns The updated settings document
 */
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
