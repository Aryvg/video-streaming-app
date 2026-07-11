export async function logoutUser(): Promise<void> {
  try {
    const res = await fetch("https://videostreamingbackend-dxgv.onrender.com/logout", {
      method: "GET",
      credentials: "include",
    });

    if (res.ok) {
      window.location.href = "/";
      return;
    }

    console.error("Logout failed", res.status, res.statusText);
  } catch (err) {
    console.error(err);
  }
}

//in mainpage.tsx, we have <button type="button" className="studio-logout-btn" onClick={() => void logoutUser()}>