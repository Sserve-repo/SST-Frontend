// "use client";

// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { Menu, Heart, X } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import {
//   NavigationMenu,
//   NavigationMenuContent,
//   NavigationMenuItem,
//   NavigationMenuList,
//   NavigationMenuTrigger,
// } from "@/components/ui/navigation-menu";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import RoleWithRedirect from "@/app/auth/register/_components/RoleWithRedirect";
// import CartIcon from "../CartIcon";
// import { useRouter } from "next/navigation";
// import { getProductMenu } from "@/actions/product";
// import { getServicesMenu } from "@/actions/service";
// import { useAuth } from "@/context/AuthContext";
// import { RiArrowDropDownLine } from "react-icons/ri";

// import {
//   HoverCard,
//   HoverCardContent,
//   HoverCardTrigger,
// } from "@/components/ui/hover-card";
// import { getUserType } from "@/config/utils";

// export default function Header() {
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [productsMenu, setProductsMenu] = useState<any[]>([]);
//   const [servicesMenu, setServicesMenu] = useState<any[]>([]);
//   const router = useRouter();
//   const { isAuthenticated, currentUser, logOut } = useAuth();

//   const handleOpenRole = () => {
//     if (!isAuthenticated) {
//       setModalOpen(!isModalOpen);
//     } else {
//       const type = getUserType(currentUser.user_type);
//       router.push(`/${type}/dashboard`);
//     }
//   };

//   const handleAuth = () => {
//     console.log({isAuthenticated})
//     if (isAuthenticated) {
//       logOut();
//     } else {
//       router.push("/auth/login");
//     }
//   };

//   const handleFetchProductMenu = async () => {
//     const response = await getProductMenu();
//     if (response && response.ok) {
//       const data = await response.json();
//       setProductsMenu(data.data["Products Category Menu"]);
//     }
//   };

//   const handleFetchServicesMenu = async () => {
//     const response = await getServicesMenu();
//     if (response && response.ok) {
//       const data = await response.json();
//       setServicesMenu(data.data["Service Category Menu"]);
//     }
//   };

//   useEffect(() => {
//     // const token = Cookies.get("accessToken");
//     // if (token) {
//     //   setIsAuth(true);
//     // }

//     handleFetchProductMenu();
//     handleFetchServicesMenu();
//   }, []);

//   return (
//     <header className="fixed top-0 left-0 w-full bg-white shadow-lg z-50">
//       <div className="relative container mx-auto px-4 h-20 md:h-24 flex items-center justify-between">
//         <div className="flex items-center">
//           <Link href="/" className="mr-4">
//             <Image
//               src="/assets/images/logo.svg"
//               alt="Logo"
//               width={220}
//               height={60}
//             />
//           </Link>
//         </div>
//         <div className="">
//           <nav className="hidden lg:flex space-x-4">
//             <NavigationMenu>
//               <NavigationMenuList>
//                 <NavigationMenuItem>
//                   <NavigationMenuTrigger>Services</NavigationMenuTrigger>
//                   <NavigationMenuContent>
//                     <div className="w-[35rem] max-h-[80vh] overflow-y-auto grid grid-cols-2 p-4">
//                       {servicesMenu.map((service) => (
//                         <div
//                           key={`${service.name}${service.id}`}
//                           className="flex flex-col mb-4"
//                         >
//                           <p className="font-bold mb-2">{service.name}</p>
//                           {service["service_category_items"].map(
//                             (item, index) => (
//                               <Link
//                                 key={index}
//                                 href={`/services/?categoryId=${item.id}`}
//                                 className="hover:underline mb-1"
//                               >
//                                 {item.name}
//                               </Link>
//                             )
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   </NavigationMenuContent>
//                 </NavigationMenuItem>
//                 <NavigationMenuItem>
//                   <NavigationMenuTrigger>Products</NavigationMenuTrigger>
//                   <NavigationMenuContent>
//                     <div className="w-[35rem] max-h-[80vh] overflow-y-auto grid grid-cols-2 p-4">
//                       {productsMenu.map((category) => (
//                         <div
//                           key={`${category.name}${category.id}`}
//                           className="flex flex-col mb-4"
//                         >
//                           <p className="font-bold mb-2">{category.name}</p>
//                           {category["product_categories"].map((item, index) => (
//                             <div key={index} className="grid grid-cols-2">
//                               <Link
//                                 key={index}
//                                 href={`/products/?categoryId=${item.id}`}
//                                 className="hover:underline mb-1"
//                               >
//                                 {item.name}
//                               </Link>
//                               <HoverCard>
//                                 <HoverCardTrigger>
//                                   <RiArrowDropDownLine className="hover: cursor-pointer text-2xl ml-8" />
//                                 </HoverCardTrigger>
//                                 <HoverCardContent className="flex flex-col gap-y-2 ">
//                                   {item["product_category_items"].map(
//                                     (subItem, subItemIndex) => (
//                                       <Link
//                                         key={subItemIndex}
//                                         href={`/products/?categoryId=${item.id}&subCategoryId=${subItem.id}`}
//                                         className="hover:underline mb-1"
//                                       >
//                                         {subItem.name}
//                                       </Link>
//                                     )
//                                   )}
//                                 </HoverCardContent>
//                               </HoverCard>
//                             </div>
//                           ))}
//                         </div>
//                       ))}
//                     </div>
//                   </NavigationMenuContent>
//                 </NavigationMenuItem>
//               </NavigationMenuList>
//             </NavigationMenu>
//             <div className="flex items-center space-x-5">
//               <Link
//                 href="/refer-earn"
//                 className="hidden sm:flex text-sm items-center space-x-2"
//               >
//                 <span>Refer & Earn</span>
//               </Link>
//               <Link
//                 href="/favorites"
//                 className="text-gray-600 hover:text-gray-900"
//               >
//                 <Heart className="h-6 w-6" />
//               </Link>
//               <CartIcon />
//             </div>
//           </nav>
//         </div>

//         <div className="flex items-center space-x-4">
//           <div className="hidden md:flex items-center space-x-2">
//             <Button
//               className="border border-[#FFB46A] bg-white text-black hover:text-white"
//               onClick={() => handleAuth()}
//               // variant="outline"
//               // asChild
//             >
//               {isAuthenticated ? "Logout" : "Login"}
//             </Button>

//             <Button onClick={() => handleOpenRole()}>
//               {isAuthenticated ? "Dashboard" : "Join SphereServe"}
//             </Button>
//           </div>
//         </div>

