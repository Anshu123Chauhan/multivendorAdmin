import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Banner from "../pages/banner.js";
import Dashboard from "../pages/dashboard.js";
// import Viewuser from "../pages/viewuser.js";
import Viewstore from "../pages/stores.js";
import { useContext, useEffect, useState } from "react";
// import CreateCatalog2 from "../pages/createCatlog2";
import Analytics from "../pages/analytics.js";
import Themes from "../pages/themes.js";

import PrivateRoute from "../config/protectedRoute.js";
import Login from "../pages/home";
import { validateToken } from "../config/validateToken.js";
import { useUser } from "../config/userProvider.js";
import ForgetPassword from "../pages/forgetPassword.js";
import UserLogin from "../pages/userLogin.js";
import Account from "../pages/account.js";
import Integration from "../pages/integration.js";
import Filter from "../pages/filter.js";

import Stores from "../pages/stores.js";

import StoreDetails from "../pages/storeDetails.js";

import ServiceDetails from "../pages/serviceDetails.js";
import UserPermissions from "../config/userPermissions.js";

import AddStore from "../pages/addStore.js";
import NotFound from "../pages/notFound.js";
import EditStore from "../pages/editStore.js";

import UpdatePassword from "../pages/updatePassword.js";
import AnalyticsReport from "../pages/analyticsReport";
import Permission from "../pages/permission.js";
import Locations from "../pages/locations.js";
import Domains from "../pages/domains.js";
import Notifications from "../pages/notifications.js";
import CustomData from "../pages/customData.js";
import Language from "../pages/language.js";
import Webhooks from "../pages/webhooks.js";
import PoliciesPage from "../pages/policy.js";

import UpdatePermission from "../pages/updatePermission.js";
import CustomerPasswordReset from "../pages/customerPasswordReset.js";

import Welcome from "../pages/welcome.js";

import CreateStore from "../pages/createStore.js";
import Category from "../pages/category.js";
import Subategory from "../pages/subcategory.js";
import Addcategory from "../pages/addcategory.js";
import Addsubcategory from "../pages/addsubcategory.js";
import CategoryDetails from "../pages/categoryDetails.js";
import SubcategoryDetails from "../pages/subcategoryDetails.js";
import Service from "../pages/service.js";
import Addservice from "../pages/addservice.js";
import Editcategory from "../pages/editcategory.js";
import Editsubcategory from "../pages/editsubcategory.js";
import EditServices from "../pages/editServices.js";
import ImageMapping from "../pages/imageMapping.js";
import VideoMapping from "../pages/videoMapping.js";
import PriceMapping from "../pages/priceMapping.js";
import AddBanner from "../pages/addBanner.js";
import EditBanner from "../pages/editBanner.js";
import ChangePassword from "../pages/changePassword.js";
import AddImage from "../pages/addImageService.js";
import AddVideoService from "../pages/addVideoService.js";
import Userlist from "../pages/userlist.js";
import Seller from "../pages/seller.js";
import AddSeller from "../pages/addSeller.js";
import AddUser from "../pages/addUser.js";
import AddRole from "../pages/addRole.js";
import BrandDetails from "../pages/brandDetails.js";
import Brand from "../pages/brand.js"
import Addbrand from "../pages/addbrand.js"
import Editbrand from "../pages/editbrand.js"
import Role from "../pages/role.js";
import EditUser from "../pages/editUser.js";
import EditSeller from "../pages/editSeller.js";
import AddProduct from "../pages/addProduct.js";
import Product from "../pages/product.js"
import EditProduct from "../pages/editProduct.js";
import EditRole from "../pages/editRole.js"
import AddAttribute from "../pages/addAttribute.js";
import Attribute from "../pages/attribute.js";
import EditAttribute from "../pages/editAttribute.js";
import Customer from "../pages/customer.js"
import CustomerDetails from "../pages/customerDetails.js";
import Settings from "../pages/settings.js";
import ProductDetails from "../pages/productDetails.js";
import SellerDetails from "../pages/sellerDetails.js";
import EditProfile from "../pages/editProfile.js";
import Orders from "../pages/orders.js";
import OrderDetails from "../pages/orderDetails.js";
import EditOrderDetails from "../pages/editorderDetails.js"

