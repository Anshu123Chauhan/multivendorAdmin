import React, { useEffect, useState } from 'react';

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPopup, setShowInstallPopup] = useState(false);

  useEffect(() => {
    // Check if the app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) {
      setShowInstallPopup(false);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPopup(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the PWA installation');
      }
      setDeferredPrompt(null);
      setShowInstallPopup(false);
    }
  };

  return (
    <>
      {showInstallPopup && (
        <div className="fixed top-0 right-0 w-full max-h-12 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white pt-10 pb-2 rounded-lg shadow-lg max-w-sm text-center w-full relative">
            <h2 className="text-lg font-semibold mb-4">Install Our App</h2>
            {/* <p className="text-sm">Get the full experience by installing our app on your device.</p> */}
            <button
              onClick={handleInstallClick}
              className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600"
            >
              Install
            </button>
          </div>
          <button
              onClick={() => setShowInstallPopup(false)}
              className="text-gray-500 mt-4 absolute top-3 right-8"
            >
              X
            </button>
        </div>
      )}
    </>
  );
};

export default InstallPWA;
