'use client';

import { useAuth } from '@/context/auth-context';
import Link from 'next/link';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="border-b border-gray-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between items-center">
                    <div className="flex">
                        <Link href="/" className="text-xl font-bold text-blue-600">
                            SyncFlow
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <span className="text-sm text-gray-700">
                                    Hi, <span className="font-semibold">{user.firstName || user.email}</span>
                                </span>
                                <button
                                    onClick={logout}
                                    className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
                            >
                                Sign in
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}