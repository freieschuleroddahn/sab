<script>
    import PocketBase from 'pocketbase';

    const url = 'https://sab.pockethost.io/'
    const pb = new PocketBase(url)


    let password;
    let username;

    async function login(){
        let result = await pb.collection('users').authWithPassword(username, password);
        console.log("LOGIN", result)
    }
  </script>

<form
  class="card"
>
  <h1 class="text-2xl mb-8">Log in</h1>
  <div class="form-control gap-2 mb-4">
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