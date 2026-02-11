import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname} = useLocation();

    // Forcing window to top whenever the URL path changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}