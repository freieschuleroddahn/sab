<script>
    
    import PocketBase from 'pocketbase';
    import { user } from '$lib/stores/user.js';
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment';

    const url = 'https://sab-roddahn.kruw.de/'
    const pb = new PocketBase(url)

    let password = "";
    let username = "";
    let errorMessage = "";

    async function login(){
        try {
            errorMessage = "";
            let result = await pb.collection('users').authWithPassword(username, password);
            console.log("LOGIN", result)
            if(result.record) {
              $user = result.record;
            }
        } catch (error) {
            console.error("Login error:", error);
            errorMessage = "Login failed. Please check your username and password.";
        }
    }

    $: if($user.id && browser) {
        goto("/", {
            "replaceState": true
        });
    }
  </script>

{#if !$user?.id}

<div class="container">
 
  <div class="formular">
    <h1>Log in</h1>

    {#if errorMessage}
        <div class="error">{errorMessage}</div>
    {/if}

    <input
      type="text"
      name="username"
      placeholder="Benutzername"
      bind:value={username}
    />
    <input
      type="password"
      name="password"
      placeholder="Password"
      bind:value={password}
    />
    <button on:click={login}>Log in</button>

  </div>

</div>

{:else}

  {$user.name}

  

{/if}



<style lang="scss">

.container {
 
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.formular {
  background-color: rgb(230, 230, 230);
  width: 400px;
  height: 300px;
  padding:2rem;
  border-radius: 0.5rem;
}



input, button {
  padding:1em;
  display: block;
  width: 100%;
  border: none;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  
}

.error {
    color: red;
    background-color: #ffe6e6;
    padding: 0.5rem;
    border-radius: 0.25rem;
    margin-bottom: 1rem;
    border: 1px solid #ffcccc;
}



  .centered {
    position: absolute;
    top:100vh;
    left:50%;
  }

</style>
