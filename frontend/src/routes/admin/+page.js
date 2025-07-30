// src/routes/admin/+page.js
import { redirect } from '@sveltejs/kit';

export function load() {
  if (typeof window !== 'undefined') {
    // Client-side load
    const role = localStorage.getItem('userRole');
    if (role !== 'admin') {
      throw redirect(302, '/login');
    }
  }
}