//         <Sheet>
//           <SheetTrigger asChild>
//             <Button variant="outline" size="icon" className="md:hidden">
//               <Menu className="h-6 w-6" />
//             </Button>
//           </SheetTrigger>
//           <SheetContent>
//             <nav className="flex flex-col space-y-12">
//               <Link href="/" className="mr-4">
//                 <Image
//                   src="/assets/images/logo.svg"
//                   alt="Logo"
//                   width={220}
//                   height={60}
//                 />
//               </Link>
//               <div className="flex flex-col space-y-6 mt-6 text-black">
//                 <Link href="/services">Services</Link>
//                 <Link href="/products">Products</Link>
//                 <Link href="/refer-earn">Refer & Earn</Link>
//                 <Link href="/favorites">
//                   <div className="flex gap-x-2  hover:text-gray-900 ">
//                     <Heart className="h-6 w-6" /> Favorites
//                   </div>
//                 </Link>
//                 <Link href="/cart">
//                   <div className="flex gap-x-2  hover:text-gray-900 ">
//                     <CartIcon /> Cart
//                   </div>
//                 </Link>
//               </div>

//               <div className="flex flex-col space-y-3 ">
//                 <Button
//                   onClick={() => handleAuth()}
//                   variant="outline"
//                   className="border-[#FFB46A] border-2"
//                   // asChild
//                 >
//                   {isAuthenticated ? "Logout" : "Login"}
//                 </Button>

//                 <Button
//                   onClick={() => handleOpenRole()}
//                   variant="outline"
//                   className="bg-[#502266] text-white"
//                   // asChild
//                 >
//                   {isAuthenticated ? "Dashboard" : "Join SphereServe"}
//                 </Button>
//               </div>
//             </nav>
//           </SheetContent>
//         </Sheet>
//       </div>

//       {/* Framer Motion Modal */}
//       <AnimatePresence>
//         {isModalOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 overflow-hidden"
//             onClick={handleOpenRole}
//           >
//             <motion.div
//               onClick={(e) => e.stopPropagation()}
//               initial={{ opacity: 0, scale: 0.8, y: 50 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.8, y: 50 }}
//               transition={{ duration: 0.4, ease: "easeInOut" }}
//               className="bg-white w-[90%] max-w-lg rounded-lg p-2 relative shadow-lg"
//             >
//               <button
//                 onClick={handleOpenRole}
//                 className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 mt-4 mr-2"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//               <div className="p-3 bg-white">
//                 <RoleWithRedirect />
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </header>
//   );
// }

// "use client";

// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { Menu, Heart, X } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import {
//   NavigationMenu,
//   NavigationMenuContent,
//   NavigationMenuItem,
//   NavigationMenuList,
//   NavigationMenuTrigger,
// } from "@/components/ui/navigation-menu";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import RoleWithRedirect from "@/app/auth/register/_components/RoleWithRedirect";
// import CartIcon from "../CartIcon";
// import { useRouter } from "next/navigation";
// import { getProductMenu } from "@/actions/product";
// import { getServicesMenu } from "@/actions/service";
// import { useAuth } from "@/context/AuthContext";
// import { RiArrowDropDownLine } from "react-icons/ri";

// import {
//   HoverCard,
//   HoverCardContent,
//   HoverCardTrigger,
// } from "@/components/ui/hover-card";
// import { getUserType } from "@/config/utils";

// export default function Header() {
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [productsMenu, setProductsMenu] = useState<any[]>([]);
//   const [servicesMenu, setServicesMenu] = useState<any[]>([]);
//   const router = useRouter();
//   const { isAuthenticated, currentUser, logOut } = useAuth();

//   const handleOpenRole = () => {
//     if (!isAuthenticated) {
//       setModalOpen(!isModalOpen);
//     } else {
//       const type = getUserType(currentUser.user_type);
//       router.push(`/${type}/dashboard`);
//     }
//   };

//   const handleCloseModal = () => {
//     setModalOpen(false);
//   };

//   const handleAuth = () => {
//     console.log({ isAuthenticated });
//     if (isAuthenticated) {
//       logOut();
//     } else {
//       router.push("/auth/login");
//     }
//   };

//   const handleFetchProductMenu = async () => {
//     try {
//       const response = await getProductMenu();
//       if (response && response.ok) {
//         const data = await response.json();
//         setProductsMenu(data.data["Products Category Menu"] || []);
//       }
//     } catch (error) {
//       console.error("Error fetching product menu:", error);
//     }
//   };

//   const handleFetchServicesMenu = async () => {
//     try {
//       const response = await getServicesMenu();
//       if (response && response.ok) {
//         const data = await response.json();
//         setServicesMenu(data.data["Service Category Menu"] || []);
//       }
//     } catch (error) {
//       console.error("Error fetching services menu:", error);
//     }
//   };

//   useEffect(() => {
//     handleFetchProductMenu();
//     handleFetchServicesMenu();
//   }, []);

//   // Prevent body scroll when modal is open
//   useEffect(() => {
//     if (isModalOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "unset";
//     }

//     // Cleanup function to reset body overflow
//     return () => {
//       document.body.style.overflow = "unset";
//     };
//   }, [isModalOpen]);

//   return (
//     <>
//       <header className="fixed top-0 left-0 w-full bg-white shadow-lg z-40">
//         <div className="relative container mx-auto px-4 h-20 md:h-24 flex items-center justify-between">
//           {/* Logo */}
//           <div className="flex items-center">
//             <Link href="/" className="mr-4">
//               <Image
//                 src="/assets/images/logo.svg"
//                 alt="Logo"
//                 width={220}
//                 height={60}
//                 className="h-auto"
//               />
//             </Link>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden lg:flex items-center space-x-6">
//             <NavigationMenu>
//               <NavigationMenuList>
//                 {/* Services Menu */}
//                 <NavigationMenuItem>
//                   <NavigationMenuTrigger className="text-gray-700 hover:text-[#502266] transition-colors">
//                     Services
//                   </NavigationMenuTrigger>
//                   <NavigationMenuContent>
//                     <div className="w-[35rem] max-h-[80vh] overflow-y-auto grid grid-cols-2 gap-4 p-6">
//                       {servicesMenu.map((service) => (
//                         <div
//                           key={`${service.name}${service.id}`}
//                           className="flex flex-col space-y-2"
//                         >
//                           <p className="font-semibold text-[#502266] mb-2 border-b border-gray-200 pb-1">
//                             {service.name}
//                           </p>
//                           {service["service_category_items"]?.map(
//                             (item, index) => (
//                               <Link
//                                 key={index}
//                                 href={`/services/?categoryId=${item.id}`}
//                                 className="text-gray-600 hover:text-[#FF7F00] hover:underline transition-colors text-sm"
//                               >
//                                 {item.name}
//                               </Link>
//                             )
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   </NavigationMenuContent>
//                 </NavigationMenuItem>

