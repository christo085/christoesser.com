import { supabase } from './supabase';
export async function publishedProjects() { const { data } = await supabase.from('projects').select('*').eq('published', true).order('date', { ascending: false }); return data ?? []; }
export async function publishedPhotos() { const { data } = await supabase.from('photos').select('*, albums(title, slug)').eq('published', true).order('sort_order'); return data ?? []; }
export async function settings() { const { data } = await supabase.from('site_settings').select('*'); return Object.fromEntries((data ?? []).map((item) => [item.key, item.value])); }
