import { setAccessToken } from "../mainPage/auth";

export async function checkAuthOnLoad(): Promise<boolean> {
  try {
    const res = await fetch("https://videostreamingbackend-dxgv.onrender.com/refresh", {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      return false;
    }

    const data = await res.json().catch(() => null);
    if (data?.accessToken) {
      setAccessToken(data.accessToken);
      return true;
    }

    return false;
  } catch (e) {
    console.error("Auth check failed", e);
    return false;
  }
}
//in homepage.tsx, we have
/**
 useEffect(() => {
     const verifySession = async () => {
       const isAuthenticated = await checkAuthOnLoad();
 
       if (isAuthenticated) {
         navigate('/mainPage');
       }
     };
 
     void verifySession();
 
   }, []);
 */