const Router = () => {
  const { userData, currentLocation, token } = useUser();

  const location = useLocation();

  useEffect(() => {
    if (token && location.pathname === "/admin") {
      validateToken(token)
        .then(() => {
          window.location.href = "/admin/dashboard";
        })
        .catch((error) => {
          console.error("Token validation failed:", error);
        });
      // .finally(() => {
      //   setLoading(false);
      // });
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<UserLogin />} />
      {/* <Route path="/admin" element={<Welcome />} /> */}
      <Route path="/forgetpassword" element={<ForgetPassword />} />
      <Route
        path="/updatepassword/:userObjId/:updatePasswordToken"
        element={<UpdatePassword />}
      />
      <Route path="/update_password" element={<ChangePassword />} />
      <Route path="/addseller" element={<AddSeller />} />
      <Route path="/sellerList" element={<Seller />} />
      <Route path="/sellerDetails/:id" element={<SellerDetails />} />
      
      
      <Route
        path="/addbanner"
        element={<PrivateRoute element={<AddBanner />} />}
      />
      
      <Route path="/account" element={<PrivateRoute element={<Account />} />} />     
      <Route
        path="/dashboard"
        element={
          <PrivateRoute element={<Dashboard />} PermissionName="dashboard" />
        }
      />
      <Route
        path="/dashboard/:pathname"
        element={<PrivateRoute element={<Dashboard />} />}
      />
      {/* --------------Stores-------------------------------*/}
      <Route
        path="/stores"
        element={<PrivateRoute element={<Stores />} PermissionName="stores" />}
      />
      <Route
        path="/stores/add"
        element={
          <PrivateRoute element={<AddStore />} PermissionName="stores" />
        }
      />
      <Route
        path="/editStore/:storeId/"
        element={
          <PrivateRoute element={<EditStore />} PermissionName="stores" />
        }
      />
      <Route
        path="/stores/:storeId"
        element={
          <PrivateRoute element={<StoreDetails />} PermissionName="stores" />
        }
      />
      <Route
        path="/analytics"
        element={
          <PrivateRoute element={<Analytics />} PermissionName="analysis" />
        }
      />
      <Route path="/filter" element={<PrivateRoute element={<Filter />} />} />
      <Route path="/banner" element={<PrivateRoute element={<Banner />} />} />
      <Route
        path="/addbanner"
        element={<PrivateRoute element={<AddBanner />} />}
      />
      <Route
        path="/addimage"
        element={<PrivateRoute element={<AddImage />} />}
      />
      <Route
        path="/editImage/:id"
        element={<PrivateRoute element={<AddImage />} />}
      />
      <Route
        path="/imagemapping"
        element={<PrivateRoute element={<ImageMapping />} />}
      />
      <Route
        path="/videomapping"
        element={<PrivateRoute element={<VideoMapping />} />}
      />
      <Route
        path="/addVideo"
        element={<PrivateRoute element={<AddVideoService />} />}
      />
      <Route
        path="/editVideo/:id"
        element={<PrivateRoute element={<AddVideoService />} />}
      />
      <Route
        path="/editbanner/:id"
        element={<PrivateRoute element={<EditBanner />} />}
      />
      <Route
        path="/analytics/report"
        element={
          <PrivateRoute
            element={<AnalyticsReport />}
            PermissionName="analysis"
          />
        }
      />
      <Route path="/service" element={<PrivateRoute element={<Service />} />} />

      <Route path="/themes" element={<PrivateRoute element={<Themes />} />} />
      {/* <Route path="/apps" element={<PrivateRoute element={<Apps />} />} /> */}
      <Route
        path="/integration"
        element={<PrivateRoute element={<Integration />} />}
      />
      {/* <Route path="/apps" element={<PrivateRoute element={<Apps />} />} /> */}
      <Route
        path="/integration"
        element={<PrivateRoute element={<Integration />} />}
      />
      <Route
        path="/integration"
        element={<PrivateRoute element={<Integration />} />}
      />
      <Route>
        <Route
          path="/StoreDetails/view/:id"
          element={
            <PrivateRoute element={<StoreDetails />} PermissionName="stores" />
          }
        />
        <Route
          path="/ServiceDetails/view/:id"
          element={<PrivateRoute element={<ServiceDetails />} />}
        />
      </Route>
      <Route
        path="/integration"
        element={<PrivateRoute element={<Integration />} />}
      />
      <Route
        path="/imagemapping"
        element={<PrivateRoute element={<ImageMapping />} />}
      />
      <Route
        path="/videomapping"
        element={<PrivateRoute element={<VideoMapping />} />}
      />
      <Route
        path="/pricemapping"
        element={<PrivateRoute element={<PriceMapping />} />}
      />
      {/* <Route
        path="/apps/create"
        element={<PrivateRoute element={<CreateApp />} />}
      />
      <Route
        path="/apps/:id"
        element={<PrivateRoute element={<AppDetails />} />}
      /> */}
      <Route
        path="/locations"
        element={<PrivateRoute element={<Locations />} />}
      />
      <Route
        path="/settings/domains"
        element={<PrivateRoute element={<Domains />} />}
      />
      <Route
        path="/settings/notifications"
        element={<PrivateRoute element={<Notifications />} />}
      />
      <Route
        path="/notifications/webhooks"
        element={<PrivateRoute element={<Webhooks />} />}
      />
      <Route
        path="/custom_data"
        element={<PrivateRoute element={<CustomData />} />}
      />
      <Route
        path="/languages"
        element={<PrivateRoute element={<Language />} />}
      />
       <Route
        path="/settings"
        element={<PrivateRoute element={<Settings />} />}
      />
      <Route
        path="/settings/policy"
        element={<PrivateRoute element={<PoliciesPage />} />}
      />
      <Route
        path="/settings/permission"
        element={<PrivateRoute element={<Permission />} />}
      />
      <Route
        path="/settings/permission/edit"
        element={<PrivateRoute element={<UpdatePermission />} />}
      />
      <Route
        path="/locations"
        element={<PrivateRoute element={<Locations />} />}
      />
      <Route
        path="/settings/domains"
        element={<PrivateRoute element={<Domains />} />}
      />
      <Route
        path="/settings/notifications"
        element={<PrivateRoute element={<Notifications />} />}
      />
      <Route
        path="/settings/notifications/customer/account_password_reset/preview"
        element={<PrivateRoute element={<CustomerPasswordReset />} />}
      />
      <Route
        path="/notifications/webhooks"
        element={<PrivateRoute element={<Webhooks />} />}
      />
      <Route
        path="/custom_data"
        element={<PrivateRoute element={<CustomData />} />}
      />
      <Route
        path="/languages"
        element={<PrivateRoute element={<Language />} />}
      />
      <Route
        path="/settings/policy"
        element={<PrivateRoute element={<PoliciesPage />} />}
      />
      <Route
        path="/settings/permission"
        element={<PrivateRoute element={<Permission />} />}
      />
      <Route
        path="/settings/permission/edit"
        element={<PrivateRoute element={<UpdatePermission />} />}
      />
      <Route path="/filter" element={<PrivateRoute element={<Filter />} />} />
      <Route
        path="/locations"
        element={<PrivateRoute element={<Locations />} />}
      />
      <Route
        path="/settings/domains"
        element={<PrivateRoute element={<Domains />} />}
      />
      <Route
        path="/settings/notifications"
        element={<PrivateRoute element={<Notifications />} />}
      />
      <Route
        path="/notifications/webhooks"
        element={<PrivateRoute element={<Webhooks />} />}
      />
      <Route
        path="/custom_data"
        element={<PrivateRoute element={<CustomData />} />}
      />
      <Route
        path="/languages"
        element={<PrivateRoute element={<Language />} />}
      />
      <Route
        path="/settings/policy"
        element={<PrivateRoute element={<PoliciesPage />} />}
      />
      <Route
        path="/createstore"
        element={<PrivateRoute element={<CreateStore />} />}
      />
      <Route
        path="/category"
        element={<PrivateRoute element={<Category />} />}
      />
      <Route
        path="/addcategory"
        element={<PrivateRoute element={<Addcategory />} />}
      />
      <Route
        path="/categories/:id"
        element={<PrivateRoute element={<CategoryDetails />} />}
      />
      <Route
        path="/addsubcategory"
        element={<PrivateRoute element={<Addsubcategory />} />}
      />
      <Route
        path="/subcategory"
        element={<PrivateRoute element={<Subategory />} />}
      />
      <Route
        path="/subcategories/:id"
        element={<PrivateRoute element={<SubcategoryDetails />} />}
      />
      <Route
        path="/addservice"
        element={<PrivateRoute element={<Addservice />} />}
      />
      <Route
        path="/editCategory/:categoryId/"
        element={<PrivateRoute element={<Editcategory />} />}
      />
      <Route
        path="/editSubCategory/:subcategoryId/"
        element={<PrivateRoute element={<Editsubcategory />} />}
      />
      <Route
        path="/editServices/:serviceId/"
        element={<PrivateRoute element={<EditServices />} />}
      />

       <Route
        path="/brand"
        element={<PrivateRoute element={<Brand />} />}
      />
      <Route
        path="/addBrand"
        element={<PrivateRoute element={<Addbrand />} />}
      />
      <Route
        path="/brand/:id"
        element={<PrivateRoute element={<BrandDetails />} />}
      />
      <Route
        path="/editBrand/:brandId"
        element={<PrivateRoute element={<Editbrand />} />}
      />

      <Route
        path="/role"
        element={<PrivateRoute element={<Role />} />}
      />
      <Route path="/addrole" element={<PrivateRoute element={<AddRole />} />} />
      <Route
        path="/userlist"
        element={<PrivateRoute element={<Userlist />} />}
      />
      <Route path="/addUser" element={<PrivateRoute element={<AddUser />} />} />
      <Route path="/editUser/:id" element={<PrivateRoute element={<EditUser />} />} />
      <Route path="/editSeller/:id" element={<PrivateRoute element={<EditSeller />} />} />
      <Route path="/addProduct" element={<PrivateRoute element={<AddProduct />} />} />
      <Route path="/product" element={<PrivateRoute element={<Product />} />} />
      <Route path="/orders" element={<PrivateRoute element={<Orders />} />} />
      <Route path="/order-details/:id" element={<PrivateRoute element={<OrderDetails />} />} />
      <Route path="/edit-order/:id" element={<PrivateRoute element={<EditOrderDetails />} />} />
      <Route path="/updateProfile" element={<PrivateRoute element={<EditProfile />} />} />
      <Route path="/editProduct/:id" element={<PrivateRoute element={<EditProduct />} />} />
      <Route path="/editRole/:id" element={<PrivateRoute element={<EditRole />} />} />
      <Route path="/addAttribute" element={<PrivateRoute element={<AddAttribute />} />} />
      <Route path="/editAttribute/:id" element={<PrivateRoute element={<EditAttribute />} />} />
      <Route path="/attribute" element={<PrivateRoute element={<Attribute />} />} />
      <Route path="/customer" element={<PrivateRoute element={<Customer />} />} />
      <Route path="/customers/:id" element={<PrivateRoute element={<CustomerDetails />} />} />
      <Route path="/products/:id" element={<PrivateRoute element={<ProductDetails />} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default Router;
