import { DEFAULT_CONTENT, STORAGE_KEY } from './resumeStore.js';
import { getSupabaseClient } from '../lib/supabase/client.js';

export const DASHBOARD_VIEW_STORAGE_KEY = 'cvcreator-dashboard-view';

function mapAuthUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email || '',
    name:
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split('@')[0] ||
      'Usuario',
  };
}

function mapCv(row) {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    template: row.template,
    content:
      typeof row.content === 'string'
        ? row.content
        : row.content && typeof row.content === 'object'
          ? JSON.stringify(row.content, null, 2)
          : DEFAULT_CONTENT,
    thumbnailUrl: row.thumbnail_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getCurrentUser() {
  const { data, error } = await getSupabaseClient().auth.getUser();
  if (error) {
    if (error.name === 'AuthSessionMissingError') {
      return null;
    }
    throw error;
  }

  return mapAuthUser(data.user);
}

export async function signInWithEmail({ email, password }) {
  const { data, error } = await getSupabaseClient().auth.signInWithPassword({
    email: String(email || '').trim().toLowerCase(),
    password,
  });

  if (error) {
    throw error;
  }

  return mapAuthUser(data.user);
}

export async function signUpWithEmail({ name, email, password }) {
  const { data, error } = await getSupabaseClient().auth.signUp({
    email: String(email || '').trim().toLowerCase(),
    password,
    options: {
      data: { full_name: String(name || '').trim() },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    throw error;
  }

  return {
    user: mapAuthUser(data.user),
    session: data.session,
  };
}

export async function signInWithGoogle() {
  const { error } = await getSupabaseClient().auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    throw error;
  }
}

export async function logoutCurrentUser() {
  const { error } = await getSupabaseClient().auth.signOut();
  if (error) {
    throw error;
  }
}

export async function getUserCvs() {
  const { data, error } = await getSupabaseClient()
    .from('cvs')
    .select('id,user_id,title,template,content,thumbnail_url,created_at,updated_at')
    .order('updated_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []).map(mapCv);
}

export async function getCvById(cvId) {
  const { data, error } = await getSupabaseClient()
    .from('cvs')
    .select('id,user_id,title,template,content,thumbnail_url,created_at,updated_at')
    .eq('id', cvId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapCv(data) : null;
}

export async function createCv({ title, content, template = 'default' }) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Debes iniciar sesión para guardar un CV.');
  }

  const { data, error } = await getSupabaseClient()
    .from('cvs')
    .insert({
      user_id: user.id,
      title: title || 'CV sin título',
      template,
      content: content ?? DEFAULT_CONTENT,
    })
    .select('id,user_id,title,template,content,thumbnail_url,created_at,updated_at')
    .single();

  if (error) {
    throw error;
  }

  return mapCv(data);
}

export async function updateCvRecord(cvId, updates) {
  const payload = {};
  if (typeof updates.title === 'string') {
    payload.title = updates.title;
  }
  if (typeof updates.content === 'string') {
    payload.content = updates.content;
  }
  if (typeof updates.template === 'string') {
    payload.template = updates.template;
  }
  if (typeof updates.thumbnailUrl === 'string' || updates.thumbnailUrl === null) {
    payload.thumbnail_url = updates.thumbnailUrl;
  }

  if (Object.keys(payload).length === 0) {
    throw new Error('No hay cambios para guardar.');
  }

  const { data, error } = await getSupabaseClient()
    .from('cvs')
    .update(payload)
    .eq('id', cvId)
    .select('id,user_id,title,template,content,thumbnail_url,created_at,updated_at')
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('El CV ya no existe o no tienes permiso para modificarlo.');
  }

  return mapCv(data);
}

export async function duplicateCv(cvId) {
  const source = await getCvById(cvId);
  if (!source) {
    throw new Error('El CV que intentas duplicar no existe o no tienes permiso para verlo.');
  }

  return createCv({
    title: `${source.title} (copia)`,
    content: source.content,
    template: source.template || 'default',
  });
}

export async function deleteCv(cvId) {
  const { data, error } = await getSupabaseClient()
    .from('cvs')
    .delete()
    .eq('id', cvId)
    .select('id')
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('El CV ya no existe o no tienes permiso para eliminarlo.');
  }
}

export function getDashboardView() {
  if (typeof window === 'undefined') {
    return 'grid';
  }

  return window.localStorage.getItem(DASHBOARD_VIEW_STORAGE_KEY) === 'list' ? 'list' : 'grid';
}

export function setDashboardView(view) {
  const safeView = view === 'list' ? 'list' : 'grid';
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(DASHBOARD_VIEW_STORAGE_KEY, safeView);
  }
  return safeView;
}

export async function maybeMigrateGuestResume() {
  if (typeof window === 'undefined') {
    return null;
  }

  const guestContent = window.localStorage.getItem(STORAGE_KEY);
  if (!guestContent || guestContent === DEFAULT_CONTENT || guestContent.trim().length === 0) {
    return null;
  }

  const confirmed = window.confirm('¿Quieres guardar el CV en el que estabas trabajando en tu cuenta?');
  if (!confirmed) {
    return null;
  }

  const created = await createCv({
    title: 'CV en el que estabas trabajando',
    content: guestContent,
    template: 'default',
  });

  window.localStorage.removeItem(STORAGE_KEY);
  return created;
}