//                 {/* Products Menu */}
//                 <NavigationMenuItem>
//                   <NavigationMenuTrigger className="text-gray-700 hover:text-[#502266] transition-colors">
//                     Products
//                   </NavigationMenuTrigger>
//                   <NavigationMenuContent>
//                     <div className="w-[35rem] max-h-[80vh] overflow-y-auto grid grid-cols-2 gap-4 p-6">
//                       {productsMenu.map((category) => (
//                         <div
//                           key={`${category.name}${category.id}`}
//                           className="flex flex-col space-y-2"
//                         >
//                           <p className="font-semibold text-[#502266] mb-2 border-b border-gray-200 pb-1">
//                             {category.name}
//                           </p>
//                           {category["product_categories"]?.map(
//                             (item, index) => (
//                               <div
//                                 key={index}
//                                 className="flex items-center justify-between"
//                               >
//                                 <Link
//                                   href={`/products/?categoryId=${item.id}`}
//                                   className="text-gray-600 hover:text-[#FF7F00] hover:underline transition-colors text-sm flex-1"
//                                 >
//                                   {item.name}
//                                 </Link>
//                                 {item["product_category_items"]?.length > 0 && (
//                                   <HoverCard>
//                                     <HoverCardTrigger>
//                                       <RiArrowDropDownLine className="hover:cursor-pointer text-2xl text-gray-400 hover:text-[#502266] transition-colors" />
//                                     </HoverCardTrigger>
//                                     <HoverCardContent className="w-56">
//                                       <div className="flex flex-col space-y-2">
//                                         {item["product_category_items"].map(
//                                           (subItem, subItemIndex) => (
//                                             <Link
//                                               key={subItemIndex}
//                                               href={`/products/?categoryId=${item.id}&subCategoryId=${subItem.id}`}
//                                               className="text-gray-600 hover:text-[#FF7F00] hover:underline transition-colors text-sm"
//                                             >
//                                               {subItem.name}
//                                             </Link>
//                                           )
//                                         )}
//                                       </div>
//                                     </HoverCardContent>
//                                   </HoverCard>
//                                 )}
//                               </div>
//                             )
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   </NavigationMenuContent>
//                 </NavigationMenuItem>
//               </NavigationMenuList>
//             </NavigationMenu>

//             {/* Additional Navigation Items */}
//             <div className="flex items-center space-x-4">
//               <Link
//                 href="/refer-earn"
//                 className="text-gray-700 hover:text-[#502266] transition-colors text-sm font-medium"
//               >
//                 Refer & Earn
//               </Link>
//               <Link
//                 href="/favorites"
//                 className="text-gray-600 hover:text-[#502266] transition-colors"
//                 title="Favorites"
//               >
//                 <Heart className="h-6 w-6" />
//               </Link>
//               <CartIcon />
//             </div>
//           </div>

//           {/* Desktop Auth Buttons */}
//           <div className="hidden lg:flex items-center space-x-3">
//             <Button
//               className="border border-[#FFB46A] bg-white text-black hover:bg-[#FFB46A] hover:text-white transition-colors"
//               onClick={handleAuth}
//               variant="outline"
//             >
//               {isAuthenticated ? "Logout" : "Login"}
//             </Button>

//             <Button
//               onClick={handleOpenRole}
//               className="bg-[#502266] hover:bg-[#502266]/90 text-white"
//             >
//               {isAuthenticated ? "Dashboard" : "Join SphereServe"}
//             </Button>
//           </div>

//           {/* Mobile Menu */}
//           <Sheet>
//             <SheetTrigger asChild>
//               <Button variant="outline" size="icon" className="lg:hidden">
//                 <Menu className="h-6 w-6" />
//               </Button>
//             </SheetTrigger>
//             <SheetContent side="right" className="w-80">
//               <nav className="flex flex-col space-y-8">
//                 <Link href="/" className="flex justify-center">
//                   <Image
//                     src="/assets/images/logo.svg"
//                     alt="Logo"
//                     width={180}
//                     height={50}
//                     className="h-auto"
//                   />
//                 </Link>

//                 <div className="flex flex-col space-y-6 text-gray-700">
//                   <Link
//                     href="/services"
//                     className="hover:text-[#502266] transition-colors font-medium"
//                   >
//                     Services
//                   </Link>
//                   <Link
//                     href="/products"
//                     className="hover:text-[#502266] transition-colors font-medium"
//                   >
//                     Products
//                   </Link>
//                   <Link
//                     href="/refer-earn"
//                     className="hover:text-[#502266] transition-colors font-medium"
//                   >
//                     Refer & Earn
//                   </Link>
//                   <Link
//                     href="/favorites"
//                     className="hover:text-[#502266] transition-colors"
//                   >
//                     <div className="flex items-center gap-3">
//                       <Heart className="h-5 w-5" />
//                       <span className="font-medium">Favorites</span>
//                     </div>
//                   </Link>
//                   <Link
//                     href="/cart"
//                     className="hover:text-[#502266] transition-colors"
//                   >
//                     <div className="flex items-center gap-3">
//                       <CartIcon />
//                       <span className="font-medium">Cart</span>
//                     </div>
//                   </Link>
//                 </div>

//                 <div className="flex flex-col space-y-3 pt-6 border-t border-gray-200">
//                   <Button
//                     onClick={handleAuth}
//                     variant="outline"
//                     className="border-[#FFB46A] border-2 text-black hover:bg-[#FFB46A] hover:text-white"
//                   >
//                     {isAuthenticated ? "Logout" : "Login"}
//                   </Button>

//                   <Button
//                     onClick={handleOpenRole}
//                     className="bg-[#502266] text-white hover:bg-[#502266]/90"
//                   >
//                     {isAuthenticated ? "Dashboard" : "Join SphereServe"}
//                   </Button>
//                 </div>
//               </nav>
//             </SheetContent>
//           </Sheet>
//         </div>
//       </header>

