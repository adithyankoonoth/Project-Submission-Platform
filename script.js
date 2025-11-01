// ===== SUPABASE CONFIGURATION =====
// REPLACE THESE WITH YOUR ACTUAL CREDENTIALS FROM SUPABASE DASHBOARD
const SUPABASE_URL = 
const SUPABASE_KEY = 
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let signupEmail = '';

// ===== TOGGLE ADMIN DROPDOWN =====
function toggleAdminMenu() {
    const dropdown = document.getElementById('adminDropdown');
    dropdown.classList.toggle('show');
}

// Close dropdown when clicking outside
window.onclick = function(event) {
    if (!event.target.matches('.settings-icon') && !event.target.matches('.settings-icon *')) {
        const dropdown = document.getElementById('adminDropdown');
        if (dropdown && dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        }
    }
}

// ===== SHOW ADMIN LOGIN =====
function showAdminLogin() {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelector('.tabs').style.display = 'none';
    document.getElementById('adminTab').classList.add('active');
    document.getElementById('adminDropdown').classList.remove('show');
    document.getElementById('error-msg').style.display = 'none';
}

// ===== BACK TO MAIN LOGIN =====
function backToMain() {
    document.querySelector('.tabs').style.display = 'flex';
    showTab('login');
}

// ===== TAB SWITCHING =====
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (tabName === 'login') {
        document.getElementById('loginTab').classList.add('active');
        document.querySelectorAll('.tab-btn')[0].classList.add('active');
    } else {
        document.getElementById('signupTab').classList.add('active');
        document.querySelectorAll('.tab-btn')[1].classList.add('active');
    }
    
    document.getElementById('error-msg').style.display = 'none';
    if (document.getElementById('success-msg')) {
        document.getElementById('success-msg').style.display = 'none';
    }
}

// ===== REGULAR USER LOGIN =====
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            
            if (error) throw error;
            
            const userRole = data.user.user_metadata.role || 'user';
            
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userRole', userRole);
            localStorage.setItem('userId', data.user.id);
            
            if (userRole === 'user') {
                window.location.href = 'user.html';
            } else {
                window.location.href = 'user.html';
            }
            
        } catch (error) {
            document.getElementById('error-msg').textContent = 'Login failed: ' + error.message;
            document.getElementById('error-msg').style.display = 'block';
        }
    });
}

// ===== ADMIN LOGIN =====
if (document.getElementById('adminLoginForm')) {
    document.getElementById('adminLoginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;
        
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            
            if (error) throw error;
            
            const userRole = data.user.user_metadata.role;
            
            if (userRole !== 'admin') {
                throw new Error('Access denied. Admin credentials required.');
            }
            
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userRole', userRole);
            localStorage.setItem('userId', data.user.id);
            
            window.location.href = 'admin.html';
            
        } catch (error) {
            document.getElementById('error-msg').textContent = 'Admin login failed: ' + error.message;
            document.getElementById('error-msg').style.display = 'block';
        }
    });
}

// ===== SIGNUP FORM =====
if (document.getElementById('signupForm')) {
    document.getElementById('signupForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password !== confirmPassword) {
            document.getElementById('error-msg').textContent = 'Passwords do not match!';
            document.getElementById('error-msg').style.display = 'block';
            return;
        }
        
        signupEmail = email;
        
        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    emailRedirectTo: window.location.origin,
                    data: {
                        role: 'user'
                    }
                }
            });
            
            if (error) throw error;
            
            document.getElementById('signupForm').style.display = 'none';
            document.getElementById('otpVerification').style.display = 'block';
            document.getElementById('success-msg').textContent = 'Verification code sent to your email!';
            document.getElementById('success-msg').style.display = 'block';
            
        } catch (error) {
            document.getElementById('error-msg').textContent = 'Signup failed: ' + error.message;
            document.getElementById('error-msg').style.display = 'block';
        }
    });
}

// ===== VERIFY OTP AFTER SIGNUP =====
if (document.getElementById('verifyOtpForm')) {
    document.getElementById('verifyOtpForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const otpCode = document.getElementById('otpCode').value;
        
        try {
            const { data, error } = await supabase.auth.verifyOtp({
                email: signupEmail,
                token: otpCode,
                type: 'email'
            });
            
            if (error) throw error;
            
            document.getElementById('success-msg').textContent = 'Email verified! Redirecting to login...';
            document.getElementById('success-msg').style.display = 'block';
            
            setTimeout(() => {
                window.location.reload();
            }, 2000);
            
        } catch (error) {
            document.getElementById('error-msg').textContent = 'Invalid OTP. Please try again.';
            document.getElementById('error-msg').style.display = 'block';
        }
    });
}

// ===== CHECK AUTHENTICATION =====
async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = 'index.html';
    }
}

// ===== LOGOUT =====
async function logout() {
    await supabase.auth.signOut();
    localStorage.clear();
    window.location.href = 'index.html';
}

