<script lang="ts">
    import { user } from '$lib/stores/user.js';
    import PocketBase from 'pocketbase';
    import { goto } from '$app/navigation';
    
    const pb = new PocketBase('https://sab-roddahn.kruw.de');
    
    interface FormData {
        name: string;
        password: string;
        passwordConfirm: string;
        oldPassword: string;
        theme_color_hue: number;
    }
    
    let formData: FormData = {
        name: $user.name || '',
        password: '',
        passwordConfirm: '',
        oldPassword: '',
        theme_color_hue: $user.theme_color_hue || 0
    };
    
    // Initialize form data when component mounts
    let isInitialized = false;
    $: if (!isInitialized && $user.id) {
        formData.name = $user.name || '';
        formData.theme_color_hue = $user.theme_color_hue || 0;
        isInitialized = true;
    }
    
    let loading = false;
    let message = '';
    let messageType = '';
    
    function showMessage(text: string, type: string = 'info') {
        message = text;
        messageType = type;
        setTimeout(() => {
            message = '';
            messageType = '';
        }, 5000);
    }
    
    async function updateProfile() {
        if (!$user.id) {
            showMessage('Nicht angemeldet', 'error');
            return;
        }
        
        loading = true;
        
        try {
            // First try to update just the basic fields without password
            const updateData: any = {};
            
            // Test with minimal data first
            if (formData.name !== $user.name && formData.name.trim() !== '') {
                updateData.name = formData.name.trim();
            }
            
            // Try the theme color as a number
            if (formData.theme_color_hue !== $user.theme_color_hue) {
                updateData.theme_color_hue = Number(formData.theme_color_hue);
            }
            
            // Handle password separately
            if (formData.password && formData.password.trim() !== '') {
                if (formData.password !== formData.passwordConfirm) {
                    showMessage('Passwörter stimmen nicht überein', 'error');
                    loading = false;
                    return;
                }
                
                if (!formData.oldPassword || formData.oldPassword.trim() === '') {
                    showMessage('Altes Passwort ist erforderlich', 'error');
                    loading = false;
                    return;
                }
                
                if (formData.password.length < 8) {
                    showMessage('Neues Passwort muss mindestens 8 Zeichen lang sein', 'error');
                    loading = false;
                    return;
                }
                
                updateData.password = formData.password;
                updateData.passwordConfirm = formData.passwordConfirm;
                updateData.oldPassword = formData.oldPassword;
            }
            
            // Check if there's actually something to update
            if (Object.keys(updateData).length === 0) {
                showMessage('Keine Änderungen vorgenommen', 'info');
                loading = false;
                return;
            }
            
            console.log('Updating user with data:', updateData);
            console.log('Current user ID:', $user.id);
            
            // Update user record
            const updatedUser = await pb.collection('users').update($user.id, updateData);
            
            console.log('Update successful:', updatedUser);
            
            // Update the user store with new data
            user.update(currentUser => ({ ...currentUser, ...updatedUser } as any));
            
            showMessage('Profil erfolgreich aktualisiert', 'success');
            
            // Clear password fields
            formData.password = '';
            formData.passwordConfirm = '';
            formData.oldPassword = '';
            
        } catch (error: any) {
            console.error('Profile update error:', error);
            console.error('Error details:', error?.response?.data);
            
            // More detailed error handling
            if (error?.response?.data) {
                const errorData = error.response.data;
                console.error('Full error response:', errorData);
                
                // Handle specific field errors
                if (errorData.password) {
                    showMessage('Passwort Fehler: ' + (errorData.password.message || errorData.password), 'error');
                } else if (errorData.oldPassword) {
                    showMessage('Altes Passwort ist falsch', 'error');
                } else if (errorData.name) {
                    showMessage('Name Fehler: ' + (errorData.name.message || errorData.name), 'error');
                } else if (errorData.theme_color_hue) {
                    showMessage('Theme Color Fehler: ' + (errorData.theme_color_hue.message || errorData.theme_color_hue), 'error');
                } else {
                    // Show the first error message we can find
                    const firstError = Object.values(errorData)[0];
                    if (typeof firstError === 'object' && firstError && 'message' in firstError) {
                        showMessage('Fehler: ' + firstError.message, 'error');
                    } else {
                        showMessage('Validierungsfehler: ' + JSON.stringify(errorData), 'error');
                    }
                }
            } else {
                showMessage(error?.message || 'Fehler beim Aktualisieren des Profils', 'error');
            }
        } finally {
            loading = false;
        }
    }
    
    // Update theme color hue in real time
    $: if (typeof window !== 'undefined') {
        document.documentElement.style.setProperty('--primary-color', formData.theme_color_hue.toString());
    }
    
    // Debug function to test user data
    async function debugUserData() {
        console.log('Current user store:', $user);
        console.log('Form data:', formData);
        
        if ($user.id) {
            try {
                const userRecord = await pb.collection('users').getOne($user.id);
                console.log('User record from PocketBase:', userRecord);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        } else {
            console.log('No user ID available');
        }
    }
</script>

<div class="profile-container">
    <h1>Profil bearbeiten</h1>
    
    {#if message}
        <div class="message {messageType}">
            {message}
        </div>
    {/if}
    
    <form on:submit|preventDefault={updateProfile} class="profile-form">
        <div class="form-group">
            <label for="name">Name</label>
            <input 
                type="text" 
                id="name" 
                bind:value={formData.name}
                required
            />
        </div>
        
        <div class="form-group">
            <label for="theme-color">Themenfarbe (Farbton)</label>
            <input 
                type="range" 
                id="theme-color" 
                bind:value={formData.theme_color_hue}
                min="0"
                max="360"
                step="1"
            />
            <div class="color-preview" style="background-color: hsl({formData.theme_color_hue}, 70%, 50%)">
                Farbton: {formData.theme_color_hue}°
            </div>
        </div>
        
        <div class="password-section">
            <h3>Passwort ändern (optional)</h3>
            
            <div class="form-group">
                <label for="oldPassword">Aktuelles Passwort</label>
                <input 
                    type="password" 
                    id="oldPassword" 
                    bind:value={formData.oldPassword}
                    placeholder="Nur ausfüllen wenn Passwort geändert werden soll"
                />
            </div>
            
            <div class="form-group">
                <label for="password">Neues Passwort</label>
                <input 
                    type="password" 
                    id="password" 
                    bind:value={formData.password}
                    placeholder="Nur ausfüllen wenn Passwort geändert werden soll"
                />
            </div>
            
            <div class="form-group">
                <label for="passwordConfirm">Neues Passwort bestätigen</label>
                <input 
                    type="password" 
                    id="passwordConfirm" 
                    bind:value={formData.passwordConfirm}
                    placeholder="Nur ausfüllen wenn Passwort geändert werden soll"
                />
            </div>
        </div>
        
        <div class="form-actions">
            <button type="submit" disabled={loading} class="btn-primary">
                {loading ? 'Wird gespeichert...' : 'Profil aktualisieren'}
            </button>
            
            <button type="button" on:click={() => goto('/')} class="btn-secondary">
                Abbrechen
            </button>
            
            <button type="button" on:click={debugUserData} class="btn-debug">
                Debug Info (Console)
            </button>
        </div>
    </form>
</div>

<style>
    .profile-container {
        max-width: 600px;
        margin: 0 auto;
        padding: 2rem;
    }
    
    .profile-form {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .form-group {
        margin-bottom: 1.5rem;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: #333;
    }
    
    .form-group input[type="text"],
    .form-group input[type="password"] {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid #e1e5e9;
        border-radius: 4px;
        font-size: 1rem;
        transition: border-color 0.3s ease;
    }
    
    .form-group input[type="text"]:focus,
    .form-group input[type="password"]:focus {
        outline: none;
        border-color: hsl(var(--primary-color, 200), 70%, 50%);
    }
    
    .form-group input[type="range"] {
        width: 100%;
        height: 6px;
        border-radius: 3px;
        background: #ddd;
        outline: none;
    }
    
    .color-preview {
        margin-top: 0.5rem;
        padding: 0.75rem;
        border-radius: 4px;
        color: white;
        text-align: center;
        font-weight: 600;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    }
    
    .password-section {
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 2px solid #e1e5e9;
    }
    
    .password-section h3 {
        margin-bottom: 1rem;
        color: #555;
    }
    
    .form-actions {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
    }
    
    .btn-primary {
        background-color: hsl(var(--primary-color, 200), 50%, 50%);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }
    
    .btn-primary:hover:not(:disabled) {
        background-color: hsl(var(--primary-color, 200), 70%, 45%);
    }
    
    .btn-primary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    
    .btn-secondary {
        background-color: #6c757d;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }
    
    .btn-secondary:hover {
        background-color: #5a6268;
    }
    
    .btn-debug {
        background-color: #17a2b8;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }
    
    .btn-debug:hover {
        background-color: #138496;
    }
    
    .message {
        padding: 0.75rem 1rem;
        border-radius: 4px;
        margin-bottom: 1rem;
        font-weight: 600;
    }
    
    .message.success {
        background-color: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }
    
    .message.error {
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }
    
    .message.info {
        background-color: #d1ecf1;
        color: #0c5460;
        border: 1px solid #bee5eb;
    }
    
    h1 {
        text-align: center;
        color: #333;
        margin-bottom: 2rem;
    }
</style>