//       {/* Modal with Proper Overlay */}
//       <AnimatePresence>
//         {isModalOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
//             onClick={handleCloseModal}
//           >
//             <motion.div
//               onClick={(e) => e.stopPropagation()}
//               initial={{ opacity: 0, scale: 0.9, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.9, y: 20 }}
//               transition={{ duration: 0.3, ease: "easeOut" }}
//               className="bg-white w-full max-w-lg rounded-xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
//             >
//               {/* Close Button */}
//               <button
//                 onClick={handleCloseModal}
//                 className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10 bg-gray-100 hover:bg-gray-200 rounded-full p-2"
//               >
//                 <X className="h-5 w-5" />
//               </button>

//               {/* Modal Content */}
//               <div className="p-6">
//                 <RoleWithRedirect />
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }

// "use client";

// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { Menu, Heart, X } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import {
//   NavigationMenu,
//   NavigationMenuContent,
//   NavigationMenuItem,
//   NavigationMenuList,
//   NavigationMenuTrigger,
// } from "@/components/ui/navigation-menu";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import RoleWithRedirect from "@/app/auth/register/_components/RoleWithRedirect";
// import CartIcon from "../CartIcon";
// import { useRouter } from "next/navigation";
// import { getProductMenu } from "@/actions/product";
// import { getServicesMenu } from "@/actions/service";
// import { useAuth } from "@/context/AuthContext";
// import { RiArrowDropDownLine } from "react-icons/ri";

// import {
//   HoverCard,
//   HoverCardContent,
//   HoverCardTrigger,
// } from "@/components/ui/hover-card";
// import { getUserType } from "@/config/utils";

// export default function Header() {
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [productsMenu, setProductsMenu] = useState<any[]>([]);
//   const [servicesMenu, setServicesMenu] = useState<any[]>([]);
//   const router = useRouter();
//   const { isAuthenticated, currentUser, logOut } = useAuth();

//   const handleOpenRole = () => {
//     if (!isAuthenticated) {
//       setModalOpen(!isModalOpen);
//     } else {
//       const type = getUserType(currentUser.user_type);
//       router.push(`/${type}/dashboard`);
//     }
//   };

//   const handleCloseModal = () => {
//     setModalOpen(false);
//   };

//   const handleAuth = () => {
//     console.log({ isAuthenticated });
//     if (isAuthenticated) {
//       logOut();
//     } else {
//       router.push("/auth/login");
//     }
//   };

//   const handleFetchProductMenu = async () => {
//     try {
//       const response = await getProductMenu();
//       if (response && response.ok) {
//         const data = await response.json();
//         setProductsMenu(data.data["Products Category Menu"] || []);
//       }
//     } catch (error) {
//       console.error("Error fetching product menu:", error);
//     }
//   };

//   const handleFetchServicesMenu = async () => {
//     try {
//       const response = await getServicesMenu();
//       if (response && response.ok) {
//         const data = await response.json();
//         setServicesMenu(data.data["Service Category Menu"] || []);
//       }
//     } catch (error) {
//       console.error("Error fetching services menu:", error);
//     }
//   };

//   useEffect(() => {
//     handleFetchProductMenu();
//     handleFetchServicesMenu();
//   }, []);

//   // Prevent body scroll when modal is open and close navigation menus
//   useEffect(() => {
//     if (isModalOpen) {
//       document.body.style.overflow = 'hidden';
//       // Close any open navigation menus when modal opens
//       const navMenus = document.querySelectorAll('[data-radix-navigation-menu-content]');
//       navMenus.forEach(menu => {
//         if (menu instanceof HTMLElement) {
//           menu.style.display = 'none';
//         }
//       });
//     } else {
//       document.body.style.overflow = 'unset';
//       // Restore navigation menus when modal closes
//       const navMenus = document.querySelectorAll('[data-radix-navigation-menu-content]');
//       navMenus.forEach(menu => {
//         if (menu instanceof HTMLElement) {
//           menu.style.display = '';
//         }
//       });
//     }

//     // Cleanup function to reset body overflow
//     return () => {
//       document.body.style.overflow = 'unset';
//     };
//   }, [isModalOpen]);

//   return (
//     <>
//       <header className="fixed top-0 left-0 w-full bg-white shadow-lg z-40 relative">
//         <div className="relative container mx-auto px-4 h-20 md:h-24 flex items-center justify-between">
//           {/* Logo */}
//           <div className="flex items-center">
//             <Link href="/" className="mr-4">
//               <Image
//                 src="/assets/images/logo.svg"
//                 alt="Logo"
//                 width={220}
//                 height={60}
//                 className="h-auto"
//               />
//             </Link>
//           </div>

//           {/* Desktop Navigation */}
//           <div className={`hidden lg:flex items-center space-x-6 ${isModalOpen ? 'pointer-events-none opacity-50' : ''}`}>
//             <NavigationMenu>
//               <NavigationMenuList>
//                 {/* Services Menu */}
//                 <NavigationMenuItem>
//                   <NavigationMenuTrigger className="text-gray-700 hover:text-[#502266] transition-colors">
//                     Services
//                   </NavigationMenuTrigger>
//                   <NavigationMenuContent>
//                     <div className="w-[35rem] max-h-[80vh] overflow-y-auto grid grid-cols-2 gap-4 p-6">
//                       {servicesMenu.map((service) => (
//                         <div
//                           key={`${service.name}${service.id}`}
//                           className="flex flex-col space-y-2"
//                         >
//                           <p className="font-semibold text-[#502266] mb-2 border-b border-gray-200 pb-1">
//                             {service.name}
//                           </p>
//                           {service["service_category_items"]?.map((item, index) => (
//                             <Link
//                               key={index}
//                               href={`/services/?categoryId=${item.id}`}
//                               className="text-gray-600 hover:text-[#FF7F00] hover:underline transition-colors text-sm"
//                             >
//                               {item.name}
//                             </Link>
//                           ))}
//                         </div>
//                       ))}
//                     </div>
//                   </NavigationMenuContent>
//                 </NavigationMenuItem>

