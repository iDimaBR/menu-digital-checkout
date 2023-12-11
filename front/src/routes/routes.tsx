import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom'
import { LoginPage } from '../pages/Login/Login';
import { ShopPage } from '../pages/ShopPage/ShopPage';
import { Page404 } from '../pages/Page404/Page404';
import { RegisterPage } from '../pages/Register/Register';
import AccountPage from '../pages/Account/Account';
import { AddProductPage } from '../pages/AddProduct/AddProduct';
import { AddCategoryPage } from '../pages/AddCategory/AddCategory';
import { EditProductPage } from '../pages/EditProduct/EditProduct';

export default function MainRoutes() {
    return (
        <Routes>
            <Route path='/' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/account' element={<AccountPage />} />
            <Route path='/shop/:username' element={<ShopPage />} />
            <Route path='/shop/:username/product/add' element={<AddProductPage />} />
            <Route path='/shop/:username/product/edit/:productId' element={<EditProductPage />} />
            <Route path='/shop/:username/category/add' element={<AddCategoryPage />} />

            <Route path='*' element={<Page404/>} />
        </Routes>
    );
}