// ===== ADMIN PANEL - EVENT MANAGEMENT =====
if (document.getElementById('eventForm')) {
    checkAuth();
    
    async function loadEvents() {
        const { data: events, error } = await supabase
            .from('events')
            .select('*')
            .order('created_at', { ascending: false });
        
        const eventsList = document.getElementById('eventsList');
        const filterSelect = document.getElementById('filterEvent');
        
        if (events && events.length > 0) {
            eventsList.innerHTML = '';
            filterSelect.innerHTML = '<option value="all">All Events</option>';
            
            events.forEach(event => {
                const eventDiv = document.createElement('div');
                eventDiv.className = 'event-item';
                eventDiv.innerHTML = `
                    <div class="event-info">
                        <strong>${event.event_name}</strong>
                        <span>${event.event_description || ''}</span>
                    </div>
                    <button class="delete-btn" onclick="deleteEvent('${event.id}')">Delete</button>
                `;
                eventsList.appendChild(eventDiv);
                
                const option = document.createElement('option');
                option.value = event.id;
                option.textContent = event.event_name;
                filterSelect.appendChild(option);
            });
        } else {
            eventsList.innerHTML = '<p style="color: #666;">No events added yet</p>';
        }
    }
    
    loadEvents();
    
    document.getElementById('eventForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const eventData = {
            event_name: document.getElementById('eventName').value,
            event_description: document.getElementById('eventDescription').value
        };
        
        try {
            const { error } = await supabase
                .from('events')
                .insert(eventData);
            
            if (error) throw error;
            
            document.getElementById('eventName').value = '';
            document.getElementById('eventDescription').value = '';
            loadEvents();
            loadProjects();
            
        } catch (error) {
            alert('Error adding event: ' + error.message);
        }
    });
    
    document.getElementById('filterEvent').addEventListener('change', function() {
        loadProjects();
    });
    
    async function loadProjects() {
        const filterValue = document.getElementById('filterEvent').value;
        
        let query = supabase.from('projects').select(`
            *,
            events (event_name)
        `).order('created_at', { ascending: false });
        
        if (filterValue !== 'all') {
            query = query.eq('event_id', filterValue);
        }
        
        const { data: projects, error } = await query;
        
        const tbody = document.getElementById('projectList');
        tbody.innerHTML = '';
        
        if (!projects || projects.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="loading">No submissions yet</td></tr>';
        } else {
            projects.forEach(project => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${project.events?.event_name || 'N/A'}</td>
                    <td>${project.email}</td>
                    <td>${project.team_name}</td>
                    <td>${project.project_title}</td>
                    <td>${project.status}</td>
                    <td>${project.github_link ? '<a href="' + project.github_link + '" target="_blank">View</a>' : 'N/A'}</td>
                    <td>${project.hosted_link ? '<a href="' + project.hosted_link + '" target="_blank">View</a>' : 'N/A'}</td>
                    <td>${new Date(project.created_at).toLocaleString('en-IN')}</td>
                `;
                tbody.appendChild(row);
            });
        }
    }
    
    loadProjects();
    setInterval(loadProjects, 15000);
}

async function deleteEvent(eventId) {
    if (confirm('Are you sure you want to delete this event?')) {
        const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', eventId);
        
        if (error) {
            alert('Error deleting event: ' + error.message);
        } else {
            location.reload();
        }
    }
}

// ===== USER PANEL - SUBMIT PROJECT =====
if (document.getElementById('projectForm')) {
    checkAuth();
    
    async function loadEventOptions() {
        const { data: events, error } = await supabase
            .from('events')
            .select('*')
            .order('created_at', { ascending: false });
        
        const eventSelect = document.getElementById('eventSelect');
        
        if (events && events.length > 0) {
            events.forEach(event => {
                const option = document.createElement('option');
                option.value = event.id;
                option.textContent = event.event_name;
                eventSelect.appendChild(option);
            });
        }
    }
    
    loadEventOptions();
    
    async function loadUserProjects() {
        const userId = localStorage.getItem('userId');
        const { data: projects, error } = await supabase
            .from('projects')
            .select(`
                *,
                events (event_name)
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        
        const tbody = document.getElementById('userProjectsList');
        tbody.innerHTML = '';
        
        if (!projects || projects.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="loading">No submissions yet</td></tr>';
        } else {
            projects.forEach(project => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${project.events?.event_name || 'N/A'}</td>
                    <td>${project.team_name}</td>
                    <td>${project.project_title}</td>
                    <td>${project.status}</td>
                    <td>
                        ${project.github_link ? '<a href="' + project.github_link + '" target="_blank">GitHub</a> ' : ''}
                        ${project.hosted_link ? '<a href="' + project.hosted_link + '" target="_blank">Live</a>' : ''}
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
    }
    
    loadUserProjects();
    
    document.getElementById('projectForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const userId = localStorage.getItem('userId');
        const userEmail = localStorage.getItem('userEmail');
        
        const projectData = {
            user_id: userId,
            email: userEmail,
            event_id: document.getElementById('eventSelect').value,
            team_name: document.getElementById('teamName').value,
            project_title: document.getElementById('projectTitle').value,
            status: document.getElementById('status').value,
            github_link: document.getElementById('githubLink').value || null,
            hosted_link: document.getElementById('hostedLink').value || null
        };
        
        try {
            const { error } = await supabase
                .from('projects')
                .insert(projectData);
            
            if (error) throw error;
            
            document.getElementById('success-msg').style.display = 'block';
            document.getElementById('projectForm').reset();
            loadUserProjects();
            
            setTimeout(() => {
                document.getElementById('success-msg').style.display = 'none';
            }, 3000);
            
        } catch (error) {
            alert('Error submitting project: ' + error.message);
        }
    });
}