//                 {/* Products Menu */}
//                 <NavigationMenuItem>
//                   <NavigationMenuTrigger className="text-gray-700 hover:text-[#502266] transition-colors">
//                     Products
//                   </NavigationMenuTrigger>
//                   <NavigationMenuContent>
//                     <div className="w-[35rem] max-h-[80vh] overflow-y-auto grid grid-cols-2 gap-4 p-6">
//                       {productsMenu.map((category) => (
//                         <div
//                           key={`${category.name}${category.id}`}
//                           className="flex flex-col space-y-2"
//                         >
//                           <p className="font-semibold text-[#502266] mb-2 border-b border-gray-200 pb-1">
//                             {category.name}
//                           </p>
//                           {category["product_categories"]?.map((item, index) => (
//                             <div key={index} className="flex items-center justify-between">
//                               <Link
//                                 href={`/products/?categoryId=${item.id}`}
//                                 className="text-gray-600 hover:text-[#FF7F00] hover:underline transition-colors text-sm flex-1"
//                               >
//                                 {item.name}
//                               </Link>
//                               {item["product_category_items"]?.length > 0 && (
//                                 <HoverCard>
//                                   <HoverCardTrigger>
//                                     <RiArrowDropDownLine className="hover:cursor-pointer text-2xl text-gray-400 hover:text-[#502266] transition-colors" />
//                                   </HoverCardTrigger>
//                                   <HoverCardContent className="w-56">
//                                     <div className="flex flex-col space-y-2">
//                                       {item["product_category_items"].map((subItem, subItemIndex) => (
//                                         <Link
//                                           key={subItemIndex}
//                                           href={`/products/?categoryId=${item.id}&subCategoryId=${subItem.id}`}
//                                           className="text-gray-600 hover:text-[#FF7F00] hover:underline transition-colors text-sm"
//                                         >
//                                           {subItem.name}
//                                         </Link>
//                                       ))}
//                                     </div>
//                                   </HoverCardContent>
//                                 </HoverCard>
//                               )}
//                             </div>
//                           ))}
//                         </div>
//                       ))}
//                     </div>
//                   </NavigationMenuContent>
//                 </NavigationMenuItem>
//               </NavigationMenuList>
//             </NavigationMenu>

//             {/* Additional Navigation Items */}
//             <div className="flex items-center space-x-4">
//               <Link
//                 href="/refer-earn"
//                 className="text-gray-700 hover:text-[#502266] transition-colors text-sm font-medium"
//               >
//                 Refer & Earn
//               </Link>
//               <Link
//                 href="/favorites"
//                 className="text-gray-600 hover:text-[#502266] transition-colors"
//                 title="Favorites"
//               >
//                 <Heart className="h-6 w-6" />
//               </Link>
//               <CartIcon />
//             </div>
//           </div>

//           {/* Desktop Auth Buttons */}
//           <div className={`hidden lg:flex items-center space-x-3 ${isModalOpen ? 'pointer-events-none opacity-50' : ''}`}>
//             <Button
//               className="border border-[#FFB46A] bg-white text-black hover:bg-[#FFB46A] hover:text-white transition-colors"
//               onClick={handleAuth}
//               variant="outline"
//             >
//               {isAuthenticated ? "Logout" : "Login"}
//             </Button>

//             <Button
//               onClick={handleOpenRole}
//               className="bg-[#502266] hover:bg-[#502266]/90 text-white"
//             >
//               {isAuthenticated ? "Dashboard" : "Join SphereServe"}
//             </Button>
//           </div>

//           {/* Mobile Menu */}
//           <Sheet>
//             <SheetTrigger asChild>
//               <Button variant="outline" size="icon" className="lg:hidden">
//                 <Menu className="h-6 w-6" />
//               </Button>
//             </SheetTrigger>
//             <SheetContent side="right" className="w-80">
//               <nav className="flex flex-col space-y-8">
//                 <Link href="/" className="flex justify-center">
//                   <Image
//                     src="/assets/images/logo.svg"
//                     alt="Logo"
//                     width={180}
//                     height={50}
//                     className="h-auto"
//                   />
//                 </Link>

//                 <div className="flex flex-col space-y-6 text-gray-700">
//                   <Link href="/services" className="hover:text-[#502266] transition-colors font-medium">
//                     Services
//                   </Link>
//                   <Link href="/products" className="hover:text-[#502266] transition-colors font-medium">
//                     Products
//                   </Link>
//                   <Link href="/refer-earn" className="hover:text-[#502266] transition-colors font-medium">
//                     Refer & Earn
//                   </Link>
//                   <Link href="/favorites" className="hover:text-[#502266] transition-colors">
//                     <div className="flex items-center gap-3">
//                       <Heart className="h-5 w-5" />
//                       <span className="font-medium">Favorites</span>
//                     </div>
//                   </Link>
//                   <Link href="/cart" className="hover:text-[#502266] transition-colors">
//                     <div className="flex items-center gap-3">
//                       <CartIcon />
//                       <span className="font-medium">Cart</span>
//                     </div>
//                   </Link>
//                 </div>

//                 <div className="flex flex-col space-y-3 pt-6 border-t border-gray-200">
//                   <Button
//                     onClick={handleAuth}
//                     variant="outline"
//                     className="border-[#FFB46A] border-2 text-black hover:bg-[#FFB46A] hover:text-white"
//                   >
//                     {isAuthenticated ? "Logout" : "Login"}
//                   </Button>

//                   <Button
//                     onClick={handleOpenRole}
//                     className="bg-[#502266] text-white hover:bg-[#502266]/90"
//                   >
//                     {isAuthenticated ? "Dashboard" : "Join SphereServe"}
//                   </Button>
//                 </div>
//               </nav>
//             </SheetContent>
//           </Sheet>
//         </div>
//       </header>

//       {/* Modal with Proper Overlay */}
//       <AnimatePresence>
//         {isModalOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
//             onClick={handleCloseModal}
//           >
//             <motion.div
//               onClick={(e) => e.stopPropagation()}
//               initial={{ opacity: 0, scale: 0.9, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.9, y: 20 }}
//               transition={{ duration: 0.3, ease: "easeOut" }}
//               className="bg-white w-full max-w-lg rounded-xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
//             >
//               {/* Close Button */}
//               <button
//                 onClick={handleCloseModal}
//                 className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10 bg-gray-100 hover:bg-gray-200 rounded-full p-2"
//               >
//                 <X className="h-5 w-5" />
//               </button>

//               {/* Modal Content */}
//               <div className="p-6">
//                 <RoleWithRedirect />
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }

// "use client";

// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { Menu, Heart, X, ChevronDown } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import RoleWithRedirect from "@/app/auth/register/_components/RoleWithRedirect";
// import CartIcon from "../CartIcon";
// import { useRouter } from "next/navigation";
// import { getProductMenu } from "@/actions/product";
// import { getServicesMenu } from "@/actions/service";
// import { useAuth } from "@/context/AuthContext";
// import { RiArrowDropDownLine } from "react-icons/ri";

// import {
//   HoverCard,
//   HoverCardContent,
//   HoverCardTrigger,
// } from "@/components/ui/hover-card";
// import { getUserType } from "@/config/utils";

