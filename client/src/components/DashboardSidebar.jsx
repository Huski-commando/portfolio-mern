import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import { Sidebar } from "flowbite-react";
import { HiUser } from "react-icons/hi";
import { FaSignOutAlt, FaUsers } from "react-icons/fa";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { HiDocumentText } from "react-icons/hi2";
import { MdDashboard } from "react-icons/md";

const DashboardSidebar = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const { currentUser, isLoading } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  // console.log(currentUser);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    // console.log(tabFromUrl);

    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  // sign out
  const handleSignOut = async () => {
    try {
      const res = await fetch(`/api/user/signout`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-2">
          {currentUser?.isAdmin && (
            <Link to="/dashboard?tab=dash">
              <Sidebar.Item active={tab === "dash"} icon={MdDashboard} as="div">
                Dashboard
              </Sidebar.Item>
            </Link>
          )}

          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={
                currentUser.isAdmin
                  ? "Admin"
                  : currentUser.isEditor
                  ? "Editor"
                  : "User"
              }
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser.isAdmin || currentUser.isEditor ? (
            <Link to="/dashboard?tab=posts">
              <Sidebar.Item
                active={tab === "posts"}
                icon={HiDocumentText}
                as="div"
              >
                Posts
              </Sidebar.Item>
            </Link>
          ) : (
            <Navigate to="/dashboard?tab=profile" />
          )}

          {currentUser.isAdmin ? (
            <>
              <Link to="/dashboard?tab=users">
                <Sidebar.Item active={tab === "users"} icon={FaUsers} as="div">
                  Users
                </Sidebar.Item>
              </Link>
            </>
          ) : (
            <Navigate to="/dashboard?tab=profile" />
          )}
          <Sidebar.Item
            icon={FaSignOutAlt}
            className="cursor-pointer"
            onClick={handleSignOut}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashboardSidebar;
