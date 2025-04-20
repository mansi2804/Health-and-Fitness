import React, { useEffect } from 'react';

const GoogleTranslate = () => {
  useEffect(() => {
    // Function to remove Google translate elements
    const removeGoogleElements = () => {
      const googleElements = [
        '.goog-te-banner-frame',
        '.goog-logo-link',
        '#google_translate_element',
        '.goog-te-balloon-frame'
      ];

      googleElements.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          if (el.parentNode) {
            el.parentNode.removeChild(el);
          }
        });
      });
    };

    // Load Google Translate script
    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    // Initialize Google Translate
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,hi,ta,te,ml,bn,kn,mr,gu',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      }, 'google-translate-element');

      // Remove Google elements after initialization
      setTimeout(removeGoogleElements, 100);
    };

    // Custom CSS to suppress Google branding
    const style = document.createElement('style');
    style.innerHTML = `
      .goog-te-banner-frame, 
      .goog-logo-link, 
      .goog-te-balloon-frame {
        display: none !important;
        visibility: hidden !important;
        position: absolute !important;
        left: -9999px !important;
        width: 0 !important;
        height: 0 !important;
        overflow: hidden !important;
        opacity: 0 !important;
      }

      .goog-te-gadget {
        color: transparent !important;
      }

      .goog-te-gadget-simple {
        border: none !important;
        background: none !important;
      }

      .goog-te-menu-value {
        color: black !important;
        font-family: inherit !important;
      }
    `;
    document.head.appendChild(style);

    // MutationObserver to continuously remove Google elements
    const observer = new MutationObserver(removeGoogleElements);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });

    // Cleanup function
    return () => {
      observer.disconnect();
      document.body.removeChild(script);
      document.head.removeChild(style);
      delete window.googleTranslateElementInit;
    };
  }, []);

  return (
    <div className="translate-container">
      <div 
        id="google-translate-element" 
        className="translate-selector"
      />
    </div>
  );
};

export default GoogleTranslate;