// export default function Header() {
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [productsMenu, setProductsMenu] = useState<any[]>([]);
//   const [servicesMenu, setServicesMenu] = useState<any[]>([]);
//   const [isServicesOpen, setIsServicesOpen] = useState(false);
//   const [isProductsOpen, setIsProductsOpen] = useState(false);
//   const router = useRouter();
//   const { isAuthenticated, currentUser, logOut } = useAuth();

//   const handleOpenRole = () => {
//     if (!isAuthenticated) {
//       setModalOpen(!isModalOpen);
//     } else {
//       const type = getUserType(currentUser.user_type);
//       router.push(`/${type}/dashboard`);
//     }
//   };

//   const handleCloseModal = () => {
//     setModalOpen(false);
//   };

//   const handleAuth = () => {
//     console.log({ isAuthenticated });
//     if (isAuthenticated) {
//       logOut();
//     } else {
//       router.push("/auth/login");
//     }
//   };

//   const handleFetchProductMenu = async () => {
//     try {
//       const response = await getProductMenu();
//       if (response && response.ok) {
//         const data = await response.json();
//         setProductsMenu(data.data["Products Category Menu"] || []);
//       }
//     } catch (error) {
//       console.error("Error fetching product menu:", error);
//     }
//   };

//   const handleFetchServicesMenu = async () => {
//     try {
//       const response = await getServicesMenu();
//       if (response && response.ok) {
//         const data = await response.json();
//         setServicesMenu(data.data["Service Category Menu"] || []);
//       }
//     } catch (error) {
//       console.error("Error fetching services menu:", error);
//     }
//   };

//   // Close all popovers when modal opens
//   const closeAllPopovers = () => {
//     setIsServicesOpen(false);
//     setIsProductsOpen(false);
//   };

//   useEffect(() => {
//     handleFetchProductMenu();
//     handleFetchServicesMenu();
//   }, []);

//   // Prevent body scroll when modal is open and close popovers
//   useEffect(() => {
//     if (isModalOpen) {
//       document.body.style.overflow = "hidden";
//       closeAllPopovers();
//     } else {
//       document.body.style.overflow = "unset";
//     }

//     // Cleanup function to reset body overflow
//     return () => {
//       document.body.style.overflow = "unset";
//     };
//   }, [isModalOpen]);

//   return (
//     <>
//       <header className="fixed top-0 left-0 w-full bg-white shadow-lg z-40">
//         <div className="relative container mx-auto px-4 h-20 md:h-24 flex items-center justify-between">
//           {/* Logo */}
//           <div className="flex items-center">
//             <Link href="/" className="mr-4">
//               <Image
//                 src="/assets/images/logo.svg"
//                 alt="Logo"
//                 width={220}
//                 height={60}
//                 className="h-auto"
//               />
//             </Link>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden lg:flex items-center space-x-6">
//             {/* Services Popover */}
//             <Popover
//               open={isServicesOpen && !isModalOpen}
//               onOpenChange={setIsServicesOpen}
//             >
//               <PopoverTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   className="text-gray-700 hover:text-[#502266] transition-colors font-medium flex items-center gap-1"
//                   disabled={isModalOpen}
//                 >
//                   Services
//                   <ChevronDown className="h-4 w-4" />
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent
//                 className="w-[600px] max-h-[80vh] overflow-y-auto p-0"
//                 side="bottom"
//                 align="start"
//               >
//                 <div className="grid grid-cols-2 gap-4 p-6">
//                   {servicesMenu.map((service) => (
//                     <div
//                       key={`${service.name}${service.id}`}
//                       className="flex flex-col space-y-2"
//                     >
//                       <p className="font-semibold text-[#502266] mb-2 border-b border-gray-200 pb-1">
//                         {service.name}
//                       </p>
//                       {service["service_category_items"]?.map((item, index) => (
//                         <Link
//                           key={index}
//                           href={`/services/?categoryId=${item.id}`}
//                           className="text-gray-600 hover:text-[#FF7F00] hover:underline transition-colors text-sm"
//                           onClick={() => setIsServicesOpen(false)}
//                         >
//                           {item.name}
//                         </Link>
//                       ))}
//                     </div>
//                   ))}
//                 </div>
//               </PopoverContent>
//             </Popover>

//             {/* Products Popover */}
//             <Popover
//               open={isProductsOpen && !isModalOpen}
//               onOpenChange={setIsProductsOpen}
//             >
//               <PopoverTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   className="text-gray-700 hover:text-[#502266] transition-colors font-medium flex items-center gap-1"
//                   disabled={isModalOpen}
//                 >
//                   Products
//                   <ChevronDown className="h-4 w-4" />
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent
//                 className="w-[600px] max-h-[80vh] overflow-y-auto p-0"
//                 side="bottom"
//                 align="start"
//               >
//                 <div className="grid grid-cols-2 gap-4 p-6">
//                   {productsMenu.map((category) => (
//                     <div
//                       key={`${category.name}${category.id}`}
//                       className="flex flex-col space-y-2"
//                     >
//                       <p className="font-semibold text-[#502266] mb-2 border-b border-gray-200 pb-1">
//                         {category.name}
//                       </p>
//                       {category["product_categories"]?.map((item, index) => (
//                         <div
//                           key={index}
//                           className="flex items-center justify-between"
//                         >
//                           <Link
//                             href={`/products/?categoryId=${item.id}`}
//                             className="text-gray-600 hover:text-[#FF7F00] hover:underline transition-colors text-sm flex-1"
//                             onClick={() => setIsProductsOpen(false)}
//                           >
//                             {item.name}
//                           </Link>
//                           {item["product_category_items"]?.length > 0 && (
//                             <HoverCard>
//                               <HoverCardTrigger>
//                                 <RiArrowDropDownLine className="hover:cursor-pointer text-2xl text-gray-400 hover:text-[#502266] transition-colors" />
//                               </HoverCardTrigger>
//                               <HoverCardContent className="w-56">
//                                 <div className="flex flex-col space-y-2">
//                                   {item["product_category_items"].map(
//                                     (subItem, subItemIndex) => (
//                                       <Link
//                                         key={subItemIndex}
//                                         href={`/products/?categoryId=${item.id}&subCategoryId=${subItem.id}`}
//                                         className="text-gray-600 hover:text-[#FF7F00] hover:underline transition-colors text-sm"
//                                         onClick={() => setIsProductsOpen(false)}
//                                       >
//                                         {subItem.name}
//                                       </Link>
//                                     )
//                                   )}
//                                 </div>
//                               </HoverCardContent>
//                             </HoverCard>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   ))}
//                 </div>
//               </PopoverContent>
//             </Popover>

