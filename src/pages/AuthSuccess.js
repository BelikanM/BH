import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthSuccess = () => {
    const { checkAuth } = useAuth();

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p>Connexion en cours...</p>
            </div>
        </div>
    );
};

export default AuthSuccess;

