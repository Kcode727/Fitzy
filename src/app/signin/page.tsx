'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const router = useRouter();

  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignIn = async () => {
    setError('');
    setSuccess('');

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      if (error.message.includes('Email not confirmed')) {
        setError('Please verify your email before signing in.');
      } else {
        setError(error.message);
      }
    } else if (data.session) {
      localStorage.setItem('user', JSON.stringify(data.session.user));
      router.push('/myspace');
    }
  };

  const handleRegister = async () => {
    setError('');
    setSuccess('');

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'http://localhost:3000/confirm',
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    const user = data.user;
    if (!user) return;

    const { error: profileError } = await supabase.from('profiles').insert([
      {
        id: user.id,
        email,
        gender,
        age: Number(age),
        weight_kg: Number(weight),
        height_cm: Number(height),
      },
    ]);

    if (profileError) {
      setError(profileError.message);
      return;
    }

    setSuccess('Registration successful! Please check your email to confirm your account.');
    setIsRegistering(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden">
      {/* Left Panel */}
      <div className="w-full md:w-[40%] bg-zinc-900 p-10 flex flex-col justify-center items-center text-white">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-extrabold mb-4">
            Welcome to <span className="text-[#ff4a4a]">Fitzy</span>
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed">
            Track your workouts, eat healthy, and stay consistent.
          </p>
        </div>

        <div className="mt-10 w-full max-w-sm">
          <input
            className="w-full px-4 py-2 rounded mb-3 text-gray-200 border border-white/50 bg-transparent"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full px-4 py-2 rounded mb-4 text-gray-200 border border-white/50 bg-transparent"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {isRegistering && (
            <>
              <select
                className="w-full px-4 py-2 rounded mb-3 bg-zinc-800 text-gray-200 border border-white/50"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <input
                type="number"
                placeholder="Age"
                className="w-full px-4 py-2 rounded mb-3 text-gray-200 border border-white/50 bg-transparent"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
              <input
                type="number"
                placeholder="Weight (kg)"
                className="w-full px-4 py-2 rounded mb-3 text-gray-200 border border-white/50 bg-transparent"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
              <input
                type="number"
                placeholder="Height (cm)"
                className="w-full px-4 py-2 rounded mb-3 text-gray-200 border border-white/50 bg-transparent"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </>
          )}

          <button
            onClick={isRegistering ? handleRegister : handleSignIn}
            className="bg-[#ff4a4a] w-full py-3 rounded text-white font-semibold mb-3 hover:bg-[#ff8a8a]"
          >
            {isRegistering ? 'Register' : 'Sign In'}
          </button>

          <p className="text-center text-sm mt-4 text-gray-400">
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
                setSuccess('');
              }}
              className="text-[#ff4a4a] font-semibold underline ml-1"
            >
              {isRegistering ? 'Sign In' : 'Register'}
            </button>
          </p>

          {error && <p className="text-red-400 mt-4 text-sm text-center">{error}</p>}
          {success && <p className="text-green-400 mt-4 text-sm text-center">{success}</p>}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-[60%] h-full relative">
        <canvas
          id="canvas"
          className="w-full h-full block bg-gradient-to-br from-black via-gray-900 to-zinc-800"
        />
      </div>
    </div>
  );
}