//             {/* Additional Navigation Items */}
//             <div className="flex items-center space-x-4">
//               <Link
//                 href="/refer-earn"
//                 className="text-gray-700 hover:text-[#502266] transition-colors text-sm font-medium"
//               >
//                 Refer & Earn
//               </Link>
//               <Link
//                 href="/favorites"
//                 className="text-gray-600 hover:text-[#502266] transition-colors"
//                 title="Favorites"
//               >
//                 <Heart className="h-6 w-6" />
//               </Link>
//               <CartIcon />
//             </div>
//           </div>

//           {/* Desktop Auth Buttons */}
//           <div className="hidden lg:flex items-center space-x-3">
//             <Button
//               className="border border-[#FFB46A] bg-white text-black hover:bg-[#FFB46A] hover:text-white transition-colors"
//               onClick={handleAuth}
//               variant="outline"
//               disabled={isModalOpen}
//             >
//               {isAuthenticated ? "Logout" : "Login"}
//             </Button>

//             <Button
//               onClick={handleOpenRole}
//               className="bg-[#502266] hover:bg-[#502266]/90 text-white"
//               disabled={isModalOpen}
//             >
//               {isAuthenticated ? "Dashboard" : "Join SphereServe"}
//             </Button>
//           </div>

//           {/* Mobile Menu */}
//           <Sheet>
//             <SheetTrigger asChild>
//               <Button
//                 variant="outline"
//                 size="icon"
//                 className="lg:hidden"
//                 disabled={isModalOpen}
//               >
//                 <Menu className="h-6 w-6" />
//               </Button>
//             </SheetTrigger>
//             <SheetContent side="right" className="w-80">
//               <nav className="flex flex-col space-y-8">
//                 <Link href="/" className="flex justify-center">
//                   <Image
//                     src="/assets/images/logo.svg"
//                     alt="Logo"
//                     width={180}
//                     height={50}
//                     className="h-auto"
//                   />
//                 </Link>

//                 <div className="flex flex-col space-y-6 text-gray-700">
//                   <Link
//                     href="/services"
//                     className="hover:text-[#502266] transition-colors font-medium"
//                   >
//                     Services
//                   </Link>
//                   <Link
//                     href="/products"
//                     className="hover:text-[#502266] transition-colors font-medium"
//                   >
//                     Products
//                   </Link>
//                   <Link
//                     href="/refer-earn"
//                     className="hover:text-[#502266] transition-colors font-medium"
//                   >
//                     Refer & Earn
//                   </Link>
//                   <Link
//                     href="/favorites"
//                     className="hover:text-[#502266] transition-colors"
//                   >
//                     <div className="flex items-center gap-3">
//                       <Heart className="h-5 w-5" />
//                       <span className="font-medium">Favorites</span>
//                     </div>
//                   </Link>
//                   <Link
//                     href="/cart"
//                     className="hover:text-[#502266] transition-colors"
//                   >
//                     <div className="flex items-center gap-3">
//                       <CartIcon />
//                       <span className="font-medium">Cart</span>
//                     </div>
//                   </Link>
//                 </div>

//                 <div className="flex flex-col space-y-3 pt-6 border-t border-gray-200">
//                   <Button
//                     onClick={handleAuth}
//                     variant="outline"
//                     className="border-[#FFB46A] border-2 text-black hover:bg-[#FFB46A] hover:text-white"
//                   >
//                     {isAuthenticated ? "Logout" : "Login"}
//                   </Button>

//                   <Button
//                     onClick={handleOpenRole}
//                     className="bg-[#502266] text-white hover:bg-[#502266]/90"
//                   >
//                     {isAuthenticated ? "Dashboard" : "Join SphereServe"}
//                   </Button>
//                 </div>
//               </nav>
//             </SheetContent>
//           </Sheet>
//         </div>
//       </header>

//       {/* Modal with Proper Overlay */}
//       <AnimatePresence>
//         {isModalOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
//             onClick={handleCloseModal}
//           >
//             <motion.div
//               onClick={(e) => e.stopPropagation()}
//               initial={{ opacity: 0, scale: 0.9, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.9, y: 20 }}
//               transition={{ duration: 0.3, ease: "easeOut" }}
//               className="bg-white w-full max-w-lg rounded-xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
//             >
//               {/* Close Button */}
//               <button
//                 onClick={handleCloseModal}
//                 className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10 bg-gray-100 hover:bg-gray-200 rounded-full p-2"
//               >
//                 <X className="h-5 w-5" />
//               </button>

//               {/* Modal Content */}
//               <div className="p-6">
//                 <RoleWithRedirect />
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, Heart, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import RoleWithRedirect from "@/app/auth/register/_components/RoleWithRedirect";
import CartIcon from "../CartIcon";
import { useRouter } from "next/navigation";
import { getProductMenu } from "@/actions/product";
import { getServicesMenu } from "@/actions/service";
import { useAuth } from "@/context/AuthContext";
import { RiArrowDropDownLine } from "react-icons/ri";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { getUserType } from "@/config/utils";

