<script>
    import PocketBase from 'pocketbase';
    import { user } from '$lib/stores/user.js';

    const url = 'https://sab.pockethost.io/'
    const pb = new PocketBase(url)

    let password = "";
    let username = "";

    async function login(){
        let result = await pb.collection('users').authWithPassword(username, password);
        console.log("LOGIN", result)
        if(result.record) {
          $user = result.record;
        }
    }
  </script>

{#if !$user?.id}
<form>
  <h1>Log in</h1>

  <div>

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

    {password} - {username}

  </div>

</form>
{:else}
  {$user.name}
{/if}