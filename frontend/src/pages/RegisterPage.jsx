import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import AuthLayout from '../layout/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import Loader from '../components/Loader';
import { registerSchema } from '../utils/schemas';
import { extractApiError } from '../api/client';
import { useAuth } from '../hooks/useAuth';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values) => {
    setSubmitting(true);

    try {
      const result = await registerUser({ fullName: values.fullName, email: values.email, password: values.password });

      if (result?.access_token || result?.session?.access_token) {
        toast.success('Account created');
        navigate('/dashboard', { replace: true });
      } else {
        toast.success('Account created. Please sign in.');
        navigate('/login', { replace: true });
      }
    } catch (error) {
      toast.error(extractApiError(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      description="Register to track experiments, review evaluations, and export results from the arbitrator workspace."
    >
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Full Name" placeholder="Jhon Doe" {...register('fullName')} error={errors.fullName?.message} />
        <Input label="Email" type="email" autoComplete="email" placeholder="name@company.com" {...register('email')} error={errors.email?.message} />
        <Input label="Password" type="password" autoComplete="new-password" placeholder="Create a strong password" {...register('password')} error={errors.password?.message} />
        <Input label="Confirm password" type="password" autoComplete="new-password" placeholder="Repeat the password" {...register('confirmPassword')} error={errors.confirmPassword?.message} />

        <Button type="submit" className="w-full" size="lg" disabled={submitting}>
          {submitting ? <Loader label="Creating account" /> : 'Register'}
        </Button>
      </form>

      <p className="mt-6 text-sm text-muted">
        Already have an account?{' '}
        <Link className="font-semibold text-primary underline-offset-4 hover:underline" to="/login">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}