export default function Header() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [productsMenu, setProductsMenu] = useState<any[]>([]);
  const [servicesMenu, setServicesMenu] = useState<any[]>([]);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const router = useRouter();
  const { isAuthenticated, currentUser, logOut } = useAuth();

  const handleOpenRole = () => {
    if (!isAuthenticated) {
      setModalOpen(!isModalOpen);
    } else {
      const type = getUserType(currentUser.user_type);
      router.push(`/${type}/dashboard`);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleAuth = () => {
    console.log({ isAuthenticated });
    if (isAuthenticated) {
      logOut();
    } else {
      router.push("/auth/login");
    }
  };

  const handleFetchProductMenu = async () => {
    try {
      const response = await getProductMenu();
      if (response && response.ok) {
        const data = await response.json();
        setProductsMenu(data.data["Products Category Menu"] || []);
      }
    } catch (error) {
      console.error("Error fetching product menu:", error);
    }
  };

  const handleFetchServicesMenu = async () => {
    try {
      const response = await getServicesMenu();
      if (response && response.ok) {
        const data = await response.json();
        setServicesMenu(data.data["Service Category Menu"] || []);
      }
    } catch (error) {
      console.error("Error fetching services menu:", error);
    }
  };

  // Close all popovers when modal opens
  const closeAllPopovers = () => {
    setIsServicesOpen(false);
    setIsProductsOpen(false);
  };

  useEffect(() => {
    handleFetchProductMenu();
    handleFetchServicesMenu();
  }, []);

  // Prevent body scroll when modal is open and close popovers
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
      closeAllPopovers();
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to reset body overflow
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white shadow-lg z-40">
        <div className="relative container mx-auto px-4 h-20 md:h-24 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="mr-4">
              <Image
                src="/assets/images/logo.svg"
                alt="Logo"
                width={220}
                height={60}
                className="h-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Services Popover */}
            <Popover
              open={isServicesOpen && !isModalOpen}
              onOpenChange={setIsServicesOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-[#502266] transition-colors font-medium flex items-center gap-1"
                  disabled={isModalOpen}
                >
                  Services
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[600px] max-h-[80vh] overflow-y-auto p-0 z-50"
                side="bottom"
                align="start"
              >
                <div className="grid grid-cols-2 gap-4 p-6">
                  {servicesMenu.map((service) => (
                    <div
                      key={`${service.name}${service.id}`}
                      className="flex flex-col space-y-2"
                    >
                      <p className="font-semibold text-[#502266] mb-2 border-b border-gray-200 pb-1">
                        {service.name}
                      </p>
                      {service["service_category_items"]?.map((item, index) => (
                        <Link
                          key={index}
                          href={`/services/?categoryId=${item.id}`}
                          className="text-gray-600 hover:text-[#FF7F00] hover:underline transition-colors text-sm"
                          onClick={() => setIsServicesOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Products Popover */}
            <Popover
              open={isProductsOpen && !isModalOpen}
              onOpenChange={setIsProductsOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-[#502266] transition-colors font-medium flex items-center gap-1"
                  disabled={isModalOpen}
                >
                  Products
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[600px] max-h-[80vh] overflow-y-auto p-0 z-50"
                side="bottom"
                align="start"
              >
                <div className="grid grid-cols-2 gap-4 p-6">
                  {productsMenu.map((category) => (
                    <div
                      key={`${category.name}${category.id}`}
                      className="flex flex-col space-y-2"
                    >
                      <p className="font-semibold text-[#502266] mb-2 border-b border-gray-200 pb-1">
                        {category.name}
                      </p>
                      {category["product_categories"]?.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <Link
                            href={`/products/?categoryId=${item.id}`}
                            className="text-gray-600 hover:text-[#FF7F00] hover:underline transition-colors text-sm flex-1"
                            onClick={() => setIsProductsOpen(false)}
                          >
                            {item.name}
                          </Link>
                          {item["product_category_items"]?.length > 0 && (
                            <HoverCard>
                              <HoverCardTrigger>
                                <RiArrowDropDownLine className="hover:cursor-pointer text-2xl text-gray-400 hover:text-[#502266] transition-colors" />
                              </HoverCardTrigger>
                              <HoverCardContent className="w-56">
                                <div className="flex flex-col space-y-2">
                                  {item["product_category_items"].map(
                                    (subItem, subItemIndex) => (
                                      <Link
                                        key={subItemIndex}
                                        href={`/products/?categoryId=${item.id}&subCategoryId=${subItem.id}`}
                                        className="text-gray-600 hover:text-[#FF7F00] hover:underline transition-colors text-sm"
                                        onClick={() => setIsProductsOpen(false)}
                                      >
                                        {subItem.name}
                                      </Link>
                                    )
                                  )}
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Additional Navigation Items */}
            <div className="flex items-center space-x-4">
              <Link
                href="/refer-earn"
                className="text-gray-700 hover:text-[#502266] transition-colors text-sm font-medium"
              >
                Refer & Earn
              </Link>
              <Link
                href="/favorites"
                className="text-gray-600 hover:text-[#502266] transition-colors"
                title="Favorites"
              >
                <Heart className="h-6 w-6" />
              </Link>
              <CartIcon />
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Button
              className="border border-[#FFB46A] bg-white text-black hover:bg-[#FFB46A] hover:text-white transition-colors"
              onClick={handleAuth}
              variant="outline"
              disabled={isModalOpen}
            >
              {isAuthenticated ? "Logout" : "Login"}
            </Button>

            <Button
              onClick={handleOpenRole}
              className="bg-[#502266] hover:bg-[#502266]/90 text-white"
              disabled={isModalOpen}
            >
              {isAuthenticated ? "Dashboard" : "Join SphereServe"}
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                disabled={isModalOpen}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <nav className="flex flex-col space-y-8">
                <Link href="/" className="flex justify-center">
                  <Image
                    src="/assets/images/logo.svg"
                    alt="Logo"
                    width={180}
                    height={50}
                    className="h-auto"
                  />
                </Link>

                <div className="flex flex-col space-y-6 text-gray-700">
                  <Link
                    href="/services"
                    className="hover:text-[#502266] transition-colors font-medium"
                  >
                    Services
                  </Link>
                  <Link
                    href="/products"
                    className="hover:text-[#502266] transition-colors font-medium"
                  >
                    Products
                  </Link>
                  <Link
                    href="/refer-earn"
                    className="hover:text-[#502266] transition-colors font-medium"
                  >
                    Refer & Earn
                  </Link>
                  <Link
                    href="/favorites"
                    className="hover:text-[#502266] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Heart className="h-5 w-5" />
                      <span className="font-medium">Favorites</span>
                    </div>
                  </Link>
                  <Link
                    href="/cart"
                    className="hover:text-[#502266] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <CartIcon />
                      <span className="font-medium">Cart</span>
                    </div>
                  </Link>
                </div>

                <div className="flex flex-col space-y-3 pt-6 border-t border-gray-200">
                  <Button
                    onClick={handleAuth}
                    variant="outline"
                    className="border-[#FFB46A] border-2 text-black hover:bg-[#FFB46A] hover:text-white"
                  >
                    {isAuthenticated ? "Logout" : "Login"}
                  </Button>

                  <Button
                    onClick={handleOpenRole}
                    className="bg-[#502266] text-white hover:bg-[#502266]/90"
                  >
                    {isAuthenticated ? "Dashboard" : "Join SphereServe"}
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Custom Backdrop for Navigation Popovers */}
      {(isServicesOpen || isProductsOpen) && !isModalOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={closeAllPopovers}
        />
      )}

      {/* Modal with Proper Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white w-full max-w-lg rounded-xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10 bg-gray-100 hover:bg-gray-200 rounded-full p-2"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Modal Content */}
              <div className="p-6">
                <RoleWithRedirect />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
