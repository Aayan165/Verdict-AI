import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import AuthLayout from '../layout/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import Loader from '../components/Loader';
import { loginSchema } from '../utils/schemas';
import { extractApiError } from '../api/client';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values) => {
    setSubmitting(true);

    try {
      await login(values);
      toast.success('Signed in successfully');
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (error) {
      toast.error(extractApiError(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to inspect scores, experiment outcomes, and analytics in the arbitrator dashboard."
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Email" type="email" autoComplete="email" placeholder="name@company.com" {...register('email')} error={errors.email?.message} />
        <Input label="Password" type="password" autoComplete="current-password" placeholder="••••••••" {...register('password')} error={errors.password?.message} />

        <Button type="submit" className="w-full" size="lg" disabled={submitting}>
          {submitting ? <Loader label="Signing in" /> : 'Login'}
        </Button>
      </form>

      <p className="mt-6 text-sm text-muted">
        New here?{' '}
        <Link className="font-semibold text-primary underline-offset-4 hover:underline" to="/register">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}