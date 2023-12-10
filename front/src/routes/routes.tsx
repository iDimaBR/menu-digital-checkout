import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom'
import { LoginPage } from '../pages/Login';
import { ShopPage } from '../pages/ShopPage/ShopPage';
import { Page404 } from '../pages/Page404';

export default function MainRoutes() {
    const { pathname } = useLocation();

    useEffect(() => { 
        window.scrollTo(0, 0); 
    }, [pathname]);

    return (
        <Routes>
            <Route path='/' element={<LoginPage />} />
            <Route path='/shop/:username' element={<ShopPage />} />
            <Route path='*' element={<Page404/>} />
        </Routes>
    );
}