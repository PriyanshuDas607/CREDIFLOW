document.addEventListener('DOMContentLoaded', () => {
    // Login Form Handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = loginForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            
            // Artificial delay to simulate API call
            btn.innerText = 'Verifying...';
            btn.disabled = true;

            setTimeout(() => {
                // Mock success
                window.location.href = 'dashboard.html';
            }, 1500);
        });
    }

    // Signup Form Handling
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = signupForm.querySelector('button[type="submit"]');
            
            // Basic validation check
            const consent = document.getElementById('consent');
            if (!consent.checked) {
                alert("Please provide consent to proceed.");
                return;
            }

            btn.innerText = 'Creating Account...';
            btn.disabled = true;

            setTimeout(() => {
                // Mock success
                window.location.href = 'dashboard.html';
            }, 2000);
        });
    }
});
