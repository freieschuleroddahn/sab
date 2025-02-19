<script>
    import { Confetti } from "svelte-confetti";
    import PocketBase from 'pocketbase';
    import { user } from '$lib/stores/user.js';

    const url = 'https://sab-roddahn.kruw.de/'
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
<div>
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

</div>
{:else}
  {$user.name}

  <div class="centered">
    <Confetti x={[-3.5, 3.5]} y={[0.5, 3.5]} delay={[0, 500]}  duration=2000 amount=500  size=10 />
  </div>
{/if}



<style lang="scss">
  .centered {
    position: absolute;
    top:100vh;
    left:50%;
  }
</style>
