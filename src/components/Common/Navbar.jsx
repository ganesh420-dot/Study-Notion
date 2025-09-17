import { useEffect, useState } from "react"
import {
  AiOutlineClose,
  AiOutlineMenu,
  AiOutlineShoppingCart,
} from "react-icons/ai"
import { BsChevronDown } from "react-icons/bs"
import { useSelector } from "react-redux"
import { Link, matchPath, useLocation } from "react-router-dom"

import logo from "../../assets/Logo/Logo-Full-Light.png"
import { NavbarLinks } from "../../data/navbar-links"
import { apiConnector } from "../../services/apiConnector"
import { categories } from "../../services/apis"
import { ACCOUNT_TYPE } from "../../utils/constants"
import ProfileDropdown from "../core/Auth/ProfileDropdown"

function Navbar() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { totalItems } = useSelector((state) => state.cart)
  const location = useLocation()

  const [subLinks, setSubLinks] = useState([])
  const [loading, setLoading] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false) // 👈 state for mobile menu

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        setSubLinks(res.data.data)
      } catch (error) {
        console.log("Could not fetch Categories.", error)
      }
      setLoading(false)
    })()
  }, [])

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  return (
    <div
      className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${
        location.pathname !== "/" ? "bg-richblack-800" : ""
      } transition-all duration-200`}
    >
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <div
                    className={`group relative flex cursor-pointer items-center gap-1 ${
                      matchRoute("/catalog/:catalogName")
                        ? "text-yellow-25"
                        : "text-richblack-25"
                    }`}
                  >
                    <p>{link.title}</p>
                    <BsChevronDown />
                    {/* dropdown */}
                    <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                      {loading ? (
                        <p className="text-center">Loading...</p>
                      ) : subLinks?.length ? (
                        subLinks
                          ?.filter((subLink) => subLink?.courses?.length > 0)
                          ?.map((subLink, i) => (
                            <Link
                              to={`/catalog/${subLink.name
                                .split(" ")
                                .join("-")
                                .toLowerCase()}`}
                              className="rounded-lg py-2 pl-2 hover:bg-richblack-50"
                              key={i}
                            >
                              {subLink.name}
                            </Link>
                          ))
                      ) : (
                        <p className="text-center">No Courses Found</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${
                        matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop Right Section */}
        <div className="hidden items-center gap-x-4 md:flex">
          {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center rounded-full bg-richblack-600 text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null && (
            <>
              <Link to="/login">
                <button className="rounded-md border border-richblack-700 bg-richblack-800 px-3 py-1 text-richblack-100">
                  Log in
                </button>
              </Link>
              <Link to="/signup">
                <button className="rounded-md border border-richblack-700 bg-richblack-800 px-3 py-1 text-richblack-100">
                  Sign up
                </button>
              </Link>
            </>
          )}
          {token !== null && <ProfileDropdown />}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mr-4 md:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? (
            <AiOutlineClose fontSize={24} fill="#AFB2BF" />
          ) : (
            <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
          )}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <div className="absolute left-0 top-14 z-50 w-full bg-richblack-800 px-6 py-4 md:hidden">
          <ul className="flex flex-col gap-4 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                <Link
                  to={link?.path}
                  className="block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.title}
                </Link>
              </li>
            ))}
            {!token && (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="block"
                >
                  Sign up
                </Link>
              </>
            )}
            {token && <ProfileDropdown />}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Navbar
