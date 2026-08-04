import { api } from '../../api/client';
import { endpoints } from '../../api/endpoints';
import { supabase } from '../../services/supabase';

export async function loginRequest(payload) {
  const response = await supabase.auth.signInWithPassword({
    email: payload.email,
    password: payload.password,
  });

  if (response.error) {
    throw response.error;
  }

  return response.data;
}

export async function registerRequest(payload) {
  const response = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
  });

  if (response.error) {
    throw response.error;
  }

  const user = response.data.user;

  if (user) {
    const { error } = await supabase
      .from('user_profiles')
      .insert({
        id: user.id,
        full_name: payload.fullName ?? null,
      });

    if (error) {
      throw error;
    }
  }

  return response.data;
}