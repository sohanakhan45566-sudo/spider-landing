"use client";
import { useEffect, useState } from "react";
import { signInWithPopup, onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth, googleProvider, db } from "../lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        await setDoc(
          doc(db, "users", currentUser.uid),
          {
            email: currentUser.email,
            name: currentUser.displayName,
            photo: currentUser.photoURL,
            signedInAt: serverTimestamp(),
          },
          { merge: true }
        );
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  // Login se pehle: sirf Continue with Google button
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <button
          onClick={handleGoogleLogin}
          className="flex items-center gap-3 bg-white border border-gray-300 px-6 py-3 rounded-lg shadow hover:shadow-md transition"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-6 h-6"
          />
          <span className="font-medium text-gray-700">Continue with Google</span>
        </button>
      </div>
    );
  }

  // Login ke baad: Landing Page
  return (
    <div className="min-h-screen bg-[var(--light-bg)]">
      {/* Navbar */}
      <nav className="bg-[var(--primary-blue)] text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Spider Portal</h1>
        <div className="flex items-center gap-4">
          <span className="hidden md:block text-sm">{user.email}</span>
          <button
            onClick={() => signOut(auth)}
            className="bg-[var(--accent-red)] px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <h1 className="text-5xl font-bold text-[var(--primary-blue)] mb-6">
            Thanks for connecting
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Welcome to the Spider Portal, {user.displayName || "friend"}! You
            have successfully connected with Google. Explore the amazing world
            with us and stay connected.
          </p>
          <button className="bg-[var(--accent-red)] text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition">
            Get Started
          </button>
        </div>

        <div className="flex-1 flex justify-center">
          <img
            src="/spider-man.jpeg"
            alt="Spider-Man"
            className="rounded-2xl shadow-2xl max-w-md w-full object-cover"
          />
        </div>
      </section>
    </div>
  );
}