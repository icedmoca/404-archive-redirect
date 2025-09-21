// JavaScript for 404 page - separate file to comply with CSP

document.addEventListener('DOMContentLoaded', function() {
    // Get the original URL from query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const originalUrl = urlParams.get('url');
    
    // Update the display
    const originalUrlElement = document.getElementById('original-url');
    const waybackLink = document.getElementById('wayback-link');
    
    console.log('Original URL from params:', originalUrl);
    console.log('Current URL:', window.location.href);
    
        if (originalUrl) {
            originalUrlElement.textContent = originalUrl;
            
            // Check Wayback Machine captures
            checkWaybackCaptures(originalUrl);
        } else {
            originalUrlElement.textContent = 'No URL provided';
        }
    
    // Enhanced Go Back functionality
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            console.log('Go back clicked');
            console.log('History length:', window.history.length);
            console.log('Document referrer:', document.referrer);
            
            // First try: Use document.referrer if available and not empty
            if (document.referrer && document.referrer !== '' && !document.referrer.includes('chrome-extension://')) {
                console.log('Using document.referrer:', document.referrer);
                window.location.href = document.referrer;
                return;
            }
            
            // Second try: Go back multiple steps to skip the 404 page itself
            if (window.history.length > 2) {
                console.log('Going back 2 steps');
                window.history.go(-2);
            } else if (window.history.length > 1) {
                console.log('Going back 1 step');
                window.history.back();
            } else {
                // Third try: Check if we can use the original URL as a fallback
                if (originalUrl && originalUrl !== window.location.href) {
                    console.log('Using original URL as fallback:', originalUrl);
                    window.location.href = originalUrl;
                } else {
                    // Final fallback: go to a safe page
                    console.log('No history available, redirecting to Google');
                    window.location.href = 'https://www.google.com';
                }
            }
        });
    }
    
    // Copy URL functionality
    const copyBtn = document.getElementById('copy-btn');
    if (copyBtn && originalUrl) {
        copyBtn.addEventListener('click', async function() {
            try {
                await navigator.clipboard.writeText(originalUrl);
                console.log('URL copied to clipboard:', originalUrl);
                
                // Visual feedback
                copyBtn.classList.add('copied');
                copyBtn.querySelector('.copy-icon').textContent = '✓';
                
                // Reset after 2 seconds
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    copyBtn.querySelector('.copy-icon').textContent = '📋';
                }, 2000);
                
            } catch (err) {
                console.error('Failed to copy URL:', err);
                
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = originalUrl;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    console.log('URL copied using fallback method');
                    
                    // Visual feedback
                    copyBtn.classList.add('copied');
                    copyBtn.querySelector('.copy-icon').textContent = '✓';
                    
                    setTimeout(() => {
                        copyBtn.classList.remove('copied');
                        copyBtn.querySelector('.copy-icon').textContent = '📋';
                    }, 2000);
                } catch (fallbackErr) {
                    console.error('Fallback copy also failed:', fallbackErr);
                }
                document.body.removeChild(textArea);
            }
        });
    } else if (copyBtn) {
        // Hide copy button if no URL is available
        copyBtn.style.display = 'none';
    }
    
    // Archive services functionality
    const archiveLinks = document.querySelectorAll('.archive-link');
    archiveLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const service = this.getAttribute('data-service');
            let archiveUrl = '';
            
            if (!originalUrl) {
                alert('No URL available to archive');
                return;
            }
            
            // Build archive URLs based on service
            switch (service) {
                case 'wayback':
                    archiveUrl = `https://web.archive.org/web/*/${originalUrl}`;
                    break;
                case 'ghostarchive':
                    archiveUrl = `https://ghostarchive.org/search?term=${encodeURIComponent(originalUrl)}`;
                    break;
                case 'ukwa':
                    archiveUrl = `https://www.webarchive.org.uk/wayback/archive/*/${originalUrl}`;
                    break;
                case 'loc':
                    archiveUrl = `https://www.loc.gov/search/?q=${encodeURIComponent(originalUrl)}`;
                    break;
                case 'commoncrawl':
                    archiveUrl = `https://commoncrawl.org/search?q=${encodeURIComponent(originalUrl)}`;
                    break;
                default:
                    console.error('Unknown archive service:', service);
                    return;
            }
            
            console.log(`Opening ${service} for URL:`, originalUrl);
            console.log('Archive URL:', archiveUrl);
            
            // Open in new tab
            window.open(archiveUrl, '_blank');
        });
    });
    
    // Copy archive link functionality
    const copyLinkBtns = document.querySelectorAll('.copy-link-btn');
    copyLinkBtns.forEach(btn => {
        btn.addEventListener('click', async function(e) {
            e.preventDefault();
            const service = this.getAttribute('data-service');
            let archiveUrl = '';
            
            if (!originalUrl) {
                alert('No URL available to archive');
                return;
            }
            
            // Build archive URLs based on service (same logic as archive links)
            switch (service) {
                case 'wayback':
                    archiveUrl = `https://web.archive.org/web/*/${originalUrl}`;
                    break;
                case 'ghostarchive':
                    archiveUrl = `https://ghostarchive.org/search?term=${encodeURIComponent(originalUrl)}`;
                    break;
                case 'ukwa':
                    archiveUrl = `https://www.webarchive.org.uk/wayback/archive/*/${originalUrl}`;
                    break;
                case 'loc':
                    archiveUrl = `https://www.loc.gov/search/?q=${encodeURIComponent(originalUrl)}`;
                    break;
                case 'commoncrawl':
                    archiveUrl = `https://commoncrawl.org/search?q=${encodeURIComponent(originalUrl)}`;
                    break;
                default:
                    console.error('Unknown archive service:', service);
                    return;
            }
            
            try {
                await navigator.clipboard.writeText(archiveUrl);
                console.log(`Copied ${service} URL to clipboard:`, archiveUrl);
                
                // Visual feedback
                this.classList.add('copied');
                this.textContent = '✓';
                
                // Reset after 2 seconds
                setTimeout(() => {
                    this.classList.remove('copied');
                    this.textContent = '📋';
                }, 2000);
                
            } catch (err) {
                console.error('Failed to copy archive URL:', err);
                
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = archiveUrl;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    console.log('Archive URL copied using fallback method');
                    
                    // Visual feedback
                    this.classList.add('copied');
                    this.textContent = '✓';
                    
                    setTimeout(() => {
                        this.classList.remove('copied');
                        this.textContent = '📋';
                    }, 2000);
                } catch (fallbackErr) {
                    console.error('Fallback copy also failed:', fallbackErr);
                }
                document.body.removeChild(textArea);
            }
        });
    });
    
    // Function to check Wayback Machine captures
    async function checkWaybackCaptures(url) {
        try {
            const waybackApiUrl = `https://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(url)}&output=json&limit=0`;
            console.log('Checking Wayback captures for:', url);
            
            const response = await fetch(waybackApiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            const captureCount = data.length - 1; // Subtract 1 for the header row
            
            console.log(`Found ${captureCount} captures for ${url}`);
            
            if (captureCount > 0) {
                const badge = document.getElementById('wayback-badge');
                if (badge) {
                    badge.textContent = `+${captureCount}`;
                    badge.style.display = 'inline-block';
                }
            }
            
        } catch (error) {
            console.log('Error checking Wayback captures:', error);
            // Silently fail - don't show badge if API fails
        }
    }
});