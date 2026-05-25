import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import './TopProgressBar.css'; // We will create this for custom colors

// Matikan lingkaran spinner di pojok kanan atas bawaan nprogress
NProgress.configure({ showSpinner: false });

const TopProgressBar = () => {
  const location = useLocation();

  useEffect(() => {
    NProgress.start();
    // Finish the progress bar after a tiny delay to simulate smooth loading
    const timer = setTimeout(() => {
      NProgress.done();
    }, 300);

    return () => {
        clearTimeout(timer);
        NProgress.start();
    };
  }, [location.pathname]);

  return null;
};

export default TopProgressBar;
