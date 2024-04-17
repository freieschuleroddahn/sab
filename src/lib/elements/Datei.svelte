<script>
    import PocketBase from 'pocketbase';
    import { user } from '$lib/stores/user.js';

    const url = 'https://sab.pockethost.io/'
    const pb = new PocketBase(url)

    export let document;

    let done;
    let seen;

    let loading = false;

    async function updateDone(userID, dateiID, userDatei) {
      loading = true;
      const data = {
          "user": userID,
          "datei": dateiID,
          "done": true
      };

      if(userDatei == undefined) {
        // create data
        const record = await pb.collection('user_datei').create(data);
        document.expand = {
          "user_datei(datei)": [
            record
          ]
        }
      } else {
        // update data
        data.done = !userDatei["user_datei(datei)"][0].done
        const userDateiID = userDatei["user_datei(datei)"][0].id;
        const record = await pb.collection('user_datei').update(userDateiID, data);
        document.expand["user_datei(datei)"][0] = record;
      }

      loading = false;
    }



</script>

<div class="card">
    <div class="content">
      <i class:test={loading} class="right floated check icon pointer" class:green={(document?.expand && document?.expand["user_datei(datei)"][0].done)} on:click={()=>{updateDone($user.id, document.id, document.expand);}}></i>

      <i class="right floated eye icon"  class:green={(document?.expand && document?.expand["user_datei(datei)"][0].seen)}></i>

      <div class="header">{document.name}</div>
      <div class="meta">
          <span class="category">{document.file}</span>
        </div>
      <div class="description">
        {document.beschreibung}

        <!-- <pre>{JSON.stringify(document,0,2)}</pre> -->

      </div>
    </div>
    <a class="ui button" href="{`https://sab.pockethost.io/api/files/${document.collectionName}/${document.id}/${document.file}`}" target="_blank" on:click={()=>{document.downloaded=true}}>
      <i class="download icon"></i>
      Herunterladen
    </a>
  </div>

<style>
  .test {
    opacity: .4 !important;
  }
</style>